import { useMemo } from 'react';
import __ from 'i18next';
import _ from 'lodash';
import propTypes from 'prop-types';
import moment from 'moment-timezone';
import useSWR from 'swr';

import { fetcher } from 'lib/api';
import { useUser } from 'context/userContext';
import PostList from 'layouts/post-list';


const JobCompletedList = ({color = 'red', uid, jobProps, ...other }) => {
  const { data: posts, error, isValidating } = useSWR(`/api/job/jc`, fetcher);
  const context = useUser();
  const thePosts = useMemo(() => {
    if (!_.has(posts, ['jobTitle', 'jobPostDate', 'jobHiree', 'jobFinalStatus']) &&
        !error && !isValidating) {
      return _.map(posts, post => ({
        [post.jobId]: [
          {
            options: {},
            text: _.has(post, 'jobTitle.pValue') ? post.jobTitle.pValue[context.lang] : '',
          },{
            options: { responsive: true },
            text: moment(post.jobPostDate).tz(context.tz).format('YYYY-MM-DD HH:mm z'),
          },{
            options: { responsive: true, position: 'center' },
            text: post.jobHiree ? post.jobHiree.pValue[context.lang] : 'None',
          },{
            options: { position: 'center' },
            text: __.t(_.find(jobProps.values.finalStatus, ['value', post.jobFinalStatus]).label),
          },{
            options: { position: 'center' },
            text: <i className="fas fa-star color-yellow"/>,
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
      text: __.t('Complete Date'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Worker'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Final Status'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Satisfaction'),
    }
  ];

  return (
    <PostList
      title={__.t('Completed Jobs')}
      header={theHeader}
      data={thePosts}
      color={color}
      baseLink={`/work/${uid}/post/edit/{{id}}`}
      {...other}
    />
  );
};

export default JobCompletedList;

JobCompletedList.propTypes = {
  color: propTypes.string,
  uid: propTypes.string,
  jobProps: propTypes.object,
};