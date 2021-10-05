import {combineReducers} from 'redux';

//Import All Reducers
import {authReducer} from './auth';
import {appReducer} from './app';
import {LOGOUT} from '../types';

const appRed = combineReducers({
  auth: authReducer,
  app: appReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appRed(state, action);
};
export default rootReducer;
