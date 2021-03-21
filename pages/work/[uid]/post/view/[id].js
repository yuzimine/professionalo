import { useMemo } from 'react';
import { useRouter } from 'next/router';
import __ from 'i18next';
import useSWR from 'swr';

import SecureLayout from 'layouts/secure-layout';
import { Button, Divider } from 'components/utils';
import { fetcher } from 'lib/api';
import { useUser } from 'context/userContext';

const Job = () => {
  const context = useUser();
  const router = useRouter();
  const { uid, id } = router.query;
  const {
    data: jobData,
    error: jobError,
    isValidating: jobIsValidating,
  } = useSWR(`/api/job/${id}`, fetcher);
  const {
    data: hireeProfile,
    error: hireeError,
    isValidating: hireeIsValidating,
  } = useSWR((jobData && jobData.hireeId) ? `/api/profile?id=${jobData.hireeId}` : null, fetcher);
  const location = useMemo(() => (
    (hireeProfile && !hireeError && !hireeIsValidating) ?
      `${hireeProfile.city.pValue[context.lang]}, ${hireeProfile.country.label}`: '-'
  ), [hireeProfile, hireeError, hireeIsValidating]);

  return (
    <SecureLayout>
      {(jobData && !jobError && !jobIsValidating) &&
        <div className="work__container">
          <h1>{jobData.jobTitle.pValue[__.language]}</h1>

          <Divider />

          <div className="job-detail">

            <section className="row">
              <div className="col-1-of-8"></div>
              <div className="col-6-of-8">
                <h3>{__.t('Job Info')}</h3>
                <div className="job-detail__container">

                  <div className="job-detail__element">
                    <div className="job-detail__label">{__.t('Job ID')}</div>
                    <div className="job-detail__info">{jobData.jobId}</div>
                  </div>

                  <div className="job-detail__element">
                    <div className="job-detail__label">{__.t('Hiree')}</div>
                    <div className="job-detail__info">{jobData.jobHiree || '-'}</div>
                  </div>

                  <div className="job-detail__element">
                    <div className="job-detail__label">{__.t('Location')}</div>
                    <div className="job-detail__info">{location}</div>
                  </div>

                  <div className="job-detail__element">
                    <div className="job-detail__label">{__.t('Status')}</div>
                    <div className="job-detail__info">{jobData.jobStatus || 'Pending Contract'}</div>
                  </div>

                  <div className="job-detail__element">
                    <div className="job-detail__label">{__.t('Job Start')}</div>
                    <div className="job-detail__info">{jobData.jobContractStart || '-'}</div>
                  </div>

                </div>
              </div>
              <div className="col-1-of-8"></div>
            </section>

          </div>

          <Divider />

          <div className="work__footer">
            <Button
              label={__.t('Close')}
              size="medium"
              color="black"
              onClick={() => router.push(`/work/${uid}/post`)}
            />
          </div>
        </div>}
    </SecureLayout>
  );
};

export default Job;