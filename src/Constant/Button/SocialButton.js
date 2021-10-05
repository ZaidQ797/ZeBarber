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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-elements';
// create a component
const SocialButton = ({name, onPress, btnTextColor, style, social}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          width: wp('82'),
          height: hp(8),
          // padding: Platform.OS == 'android' ? 14 : 20,

          backgroundColor: social == 'fb' ? '#1A294A' : '#91231A',

          alignSelf: 'center',
          borderRadius: 10,
        },
        style,
      ]}>
      <View
        style={{
          width: wp('82'),
          height: hp(7.2),

          backgroundColor: social == 'fb' ? '#4867AA' : '#E94235',

          justifyContent: 'center',
          alignItems: 'center',

          alignSelf: 'center',
          borderRadius: 10,
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: wp('22'),
            height: hp(7.2),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <FontAwesome
            name={social == 'fb' ? 'facebook-f' : 'google'}
            size={30}
            color={'white'}
          />
          <View
            style={{
              height: '100%',
              width: 1,

              backgroundColor: social == 'fb' ? '#4867AA' : '#E94235',
              right: 0,
              position: 'absolute',
              borderWidth: 1,
              borderColor: social == 'fb' ? '#1A294A' : '#91231A',
            }}
          />
        </View>
        <View
          style={{
            width: wp('60'),
            alignSelf: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            right: wp(6),
          }}>
          <CustomText
            title={name}
            type={'medium'}
            color={'white'}
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
export {SocialButton};
