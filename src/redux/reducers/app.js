import {
  EMPLOYEES,
  GET_CATEGS,
  GET_SERVICES,
  PROMOTIONS,
  TIME_SLOTS,
  ALL_RESERVATIONS,
  ALL_NOTIF,
  SELECTED_SERVICES_COUNT,
  BOOKING_DETAIL,
  NEW_NOTIFICATION,
  POINTS_HISTORY,
  NOTIF_DATA,
} from '../types';

const initialState = {
  categs: null,
  promotions: null,
  slots: null,
  employees: null,
  notifications: null,
  services_count: 0,
  total_Price: 0,
  bookingDetail: null,
  notificationData: null,
  pointHistory: null,
  noti_count: 0,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGS:
      return {
        ...state,
        categs: action.categs,
      };
    case GET_SERVICES:
      return {
        ...state,
        services: action.services,
        services_count: action.selected,
      };
    case PROMOTIONS:
      return {
        ...state,
        promotions: action.promotions,
      };
    case TIME_SLOTS:
      return {
        ...state,
        slots: action.slots,
      };
    case EMPLOYEES:
      return {
        ...state,
        employees: action.all_employees,
      };
    case ALL_RESERVATIONS:
      return {
        ...state,
        reservations: action.reservations,
      };
    case ALL_NOTIF:
      return {
        ...state,
        notifications: action.notifications,
        noti_count: action.noti_count,
      };

    case SELECTED_SERVICES_COUNT:
      return {
        ...state,
        services_count: action.selected,
      };
    case BOOKING_DETAIL:
      return {
        ...state,
        bookingDetail: action.bookingDetail,
      };
    case NEW_NOTIFICATION:
      return {
        ...state,
        bookingDetail: action.noti,
      };
    case POINTS_HISTORY:
      return {
        ...state,
        pointHistory: action.pointHistory,
      };
    case NOTIF_DATA:
      return {
        ...state,
        notificationData: action.noti,
      };
    default:
      return state;
  }
};
