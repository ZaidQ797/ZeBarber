import React from 'react';
import {Text, View} from 'react-native';
import {appLogo, colors, hp, wp, appIcons} from '../../utilities';
import {TextInput, HelperText} from 'react-native-paper';
import CustomText from '../CustomText';
import {fonts} from '../../Constant/../utilities/fonts';
import {Platform} from 'react-native';

const OutLinedInput = ({
  placeholder,
  title,
  value,
  secure,
  onChangeText,
  label,
  error,
  reference,
  keyboardType,
  rightIcon,
  onRightPress,
  contextMenuHidden,
}) => {
  return (
    <View style={{marginVertical: Platform.OS == 'ios' ? 12 : 2}}>
      <View
        style={{
          width: wp(82),
          height: 50,

          marginVertical: Platform.OS == 'ios' ? hp(0.8) : hp(2),
        }}>
        <TextInput
          mode="outlined"
          ref={reference}
          autoCapitalize={'none'}
          label={label}
          value={value}
          right={
            <TextInput.Icon
              name={rightIcon}
              onPress={onRightPress}
              color={colors.primaryDark}
              size={20}
            />
          }
          contextMenuHidden={contextMenuHidden}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          style={{
            fontSize: 15,
          }}
          theme={{
            colors: {
              primary: colors.buttonColor,
              underlineColor: 'transparent',
              background: 'white',
            },
            fonts: {
              regular: {
                fontFamily: fonts.WorkSansRegular,
              },
            },
          }}
        />
        <CustomText
          style={{fontSize: 13, marginTop: 3}}
          title={error}
          type={'large'}
          color={colors.red}
        />
      </View>
    </View>
  );
};

export {OutLinedInput};
