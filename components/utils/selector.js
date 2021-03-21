import { useMemo, useCallback } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import propTypes from 'prop-types';
import cn from 'classnames';

const colors = {
  red: '#e65096',
  black: '#364f6b',
  white: '#f5f5f5',
  lightRed: '#feb5cb',
  inputBackground: '#fff8fa',
  placeholder: '#feabc4',

  // SECONDARY COLORS
  // red: '#fc5185',
  // black: '#364f6b',
  // white: '#f5f5f5',
  // lightRed: '#feb5cb',
  // inputBackground: '#fff8fa',
  // placeholder: '#feabc4',
};

/**
 * Item selector component
 * 
 * @param {object} param.options  Selectable object list [{ value: '', label: ''}, ...]
 * @param {function} param.handleChange Handler for change event
 * @param {bool} param.isClearable  Whether to show clear button
 * @param {bool} param.isMulti  Whether multi-selection is possible
 * @param {bool} param.vertical Whether to align label and selector vertically
 * @param {string} param.label  Select item label
 */
const Selector = ({ options, label, fill, isClearable, isCreatable, isMulti, handleChange, vertical, ...other }) => {
  const getWidth = useCallback((state) => {
    if (!fill) {
      return _.has(state, 'selectProps.value.label') ? `${state.selectProps.value.label.length + 3}em` : 320;
    } else {
      return '100%'; 
    }
  }, [fill]);

  const customStyles = useMemo(() => ({
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 4px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: colors.lightRed,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: colors.red,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: colors.placeholder,
      fontSize: '1.8rem',
      fontStyle: 'italic',
    }),
    container: (provided) => ({
      ...provided,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: colors.lightRed,
      ':hover': {
        color: colors.red,
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: colors.lightRed,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: colors.lightRed,
      padding: 4,
      ':hover': {
        color: colors.red,
      },
    }),
    menu: (provided) => ({
      ...provided,
      border: `1px solid ${colors.lightRed}`,
      borderRadius: 0,
      textAlign: 'left',
      boxShadow: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      ':active': {
        backgroundColor: colors.red,
        color: colors.white,
      },
      ':hover': {
        backgroundColor: colors.red,
        color: colors.white,
      },
      color: state.isSelected ? colors.red : '#364f6b',
      backgroundColor: 'transparent',
    }),
    control: (provided, state) => ({
      ...provided,
      ':hover': {
        borderColor: colors.red
      },
      ':focus-within': {
        border: `2px solid ${colors.red}`,
      },
      minHeight: '3rem',
      border: `1px solid ${colors.lightRed}`,
      borderRadius: '0.4rem',
      boxShadow: 'none',
      display: 'flex',
      maxWidth: '100%',
      width: getWidth(state),
    }),
  }), [fill]);

  return (
    <div className={cn('mselector', vertical ? 'vertical' : '')}>
      {!_.isNil(label) &&
        <span className={cn('mselector__label', vertical ? 'vertical' : '')}>
          {label}
        </span>
      }
      <div className="mselector__container">
        {isCreatable ?
          <CreatableSelect
            instanceId="pro"
            isMulti={isMulti}
            isClearable={isClearable || false}
            styles={customStyles}
            options={options}
            onChange={handleChange}
            closeMenuOnSelect={false}
            noOptionsMessage={() => null}
            {...other}
          />
        :
          <Select
            instanceId="pro"
            isMulti={isMulti}
            isClearable={isClearable || false}
            styles={customStyles}
            options={options}
            onChange={handleChange}
            closeMenuOnSelect={isMulti && false}
            noOptionsMessage={() => null}
            {...other}
          />
        }
      </div>
    </div>
  );
};

export default Selector;

Selector.propTypes = {
  options: propTypes.array.isRequired,
  handleChange: propTypes.func.isRequired,
  isClearable: propTypes.bool,
  isCreatable: propTypes.bool,
  isMulti: propTypes.bool,
  label: propTypes.string,
  vertical: propTypes.bool,
  fill: propTypes.bool,
};