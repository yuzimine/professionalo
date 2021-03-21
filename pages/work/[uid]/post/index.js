import __ from 'i18next';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import propTypes from 'prop-types';
import yaml from 'js-yaml';
import fs from 'fs';
import moment from 'moment-timezone';

import SecureLayout from 'layouts/secure-layout';
import JobList from 'components/work/job/job-post-list';
import JobProgressList from 'components/work/job/job-progress-list';
import JobCompletedList from 'components/work/job/job-completed-list';

const PostJobs = (props) => {
  const router = useRouter();
  const [ session ] = useSession();
  const { uid } = router.query;

  return (
    <SecureLayout back red padding header={__.t('Post Work')}>
      <div className="work__container">
        <section className="work__list">
          <JobList uid={uid} style={{ paddingBottom: '4rem' }} jobProps={props.jobConfig}/>
          <JobProgressList uid={uid} style={{ paddingBottom: '4rem' }}/>
          <JobCompletedList uid={uid} jobProps={props.jobConfig}/>
        </section>
      </div>
    </SecureLayout>
  );
};

export default PostJobs;

PostJobs.propTypes = {
  categories: propTypes.array.isRequired,
  jobConfig: propTypes.object,
  timezones: propTypes.array,
};

export async function getServerSideProps() {
  let categories = {};
  let jobConfig = {};
  let timezones = {};

  try {
    jobConfig = yaml.load(fs.readFileSync(`${process.cwd()}/manifests/job.yml`, 'utf8'));
    categories = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/categories.yml`, 'utf8')), (cat) => {
      return ({ value: cat.tag, label: cat.name });
    });
    timezones = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/timezones.yml`, 'utf8')), (cat) => {
      return ({
        label: cat.text,
        tz: cat.value,
        value: (cat.utc[0] || 'Etc/GMT+1'),
        current: _.includes(cat.utc, moment.tz.guess()),
      });
    });
  } catch (error) {
    console.error(error);
  }
  return { props: { categories, jobConfig, timezones } };
}