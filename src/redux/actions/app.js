import axios from 'axios';
import {BASE_URL} from '../base_url';
import {
  GET_CATEGS,
  GET_SERVICES,
  PROMOTIONS,
  EMPLOYEES,
  TIME_SLOTS,
  ALL_RESERVATIONS,
  ALL_NOTIF,
  BOOKING_DETAIL,
  POINTS_HISTORY,
  NOTIF_DATA,
} from '../types';

//Get Services
export const getServices = (token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/services`, null, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data?.success == 1) {
        let sectionListData = res?.data?.data?.categorized_services?.map(i => {
          return {title: i.name, id: i.id, data: i.services};
        });

        dispatch({
          type: GET_SERVICES,
          services: sectionListData,
        });
        rsl(res.data);
      }
    } catch (err) {
      //console.log(err.response);

      dispatch({
        type: GET_SERVICES,
      });
      rej(err?.response?.data);
    }
  };
};

//get Categs
export const getCateg = (token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/servicecategories`, null, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.success == 1) {
        dispatch({
          type: GET_CATEGS,
          categs: res?.data?.data?.service_categories,
        });
        rsl(res.data);
      }
    } catch (err) {
      dispatch({
        type: GET_CATEGS,
      });
      //console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

//Update Services
export const updateServices = (sectionListData, rsl, rej) => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_SERVICES,
        services: sectionListData,
        selected: handleCount(sectionListData),
      });
      rsl();
    } catch (err) {
      rej(err);
    }
  };
};
const handleCount = services => {
  try {
    let total = 0;
    services.forEach(elem => {
      elem.data.forEach(item => {
        item.selected && total++;
      });
    });
    return total;
  } catch (err) {
    //console.log(err);
    return 0;
  }
};
//get Promos
export const getPromo = (token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/promotions`, null, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: PROMOTIONS,
          promotions: res?.data?.data?.promotions,
        });
        rsl(res.data);
      }
    } catch (err) {
      dispatch({
        type: PROMOTIONS,
        promotions: null,
      });
      //console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

//get Employees
export const getAllEmployees = (token, rsl, rej) => {
  //console.log(token, rsl, rej);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/allemployee`, null, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: EMPLOYEES,
          all_employees: res?.data?.data?.all_employee,
        });
        rsl(res.data);
      }
    } catch (err) {
      dispatch({
        type: EMPLOYEES,
      });
      //console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

//get Available Slots
export const getAvailableSlots = (data, token, rsl, rej) => {
  //console.log(token, rsl, rej);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/gettimeslots`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res);
      if (res?.data?.success == 1) {
        // dispatch({
        //   type: TIME_SLOTS,
        //   slots: res?.data?.data?.time_slots,
        // });
        rsl(res.data);
      }
    } catch (err) {
      // dispatch({
      //   type: TIME_SLOTS,
      //   slots: null,
      // });
      //console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

//Confirm BOoking
export const confirmBooking = (data, token, rsl, rej) => {
  //console.log(token, rsl, rej);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/addreservation`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res?.data?.success == 1) {
        rsl(res.data);
      }
    } catch (err) {
      console.log(err.response);

      rej(err?.response?.data);
    }
  };
};

//Confirm BOoking
export const getMyReservations = (token, rsl, rej) => {
  //console.log(token, rsl, rej);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/allreservations`, null, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: ALL_RESERVATIONS,
          reservations: res?.data?.data?.reservations,
        });
        rsl(res.data);
      }
    } catch (err) {
      //console.log(err.response);
      dispatch({
        type: ALL_RESERVATIONS,
      });
      rej(err?.response?.data);
    }
  };
};

//Notifications
export const getAllNotif = (data, token, rsl, rej) => {
  console.log(data);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/getnotification`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      let noti_count = res?.data?.data?.notification?.filter(elem => {
        return elem.is_read == 0;
      });
      //console.log('noti_count', noti_count);
      if (res?.data?.success == 1) {
        dispatch({
          type: ALL_NOTIF,
          notifications: res?.data?.data?.notification,
          noti_count: noti_count?.length,
        });
        rsl(res.data);
      } else {
        rej();
        dispatch({
          type: ALL_NOTIF,
          noti_count: 0,
        });
      }
    } catch (err) {
      //console.log('====>', err);
      dispatch({
        type: ALL_NOTIF,
        notifications: null,
      });
      rej(err?.response?.data);
    }
  };
};

//get Reservation Detail
export const getReservationDetail = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      if (data) {
        const res = await axios.post(`${BASE_URL}api/reservationdetail`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log('Zaid', res);
        if (res?.data?.success == 1) {
          //console.log(JSON.stringify(res?.data?.data?.reservation));

          dispatch({
            type: BOOKING_DETAIL,
            bookingDetail: res?.data?.data?.reservation,
          });
          rsl(res.data);
        }
      } else {
        dispatch({
          type: BOOKING_DETAIL,
          bookingDetail: null,
        });
        rsl();
      }
    } catch (err) {
      //console.log(err.response);
      dispatch({
        type: BOOKING_DETAIL,
      });
      rej(err?.response?.data);
    }
  };
};

export const updateBooking = (data, rsl, rej) => {
  return async dispatch => {
    try {
      dispatch({
        type: BOOKING_DETAIL,
        bookingDetail: data,
      });
      rsl();
    } catch (err) {
      //console.log(err);
      rej();
    }
  };
};

//redeem Points
export const redeemPoints = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      if (data) {
        const res = await axios.post(`${BASE_URL}api/redeempoints`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
        if (res?.data?.success == 1) {
          dispatch({
            type: BOOKING_DETAIL,
            bookingDetail: res?.data?.data?.reservation,
          });
          rsl(res.data);
        }
      }
    } catch (err) {
      console.log(err.response);

      rej(err?.response?.data);
    }
  };
};

//Employee Review
export const employeeReview = (data, token, rsl, rej) => {
  console.log(data);
  return async dispatch => {
    try {
      if (data) {
        const res = await axios.post(`${BASE_URL}api/addempcomment`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
        res?.data?.success === 1 && rsl(res?.data?.message);
      }
    } catch (err) {
      console.log(err.response);

      rej(err?.response?.data);
    }
  };
};

// pointsHistory
export const pointsHistory = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/pointshistory`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: POINTS_HISTORY,
          pointHistory: res?.data?.data?.points_history,
        });
        rsl(res.data);
      } else {
        rej(res.data);
        dispatch({
          type: POINTS_HISTORY,
        });
      }
    } catch (err) {
      console.log(err.response);
      dispatch({
        type: POINTS_HISTORY,
      });

      rej(err?.response?.data);
    }
  };
};

//read Noti
export const readNoti = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/readnotification`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      rsl();
      console.log(res);
    } catch (err) {
      rej();
      console.log(err.response);
    }
  };
};

//Cancel Reservation
export const cancelReservation = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      if (data) {
        const res = await axios.post(`${BASE_URL}api/cancelreservation`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.success == 1) {
          rsl(res.data);
        }
      }
    } catch (err) {
      console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

export const updateNotiData = data => {
  return async dispatch => {
    try {
      dispatch({type: NOTIF_DATA, noti: data});
    } catch (err) {
      console.log(err);
    }
  };
};
