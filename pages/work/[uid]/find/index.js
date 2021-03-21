import { useMemo, useState } from 'react';
import _ from 'lodash';
import __ from 'i18next';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import yaml from 'js-yaml';
import fs from 'fs';
import propTypes from 'prop-types';

import { getApi } from 'lib/api';
import { useUser } from 'context/userContext';
import { Button, Selector } from 'components/utils';
import SecureLayout from 'layouts/secure-layout';
import PostList from 'layouts/post-list';

const FindJobs = ({ categories }) => {
  const router = useRouter();
  const context = useUser();
  const { uid } = router.query;
  const [ filter, setFilter ] = useState();
  const [ filterHistory, setFilterHistory ] = useState([]);
  const [ posts, setPosts ] = useState();
  const theHeader = [
    {
      options: { responsive: true },
      text: __.t('Title'),
    },{
      options: { responsive: true },
      text: __.t('Category'),
    },{
      options: { responsive: true },
      text: __.t('Description'),
    },{
      options: { responsive: true },
      text: __.t('Post Date'),
    }
  ];
  const thePosts = useMemo(() => {
    if (!_.has(posts, ['jobTitle', 'jobCategory', 'jobDescription', 'jobPostDate'])) {
      return _.map(posts, post => ({
        [post.jobId]: [
          {
            options: {},
            text: _.has(post, 'jobTitle.pValue') ? post.jobTitle.pValue[context.lang] : '',
          },{
            options: { responsive: true },
            text: __.t(post.jobCategory.label),
          },{
            options: { responsive: true },
            text: _.has(post, 'jobDescription.pValue') ? post.jobDescription.pValue[context.lang] : '',
          },{
            options: { responsive: true },
            text: moment(post.jobPostDate).tz(post.jobTimezone.value).format('YYYY-MM-DD HH:mm z'),
          }
        ]}));
    }
    return [];
  }, [posts, context.lang]);

  const _handleChange = (data) => {
    setFilterHistory( _.union(filterHistory, data));
    setFilter(data);
  };

  const _handleSearch = async () => {
    const keywords = _.map(filter, 'value');
    if (keywords.length) {
      const data = await getApi(`job/search?keywords=${_.toString(keywords)}`);
      if (_.isArray(data) && data !== 'unknown error') {
        setPosts(data);
      }
    }
  };

  return (
    <SecureLayout flex back color="red" header={__.t('Find Work')}>
      <div className="job-search__container">

        <section className="job-search__search">
          <Selector
            name="searchKeyword"
            label={__.t('Search for Jobs')}
            options={categories}
            handleChange={(sel) => _handleChange(sel)}
            fill
            isMulti
            isCreatable
            isClearable
            vertical
            placeholder={__.t('Enter or select keywords from the list')}
            style={{ paddingBottom: '3rem' }}
          />
          <br />
          <Button label="Search" color="red" onClick={_handleSearch}/>
        </section>

        <section className="job-search__results">
          <PostList
            title={__.t('Found {{number}} Jobs', { number: (_.isArray(posts) && posts.length) || 0 })}
            header={theHeader}
            data={thePosts}
            uid={uid}
            baseLink={`/work/${uid}/post/edit/{{id}}`}
          />
        </section>

      </div>
    </SecureLayout>
  );
};

export default FindJobs;

FindJobs.propTypes = {
  categories: propTypes.array,
};

export async function getServerSideProps() {
  let categories = {};

  try {
    categories = _.map(yaml.load(fs.readFileSync(`${process.cwd()}/manifests/categories.yml`, 'utf8')), (cat) => {
      return ({ value: cat.name, label: cat.name });
    });
  } catch (error) {
    console.error(error);
  }
  return { props: { categories } };
}