//import liraries
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
const DashStack = createStackNavigator();
import Dashboard from '../../../Screen/App/Dashboard';

const DashboardStack = () => {
  return (
    <DashStack.Navigator headerMode={'none'} initialRouteName={'Dashboard'}>
      <DashStack.Screen name={'Dashboard'} component={Dashboard} />
    </DashStack.Navigator>
  );
};
//make this component available to the app
export {DashboardStack};
