import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import propTypes from 'prop-types';
import _ from 'lodash';
import __ from 'i18next';
import useSWR from 'swr';
import cryptoRandomString from 'crypto-random-string';
import yaml from 'js-yaml';
import fs from 'fs';
import moment from 'moment-timezone';

import SecureLayout from 'layouts/secure-layout';
import JobStats from 'components/work/job/job-stats';
import { Button, Checkbox, Divider, Input, Label, Radiobox, Text, Selector, mlValue } from 'components/utils';
import { postApi, fetcher } from 'lib/api';
import { parseOutTzFromDate, createTzAwareDate } from 'lib/timezone';
import { useUser } from 'context/userContext';

/**
 * New and current job edit screen
 * 
 * Dynamic arguments:
 * - uid: user ID
 * - id: job ID (will be "new" for new job registration)
 * 
 * @param {array} param.categories List of job categories (in manifest)
 * @param {object} param.jobCofig Default structure of job data (in manifest) 
 * @param {object} param.timezones List of timezones
 */
const NewJob = ({ categories, jobConfig, timezones }) => {
  const context = useUser();
  const router = useRouter();
  const { uid, id } = router.query;
  const isNew = _.includes(['new'], _.toLower(id));
  const [ isEdit, setIsEdit ] = useState(isNew); // UI is in edit mode?
  const [ saveMode, setSaveMode ] = useState(false);
  const { data: jobData, error: jobDataError } = useSWR(!isNew ? `/api/job/${id}` : null, fetcher);
  const [ jobId ] = useState(!isNew ? id : cryptoRandomString({ length: 8, type: 'numeric' }));
  const [ jobInfo, setJobInfo ] = useState(null);
  const [ jobPostDate, setJobPostDate ] = useState(moment().tz(context.tz).add(1, 'minute').format('YYYY-MM-DDTHH:mm'));
  const { status } = jobConfig.values;
  const { constants } = jobConfig;
  const defaultData = useMemo(() => jobConfig.params, [jobConfig]);
  const categoryList = useMemo(() =>
    _.map(categories, cat => ({ ...cat, label: __.t(cat.label)})), [categories, context.lang]);
  const postDate = useMemo(() => {
    if (_.has(jobInfo, 'jobPostDate') && jobInfo.jobPostDate !== '' ) {
      return parseOutTzFromDate(jobInfo.jobPostDate, jobInfo.jobTimezone.value);
    } else {
      return jobPostDate;
    }
  }, [jobInfo]);
  const jobStatus = useMemo(() => {
    if (jobInfo && status) {
      const stat = status[jobInfo.jobStatus];
      return <Label text={stat.label} color={stat.color}/>;
    }
    return null;
  }, [jobInfo, status]);

  useEffect(() => {
    let di = null;
    
    if (isNew && defaultData && jobId) {
      setJobInfo({
        ...defaultData,
        jobId,
        jobTimezone: _.find(timezones, ['current', true]),
      });
      setIsEdit(true);
    } else if (jobData && !jobDataError) {
      setJobInfo({ ...defaultData, ...jobData });
      if (jobData.jobStatus === constants.statusDraft) {
        setIsEdit(true);
      }
    }

    if (_.has(jobData, 'jobPostDate') && jobData.jobPostDate === '') {
      di = setInterval(() => setJobPostDate(moment().tz(context.tz).add(1, 'minute').format('YYYY-MM-DDTHH:mm')), 60000);
    }

    return (() => {
      if (di) clearInterval(di);
    });

  }, [isNew, defaultData, jobId, jobData, jobDataError]);

  useEffect(() => {
    if (saveMode && isEdit) _handleSubmit();
    setSaveMode(false);
  }, [jobInfo, saveMode]);

  const _handleChange = (value) => {
    if (value) {
      setJobInfo(prevVal => ({
        ...prevVal,
        [value.name]: value.multiLangValue ?
          { pLang: value.pLang, pValue: value.pValue } : value.pValue,
      }));
    }
  };

  const _handleSubmit = async () => {
    const reply = await postApi(`job/${jobId}`, JSON.stringify({ jobInfo }));

    if (_.includes(['success'], _.toLower(reply))) {
      router.push(`/work/${uid}/post`).then(() => window.scrollTo(0,0));
    } else {
      // TODO: Show some kind of error message
    }
  };

  const _handlePublish = () => {
    setJobInfo(prevVal => ({
      ...prevVal,
      jobStatus: 1,
      jobPostDate: createTzAwareDate(prevVal.jobPostDate, prevVal.jobTimezone.value),
      jobStartDate: createTzAwareDate(prevVal.jobStartDate, prevVal.jobTimezone.value),
      jobEndDate: createTzAwareDate(prevVal.jobEndDate, prevVal.jobTimezone.value),
      jobMessages: ['Job Posted!'],
    }));
    setSaveMode(true);
  };

  const _handleDraftSubmit = () => {
    setJobInfo(prevVal => ({
      ...prevVal,
      jobPostDate: createTzAwareDate(prevVal.jobPostDate, prevVal.jobTimezone.value),
      jobStartDate: createTzAwareDate(prevVal.jobStartDate, prevVal.jobTimezone.value),
      jobEndDate: createTzAwareDate(prevVal.jobEndDate, prevVal.jobTimezone.value),
      jobStatus: 0,
    }));
    setSaveMode(true);
  };

  const _handleCancel = () => {
    if (!isNew) {
      setJobInfo({...defaultData, ...jobData}); // put back the original data
      setIsEdit(false);
    } else {
      router.replace(`/work/${uid}/post`).then(() => window.scrollTo(0,0));
    }
  };

  const _onChangeRadio = useCallback((event) => {
    if (isEdit) {
      setJobInfo(prevVal => ({
        ...prevVal,
        [event.target.name]: event.target.value,
      }));
    }
  }, [jobInfo, isEdit]);

  const _onChangeCheckbox = useCallback((event) => {
    if (isEdit) {
      setJobInfo(prevVal => ({
        ...prevVal,
        [event.target.name]: event.target.checked,
      }));
    }
  }, [jobInfo, isEdit]);

  return (
    <SecureLayout flex back color="red" header={__.t('{{type}} Job Post', { type: isNew ? __.t('New') : ''})}>
      <div className="job-post__container">
        {jobInfo &&
          <div className="job-post">
            <div className="row">
              <div className="col-1-of-8"></div>
              <div className="col-6-of-8">
                <h3 className="job-post__id">
                  <span>{__.t('Job ID')}</span>
                  <span>{jobInfo.jobId}</span>
                </h3>
                {jobStatus}
                {!isNew &&
                  <>
                    <Divider />
                    <JobStats jobInfo={jobInfo} uid={uid}/>
                    <Divider />
                  </>
                }
                <Input
                  name="jobTitle"
                  label={__.t('Title')}
                  val={jobInfo.jobTitle === '' ? mlValue : jobInfo.jobTitle}
                  handleChange={_handleChange}
                  enableLang
                  fill
                  vertical
                  defaultLang={context.lang}
                  inputProps={{
                    readOnly: !isEdit,
                    maxLength: 50,
                    placeholder: __.t('Enter your job title (50 characters)')
                  }}
                />
                <Input
                  name="jobDescription"
                  label={__.t('Short Description')}
                  val={jobInfo.jobDescription === '' ? mlValue : jobInfo.jobDescription}
                  handleChange={_handleChange}
                  enableLang
                  vertical
                  fill
                  defaultLang={context.lang}
                  inputProps={{
                    readOnly: !isEdit,
                    maxLength: 128,
                    placeholder: __.t('Enter a short description (128 characters)')
                  }}
                />
                {categories &&
                  <Selector
                    name="jobCategory"
                    options={categoryList}
                    label={__.t('Job Category')}
                    handleChange={value => _handleChange({ name: 'jobCategory', pValue: value })}
                    value={_.find(categoryList, ['value', jobInfo.jobCategory.value])}
                    vertical
                    isDisabled={!isEdit}
                    placeholder={__.t('Select the job category...')}
                  />
                }
                <Text
                  name="jobDetail"
                  label={__.t('Detailed Job Description')}
                  handleChange={_handleChange}
                  val={jobInfo.jobDetail === '' ? mlValue : jobInfo.jobDetail}
                  vertical
                  fill
                  rows={10}
                  enableLang
                  defaultLang={context.lang}
                  textProps={{
                    readOnly: !isEdit,
                    maxLength: 1000,
                    placeholder: __.t('Enter a detailed explanation about the job (1000 characters)')
                  }}
                />
                <div className="mradiobox__group responsive">
                  <div className="mradiobox__group__label">{__.t('Preferred Hire Type')}</div>
                  <Radiobox
                    label={__.t('Individual')}
                    name="jobHireType"
                    onChange={_onChangeRadio}
                    checked={jobInfo.jobHireType === 'individual'}
                    value="individual"
                    readOnly={!isEdit}
                  />
                  <Radiobox
                    label={__.t('Circle')}
                    name="jobHireType"
                    onChange={_onChangeRadio}
                    checked={jobInfo.jobHireType === 'circle'}
                    value="circle"
                    readOnly={!isEdit}
                  />
                  <Radiobox
                    label={__.t('No Preference')}
                    name="jobHireType"
                    onChange={_onChangeRadio}
                    checked={jobInfo.jobHireType ==='none'}
                    value="none"
                    readOnly={!isEdit}
                  />
                </div>
                <div className="mradiobox__group responsive">
                  <div className="mradiobox__group__label">{__.t('Contract Type')}</div>
                  <Radiobox
                    name="jobContractType"
                    label={__.t('Fixed Cost')}
                    checked={jobInfo.jobContractType === 'fixed'}
                    onChange={_onChangeRadio}
                    value="fixed"
                    readOnly={!isEdit}
                  />
                  <Radiobox
                    name="jobContractType"
                    label={__.t('Pay-by-Hour (PBH)')}
                    checked={jobInfo.jobContractType === 'pbh'}
                    onChange={_onChangeRadio}
                    value="pbh"
                    readOnly={!isEdit}
                  />
                </div>
                <Input
                  name="jobCost"
                  label={__.t('What is your target budget {{type}}', { type: jobInfo.jobContractType === 'fixed' ? __.t('total') : __.t('per hour')})}
                  val={jobInfo.jobCost}
                  handleChange={_handleChange}
                  vertical
                  responsive
                  align="text-right"
                  inputProps={{
                    readOnly: !isEdit,
                    placeholder: __.t('Enter amount with currency marker')
                  }}
                />
                <Input
                  name="jobStartDate"
                  type="datetime-local"
                  label={__.t('When does the job need to start')}
                  val={parseOutTzFromDate(jobInfo.jobStartDate, jobInfo.jobTimezone.value)}
                  vertical
                  handleChange={_handleChange}
                  responsive
                  inputProps={{
                    readOnly: !isEdit,
                  }}
                />
                <Input
                  name="jobEndDate"
                  type="datetime-local"
                  label={__.t('When should the job be completed')}
                  val={parseOutTzFromDate(jobInfo.jobEndDate, jobInfo.jobTimezone.value)}
                  vertical
                  handleChange={_handleChange}
                  responsive
                  inputProps={{
                    readOnly: !isEdit,
                  }}
                />
                <Input
                  name="jobPostDate"
                  type="datetime-local"
                  label={__.t('When do you want to publish your job post')}
                  val={postDate}
                  vertical
                  handleChange={_handleChange}
                  responsive
                  inputProps={{
                    readOnly: !isEdit,
                  }}
                />
                <Input
                  name="jobPostDuration"
                  type="number"
                  label={__.t('How many days do you want post your job')}
                  val={jobInfo.jobPostDuration}
                  handleChange={_handleChange}
                  vertical
                  responsive
                  align="text-right"
                  inputProps={{
                    min: '1',
                    max: '360',
                    readOnly: !isEdit,
                    placeholder: __.t('Enter 1 ~ 360 days')
                  }}
                />
                {timezones &&
                  <Selector
                    name="jobTimezone"
                    options={timezones}
                    label={__.t('Job Timezone')}
                    handleChange={value => _handleChange({ name: 'jobTimezone', pValue: value })}
                    value={_.find(timezones, ['value', jobInfo.jobTimezone.value])}
                    vertical
                    isDisabled={!isEdit}
                    placeholder={__.t('Select your timzone...')}
                  />
                }
                <div className="mradiobox__group responsive vertical">
                  <div className="mradiobox__group__label">{__.t('Other')}</div>
                  <Checkbox
                    name="jobOptionBudget"
                    label={__.t('Budget is negotiable')}
                    checked={jobInfo.jobOptionBudget}
                    onChange={_onChangeCheckbox}
                  />
                  <Checkbox
                    name="jobOptionStartDate"
                    label={__.t('Start date is negotiable')}
                    checked={jobInfo.jobOptionStartDate}
                    onChange={_onChangeCheckbox}
                  />
                  <Checkbox
                    name="jobOptionEndDate"
                    label={__.t('End date is negotiable')}
                    checked={jobInfo.jobOptionEndDate}
                    onChange={_onChangeCheckbox}
                  />
                  <Checkbox
                    name="jobOptionHireType"
                    label={__.t('Hire type is negotiable')}
                    checked={jobInfo.jobOptionHireType}
                    onChange={_onChangeCheckbox}
                  />
                </div>
              </div>
              <div className="col-1-of-8"></div>
            </div>
          </div>
        }
        <Divider />
        <div className="work__footer">
          {!isEdit && (jobInfo && jobInfo.jobStatus !== jobConfig.constants.statusDone) && <Button
            responsive
            label={__.t('Edit')}
            size="medium"
            color="black"
            onClick={() => setIsEdit(prevValue => !prevValue)}
          />}
          {isEdit && <Button
            responsive
            label={__.t('Cancel')}
            size="medium"
            color="black"
            onClick={_handleCancel}
          />}
          {isEdit && <Button
            responsive
            label={__.t('Save Draft')}
            size="medium"
            color="cyan"
            onClick={_handleDraftSubmit}
          />}
          {isEdit && <Button
            responsive
            label={__.t('Submit')}
            size="medium"
            color="red"
            onClick={_handlePublish}
          />}
        </div>
      </div>
    </SecureLayout>
  );
};

export default NewJob;

NewJob.propTypes = {
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