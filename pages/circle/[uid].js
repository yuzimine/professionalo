import { useState } from 'react';
import __ from 'i18next';
import { useSession } from 'next-auth/client';

import { BgVideo, Divider, ListCard } from 'components/utils';
import SecureLayout from 'layouts/secure-layout';

const Circle = () => {
  const session = useSession();
  const [ cardList, setCardList ] = useState([
    { title: 'Dev Ninja', image: '/img/ninja.png', content: 'High performance fronte-end dev team', link: '/'},
    { title: 'Dev Ninja', image: '/img/ninja.png', content: 'High performance fronte-end dev team'},
    { title: 'Dev Ninja', image: '/img/ninja.png', content: 'High performance fronte-end dev team'},
    { title: 'Dev Ninja', image: '/img/ninja.png', content: 'High performance fronte-end dev team'},
    { content: 'High performance fronte-end dev team'},
    { title: 'Dev Ninja', content: 'High performance fronte-end dev team'},
    { image: '/img/ninja.png', content: 'High performance fronte-end dev team'},
  ]);

  return (
    <SecureLayout flex color="red">
      <div className="circle-container">
        <BgVideo 
          srcMP4="/img/young_people_standing_circle.mp4"
          srcWEBM="/img/young_people_standing_circle.webm"
          srcIMG="/img/hero.jpg"
          responsive
        />

        <section className="circle-container__header">
          <div className="circle-container__title">{__.t('The Power of Collaboration')}</div>
          <div className="circle-container__description" dangerouslySetInnerHTML={{__html: __.t('circle description')}} />
        </section>

        <section className="circle-container__my">
          <div className="circle-container__my__title">
            <span>{__.t('My Circles')}</span>
          </div>
          <Divider color="white"/>
          <ListCard cardList={cardList} />
        </section>

      </div>
    </SecureLayout>
  );
};

export default Circle;