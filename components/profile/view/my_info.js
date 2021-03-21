import propTypes from 'prop-types';
import Link from 'next/link';

import { MlLabel } from 'components/utils';
import { useUser } from 'context/userContext';

/**
 * Contains personal profile information
 * 
 * @param {object} props Component props
 * @param {string} props.LinkedIn your link to LinkedIn page
 * @param {string} props.Facebook your link to Facebook page
 * @param {string} props.Twitter your link to Twitter page
 */

const MyInfo = ({ name, title, city, country, languages, LinkedIn, Facebook, Twitter }) => {
  const context = useUser();

  return (
    <div className="my__identity">
      <h1 className="my__name">
        <MlLabel value={name} defaultLang={context.lang}/>
      </h1>
      <h2 className="my__profession">
        <MlLabel value={title} defaultLang={context.lang}/>
      </h2>
      <h3 className="my__location">
        <i className="fas fa-map-marked-alt my__location__icon"/>&nbsp;
        <MlLabel value={city} defaultLang={context.lang}/>,&nbsp;<MlLabel value={country.label} defaultLang={context.lang}/>
      </h3>
      <h3 className="my__language">
        <i className="fas fa-language my__language__icon"/>&nbsp;
        <ul className="label-list__container tiny">
          {_.map(languages, (lang) => (
              <li key={lang.value}>
                <Link href={`/profile/search/language/${lang.value}`}><a>{lang.label}</a></Link>
              </li>
            ))}
        </ul>
      </h3>
      <h3 className="my__social">
        {LinkedIn && <a href={LinkedIn} alt="LinkedIn"><i className="fab fa-linkedin"/></a>}
        {Facebook && <a href={Facebook} alt="Facebook"><i className="fab fa-facebook-square"/></a>}
        {Twitter && <a href={Twitter} alt="Twitter"><i className="fab fa-twitter-square"/></a>}
      </h3>
    </div>
  );
};

MyInfo.propTypes = {
  name: propTypes.object,
  title: propTypes.object,
  city: propTypes.object,
  country: propTypes.object,
  languages: propTypes.array,
  LinkedIn: propTypes.string,
  Facebook: propTypes.string,
  Twitter: propTypes.string,  
};

export default MyInfo;