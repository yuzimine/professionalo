/**
 * User Profile Edit or Registration Page
 */
import propTypes from 'prop-types';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import PageLayout from 'layouts/page-layout';
import SecureLayout from 'layouts/secure-layout';
import Register from 'components/profile/register';
import { fetcher } from 'lib/api';

import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';


///////////////////////////////
// TODO: Remove for production
///////////////////////////////
// import testProfile from '../../testData/register.json';
// import crypto from 'crypto';

// const sampleUser = {
//   id: crypto.createHash('sha1').update('yuzimine@me.com').digest('hex'),
//   profile: testProfile.profile,
// };
///////////////////////////////

const Index = ({ countries, languages, categories }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/api/profile/${id}` : null, fetcher);

  if (id === 'new') {
    return (
      <PageLayout>
        <Register
          categories={categories}
          countries={countries}
          languages={languages}
        />
      </PageLayout>
    );
  }
  if (!error && !data) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (data) {
    return (
      <SecureLayout flex center>
        <Register
          categories={categories}
          profile={data}
          countries={countries}
          languages={languages}
        />
      </SecureLayout>
    );
  }
};

export default Index;

Index.propTypes = {
  languages: propTypes.array,
  countries: propTypes.array,
};

export async function getServerSideProps() {
  let categories = {};
  let languages = {};
  let countries = {};

  try {
    categories = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/categories.yml`, 'utf8')), (cat) => {
      return ({ value: cat.tag, label: cat.name });
    });
    languages = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/languages.yml`, 'utf8')), (lang, key) => {
      return ({ value: key, label: lang.name });
    });
    countries = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/countries.yml`, 'utf8')), (lang) => {
      return ({ value: lang.code, label: lang.name });
    });
  } catch (error) {
    console.error(error);
  }
  return { props: { countries, languages, categories } };
}