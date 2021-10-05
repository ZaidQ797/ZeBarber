import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CustomText from '../../Constant/CustomText';
import moment from 'moment';
import {appImages, colors, hp, wp} from '../../utilities';
import {TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {readNoti, getAllNotif} from '../../redux/actions/app';
import {Platform} from 'react-native';
import {isConnected} from '../../Constant/Internet';
import DeviceInfo from 'react-native-device-info';

const NotificationCard = ({item, navigation, token, index}) => {
  const dispatch = useDispatch();
  const handleNotiClick = async () => {
    let arr = [
      'new_reservation',
      'start_reservation',
      'reject_reservation',
      'complete_reservation',
      'cancel_reservation',
    ];
    if (await isConnected()) {
      if (item?.is_read == 0) {
        const formData = new FormData();
        formData.append('id', item?.id);
        new Promise((rsl, rej) => {
          dispatch(readNoti(formData, token, rsl, rej));
        }).then(async res => {
          if (await isConnected()) {
            getnotification();
          }
          if (arr.includes(item?.type)) {
            navigation.navigate('AppointDetail', {
              reserv_id: item?.reservation_id,
            });
          } else {
            navigation.navigate('PointsHistory');
          }
        });
      } else {
        if (arr.includes(item?.type)) {
          navigation.navigate('AppointDetail', {
            reserv_id: item?.reservation_id,
          });
        } else if (item?.type == 'reward_points') {
          navigation.navigate('PointsHistory');
        }
      }
    }
  };
  const getnotification = async () => {
    const formData = new FormData();
    formData.append('device_id', DeviceInfo?.getDeviceId());

    new Promise((rsl, rej) => {
      dispatch(getAllNotif(formData, token, rsl, rej));
    })
      .then(res => {
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        handleNotiClick(item);
      }}
      style={[
        styles.item,
        {
          backgroundColor: item.is_read ? 'white' : 'rgba(255,255,255,0.7)',
          borderTopRightRadius: index == 0 ? 4 : 0,
          borderTopLeftRadius: index == 0 ? 4 : 0,
        },
      ]}>
      <View style={styles.row}>
        <View
          style={{
            borderRadius: 3,
            flex: 0.9,
            // paddingVertical: 10,
          }}>
          <CustomText
            numberOfLines={2}
            style={{
              fontSize: 16,
            }}
            title={item.title}
            type={'medium'}
            color={colors.black}
          />
          <CustomText
            numberOfLines={2}
            style={{
              fontSize: 13,
              marginVertical: 3,
            }}
            title={item.message}
            type={'medium'}
            color={colors.black}
          />
          <CustomText
            numberOfLines={2}
            style={{fontSize: 12}}
            title={moment(item.updated_at).fromNow()}
            type={'large'}
            color={colors.primaryDark}
          />
        </View>
        {!item.is_read && (
          <View
            style={{
              height: 12,
              width: 12,
              backgroundColor: colors.primaryDark,
              borderRadius: 100,
              alignSelf: 'center',
              marginRight: wp(3),
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
const styles = StyleSheet.create({
  item: {
    // borderRadius: 5,
    width: '93%',
    alignSelf: 'center',
    // marginVertical: hp(0.4),
    borderBottomWidth: Platform.OS == 'android' ? 0.25 : 0.2,
    borderColor: '#BDBDBD',
    // borderColor: '#ddd',
    // shadowOpacity: 0.7,
  },
  row: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
