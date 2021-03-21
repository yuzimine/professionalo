import firestoreRead from 'lib/firestoreRead';
import firestoreWrite from 'lib/firestoreWrite';
import { getRequest } from 'lib/api';
import moment from 'moment-timezone';
import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';

const checkPostTiming = (jobInfo, jobConfig) => {
  let stat = _.has(jobInfo, 'jobStatus') ? jobInfo.jobStatus : constants.statusDraft;

  if (jobConfig && jobInfo && _.has(jobInfo, ['jobTimezone', 'jobPostDate', 'jobPostDuration'])) {
    const { constants } = jobConfig;
    const { value: tz } = jobInfo.jobTimezone;
    const postDate = moment(jobInfo.jobPostDate).tz(tz); // post date/time at timzone of server converted to timezone tz
    const currentDate = moment().tz(tz); // current time at the server converted to timezone tz

    if (stat <= constants.statusPosted) {
      if (postDate.isSameOrAfter(currentDate)) {
        stat = constants.statusWaiting;
      } else if (postDate.add(jobInfo.jobPostDuration, 'days').isSameOrAfter(currentDate)){
        stat = constants.statusPosted;
      } else {
        stat = constants.statusExpired;
      }
    }
  }

  return stat;
};

module.exports = async (req, res) => {
  let statusCode = 200;
  let reply = 'success';
  const request = getRequest(req);

  const jobConfig = yaml.load(fs.readFileSync(`${process.cwd()}/manifests/job.yml`, 'utf8'));

  if (req.method === 'GET') {
    if (!_.includes(['jip', 'jc', 'all', 'search'], request.slug[0])) {
      reply = await firestoreRead('jobs', request.slug[0]) || 'unknown error';
      if ( reply !== 'unknown error' && _.isObject(reply)) {
        reply.jobStatus = checkPostTiming(reply, jobConfig);
        reply.jobServerCurrentTime = moment().tz(reply.jobTimezone.value).format('YYYY-MM-DD HH:mm:SS z');
        reply.jobPostDate = moment.tz(reply.jobPostDate, reply.jobTimezone.value).format();
      }
    } else if (request.slug[0] === 'search') {
      const searchKeywords = _.split(request.keywords, ',');
      const filter = [{ field: 'jobCategory.label', operator: 'in', value: searchKeywords}];
      reply = await firestoreRead('jobs', null, null, filter) || 'unknown error';
      if (reply !== 'unknown error') {
        _.forEach(reply, r => r.jobStatus = checkPostTiming(r, jobConfig));
      }
    } else if (request.slug[0] === 'all') {
      const filter = [
        {field: 'jobStatus', operator: '<', value: jobConfig.constants.statusContracted},
      ];
      reply = await firestoreRead('jobs', null, null, filter) || 'unknown error';
      if (reply !== 'unknown error') {
        _.forEach(reply, r => r.jobStatus = checkPostTiming(r, jobConfig));
      }
    } else {
      const filter = request.slug[0] === 'jip' ?
        [
          {field: 'jobStatus', operator: '==', value: jobConfig.constants.statusContracted},
          {field: 'jobFinalStatus', operator: '==', value: jobConfig.constants.finalStatusInProgress},
        ]
      :
        [
          {field: 'jobStatus', operator: '==', value: jobConfig.constants.statusDone},
          {field: 'jobFinalStatus', operator: '==', value: jobConfig.constants.finalStatusCompleted},
        ];
      reply = await firestoreRead('jobs', null, null, filter);
    }
  } else if (req.method === 'POST') {
    reply = await firestoreWrite(
      request.body.jobInfo,
      'jobs',
      request.id) || 'unknown error';
  } else {
    statusCode = 400;
    reply = 'bad API request body format (not proper JSON)';
  }

  res.status(statusCode).send(JSON.stringify(reply));
};