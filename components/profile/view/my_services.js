import __ from 'i18next';

const MyServices = () => {
  return (
    <div className="my__services">
      <h1 className="my__title">
        <i className="fas fa-tasks"></i>&nbsp;
        <span>{__.t('My Services')}</span>
      </h1>
    </div>
  );
};

export default MyServices;