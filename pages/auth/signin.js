import { useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/client';
import Head from 'next/head';
import __ from 'i18next';
import { csrfToken } from 'next-auth/client';
import Link from 'next/link';
import propTypes from 'prop-types';

import { Input, Button, LinkButton, Divider } from 'components/utils';
import PageLayout from 'layouts/page-layout';
import Logo from 'assets/companylogo.svg';

const SignIn = ({ csrfToken }) => {
  const [credentials, setCredentials] = useState({email: '', password: ''});
  const [session] = useSession();

  const _handleChange = (value) => {
    setCredentials((prevState) => ({
      ...prevState,
      [value.name]: value.pValue,
    }));
  };

  return (
    <PageLayout flex center middle>

      <Head>
        <title>{__.t('Sign in to {{company}}', {company: '$t(company name)'})}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="login__container">
        <div className="login__logo__box">
          <Link href="/">
            <a><Logo className="login__logo__image" /></a>
          </Link>
        </div>
        <h1 className="login__title">{__.t('Sign in to {{company}}', {company: '$t(company name)'})}</h1>
        {!session ?
          <form className="login__form" method='post' action='/api/auth/callback/credentials'>
            <div className="login__info">
              <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
              <Input
                name="email"
                label={__.t('E-Mail Address')}
                val={credentials.email}
                handleChange={_handleChange}
                vertical
                fill
              />
              <Input
                name="password"
                label={__.t('Password')}
                val={credentials.password}
                handleChange={_handleChange}
                type="password"
                vertical
                fill
              />
            </div>
            <Button
              label={__.t("Sign In")}
              color="red"
              type="submit"
            />
          </form>
        :
          <>
            <Button
              label={__.t('Sign Out')}
              color="red"
              full
              onClick={() => signOut({callbackUrl: location.origin})}
            />
            <LinkButton
              style={{ marginTop: '2rem' }}
              label={`${__.t('Return to Top')}`}
              href="/"
              color="red"
            />
          </>
        }

        {!session &&
          <>
            <Divider gutter="small"/>
            <div className="login__providers">
              <Button
                label={__.t('Sign in with Google')}
                color="black"
                size="medium"
                full
                onClick={() => signIn('google', {callbackUrl: location.origin})}
                style={{ marginBottom: '1rem', marginTop: '1rem' }}
              />
              {/* <Button
                label={__.t('Sign in with Slack')}
                color="black"
                size="small"
                full
                onClick={() => signIn('slack', {callbackUrl: location.origin})}
              /> */}
              {/* <Button
                label={__.t('Sign in with Facebook')}
                color="black"
                size="small"
                full
                onClick={() => signIn('facebook', {callbackUrl: location.origin})}
              /> */}
            </div>
          </>
        }
      </div>
    </PageLayout>
  );
};

SignIn.getInitialProps = async (ctx) => {
  return {
    csrfToken: await csrfToken(ctx),
  };
};

SignIn.propTypes = {
  csrfToken: propTypes.string,
};

export default SignIn;