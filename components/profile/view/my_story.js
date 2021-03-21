import __ from 'i18next';
import propTypes from 'prop-types';

import { MlLabel } from '../../utils';

const MyStory = ({ story }) => {
  return (
    <div className="my__pr">
      <h1 className="my__title">
        <i className="fas fa-book"/>&nbsp;
        <span>{__.t('My Story')}</span>
      </h1>
      <div className="my__text"><MlLabel value={story} /></div>
    </div>
  );
};

export default MyStory;

MyStory.propTypes = {
  story: propTypes.object,
};