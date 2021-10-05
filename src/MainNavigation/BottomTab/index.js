//import liraries
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {ProfileStack} from './ProfileStack';
import {AppointmentStack} from './AppointmentStack';
import {DashboardStack} from './DashboardStack';
import {appIcons, colors, hp, wp} from '../../utilities';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import Profile from '../../Screen/App/Profile';
import Scanner from '../../Screen/App/QRScanner';
import {getColorScheme} from '../../Constant/Functions/getTheme';
import {Platform} from 'react-native';
const TabNavi = createBottomTabNavigator();
const SIZE = wp(4);
// create a component

const MyTabBar = ({state, descriptors, navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.darkBlack,
        height: Platform.OS == 'ios' ? 99 : 80,
        justifyContent: 'center',

        paddingTop: 12,
        paddingHorizontal: wp(2),
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={[
                styles.activeBg,
                {
                  backgroundColor: isFocused
                    ? colors.primaryDark
                    : 'transparent',
                },
              ]}>
              {index == 0 && <appIcons.home />}
              {index == 1 && <appIcons.appointments />}
              {/* {index == 2 && <appIcons.qrscan />} */}
              {index == 2 && <appIcons.profile />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function BottomTab() {
  return (
    <TabNavi.Navigator tabBar={props => <MyTabBar {...props} />}>
      <TabNavi.Screen name="Home" component={DashboardStack} />
      <TabNavi.Screen name="Appointments" component={AppointmentStack} />
      {/* <TabNavi.Screen name="Scan" component={Scanner} /> */}
      <TabNavi.Screen name="Profile" component={Profile} />
    </TabNavi.Navigator>
  );
}
export {BottomTab};
