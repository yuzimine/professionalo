import { useState } from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';
import { nanoid } from 'nanoid';

const Checkbox = ({ label, ...other }) => {
  const [ id ] = useState(nanoid());

  return (
    <div className={cn('mcheckbox')}>
      <input
        id={id}
        className="mcheckbox__input"
        type="checkbox"
        {...other}
      />
      {!_.isNil(label) &&
        <label htmlFor={id} className={cn('mcheckbox__label')}>
          <span className="mcheckbox__button"></span>
          {label}
        </label>
      }
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  label: propTypes.string,
};