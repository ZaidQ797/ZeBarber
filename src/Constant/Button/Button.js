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
import {fonts} from '../../utilities/fonts';
import CustomText from '../CustomText';

// create a component
const Button = ({name, onPress, btnTextColor, width}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          width: width ? width : wp('82'),
          height: hp(8),
          // padding: Platform.OS == 'android' ? 14 : 20,

          backgroundColor: colors.buttonBorderColor,

          alignSelf: 'center',
          borderRadius: 10,
        },
        // style,
      ]}>
      <View
        style={{
          width: width ? width : wp('82'),
          height: hp(7.2),

          backgroundColor: colors.buttonColor,
          justifyContent: 'center',
          alignItems: 'center',

          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <CustomText
          title={name}
          type={'medium'}
          color={'white'}
          style={{fontSize: 20}}
        />
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
export {Button};
