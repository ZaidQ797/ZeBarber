import React, {useState} from 'react';
import {appIcons, colors, hp, wp} from '../../utilities';
import CustomText from '../CustomText';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {logoutAction, offlineLogout} from '../../redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {Alert} from '../Alert';
import Share from 'react-native-share';
import {isConnected} from '../Internet';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileSection = ({item, navigation, fontawesome}) => {
  const dispatch = useDispatch();
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const {token} = useSelector(state => state.auth);
  const handleNav = route => {
    if (route == 'logout') {
      setAlertMsg('Êtes-vous sûr de vous déconnecter');
      setAlert(true);
    } else if (route == 'Share') {
      const shareOptions = {
        title: 'ZeBarber User',
        url: 'https://zebarbershop.fr/',
        failOnCancel: false,
      };
      const ShareResponse = Share.open(shareOptions)
        .then(res => {})
        .catch(err => {});
    } else {
      navigation.push(item?.onPress);
    }
  };
  const handleLogout = async () => {
    setAlert(false);
    setAlertMsg('');
    if (await isConnected()) {
      let deviceId = DeviceInfo.getDeviceId();
      const formData = new FormData();
      formData.append('device_id', deviceId);
      new Promise(async (rsl, rej) => {
        await AsyncStorage.removeItem('notif');
        dispatch(logoutAction(formData, token, rsl, rej));
      })
        .then(res => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'auth',
                },
              ],
            }),
          );
          setAlert(false);
          setAlertMsg('');
        })
        .catch(err => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'auth',
                },
              ],
            }),
          );
          setAlert(false);
          setAlertMsg('');
        });
    } else {
      new Promise((rsl, rej) => {
        dispatch(offlineLogout(rsl, rej));
      })
        .then(res => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'auth',
                },
              ],
            }),
          );
        })
        .catch(err => {});
    }
  };
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleNav(item?.onPress)}>
      <View style={styles.imageContainer}>
        {item?.fontAwesome5 ? (
          <FontAwesome5 name={item?.icon} size={20} color={'#A5A5A5'} />
        ) : (
          <FontAwesome name={item?.icon} size={20} color={'#A5A5A5'} />
        )}
      </View>
      <View style={styles.textContainer}>
        <CustomText
          numberOfLines={1}
          style={{
            fontSize: 17,
          }}
          title={item?.title}
          type={'normal'}
          color={colors.black}
        />
      </View>
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
        }}
        onprimaryPress={() => {
          handleLogout();
        }}
        logout
        secondaryText={'Annuler'}
        primaryText={'Oui'}
        showPrimary
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  item: {
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 0.4,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 3,
  },
  imageContainer: {
    flex: 0.16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.7,
    paddingVertical: hp(2),
  },
});
