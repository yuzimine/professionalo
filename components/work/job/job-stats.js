import __ from 'i18next';
import propTypes from 'prop-types';

import { Stats } from 'components/utils';

const JobStats = ({ jobInfo, uid }) => {
  if (jobInfo) {
    return (
      <Stats>
        <Stats.Item num={jobInfo.jobPostViews || 0} label={__.t('Views')} direction="down"/>
        <Stats.Item num={jobInfo.jobPostProposals || 0} label={__.t('Proposals')} direction="down"/>
        <Stats.Item num={jobInfo.jobPostInquiries || 0} label={__.t('Inquiries')} link={`/work/${uid}/messages/${jobInfo.jobId}`}/>
      </Stats>
    );
  }
  return null;
};

export default JobStats;

JobStats.propTypes = {
  jobInfo: propTypes.object,
  uid: propTypes.string,
};