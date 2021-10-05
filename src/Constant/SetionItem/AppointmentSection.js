import React from 'react';
import {appIcons, colors, hp, wp} from '../../utilities';
import CustomText from '../CustomText';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import {getUTCtime, getLocalTime} from '../../Constant/Functions/utc';

export const AppointmentSection = ({item, navigation}) => {
  const renderStatus = status => {
    return ['Réservé', '', 'Démarré', 'Rejeté', 'Annulé', 'Complété'][status];
  };
  const renderColor = status => {
    return ['#454545', '', colors.primaryDark, '#f03c3c', '#c9c9c9', '#4dc46d'][
      status
    ];
  };
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('AppointDetail', {reserv_id: item.id});
      }}>
      {/* <View style={styles.imageContainer}>
        <Image
          style={[styles.avatar]}
          source={{
            uri: item?.user?.details?.photo
              ? item?.user?.details?.photo
              : 'https://www.nicepng.com/png/detail/810-8105444_male-placeholder.png',
          }}
        />
      </View> */}
      <View style={styles.textContainer}>
        <CustomText
          numberOfLines={1}
          style={{
            fontSize: 16,
          }}
          title={getLocalTime(item?.reservation_date, 'll HH:mm')}
          type={'large'}
          color={colors.black}
        />

        {/* <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: hp(0.4),
            backgroundColor: 'tomato',
          }}>
          <CustomText
            numberOfLines={2}
            title={item.description}
            type={'normal'}
            color={colors.black}
            style={{width: '60%'}}
          />
        </View> */}
      </View>
      <View style={{justifyContent: 'center', flex: 0.2}}>
        <View
          style={{
            // backgroundColor: renderColor(item.status),
            borderRadius: 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: wp(23),
          }}>
          <CustomText
            numberOfLines={1}
            style={{
              fontSize: 14,
            }}
            title={renderStatus(item?.status)}
            type={'medium'}
            color={renderColor(item.status)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  item: {
    // paddingVertical: wp(2),
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp(0.7),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 0.22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.72,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
  },
  avatar: {
    height: 55,
    width: 55,
    alignSelf: 'center',
    borderRadius: 4,
  },
});
