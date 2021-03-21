/**
 * User Profile View Page
 */
import useSWR from 'swr';
import { useRouter } from 'next/router';
import _ from 'lodash';
import __ from 'i18next';

import SecureLayout from 'layouts/secure-layout';
import { fetcher } from 'lib/api';
import { Divider, LinkButton } from 'components/utils';
import {
  MyImage,
  MyStory,
  MyInfo,
  MyCircles,
  MyExpertise,
  MyCourses,
  MyServices
} from 'components/profile/view';

const View = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/api/profile/${id}` : null, fetcher);

  return (
    <SecureLayout flex>
      <div className="profile__view">
        {_.isEmpty(data) || _.isNil(data) ?
          <div className="profile__loader">
            <h3>{__.t('Loading...')}</h3>
          </div>
        :
          _.isNil(error) && !_.isEmpty(data) && !_.isNil(data) && data !== "unknown error" ?
            <>
              <section className="profile__info">
                <section className="profile__info__image">
                  <LinkButton
                    label={<i className="fas fa-edit"></i>}
                    onClick={() => router.push(`/register/${id}`)}
                    size="medium"
                    color="white"
                    otherClass={'profile__info__image__edit'}
                  />
                  {/* <MyImage imageURL="/img/myphoto.jpg"/> */}
                  <MyImage imageURL={data.avatar || "/img/myphoto.jpg"}/>
                </section>
                <MyInfo
                  name={data.displayName}
                  title={data.title}
                  city={data.city}
                  languages={data.languages}
                  country={data.country}
                  LinkedIn={data.linkedin}
                  Facebook={data.facebook}
                  Twitter={data.twitter}
                />
                <Divider/>
                <MyStory story={data.myStory}/>
                <Divider />
                <MyExpertise expertise={data.expertise}/>
                <Divider />
                <MyCourses data={data}/>
                <Divider />
                <MyCircles data={data}/>
                <Divider />
                <MyServices data={data}/>
              </section>
            </>
          :
            <div className="profile__loader">
              <h3>{__.t('Unknown Profile')}</h3>
              <LinkButton href="/" label={__.t('Go back to Home')} size="medium" color="red" />
            </div>
        }
      </div>
    </SecureLayout>
  );
};

export default View;