import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import CustomText from '../CustomText';
import {fonts} from '../../utilities/fonts';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp} from '../../utilities';
const Picker = ({title, onPress, width}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        {
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width,
        },
        styles.input,
      ]}>
      <CustomText
        title={title}
        numberOfLines={1}
        type={'normal'}
        color={'gray'}
        style={{
          fontSize: 16,
          alignSelf: 'center',
          width: '90%',
        }}
      />
      <Ionicons
        name="chevron-down"
        color="#E5E5E5"
        size={25}
        style={{width: '10%', alignSelf: 'center'}}
      />
    </TouchableOpacity>
  );
};

export default Picker;
const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    fontFamily: fonts.WorkSansRegular,
    marginLeft: hp(1.8),
    width: '90%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: Platform.OS == 'ios' ? 15 : 12,
    borderRadius: 5,
  },
});
