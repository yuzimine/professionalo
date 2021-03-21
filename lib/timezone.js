import moment from 'moment-timezone';

export const parseOutTzFromDate = (dateString, tz = moment.tz.guess()) => {
  if (dateString) {
    return moment.tz(dateString, tz).format('YYYY-MM-DDTHH:mm');
  }
  return '';
};

export const createTzAwareDate = (dateString, tz = moment.tz.guess()) => {
  if (dateString) {
    return `${moment(dateString).format('YYYY-MM-DDTHH:mm')}${moment.tz(tz).format('Z')}`;
  }
  return '';
};