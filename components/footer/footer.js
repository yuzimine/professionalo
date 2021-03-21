import __ from 'i18next';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useUser } from 'context/userContext';

import { Button } from 'components/utils';
import Logo from 'assets/companylogo.svg';

const Footer = () => {
  const [ session, loading ] = useSession();
  const context = useUser();

  if (session && !loading) {
    return (
      <footer className="footer">
        <div className="footer__logo-box">
          <Link href="/">
            <a><Logo className="footer__logo-box__image"/></a>
            {/* <a><img src="/img/companylogo.svg" className="footer__logo-box-image"/></a> */}
          </Link>
        </div>
        <div className="footer__language">
          <Button label="English" size="small" color="black" onClick={() => context.setLang('en')}/>
          <Button label="日本語" size="small" color="black" onClick={() => context.setLang('ja')}/>
        </div>
        <div className="row">
          <div className="col-1-of-2">

            <div className="footer__nav">
              <ul className="footer__list">
                <li className="footer__item">
                  <Link href="/">
                    <a className="footer__link">{__.t('Top')}</a>
                  </Link>
                </li>
                <li className="footer__item">
                  <Link href={`/circle/${session.user.id}`}>
                    <a className="footer__link">{__.t('Circle')}</a>
                  </Link>
                </li>
                <li className="footer__item">
                  <Link href={`/work/${session.user.id}`}>
                    <a className="footer__link">{__.t('Work')}</a>
                  </Link>
                </li>
                {/* <li className="footer__item">
                  <Link href="/school">
                    <a className="footer__link">{__.t('School')}</a>
                  </Link>
                </li> */}
                <li className="footer__item">
                  <Link href={`/profile/${session.user.id}`}>
                    <a className="footer__link">{__.t('Profile')}</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-1-of-2">

            <div className="footer__copyright">
              <div className="footer__copyright-text">
                <p>Copyright &copy; 2021 Assemble.com All rights reserved.</p>
                <p>{__.t('copyright text')}</p>
              </div>
              <div className="footer__copyright-links">
                <Link href="/"><a className="footer__link">{__.t('Contact')}</a></Link>
                <Link href="/"><a className="footer__link">{__.t('Terms of Use')}</a></Link>
                <Link href="/"><a className="footer__link">{__.t('Privacy Policy')}</a></Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    );
  }
  return null;
};

export default Footer;