import React from 'react';
import {Text, View, StyleSheet, PlatformColor, Platform} from 'react-native';
import {Header, Badge} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../CustomText';
import {appIcons, colors, hp, wp} from '../../utilities';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {getCount} from '../Functions/general';
import {fonts} from '../../utilities/fonts';
const CustomHeader = ({
  title,
  onLeftPress,
  onRightPress,
  icon,
  right,

  showRight = true,
}) => {
  const navigation = useNavigation();
  const {notifications, noti_count} = useSelector(state => state.app);
  const renderLeft = () => {
    if (right) {
      return right;
    } else {
      return (
        <FontAwesome
          onPress={onLeftPress}
          name={icon}
          size={25}
          style={{
            opacity: 0.3,
            marginLeft: wp(2),
            marginVertical: hp(2),
          }}
        />
      );
    }
  };
  return (
    <Header
      backgroundColor={colors.primaryDark}
      containerStyle={{borderBottomWidth: 0, alignItems: 'center'}}
      leftComponent={renderLeft()}
      centerComponent={
        <View style={styles.bellContainer}>
          <CustomText
            style={{
              fontSize: 18,
              marginVertical: Platform.OS == 'ios' ? hp(1.5) : hp(1.5),
            }}
            // numberOfLines={1}
            title={title}
            type={'large'}
            textAlign={'center'}
            color={colors.white}
          />
        </View>
      }
      rightComponent={
        showRight && (
          <TouchableOpacity
            style={styles.bellContainer}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Notifications');
            }}>
            <appIcons.bell height={60} width={60} />
            {noti_count > 0 && (
              <Badge
                status="black"
                value={getCount(noti_count)}
                containerStyle={{
                  position: 'absolute',
                  right: -1,
                  top: 1,
                }}
              />
            )}
          </TouchableOpacity>
        )
      }
    />
  );
};

export default CustomHeader;
const styles = StyleSheet.create({
  bellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
