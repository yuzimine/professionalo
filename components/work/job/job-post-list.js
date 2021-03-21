import { useMemo, useCallback } from 'react';
import __ from 'i18next';
import _ from 'lodash';
import propTypes from 'prop-types';
import moment from 'moment-timezone';
import useSWR from 'swr';
import { fetcher } from 'lib/api';

import { useUser } from 'context/userContext';
import PostList from 'layouts/post-list';

const JobList = ({color = 'red', uid, jobProps, ...other }) => {
  const { data: posts, error, isValidating } = useSWR(`/api/job/all`, fetcher);
  const { status } = jobProps.values;
  const context = useUser();
  const jobStatus = useCallback(post => status[post.jobStatus].label, [status]);
  const thePosts = useMemo(() => {
    if (!_.has(posts, ['jobTitle', 'jobCategory', 'jobPostDate', 'jobPostDuration', 'jobMessages']) &&
        !error && !isValidating) {
      return _.map(posts, post => ({
        [post.jobId]: [
          {
            options: {},
            text: _.has(post, 'jobTitle.pValue') ? post.jobTitle.pValue[context.lang] : '',
          },{
            options: { responsive: true },
            text: __.t(post.jobCategory.label),
          },{
            options: { responsive: true },
            text: moment(post.jobPostDate).tz(post.jobTimezone.value).format('YYYY-MM-DD HH:mm z'),
          },{
            options: { responsive: true, position: 'center' },
            text: post.jobPostDuration,
          },{
            options: { responsive: true, position: 'center' },
            text: __.t(jobStatus(post)),
          },{
            options: { responsive: true, position: 'center' },
            text: post.jobMessages.length,
          }
        ]}));
    }
    return [];
  }, [posts, error, isValidating, context.lang]);
  const theHeader = [
    {
      options: { responsive: true },
      text: __.t('Title'),
    },{
      options: { responsive: true },
      text: __.t('Category'),
    },{
      options: { responsive: true },
      text: __.t('Post Date'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Duration'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Status'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Messages'),
    }
  ];

  return (
    <PostList
      title={__.t('Your Job Posts')}
      header={theHeader}
      data={thePosts}
      color={color}
      add={`/work/${uid}/post/edit/new`}
      uid={uid}
      baseLink={`/work/${uid}/post/edit/{{id}}`}
      {...other}
    />
  );
};

export default JobList;

JobList.propTypes = {
  color: propTypes.string,
  uid: propTypes.string,
  jobProps: propTypes.object,
};
