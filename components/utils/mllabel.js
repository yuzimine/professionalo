import __ from 'i18next';
import propTypes from 'prop-types';

/**
 * Display multi-language text
 * 
 * @param {object} param.value The multi-language display value object 
 */
const MlLabel = ({ value, defaultLang }) => {
  if (!value) return '';
  let dvalue = value;
  if (_.has(value, 'pValue')) {
    const clang = defaultLang || __.language;
    dvalue = value.pValue[clang] === undefined ? value.pValue['en'] : value.pValue[clang];
  }

  return <span>{dvalue || ''}</span>;
};

export default MlLabel;

MlLabel.propTypes = {
  value: propTypes.oneOfType([propTypes.string, propTypes.object]),
  defaultLang: propTypes.string,
};