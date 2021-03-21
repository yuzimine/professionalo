import { useState } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/client';

import SecureLayout from '../../layouts/secure-layout';
import Kanban from './kanban';
import Jobs from './jobs';

const Work = () => {
  const [ jobId, setJobId ] = useState();
  const [ session ] = useSession();

  const handleJob = (jobid) => {
    setJobId(jobid);
  };

  return (
    <SecureLayout>
      <div className="full-page with-flex with-padding col">
        <h1>Work Dashboard</h1>
        <Jobs getJob={(jobid) => handleJob(jobid)}/>
        {(session && session.user.id && jobId) && <Kanban uid={session.user.id} jobid={jobId}/>}
      </div>
    </SecureLayout>
  );
};

export default Work;