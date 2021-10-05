import {createStore, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

// import reducers from './Reducers';

import combineReducers from './reducers';
import middlewares from './middlewares';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,

  blacklist: [],
};

const pReducer = persistReducer(persistConfig, combineReducers);

const store = createStore(pReducer, applyMiddleware(...middlewares));

const persister = persistStore(store);

export {store, persister};
