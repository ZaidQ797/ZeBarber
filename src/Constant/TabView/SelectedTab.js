//import liraries
import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './Styles';
import {Icon} from 'react-native-elements';
import {hp, wp} from '../../utilities';
// create a component
const SelectedTab = ({focused, name}) => {
  return (
    <View
      style={{
        width: wp(8),
        height: hp(8),
        backgroundColor: 'red',
      }}>
      <Icon
        raised
        name="heartbeat"
        type="font-awesome"
        color="#f50"
        // onPress={() => ('hello')}
      />
    </View>
  );
};
//make this component available to the app
export {SelectedTab};
