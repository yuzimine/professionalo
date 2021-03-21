import __ from 'i18next';
// import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

import { Button, Card } from 'components/utils';
import SecureLayout from 'layouts/secure-layout';
import PostJob from 'assets/postwork.svg';
import FindJob from 'assets/findwork.svg';

const WorkPortal = ({ uid }) => {
  // const router = useRouter();
  const [ session ] = useSession();
  // const { uid } = router.query;

  return (
    <SecureLayout>
      <div className="work__home">
        {/* <div className="work__header">
          <h1>{__.t('Work Portal')}</h1>
        </div> */}
        <div className="work__description">
          <h1 className="color-white">{__.t('Find & Post Work')}</h1>
          <p>{__.t('$t(company name) allows you or your circle to easily and quickly find work to do or post work to be done')}</p>
        </div>
        <div className="work__content">

          <section className="work__card">
            <Card
              icon={<FindJob className="work__icon__job"/>}
              header={<h1 style={{ textAlign: 'center' }}>{__.t('Find Work')}</h1>}
              footer={<Button label={__.t('Go')} color="cyan" size="large" link={`/work/${uid}/find`}/>}
              responsive
              color="cyan-back"
            />
          </section>

          <section className="work__card">
            <Card
              icon={<PostJob className="work__icon__job"/>}
              header={<h1 style={{ textAlign: 'center' }}>{__.t('Post Work')}</h1>}
              footer={<Button label={__.t('Go')} color="red" size="large" link={`/work/${uid}/post`}/>}
              responsive
            />
          </section>
        </div>
      </div>
    </SecureLayout>
  );
};

export default WorkPortal;

export async function getServerSideProps(cx) {
  return {
    props: {
      ...cx.params,
    }
  };
}