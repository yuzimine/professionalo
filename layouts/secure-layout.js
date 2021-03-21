import __ from 'i18next';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import propTypes from 'prop-types';
import cn from 'classnames';

const DynamicGlobalHeader = dynamic(() => import('components/header/global-header'));
const DynamicFooter = dynamic(() => import('components/footer/footer'));
import { Divider, LinkButton } from 'components/utils';

/**
 * Secure Page Layout
 * 
 * @param {bool} flex Specifies whether to create a flex-box page (flex-direction is column)
 * @param {bool} padding Add padding to the left and right of the page content
 * @param {bool} center Center align page content
 * @param {back} back Add a back button to the page header
 * @param {string} header Page header text
 * @param {string} color Color of the back button
 */
const SecureLayout = ({ children, flex = false, padding = false, center = false, back = false, header, color }) => {
  const [ session, loading ] = useSession();
  const router = useRouter();

  const _handleBack = () => {
    router.back();
  };

  if (!session && !loading) {
    signIn();
  } else {
    return (
      <>
        {(!loading && session) ?
          <div className={cn('full-page', flex && 'with-flex', center && 'center')}>
            <DynamicGlobalHeader />
            {header &&
              <>
                <div className="layout__header">
                  <h1>
                    {back &&
                      <span className="layout__header__button">
                        <LinkButton
                          label={<i className="fas fa-arrow-circle-left"/>}
                          onClick={_handleBack}
                          color={color || "red"}
                        />
                      </span>
                    }
                    <span className="layout__header__title">{header}</span>
                  </h1>
                </div>
                <Divider color="black"/>
              </>
            }
            <div className={cn('layout__body', padding && 'padding')}>
              {children}
            </div>
          </div>
          :
          <div className="full-page with-flex col center">
            <h3>{__.t('Loading content ...')}</h3>
          </div>
        }
        <DynamicFooter/>
      </>
    );
  }
  return (
    <>
      <div className="full-page with-flex col center">
        <h3>{__.t('Sign-in required...')}</h3>
      </div>
      <DynamicFooter/>
    </>
  );
};

export default SecureLayout;

SecureLayout.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  flex: propTypes.bool,
  back: propTypes.bool,
  padding: propTypes.bool,
  center: propTypes.bool,
  header: propTypes.string,
  color: propTypes.string,
};