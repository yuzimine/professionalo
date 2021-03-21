import React, { useMemo, useState, useCallback, useEffect } from 'react';
import __ from 'i18next';
import _ from 'lodash';
import cn from 'classnames';
import propTypes from 'prop-types';

/**
 * Standard input component
 * 
 * @param {string} props.name The value identifier name
 * @param {string} props.type The input value type
 * @param {string} props.label The label of the input
 * @param {string, object} props.val Current input value
 * @param {bool} props.vertical Specifies whether to align the label and input vertically or horizontally
 * @param {bool} props.responsive Enable responsive behavior
 * @param {bool} props.fill Specifies whether to fill the entire width with the input component 
 * @param {string} props.align Text content alignment
 * @param {func} props.handleChange Callback for change event in value
 * @param {bool} props.enableLang Enable or disable the language selector
 * @param {bool} props.defaultLang The default language of the input
 * @param {object} props.inputProps Additional props to be passed to the input object
 */
const Input = ({ name, type, label, val, vertical, responsive, fill, align, handleChange, enableLang, defaultLang, inputProps, ...other }) => {
  const [ clang, setClang ] = useState(__.language);
  // const [ pValue, setPvalue ] = useState();
  const [ manualShow, setManualShow ]= useState(false);
  const pLang = useMemo(() => (enableLang && val) ? val.pLang : null, [enableLang, val]);
  const value = useMemo(() => enableLang ? ((val && val.pValue && val.pValue[clang]) || '') : val, [enableLang, val, clang]);
  const isVertical = useMemo(() => vertical ? 'vertical' : null, [vertical]);
  const isFill = useMemo(() => fill ? 'fill' : null, [fill]);
  const isResponsive = useMemo(() => responsive ? 'responsive' : null, [responsive]);
  const isMultiLang = useMemo(() => enableLang && (!type || type === 'text') ? 'enable' : null, [enableLang, type]);
  const isReadOnly = useMemo(() => inputProps ? inputProps.readOnly : false, [inputProps]);
  const textAlign = useMemo(() => (align && !isReadOnly) ? align: 'text-left', [align, isReadOnly]);

  useEffect(() => {
    if (!_.isNil(defaultLang)) setClang(defaultLang);
  }, [defaultLang]);

  // useEffect(() => {
  //   if (enableLang && val) {
  //     setPvalue(val.pValue);
  //   } else {
  //     setPvalue(val || '');
  //   }
  // }, [enableLang, val]);
  
  const _onChangeLang = useCallback((event) => {
    setClang(event.target.innerText);
    setManualShow(false);
  }, []);

  const _onClick = useCallback(() => {
    setManualShow(!manualShow);
  }, [manualShow]);

  const _onChangeInput = useCallback((event) => {
    const { value } = event.target;
    const pValue = !enableLang ? value : {...val.pValue, [clang]: value};

    // if (!enableLang) {
    //   setPvalue(value);
    // } else {
    //   setPvalue((prevValue) => ({...prevValue, [clang]: value}));
    // }

    if (handleChange) {
      handleChange({
        name: name,
        multiLangValue: enableLang,
        pLang,
        pValue,
        // pValue: !enableLang ? value : {...pValue, [clang]: value },
      });
    }
  }, [enableLang, clang, val]);

  return (
    <div className={cn('minput', isVertical)}>
      {!_.isNil(label) &&<span className={cn('minput__label', isVertical)}>{label}</span>}
      <div className={cn('minput__container', isFill, isResponsive)} {...other}>
        <input
          type={type || 'text'}
          name={name}
          className={cn('minput__input', isMultiLang, isFill, textAlign)}
          value={value || ''}
          onChange={(event) => _onChangeInput(event)}
          {...inputProps}
        />
        <a onClick={_onClick} className={cn('minput__lang', isMultiLang, (manualShow ? 'show' : null), isReadOnly && 'hidden')}>
          {/* <i className="fas fa-globe minput__lang__icon"/> */}
          <span className="minput__lang__icon">{clang}</span>
          <div className="minput__lang__list">
            <ul>
              {_.map(pLang, (lang) => {
                return (
                  <li
                    key={`${lang}`}
                    className={cn('minput__lang__list__item', (clang === lang) && 'selected')}
                    onClick={(event) => _onChangeLang(event)}
                  >
                    {lang}
                  </li>
                );
              })}
            </ul>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Input;

Input.propTypes = {
  name: propTypes.string.isRequired,
  type: propTypes.string,
  label: propTypes.string,
  align: propTypes.string,
  vertical: propTypes.bool,
  fill: propTypes.bool,
  val: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.number]),
  handleChange: propTypes.func,
  defaultLang: propTypes.string,
  enableLang: propTypes.bool,
  inputProps: propTypes.object,
  responsive: propTypes.bool,
};
