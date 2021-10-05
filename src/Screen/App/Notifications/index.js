import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  RefreshControl,
} from 'react-native';
import {appImages, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {Alert} from '../../../Constant/Alert';
import {Loading} from '../../../Constant/Loading';
import {Empty} from '../../../Constant/Empty';
import {isConnected} from '../../../Constant/Internet';
import {getAllNotif} from '../../../redux/actions/app';
import {useFocusEffect} from '@react-navigation/core';
import moment from 'moment';
import frLocale from 'moment/locale/fr';
import NotificationCard from '../../../Constant/NotificationCard';
import DeviceInfo from 'react-native-device-info';

const Notifications = ({navigation}) => {
  const {user, user_details, token, user_qr_code} = useSelector(
    state => state.auth,
  );
  const {notifications} = useSelector(state => state.app);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefresh] = useState(false);

  const dispatch = useDispatch();

  //RENDER EMPTY INCASE NO NOTIFICATIONS FOUND
  const renderEmpty = () => {
    if (
      notifications?.length == 0 ||
      notifications == [] ||
      notifications == undefined ||
      notifications == null
    ) {
      return (
        <Empty visible={true} title={'Aucune notification pour le moment'} />
      );
    }
  };

  //GET ALL NOTIFICATIONS
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsub = getnotification();
      return () => unsub;
    }, []),
  );

  const getnotification = async () => {
    if (await isConnected()) {
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
    } else {
      setLoading(false);
      setAlert(true);
      setAlertMsg('veuillez vérifier votre internet');
    }
  };

  //REFRESH CONTROL
  const handleOnRefresh = () => {
    setIsRefresh(true);
    setTimeout(() => {
      getnotification();
      setIsRefresh(false);
    }, 3000);
  };

  //RENDER
  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Notifications'}
        onLeftPress={() => {
          navigation.goBack();
        }}
        showRight={false}
      />
      <View style={styles.white}>
        {renderEmpty()}
        {notifications && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={notifications}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                tintColor={colors.primaryDark}
                refreshing={isRefreshing}
                onRefresh={handleOnRefresh}
              />
            }
            renderItem={({item, index}) => (
              <NotificationCard
                item={item}
                navigation={navigation}
                token={token}
                index={index}
              />
            )}
          />
        )}
      </View>

      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
        }}
        warning
        secondaryText={`d'accord`}
      />

      <Loading visible={loading} />
    </View>
  );
};

export default Notifications;

//STYLES
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},
  qrCode: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },

  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  white: {
    flex: 1,
    backgroundColor: 'white',

    // borderTopRightRadius: 39,
    // borderTopLeftRadius: 39,
    paddingTop: hp(2),
  },

  item: {
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowOpacity: 0.7,
    shadowColor: '#eee',
    backgroundColor: 'white',
    elevation: 1,
  },
  imageContainer: {
    flex: 0.27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.7,
    paddingVertical: hp(2.5),
    marginLeft: wp(2),
  },

  avatar: {
    height: 65,
    width: 65,
    alignSelf: 'center',
    borderRadius: 13,
  },
  shadowContainer: {
    height: 70,
    width: 70,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#ffff',
    shadowOpacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
  },
});
