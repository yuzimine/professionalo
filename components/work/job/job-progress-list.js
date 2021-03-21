import { useMemo } from 'react';
import __ from 'i18next';
import _ from 'lodash';
import propTypes from 'prop-types';
import moment from 'moment-timezone';
import useSWR from 'swr';
import { fetcher } from 'lib/api';

import { useUser } from 'context/userContext';
import PostList from 'layouts/post-list';

const JobProgressList = ({ color = 'red', uid, ...other }) => {
  const { data: posts, error, isValidating } = useSWR(`/api/job/jip`, fetcher);
  const context = useUser();
  const thePosts = useMemo(() => {
    if (!_.has(posts, ['jobTitle', 'jobActualStartDate', 'jobEndDate', 'jobFinalStatus']) &&
        !error && !isValidating) {
      return _.map(posts, post => ({
        [post.jobId]: [
          {
            options: {},
            text: _.has(post, 'jobTitle.pValue') ? post.jobTitle.pValue[context.lang] : '',
          },{
            options: { responsive: true },
            text: moment(post.jobActualStartDate).tz(context.tz).format('YYYY-MM-DD HH:mm z'),
          },{
            options: { responsive: true },
            text: moment(post.jobEndDate).tz(context.tz).format('YYYY-MM-DD HH:mm z'),
          },{
            options: { responsive: true, position: 'center' },
            text: __.t('3 days'),
          },{
            options: { responsive: true, position: 'center' },
            text: post.jobFinalStatus,
          },{
            options: { responsive: true, position: 'center' },
            text: __.t('John Doe'),
          }
        ]}));
    }
    return [];
  }, [posts, error, isValidating, context]);
  const theHeader = [
    {
      options: { responsive: true },
      text: __.t('Title'),
    },{
      options: { responsive: true },
      text: __.t('Started On'),
    },{
      options: { responsive: true },
      text: __.t('Should End On'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Progress'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Completion'),
    },{
      options: { responsive: true, position: 'center' },
      text: __.t('Hire'),
    }
  ];

  return (
    <PostList
      title={__.t('Jobs In-Progress')}
      header={theHeader}
      data={thePosts}
      color={color}
      baseLink={`/work/${uid}/post/view/{{id}}`}
      {...other}
    />
  );
};

export default JobProgressList;

JobProgressList.propTypes = {
  color: propTypes.string,
  uid: propTypes.string,
};
