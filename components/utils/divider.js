import cn from 'classnames';
import propTypes from 'prop-types';

/**
 * Section divider line
 * 
 * @param {string} color Specifies the color of the line
 * @param {string} gutter The size of the gutter space above and below the line
 */
const Divider = ({ color, gutter }) => {
  return (
    <div
      className={cn('mdivider', color, gutter)}
    />
  );
};

export default Divider;

Divider.propTypes = {
  color: propTypes.string,
  gutter: propTypes.string,
};