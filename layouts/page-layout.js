import propTypes from 'prop-types';
import cn from 'classnames';

import Footer from 'components/footer/footer';

const PageLayout = ({ children, flex = false, padding = false, center = false, middle = false, }) => {
  return (
    <>
      <div className={cn('full-page', flex && 'with-flex', center && 'center', middle && 'middle')}>
        <div className={cn(padding && 'padding')}>
          {children}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PageLayout;

PageLayout.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  flex: propTypes.bool,
  back: propTypes.bool,
  padding: propTypes.bool,
  center: propTypes.bool,
  middle: propTypes.bool,
};