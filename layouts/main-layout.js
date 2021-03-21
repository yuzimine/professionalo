import propTypes from 'prop-types';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import __ from 'i18next';

const DynamicGlobalHeader = dynamic(() => import('components/header/global-header'));
const DynamicFooter = dynamic(() => import('components/footer/footer'));

const MainLayout = ({ children, flex }) => {
  const router = useRouter();

  __.changeLanguage(router.locale);

  return (
    <>
      <div className={cn('full-page', flex && 'with-flex')}>
        <DynamicGlobalHeader />
        {children}
      </div>
      <DynamicFooter/>
    </>
  );
};

MainLayout.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  flex: propTypes.bool,
};

export default MainLayout;
