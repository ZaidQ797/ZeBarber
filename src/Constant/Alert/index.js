import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'react-native-elements';

import {appIcons, colors, hp, wp} from '../../utilities';
import CustomText from '../CustomText';

export const Alert = ({
  visible = false,
  icon,
  warning = false,
  del = false,
  primaryText = 'OUI',
  secondaryText = 'OK',
  showPrimary = false,
  onprimaryPress,
  onSecondaryPress,
  alertMsg,
  logout,
  upload,
  showSecondary = true,
}) => {
  const renderIcon = () => {
    if (icon) {
      return <Image source={appIcons.del} style={styles.iconStyle} />;
    } else if (warning) {
      return <appIcons.warning />;
    } else if (del) {
      return <appIcons.del />;
    } else if (logout) {
      return <appIcons.logout height={40} width={40} />;
    } else if (upload) {
      return <appIcons.upload height={40} width={40} />;
    }
  };
  return (
    <Overlay
      isVisible={visible}
      overlayStyle={styles.overlay}
      backdropStyle={{
        opacity: Platform.OS == 'ios' ? 0.7 : 0.8,
        backgroundColor: '#000',
      }}>
      {renderIcon()}
      <CustomText
        style={{
          marginVertical: hp(1.5),
          fontSize: 20,
        }}
        title={alertMsg}
        type={'large'}
        textAlign={'center'}
        color={colors.white}
      />
      <View style={{flexDirection: 'row'}}>
        {showSecondary && (
          <TouchableOpacity onPress={onSecondaryPress} style={styles.ok}>
            <CustomText
              style={{
                fontSize: 16,
              }}
              title={secondaryText}
              type={'large'}
              color={colors.black}
            />
          </TouchableOpacity>
        )}
        {showPrimary && (
          <TouchableOpacity
            onPress={onprimaryPress}
            style={[styles.ok, {backgroundColor: colors.buttonColor}]}>
            <CustomText
              style={{
                fontSize: 16,
              }}
              textAlign={'center'}
              numberOfLines={2}
              title={primaryText}
              type={'large'}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
    </Overlay>
  );
};
const styles = StyleSheet.create({
  overlay: {
    // height: hp(20),
    width: wp(80),
    padding: 30,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#707070',
  },
  iconStyle: {
    height: 250,
    width: 250,
  },
  ok: {
   
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
