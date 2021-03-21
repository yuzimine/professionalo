import __ from 'i18next';

const MyCircles = () => {
  return (
    <div className="my__circles">
      <h1 className="my__title">
        <i className="fas fa-user-circle"></i>&nbsp;
        <span>{__.t('My Circles')}</span>
      </h1>
      <div className="my__circles__container">
        <table className="mtable full hover">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>{__.t('Name')}</th>
              <th>{__.t('Service Offer')}</th>
              <th>{__.t('My Role')}</th>
              <th className="u-text-center">{__.t('Members')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="u-text-center unhighlight">
                <img className="my__circle__logo" src="/img/ninja.png"/>
              </td>
              <td className="u-text-red u-text-bold">Ninja Devs</td>
              <td>Web Application Product Development</td>
              <td>
                <i className="fas fa-star u-text-yellow"/>&nbsp;
                <span>Chair</span>
              </td>
              <td className="u-text-center">3</td>
            </tr>
            <tr>
              <td className="u-text-center unhighlight">
                <img className="my__circle__logo" src="/img/shogun.jpg"/>
              </td>
              <td className="u-text-red u-text-bold">Shogun Branders</td>
              <td>Corporate Branding</td>
              <td>Graphics Design</td>
              <td className="u-text-center">3</td>
            </tr>
            <tr>
              <td className="u-text-center unhighlight">
                <img className="my__circle__logo" src="/img/samurai.png"/>
              </td>
              <td className="u-text-red u-text-bold">Samurai Marketers</td>
              <td>B2B Marketing</td>
              <td>Chair</td>
              <td className="u-text-center">3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCircles;