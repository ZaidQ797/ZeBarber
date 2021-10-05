//import liraries
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Profile} from '../../../Screen/BottomTab/Profile';
const profile = createStackNavigator();
// create a component
const ProfileStack = () => {
  return (
    <profile.Navigator headerMode={'none'} initialRouteName={'Profile'}>
      <profile.Screen name={'Profile'} component={Profile} />
    </profile.Navigator>
  );
};
//make this component available to the app
export {ProfileStack};
