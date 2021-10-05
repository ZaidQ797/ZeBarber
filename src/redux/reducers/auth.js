import {
  LOGIN_USER,
  CONNECTION,
  REGISTER,
  LOGOUT,
  UPDATE_PROFILE,
  UPDATE_IMAGE,
} from '../types';

const initialState = {
  user: null,
  isLoggedIn: false,
  token: null,
  connection: null,
  user_details: null,
  user_qr_code: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.user,
        isLoggedIn: action.isLoggedIn,
        token: action.token,
        user_details: action.user_details,
        user_qr_code: action.user_qr_code,
      };

    case CONNECTION:
      return {
        ...state,
        connection: action.connection,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        token: null,
        connection: null,
        user_details: null,
        user_qr_code: null,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.user,
        user_details: action.user_details,
      };
    case UPDATE_IMAGE:
      return {
        ...state,
        user_details: action.user_detail,
      };
    default:
      return state;
  }
};
