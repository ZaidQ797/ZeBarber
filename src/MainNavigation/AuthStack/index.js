import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../Screen/Auth/Login';
import Signup from '../../Screen/Auth/Signup';
import Scanner from '../../Screen/App/QRScanner';

import {Forget, OTP, ChangePassword} from '../../Screen/Auth/Reset';
// import PhoneConfirm from '../../Screen/Auth/Forget/PhoneConfirm';
// import ChangePassword from '../../Screen/Auth/Forget/ChangePassword';
const Auth = createStackNavigator();

const AuthStack = () => {
  return (
    <Auth.Navigator headerMode={'none'} initialRouteName={'Login'}>
      <Auth.Screen name={'Login'} component={Login} />
      <Auth.Screen name={'Signup'} component={Signup} />
      <Auth.Screen name={'Forget'} component={Forget} />
      <Auth.Screen name={'OTP'} component={OTP} />
      <Auth.Screen name={'Scanner'} component={Scanner} />

      <Auth.Screen name={'ChangePassword'} component={ChangePassword} />
    </Auth.Navigator>
  );
};
export {AuthStack};
