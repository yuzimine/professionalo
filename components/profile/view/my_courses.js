import __ from 'i18next';

const MyCourses = () => {
  return (
    <div className="my__courses">
      <h1 className="my__title">
        <i className="fas fa-graduation-cap"></i>&nbsp;
        <span>{__.t('My Courses')}</span>
      </h1>
    </div>
  );
}

export default MyCourses;