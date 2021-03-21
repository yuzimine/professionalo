import __ from 'i18next';
import { signIn, useSession } from 'next-auth/client';
import cn from 'classnames';
import Link from 'next/link';

const GlobalHeader = () => {
  const [session, loading] = useSession();

  return (
    <>

      <div className={cn('menubar overlap fixed responsive')}>
        <ul className="menubar__menu">
          <li><Link href="/"><a><i className="fas fa-house-user"/></a></Link></li>
        </ul>
        <ul className="menubar__menu right">
          {(session && !loading) &&
            <>
              <Link href={`/circle/${session.user.id}`}><li><a>{__.t('Circle')}</a></li></Link>
              <Link href={`/work/${session.user.id}`}><li><a>{__.t('Work')}</a></li></Link>
              {/* <Link href="/school"><li><a>{__.t('School')}</a></li></Link> */}
              <Link href={`/profile/${session.user.id}`}><li><a>{__.t('Profile')}</a></li></Link>
            </>
          }
          <li>
            <a onClick={() => signIn(null, {callbackUrl: location.origin})}>
              {(!session && !loading) && __.t('Sign In')}
              {(!session && loading) && __.t('Signing in...')}
              {(session && !loading) && __.t('Sign Out')}
            </a>
          </li>
        </ul>
      </div>

      <div className="navigation">
        <input type="checkbox" className="navigation__checkbox" id="navi-toggle"/>
        <label htmlFor="navi-toggle" className="navigation__button">
          <span className="navigation__icon">&nbsp;</span>
        </label>
        <div className="navigation__background">&nbsp;</div>
        <nav className="navigation__nav">
          <ul className="navigation__list">
            <li className="navigation__item">
              <Link href="/">
                <a className="navigation__link">{__.t('Top')}</a>
              </Link>
            </li>
            {(session && !loading) &&
              <>
                <li className="navigation__item">
                  <Link href={`/circle/${session.user.id}`}>
                    <a className="navigation__link">{__.t('Circle')}</a>
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link href={`/work/${session.user.id}`}>
                    <a className="navigation__link">{__.t('Work')}</a>
                  </Link>
                </li>
                <li className="navigation__item">
                  <Link href={`/profile/${session.user.id}`}>
                    <a className="navigation__link">{__.t('Profile')}</a>
                  </Link>
                </li>
              </>
            }
            <li className="navigation__item">
              <Link href="/api/auth/signin">
              <a className="navigation__link">
                {!session && !loading && __.t('Sign In')}
                {!session && loading && __.t('Signing In...')}
                {session && !loading && __.t('Sign Out')}
              </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

    </>
  );
};

export default GlobalHeader;