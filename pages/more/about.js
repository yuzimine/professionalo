import __ from 'i18next';
import Image from 'next/image';
import { Quote } from '../../components/utils';
import MainLayout from '../../layouts/main-layout';

const About = () => {
  return (
    <MainLayout>

      <section className="about-more-quote">
        <Quote
          text="Forty is the old age of youth; fifty the youth of old age."
          credit="Victor Hugo"
          animated
        />
      </section>

      <section className="with-padding about-more-story">
        <div className="row">
          <div className="col-1-of-2">
            <div className="about-more-vision">
              <h1>The Vision</h1>
              <p>
                The professional world is in need of a major overhaul. The world is not what it used to be 30 - 40 years ago. Yet most companies have not evolved to adapt to this change, and neither has society. A majority of people&apos;s default template for their professional life-plan is still to graduate from the best schools, get into the best companies, and seek as high a position and status as possible in a company. But the obstacles that get in the way of achieving success with this template is constantly growing or getting worse: college expense, recession, inflation, politics, age, discrimination, health issues, natural disasters, the list goes on. Some try to break out of or resist this flow though entreprenuership or freelancing (which is growing rapidly as a viable option) but still few people truly succeed. Those who fall off both bandwagons are faced with a harsh reality of not having anywhere to go - and the number of these people are growing more and more worldwide.
              </p>
              <p>
                <strong>{__.t('company full name')}</strong> was not created to be just another platform for freelancers. It was created to support a new way of life for professional workers that is unbound by age, race, language, location, expertise, and time. A new world where companies, employers, and employees no longer exist in a world of exclusivity and hierarchy, but rather each are equal pieces of a building block that are free to mix and match in pursuite of maximizating opportunities and potential for everyone. It is not about beating the competition or achiving status or making gobbs of money - it&apos;s about fulifllment, happiness, cooperation and most of all, it is about YOU - not a company or employer - beging in control of your professional life and proving that business can thrive in this world.
              </p>
            </div>
          </div>
          <div className="col-1-of-2">
            <div className="about-more-image">
              <div className="about-more-image-vision">
                <Image
                  src="/img/thevision1.svg"
                  alt="The Vision Image"
                  layout="responsive"
                  height={'1'}
                  width={'1'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="with-padding about-more-function">

      </section>

    </MainLayout>
  );
};

export default About;