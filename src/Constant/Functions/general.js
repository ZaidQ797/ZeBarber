import {isConnected} from '../../Constant/Internet';
import {getAllNotif, readNoti} from '../../redux/actions/app';
export const getnotification = async (token, dispatch) => {
  if (await isConnected()) {
    new Promise((rsl, rej) => {
      dispatch(getAllNotif(token, rsl, rej));
    })
      .then(res => {})
      .catch(err => {});
  }
};

export const readNotif = (id, token, dispatch) => {
  const formData = new FormData();
  formData.append('id', id);
  new Promise((rsl, rej) => {
    dispatch(readNoti(formData, token, rsl, rej));
  }).then(res => {
    getnotification(token, dispatch);
  });
};

export const getCount = count => {
  if (count > 10 && count < 100) {
    return '10+';
  } else if (count > 100 && count < 1000) {
    return '100+';
  } else if (count > 1000 && count < 10000) {
    return '1k+';
  } else if (count > 10000 && count < 100000) {
    return '10k+';
  } else if (count > 100000 && count < 100000) {
    return '100k+';
  } else if (count > 1000000) {
    return '1M+';
  } else {
    return count;
  }
};
