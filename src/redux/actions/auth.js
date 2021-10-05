import axios from 'axios';
import {BASE_URL} from '../base_url';
import {
  LOGIN_USER,
  CONNECTION,
  REGISTER,
  LOGOUT,
  UPDATE_PROFILE,
  UPDATE_IMAGE,
} from '../types';
import {Alert} from 'react-native';
//Singup
export const signupRequest = (data, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/register`, data);
      console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: LOGIN_USER,
          user: res?.data?.data?.user,
          isLoggedIn: true,
          token: res?.data?.data?.accessToken,
          user_details: res?.data?.data?.user?.details,
          user_qr_code: res?.data?.data?.user?.details?.user_qrcode,
        });
        rsl(res?.data);
      }
    } catch (err) {
      dispatch({
        type: LOGIN_USER,
        user: null,
        isLoggedIn: false,
        token: null,
        user_details: null,
      });
      rej(err?.response?.data);
    }
  };
};
//Login
export const loginRequest = (data, rsl, rej) => {
  console.log(data);
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/login`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log(res);
      if (res?.data?.success == 1) {
        dispatch({
          type: LOGIN_USER,
          user: res?.data?.data?.user,
          isLoggedIn: true,
          token: res?.data?.data?.accessToken,
          user_details: res?.data?.data?.user?.details,
          user_qr_code: res?.data?.data?.user?.details?.user_qr_code,
        });
        rsl(res?.data);
      }
    } catch (err) {
      console.log(err.response);
      dispatch({
        type: LOGIN_USER,
        user: null,
        isLoggedIn: false,
        token: null,
        user_details: null,
      });

      rej(err?.response?.data);
    }
  };
};
//Forgot Password
export const verifyMail = (data, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/forgotpassword`, data, {
        Accept: 'application/json',
      });

      if (res?.data?.success == 1) {
        rsl(res?.data);
      }
    } catch (err) {
      rej(err?.response?.data?.data?.message);
    }
  };
};

//Verify OTP
export const verifyOTP = (data, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/matchotp`, data);
      console.log(res);
      if (res?.data?.success == 1) {
        rsl(res?.data);
      }
    } catch (err) {
      console.log(err.response);
      rej(err?.response?.data);
    }
  };
};

//Change Password
export const changePassword = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/updatepassword`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success == 1) {
        rsl(res.data);
      }
    } catch (err) {
      rej(err.response);
    }
  };
};

//Check Connection
export const checkConnection = status => {
  return async dispatch => {
    try {
      dispatch({
        type: CONNECTION,
        connection: status,
      });
    } catch (err) {}
  };
};

//Update Profile
export const updateProfile = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/updateuserdetail`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.success == 1) {
        dispatch({
          type: UPDATE_PROFILE,
          user: res?.data?.data?.user,
          user_details: res?.data?.data?.user_detail,
        });
        rsl(res.data);
      }
    } catch (err) {
      rej(err.response);
    }
  };
};

//Update Profile PIC
export const updateimage = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/addprofilepicture`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.success == 1) {
        dispatch({
          type: UPDATE_IMAGE,
          user_detail: res?.data?.data?.user_detail,
        });
        rsl(res.data);
      }
    } catch (err) {
      rej(err.response);
    }
  };
};

//GET QR VALUE
export const scanQR = (data, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/auth/scanreferralqrcode`,
        data,
        {},
      );
      if (res?.data?.success == 1) {
        rsl(res?.data?.data);
      }
    } catch (err) {
      rej(err?.response);
    }
  };
};

//LOGOUT
export const logoutAction = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/logout`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data?.success == 1) {
        dispatch({
          type: LOGOUT,
        });
        rsl(res.data);
      } else {
        // rsl();
        dispatch({
          type: LOGOUT,
        });
      }
    } catch (err) {
      rej(err.response);
      dispatch({
        type: LOGOUT,
      });
    }
  };
};

// OFFLINE LOGOUT
export const offlineLogout = (rsl, rej) => {
  return async dispatch => {
    try {
      dispatch({
        type: LOGOUT,
      });
      rsl();
    } catch (err) {
      rej(err);
    }
  };
};

// SOCIAL Login
export const socialLogin = (data, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/auth/sociallogin`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.success == 1) {
        dispatch({
          type: LOGIN_USER,
          user: res?.data?.data?.user,
          isLoggedIn: true,
          token: res?.data?.data?.accessToken,
          user_details: res?.data?.data?.user?.details,
          user_qr_code: res?.data?.data?.user?.details?.user_qr_code,
        });
        rsl(res?.data);
      }
    } catch (err) {
      dispatch({
        type: LOGIN_USER,
        user: null,
        isLoggedIn: false,
        token: null,
        user_details: null,
      });
      rej(err?.response?.data);
    }
  };
};

//Update Profile
export const updatedUserDetail = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/userdetail`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.success == 1) {
        dispatch({
          type: UPDATE_PROFILE,
          user: res?.data?.data?.user,
          user_details: res?.data?.data?.user?.details,
        });
        rsl(res.data);
      }
    } catch (err) {
      rej(err.response);
    }
  };
};

//Update Password
export const updatePassword = (data, token, rsl, rej) => {
  return async dispatch => {
    try {
      const res = await axios.post(`${BASE_URL}api/changepassword`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success == 1) {
        rsl(res.data);
      }
    } catch (err) {
      rej(err.response);
    }
  };
};
