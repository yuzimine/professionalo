import propTypes from 'prop-types';
import cn from 'classnames';
/**
 * Quote component
 * 
 * @param {string} text The quote text
 * @param {string} credit The quote credit 
 */
const Quote = ({ text, credit, animated }) => {
  return (
    <h1 className={cn('mquote', animated ? 'animated' : '')}>
      <span className="mquote-text">
        <i className="fas fa-quote-left quote-left"/>
        {` ${text} `}
        <i className="fas fa-quote-right quote-right"/>
      </span>
      <span className="mquote-credit">{`- ${credit}`}</span>
    </h1>
  );
};

export default Quote;

Quote.propTypes = {
  text: propTypes.string.isRequired,
  credit: propTypes.string,
  animated: propTypes.bool,
};
