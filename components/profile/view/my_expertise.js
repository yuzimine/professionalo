import _ from 'lodash';
import __ from 'i18next';
import Link from 'next/link';
import propTypes from 'prop-types';

const MyExpertise = ({ expertise }) => {
  return (
    <div className="my__expertise">
      <h1 className="my__title">
        <i className="fas fa-diagnoses"></i>&nbsp;
        <span>{__.t('My Expertise')}</span>
      </h1>
      <ul className="label-list__container">
        {_.map(expertise, (ex, index) => {
          return (
            <li key={`${_.camelCase(ex.value)}-${index}`}>
              <Link href={`/profile/search/${ex.value}`}><a>{ex.label}</a></Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyExpertise;

MyExpertise.propTypes = {
  expertise: propTypes.array,
};