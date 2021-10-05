//import liraries
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Platform,
} from 'react-native';
import {appImages, colors, wp, hp} from '../../utilities';
import CustomText from '../CustomText';
import Entypo from 'react-native-vector-icons/Entypo';
// create a component
const ToggleButton = ({
  name,
  onPress,
  btnTextColor,
  style,
  selected,
  icon,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          width: wp('96'),
          height: hp(10),

          alignSelf: 'center',
          borderRadius: 2,
        },
        style,
      ]}>
      <View
        style={[
          {
            width: wp('90'),
            height: hp(10),

            //   backgroundColor: selected == 'wallet' ? colors.primaryDark : 'white',

            justifyContent: 'center',
            alignItems: 'center',

            alignSelf: 'center',
            borderRadius: 10,
            flexDirection: 'row',
          },
          style,
        ]}>
        <View
          style={{
            width: wp('22'),
            height: hp(9),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Entypo name={icon} size={30} color={iconColor} />
          <View
            style={{
              height: '100%',
              width: 1,

              backgroundColor: 'white',
              right: 0,
              position: 'absolute',
              borderWidth: 1,
              borderColor: '#E5E5E5',
            }}
          />
        </View>
        <View
          style={{
            width: wp('70'),
            alignSelf: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            right: wp(5),
          }}>
          <CustomText
            title={name}
            type={'medium'}
            color={iconColor}
            style={{fontSize: 20}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  main: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteView: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0.8,
    backgroundColor: 'transparent',
  },
});

//make this component available to the app
export {ToggleButton};
