import __ from 'i18next';
import cn from 'classnames';
import { signIn } from 'next-auth/client';

import { Button } from '../utils';

const MainHeader = () => {
  const lang = __.language || 'en';

  return (
    <header className="full-page header">
      <div className="header-block">
        <div className="logo-box">
          <img src="/img/companylogo.svg" alt="My Logo" className="logo" />
        </div>
        <h1 className="heading-primary">
          <span className={cn('heading-primary-main', lang)}>{__.t('company name')}</span>
          <span className={cn('heading-primary-sub', lang)}>{__.t('company slogan')}</span>
        </h1>
        {/* <a className="mbtn mbtn-red mbtn-animated">{__.t('Give it a try' )}</a> */}
        <Button
          color="red"
          label={__.t('Give it a try' )}
          animated
          onClick={() => signIn()}
        />
        {/* <Link href="/">
          <a className="mbtn mbtn-cyan mbtn-animated">{__.t('Accept Work')}</a>
        </Link> */}
      </div>
    </header>
  );
};

export default MainHeader;