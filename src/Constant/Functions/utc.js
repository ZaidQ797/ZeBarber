import moment from 'moment';
import frLocale from 'moment/locale/fr';

moment.locale('fr');
//get UTC TIME
const getUTCtime = (localTime, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(localTime, format).utc().format(format);
};

//CONVERT UTC TO LOCAL
const getLocalTime = (utcTime, format = 'YYYY-MM-DD HH:mm') => {
  return moment.utc(utcTime).local().format(format);
};
export {getUTCtime, getLocalTime};
