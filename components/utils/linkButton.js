import propTypes from 'prop-types';
import cn from 'classnames';

/**
 * Standard link button component
 * 
 * @param {object} props Component props
 * @param {string} props.link The href link of the button
 * @param {string} props.label The button label
 * @param {string} props.size Specify the size of the button (large, medium, small, xsmall)
 * @param {string} props.color Specify the color of the button (red, black, cyan)
 */
const LinkButton = (props) => {
  const { label, size, color, otherClass, ...other } = props;
  return (
    // <Link href={link}>
      <a className={cn('mlink-btn', size, color, otherClass)} {...other}>
        {label}
      </a>
    // </Link>
  );
};

export default LinkButton;

LinkButton.propTypes = {
  label: propTypes.oneOfType([propTypes.object, propTypes.string]).isRequired,
  // link: propTypes.string,
  size: propTypes.string,
  color: propTypes.string,
  otherClass: propTypes.oneOfType([ propTypes.string, propTypes.object ]),
};