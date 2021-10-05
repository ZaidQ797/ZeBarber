import {MainVanigation} from './src/MainNavigation';
import frLocale from 'moment/locale/fr';
import moment from 'moment';

import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar, LogBox} from 'react-native';
import {persister, store} from './src/redux/store';
LogBox.ignoreAllLogs();

const App = () => {
  moment.locale('fr');

  return (
    <Provider store={store}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <PersistGate persistor={persister}>
        <MainVanigation />
      </PersistGate>
    </Provider>
  );
};
export {App};
