import { useState } from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';
import { nanoid } from 'nanoid';

const Radiobox = ({ label, ...other }) => {
  const [ id ] = useState(nanoid());

  return (
    <div className={cn('mradiobox')}>
      <input
        id={id}
        className="mradiobox__input"
        type="radio"
        {...other}
      />
      {!_.isNil(label) &&
        <label htmlFor={id} className={cn('mradiobox__label')}>
          <span className="mradiobox__button"></span>
          {label}
        </label>
      }
    </div>
  );
};

export default Radiobox;

Radiobox.propTypes = {
  label: propTypes.string,
};