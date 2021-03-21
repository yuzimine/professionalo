import React from 'react';
import _ from 'lodash';
import propTypes from 'prop-types';
import dynamicComponent from './';

/**
 * 
 * @param {object} param.forms JSON array of form components to be rendered  
 */
const Generate = ({ forms }) => {
  const doms = _.map(forms, (fi, index) => {
    const domKey = _.keys(fi)[0];
    const domVal = _.values(fi)[0];

    if (!_.isNil(domKey) && _.has(dynamicComponent, domKey)) {
      return React.createElement(
        dynamicComponent[domKey],
        {
          ...domVal, 
          key: `${domKey}-${index}`,
        },
      );
    }
    return React.createElement('p', {className: 'bad-component'}, `<Bad component was specified here in the manifest: ${domKey}>`);
  });

  return doms;
};

export default Generate;

Generate.propTypes = {
  forms: propTypes.array.isRequired,
  // children: propTypes.oneOfType([
  //   propTypes.arrayOf(propTypes.node),
  //   propTypes.node,
  // ]).isRequired
};