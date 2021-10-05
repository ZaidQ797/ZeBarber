//import liraries
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
const AppStack = createStackNavigator();
import {AuthStack} from './AuthStack';
import {Splash} from '../Screen/Splash';
import Home from '../Screen/App/Dashboard';
import {colors} from '../utilities';
import {BottomTab} from './BottomTab';
import Slots from '../Screen/App/Slots';
import Confirm from '../Screen/App/ConfirmBooking';
import Promotions from '../Screen/App/Promotions';
import EditProfile from '../Screen/App/EditProfile';
import QR from '../Screen/App/MyQR';
import {checkConnection} from '../redux/actions/auth';
import NetInfo from '@react-native-community/netinfo';
import Notifications from '../Screen/App/Notifications';
import {useDispatch} from 'react-redux';
import Payment from '../Screen/App/Payment';
import AppointmentDetail from '../Screen/App/AppointDetail';
import Rate from '../Screen/App/Rate';
import Appointments from '../Screen/App/Appointment';
import UpdatePassword from '../Screen/App/UpdatePassword';
import PointsHistory from '../Screen/App/PointsHistory';
import {useSelector} from 'react-redux';

import {getAllNotif} from '../../src/redux/actions/app';
import {isConnected} from '../../src/Constant/Internet';
// create a component
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.xxlight,
  },
};
const MainVanigation = ({}) => {
  return (
    <NavigationContainer theme={MyTheme}>
      <AppStack.Navigator headerMode={'none'} initialRouteName={'Splash'}>
        <AppStack.Screen name={'Splash'} component={Splash} />
        <AppStack.Screen name={'auth'} component={AuthStack} />
        <AppStack.Screen name={'Root'} component={BottomTab} />
        <AppStack.Screen name={'Slots'} component={Slots} />
        <AppStack.Screen name={'Confirm'} component={Confirm} />
        <AppStack.Screen name={'Promotions'} component={Promotions} />
        <AppStack.Screen name={'EditProfile'} component={EditProfile} />
        <AppStack.Screen name={'Notifications'} component={Notifications} />
        <AppStack.Screen name={'QR'} component={QR} />
        <AppStack.Screen name={'AppointDetail'} component={AppointmentDetail} />
        <AppStack.Screen name={'Payment'} component={Payment} />
        <AppStack.Screen name={'Rate'} component={Rate} />
        <AppStack.Screen name={'Appointments'} component={Appointments} />
        <AppStack.Screen name={'UpdatePassword'} component={UpdatePassword} />
        <AppStack.Screen name={'PointsHistory'} component={PointsHistory} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};
export {MainVanigation};
