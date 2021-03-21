import React, { useMemo, useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import propTypes from 'prop-types';

import { useUser } from 'context/userContext';
/**
 * Standard input component
 * 
 * @param {string} props.name The value identifier name
 * @param {string} props.type The input value type
 * @param {string} props.label The label of the input
 * @param {number} props.rows The number of rows in the text input box
 * @param {string, object} props.val Current input value
 * @param {bool} props.vertical Specifies whether to align the label and input vertically or horizontally
 * @param {bool} props.responsive Enable responsive behavior
 * @param {bool} props.fill Specifies whether to fill the entire width with the input component 
 * @param {string} props.align Text content alignment
 * @param {func} props.handleChange Callback for change event in value
 * @param {bool} props.enableLang Enable or disable the language selector
 * @param {bool} props.defaultLang The default language of the input
 * @param {object} props.textProps Additonal props to be passed on to the text object
 */
const Text = ({ name, type, label, rows, val, vertical, responsive, fill, align, handleChange, enableLang, defaultLang, textProps, ...other }) => {
  const context = useUser();
  const [ clang, setClang ] = useState(context.lang);
  const [ manualShow, setManualShow ]= useState(false);
  const pLang = useMemo(() => (val && val.pLang) ? val.pLang : '', [enableLang, val]);
  const value = useMemo(() => enableLang ? ((val && val.pValue && val.pValue[clang]) || '') : val, [enableLang, val, clang]);
  const isVertical = useMemo(() => vertical ? 'vertical' : null, [vertical]);
  const isFill = useMemo(() => fill ? 'fill' : null, [fill]);
  const textAlign = useMemo(() => align ? align: 'text-left', [align]);
  const isResponsive = useMemo(() => responsive ? 'responsive' : null, [responsive]);
  const isMultiLang = useMemo(() => enableLang && (!type || type === 'text') ? 'enable' : null, [enableLang, type]);
  const isReadOnly = useMemo(() => textProps ? textProps.readOnly : false, [textProps]);

  useEffect(() => {
    if (!_.isNil(defaultLang)) setClang(defaultLang);
  }, [defaultLang]);

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
 
    if (handleChange) {
      handleChange({
        name: name,
        multiLangValue: enableLang,
        pLang,
        pValue,
      });
    }
  }, [enableLang, clang, val]);

  return (
    <div className={cn('mtext', isVertical)}>
      {!_.isNil(label) &&
        <span className={cn('mtext__label', isVertical)}>
          {label}
        </span>
      }
      <div className={cn('mtext__container', isFill, isResponsive)} {...other}>
        <textarea
          name={name}
          rows={!isReadOnly ? (rows || 1) : 'auto'}
          className={cn('mtext__input', isMultiLang, isFill, textAlign)}
          value={value || ''}
          onChange={(event) => _onChangeInput(event)}
          {...textProps}
        />
        <a onClick={_onClick} className={cn('mtext__lang', isMultiLang, (manualShow ? 'show' : null), isReadOnly && 'hidden')}>
          {/* <i className="fas fa-globe mtext__lang__icon"/> */}
          <span className="mtext__lang__icon">{clang}</span>
          <div className="mtext__lang__list">
            <ul>
              {_.map(pLang, (lang) => {
                return (
                  <li
                    key={`${lang}`}
                    className={cn('mtext__lang__list__item', (clang === lang) && 'selected')}
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

export default Text;

Text.propTypes = {
  name: propTypes.string.isRequired,
  type: propTypes.string,
  label: propTypes.string,
  rows: propTypes.number,
  align: propTypes.string,
  vertical: propTypes.bool,
  fill: propTypes.bool,
  val: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.number]),
  handleChange: propTypes.func,
  defaultLang: propTypes.string,
  enableLang: propTypes.bool,
  textProps: propTypes.object,
  responsive: propTypes.bool,
};
