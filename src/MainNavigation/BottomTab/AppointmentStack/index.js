//import liraries
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
const AppointStack = createStackNavigator();
import Appointment from '../../../Screen/App/Appointment';
// create a component
const AppointmentStack = () => {
  return (
    <AppointStack.Navigator
      headerMode={'none'}
      initialRouteName={'Appointment'}>
      <AppointStack.Screen name={'Appointment'} component={Appointment} />
    </AppointStack.Navigator>
  );
};
//make this component available to the app
export {AppointmentStack};
