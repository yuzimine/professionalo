import __ from 'i18next';
import Link from 'next/link';

const About = () => {
  return (
    <section className="full-page about">
      <div className="row">
        <div className="col-2-of-3">
          <div className="about-container">
            <h2 className="about-header">{__.t('about header')}</h2>
            <p className="about-description">
              {__.t('Professional-O reads "Professional Circle" and it is a specialized freelance platform that focuses on enabling highly experienced, seasoned professionals to offer their knowledge and expertise in a flexible and affordable way. If you have spent a long an prosperous career at senior or exective positions impacting your company, industry or the world and you wish to step away from the high stress day-to-day job environment and share part of or even all of your expertise in a more self-paced, flexible, yet meaningful way, this platform is perfect for you. Likewise, if you are a small firm or an aspiring startup and you can\'t afford to hire premium executives or highly experienced professionals full time to help you succdeed in your project or venture this platform is also perfect for you.')}
            </p>
            <Link href="/more/about">
              <a className="mbtn mbtn-black">{__.t('Learn More')}</a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;