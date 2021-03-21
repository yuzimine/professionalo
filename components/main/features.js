import __ from 'i18next';
import Link from 'next/link';
import { Dialog } from '../utils';

const Features = () => {
  return (
    <section className="full-page features" id="features">

      <div className="features-header">
        <h3 className="features-title">{__.t('Create and Nurture Your Professional Circle')}</h3>
        <p className="features-description">
          {__.t('Whether you want to offer your services or employ services or stay in touch with your closest professional contacts and create new ones or all of the above, you are in full control of your circle. {{company}} offers you a unique environment for building and nurturing a circle of professional contacts and partners to share knowledge, explore opportunities and offer expert services.', {company: '$t(company name)'})}
        </p>
      </div>
      <div className="row">
        <div className="col-1-of-3 u-text-center">
          <div className="fixed-card red-back wide">
            <i className="fas fa-user-circle card-icon"></i>
            <h3 className="card-header">{__.t('Create a Circle')}</h3>
            <p className="card-description">{__.t("Your first step will be to create your professional profile. Don't worry, you will have full control over who can see any part of your profile. The next step will be to invite or connect with others to begin nurturing your professional circle.")}</p>
            <div className="card-footer">
              <Link href="/profile/view">
                <a className="mbtn mbtn-red medium">{__.t('Learn More')}</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-1-of-3 u-text-center">
          <div className="fixed-card wide">
            <i className="fas fa-magic card-icon"></i>
            <h3 className="card-header">{__.t('Share Your Expertise')}</h3>
            <p className="card-description">{__.t("Your first step will be to create your professional profile. Don't worry, you will have full control over who can see any part of your profile. The next step will be to invite or connect with others to begin nurturing your professional circle.")}</p>
            <div className="card-footer">
              <a className="mbtn mbtn-red medium" href="#popup">{__.t('Learn More')}</a>
            </div>
          </div>
        </div>
        <div className="col-1-of-3 u-text-center">
          <div className="fixed-card wide">
            <i className="fas fa-hands-helping card-icon"></i>
            <h3 className="card-header">{__.t('Contract Work')}</h3>
            <p className="card-description">{__.t("Your first step will be to create your professional profile. Don't worry, you will have full control over who can see any part of your profile. The next step will be to invite or connect with others to begin nurturing your professional circle.")}</p>
            <div className="card-footer">
              <Link href="/">
                <a className="mbtn mbtn-red medium" href="#">{__.t('Learn More')}</a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Dialog target="popup" origin="features"/>
    </section>
  );
};

export default Features;