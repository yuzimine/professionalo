import _ from 'lodash';
import Link from 'next/link';
import cn from 'classnames';
import propTypes from 'prop-types';
/**
 * Standard button component
 * 
 * @param {string} props.label The button label
 * @param {string} props.type The type of the button
 * @param {string} props.link The href link (optional if onClick is not set)
 * @param {string} props.color Specifies the color of the button (red, black, cyan, white)
 * @param {string} props.size Specifies the size of the button (small, medium, large)
 * @param {bool} props.responsive Make button full width of container for small screens
 * @param {bool} props.full Force button to be full width of container
 * @param {bool} props.animated Specifies whether the button is animated when displayed
 * @param {func} props.onClick Handler function for the button push event (optional if link is not set)
 */
const Button = (props) => {
  const btnItem = (props) => {
    const { label, color, size, animated, responsive, full, text, onClick, ...other } = props;
    const styles = cn(
      'mbtn',
      color ? `mbtn-${color}` : null,
      animated ? 'animated' : null,
      responsive ? 'responsive' : null,
      full ? 'full' : null,
      text ? 'text' : null,
      size,
    );

    return (
      <button className={styles} onClick={onClick} {...other}>
        {label}
      </button>
    );
  };

  if (!_.isNil(props.link)) {
    return (
      <Link href={props.link}>
        {btnItem(props)}
      </Link>
    );
  }

  return btnItem(props);
};

export default Button;

Button.propTypes = {
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  type: propTypes.string,
  link: propTypes.string,
  color: propTypes.string,
  size: propTypes.string,
  animated: propTypes.bool,
  full: propTypes.bool,
  text: propTypes.bool,
  onClick: propTypes.func,
  responsive: propTypes.bool,
};
