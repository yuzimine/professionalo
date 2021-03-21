import { decodeBase64 } from 'react-basecode-sixty-four';
import Error from 'next/error';
import Head from 'next/head';
import __ from 'i18next';
import _ from 'lodash';
import propTypes from 'prop-types';
import cn from 'classnames';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import * as firebaseAdmin from 'firebase-admin';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useUser } from 'context/userContext';
import Logo from 'assets/companylogo.svg';
import { Button, Card, Quote } from 'components/utils';
import MainLayout from 'layouts/main-layout';

/**
 * Home page
 * 
 * @param {bool} param.auth Indicates whether user is authenticated or not 
 */
const Home = ({ auth }) => {
  if (true !== auth) {
    return <Error 
      statusCode={401}
      title={__.t('Sorry, you do not have access to see this site yet')}
    />;
  }

  const context = useUser();
  const [session] = useSession();
  const router = useRouter();

  const _handleEnter = () => {
    if (!session) {
      signIn();
    } else {
      router.push(`/work/${session.user.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>{__.t('company name')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MainLayout>
        <main>

          <header className="full-page header">
            <div className="header__block">
              <div className="header__logo-box">
                <Logo className="header__logo-box__logo"/>
              </div>
              <h1 className="header__heading-primary">
                <span className={cn('header__heading-primary__main', context.lang)}>{__.t('company name')}</span>
                <span className={cn('header__heading-primary__sub', context.lang)}>{__.t('company slogan')}</span>
              </h1>
              <Button
                color="red"
                label={__.t('Enter' )}
                animated
                onClick={() => _handleEnter()}
              />
            </div>
          </header>

          <section className="full-page about right">
            <div className="row">
              <div className="col-1-of-2">
              </div>
              <div className="col-1-of-2">
                <div className="about__container">
                  <h2 className="about__header">{__.t('about header')}</h2>
                  <p className="about__description" dangerouslySetInnerHTML={{__html: __.t('about description')}}></p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-more__quote">
            <Quote
              text={__.t('quote')}
              credit={__.t('Victor Hugo')}
              animated
            />
          </section>

          <section className="ful-page about left">
            <div className="row">
              <div className="col-1-of-2">
                <div className="about__container">
                  <h2 className="about__header">{__.t('The Vision')}</h2>
                  <div className="about__description" dangerouslySetInnerHTML={{__html: __.t('about text')}}/>
                </div>
              </div>
              <div className="col-1-of-2">
                <div className="about__image">
                  <img
                    src="/img/thevision1.svg"
                    alt="The Vision Image"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="full-page features" id="features">
            <div className="features__header">
              <h3 className="features__title">{__.t('Create and Nurture Your Professional Circle')}</h3>
              <p className="features__description">
                {__.t('feature description')}
              </p>
            </div>
            <div className="row">
              <div className="col-1-of-3 u-text-center">
                <Card
                  icon={<i className="fas fa-user-circle"></i>}
                  title={__.t('Create a Circle')}
                  content={<p>{__.t('feature1')}</p>}
                  responsive
                />
              </div>
              <div className="col-1-of-3 u-text-center">
                <Card
                  icon={<i className="fas fa-magic"></i>}
                  title={__.t('Share Your Expertise')}
                  content={<p>{__.t('feature2')}</p>}
                  responsive
                />
              </div>
              <div className="col-1-of-3 u-text-center">
                <Card
                  icon={<i className="fas fa-magic"></i>}
                  title={__.t('Share Your Expertise')}
                  content={<p>{__.t('feature3')}</p>}
                  responsive
                />
              </div>
            </div>
          </section>

        </main>
      </MainLayout>
    </>
  );
};

Home.propTypes = {
  auth: propTypes.bool,
};

export default Home;

export const getServerSideProps = async ({ req, res }) => {
  let auth = true;

  res.statusCode = 200;

  if (_.toLower(process.env.LOGIN_ON) === 'on' ) {
    auth = false;
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic');

    if (_.has(req, 'headers.authorization')) {
      const [, unpw] = _.split(req.headers.authorization, ' ');
      if (`${process.env.LOGIN_UN}:${process.env.LOGIN_PW}` === decodeBase64(unpw)) {
        auth = true;
        res.statusCode = 200;
      }
    }
  }
  
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }

  firebase.auth().signInWithEmailAndPassword(process.env.SECRET_ADMIN_NAME, process.env.SECRET_ADMIN_PASSWORD)
    .then((/* user */) => {
      console.log('User logged in to Firebase');
    })
    .catch(error => console.log('Firebase login error:', error));

  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        type: process.env.SECRET_TYPE,
        project_id: process.env.SECRET_PROJECT_ID,
        private_key_id: process.env.SECRET_PRIVATE_KEY_ID,
        private_key: process.env.SECRET_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.SECRET_CLIENT_EMAIL,
        client_id: process.env.SECRET_CLIENT_ID,
        auth_uri: process.env.SECRET_AUTH_URI,
        token_uri: process.env.SECRET_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.SECRET_X599_PROVIDER_URL,
        client_x509_cert_url: process.env.SECRET_X599_CLIENT_URL
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
  
  return { props: { auth } };
};
