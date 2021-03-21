import Button from './button';
import propTypes from 'prop-types';
import cn from 'classnames';

const Dialog = ({ children, state, handleClose, leftImage, closeButton, title, subtitle, target, origin }) => {
  const _handleClose = () => {
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <div className={cn('popup', state)} id={target || "pro-popup"}>
      <div className="popup-content">
        <a href={`#${origin}`} className="popup-close" onClick={_handleClose}>
          <i className="fas fa-times"></i>
        </a>
        {title && <h2 className="heading-secondary">{title}</h2>}
        {subtitle && <h3 className="heading-tertiary">{subtitle}</h3>}
        {children}
        {closeButton && <Button label="Close" color="red" onClick={_handleClose}/>}
      </div>
    </div>
  );
};

export default Dialog;

Dialog.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
  state: propTypes.string,
  handleClose: propTypes.func,
  title: propTypes.string,
  subtitle: propTypes.string,
  leftImage: propTypes.object,
  closeButton: propTypes.bool,
  target: propTypes.string,
  origin: propTypes.string,
};