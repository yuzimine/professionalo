import propTypes from 'prop-types';
import cn from 'classnames';

/**
 * Card content format
 * 
 * @param {object} param.icon The icon to be displayed at the head of the card
 * @param {object} param.header The header content
 * @param {object} param.content The body content
 * @param {object} param.footer The footer content
 * @param {bool} param.wide Wide width card (80% of container)
 * @param {bool} param.fullWidth Make card full width of the container
 * @param {boo} param.fullHeight Make card full height of the container
 * @param {bool} param.responsive Make card resize responsively
 * @param {string} param.color Choose color scheme of the card
 * @param {string} param.colorText Choose specific color fo the content text
 */
const Card = ({ icon, header, content, footer, wide, responsive, fullWidth, fullHeight, color = null, colorText = null, ...other }) => {
  const styles = cn(
    'mcard',
    responsive && 'responsive',
    wide && 'wide',
    fullWidth && 'full-width',
    fullHeight && 'full-height',
    color,
    colorText,
  );

  return (
    <div className={styles} {...other}>
      {icon && <div className="mcard__icon">{icon}</div>}
      <div className="mcard__header">{header}</div>
      <div className="mcard__content">{content}</div>
      <div className="mcard__footer">{footer}</div>
    </div>
  );
};

export default Card;

Card.propTypes = {
  icon: propTypes.object,
  header: propTypes.oneOfType([propTypes.object, propTypes.string]),
  content: propTypes.oneOfType([propTypes.object, propTypes.string]),
  footer: propTypes.oneOfType([propTypes.object, propTypes.string]),
  wide: propTypes.bool,
  responsive: propTypes.bool,
  fullWidth: propTypes.bool,
  fullHeight: propTypes.bool,
  color: propTypes.string,
  colorText: propTypes.string,
};