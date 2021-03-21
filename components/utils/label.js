import propTypes from 'prop-types';
import cn from 'classnames';

const Label = ({ text, color }) => {
  return (<span className={cn('mlabel', color)}>{text}</span>);
};

export default Label;

Label.propTypes = {
  text: propTypes.string.isRequired,
  color: propTypes.string,
};