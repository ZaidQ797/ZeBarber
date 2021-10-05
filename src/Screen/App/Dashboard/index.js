import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  LogBox,
  Image,
  processColor,
  Platform,
  SectionList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import {Badge} from 'react-native-elements';
import {fcmService, localNotificationService} from '../../../services';
import {appIcons, appImages, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import {Empty} from '../../../Constant/Empty';
import Header from '../../../Constant/Header';
import DeviceInfo from 'react-native-device-info';
import {updatedUserDetail} from '../../../redux/actions/auth';

import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCateg,
  getServices,
  updateServices,
} from '../../../redux/actions/app';
import {Loading} from '../../../Constant/Loading';
import {useIsFocused} from '@react-navigation/core';
import {ScrollView} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {Alert} from '../../../Constant/Alert';
import {isConnected} from '../../../Constant/Internet';
import {getAllNotif, readNoti} from '../../../redux/actions/app';

import ServiceCard from '../../../Constant/ServiceCard';
import {
  getCount,
  getnotification,
  readNotif,
} from '../../../Constant/Functions/general';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation, route}) => {
  const {token, user, user_details, connection, isLoggedIn} = useSelector(
    state => state.auth,
  );
  const {categs, services, services_count, noti_count} = useSelector(
    state => state.app,
  );
  const [active, setActive] = useState(0);
  const [categId, setCategId] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefresh] = useState(false);
  const [showFab, setShowFab] = useState(true);

  //ARRAY FOR NOTIFICATIONS TYPES
  let arr = [
    'new_reservation',
    'start_reservation',
    'reject_reservation',
    'cancel_reservation',
  ];

  //NOTIFICATION LISTENERS REGISTRATION
  useEffect(() => {
    let mount = true;
    try {
      getnotification();
      fcmService.registerAppWithFCM();
      fcmService.register(onRegister, onNotification, onOpenNotification);
      localNotificationService.configure(onOpenNotification);
    } catch (err) {}
    return () => {
      mount = false;
    };
  }, []);

  // CALLED WHEN NOTIFICATION CLICKED
  const onOpenNotification = async (notify, remoteMessage) => {
    const notif = await AsyncStorage.getItem('notif');
    let notifParsed = JSON.parse(notif);
    // readNotif(notifParsed?.id, token, dispatch);

    if (notifParsed) {
      if (arr.includes(notifParsed?.type)) {
        if (notifParsed?.type === arr[0] || notifParsed?.type === arr[1]) {
          getAllservices();
        }
        navigation.navigate('Root');
        navigation.navigate('AppointDetail', {
          reserv_id: JSON.parse(notifParsed?.reservation)['id'],
        });
      } else if (
        notifParsed?.type === 'reward_points' ||
        notifParsed?.type === 'deduct_points'
      ) {
        const formData = new FormData();
        formData.append('user_id', user?.id);
        new Promise((rsl, rej) => {
          dispatch(updatedUserDetail(formData, token, user, rsl, rej));
        }).then(() => {
          navigation.push('Root');
          navigation.push('PointsHistory');
        });
      } else if (notifParsed?.type === 'complete_reservation') {
        navigation.push('Root');
        navigation.push('AppointDetail', {
          reserv_id: JSON.parse(notifParsed?.reservation)['id'],
        });
      } else if (notifParsed?.type === 'rating_key') {
        console.log(notifParsed);
        navigation.push('Root');
        navigation.navigate('Rate', {
          emp_id: JSON.parse(notifParsed?.reservation)['employee_id'],
        });
      }
    }
  };
  //REGISTERING DEVICE FOR NOTIFICATIONS BY GETTING DEVICE TOKEN
  const onRegister = async token => {
    console.log(token);
  };

  //WHEN NOTIFICATION POPUP
  const onNotification = async (notify, remoteMessage) => {
    console.log(notify, remoteMessage);

    // localNotificationService.configure(onOpenNotification, remoteMessage);
    getnotification();
    const options = {
      soundName: 'default',
      playSound: true, //,
    };
    localNotificationService.showNotification(
      0,
      notify.title,

      notify.body,
      notify,
      options,
    );
  };

  //NOTIFICATIONS LIST FROM API TO UPDATE NOTIFICATION BADGE REALTIME
  const getnotification = async () => {
    if (await isConnected()) {
      const formData = new FormData();
      formData.append('device_id', DeviceInfo?.getDeviceId());

      new Promise((rsl, rej) => {
        dispatch(getAllNotif(formData, token, rsl, rej));
      })
        .then(res => {
          // setLoading(false);
        })
        .catch(err => {
          // setLoading(false);
        });
    }
  };

  //GET CATEGORIES
  useEffect(() => {
    const unsub = categ();
    return () => unsub;
  }, []);

  const categ = async () => {
    // setLoading(true);
    getnotification(token, dispatch);
    if (await isConnected()) {
      new Promise((rsl, rej) => {
        setLoading(true);
        dispatch(getCateg(token, rsl, rej));
      })
        .then(res => {
          getAllservices();
        })
        .catch(err => {
          //while no internet
          getAllservices();

          setLoading(false);
        });
    } else {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    }
  };

  //GET ALL SERVICES WHEN A CATEGORY CLICKED
  const getAllservices = () => {
    new Promise((rsl, rej) => {
      dispatch(getServices(token, rsl, rej));
    })
      .then(res => {
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  //SHOW ONLY THOSE SERVICES TO WHOM CATEGORY PRESSED
  const showServices = () => {
    if (active == 0) {
      return services?.length > 0 && [services[0]];
    } else {
      return services?.filter(i => {
        return i.id == categId;
      });
    }
  };

  //FILTER SELECTED SERVICES FROM POOL OF SERVICES AND NAVIGATE TO SLOTS
  const handleActionPress = () => {
    let arr = [];
    services?.forEach(element => {
      element.data.forEach(item => {
        if (item.selected) {
          arr.push(item);
        }
      });
    });
    if (arr.length > 0) {
      navigation.push('Slots', {selectedServices: arr});
    } else {
      setAlert(true);
      setAlertMsg('Choisissez au moins un service');
    }
  };

  //REFRESH CONTROL
  const handleOnRefresh = () => {
    setIsRefresh(true);
    setTimeout(() => {
      getAllservices();
      setIsRefresh(false);
    }, 2000);
  };

  //REDNER
  return (
    <View style={styles.main}>
      <Header
        showImage
        onLeftPress={() => {
          navigation.goBack();
        }}
        right={
          <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row'}}>
            <Image
              style={[styles.avatar]}
              source={{
                uri: user_details?.photo
                  ? user_details?.photo
                  : 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-512.png',
              }}
            />
            <CustomText
              numberOfLines={2}
              style={{
                fontSize: 20,
                alignSelf: 'center',
                width: wp(50),
                marginLeft: hp(1),
              }}
              title={user_details?.first_name + ' ' + user_details?.last_name}
              type={'large'}
              color={colors.white}
            />
          </TouchableOpacity>
        }
      />
      {
        //RENDER CATEGORIES
      }

      <View style={styles.black}>
        <View style={styles.horizontal}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categs}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActive(index);
                    setCategId(item.id);
                  }}
                  style={{width: wp(32), justifyContent: 'space-between'}}
                  activeOpacity={1}>
                  <View
                    style={[
                      styles.scissor,
                      {
                        backgroundColor:
                          active == 'massage'
                            ? colors.primaryDark
                            : colors.white,
                      },
                    ]}>
                    <Image
                      source={{uri: item.image}}
                      style={[
                        styles.scissor,
                        {
                          borderColor:
                            index == active ? colors.primaryDark : 'black',
                        },
                      ]}
                    />
                  </View>
                  <CustomText
                    style={{
                      fontSize: 14,
                      alignSelf: 'center',
                      marginVertical: hp(1),
                    }}
                    title={item.name}
                    type={'medium'}
                    textAlign={'center'}
                    color={active == index ? colors.primaryDark : colors.white}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {
          //RENDER SERVICES SECTION LIST
        }

        <View style={styles.white}>
          {services ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              onScrollEndDrag={() => {
                setShowFab(true);
              }}
              refreshControl={
                <RefreshControl
                  tintColor={colors.primaryDark}
                  refreshing={isRefreshing}
                  onRefresh={handleOnRefresh}
                />
              }
              onScrollBeginDrag={() => {
                setShowFab(false);
              }}>
              <SectionList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                sections={showServices()}
                ListHeaderComponent={<View />}
                keyExtractor={(item, index) => item + index}
                renderItem={({item, index}) => (
                  <ServiceCard item={item} index={index} />
                )}
                renderSectionFooter={({section}) => {
                  if (
                    section?.data.length == 0 ||
                    section?.data == undefined ||
                    section?.data == null
                  ) {
                    return (
                      <Empty
                        visible={true}
                        title={'Aucun service trouvé'}
                        height={200}
                        width={200}
                      />
                    );
                  }
                  return null;
                }}
                renderSectionHeader={({section: {title}}) => (
                  <CustomText
                    style={{
                      fontSize: 18,
                      marginTop: hp(2),
                      marginLeft: hp(3),
                      marginBottom: hp(0.5),
                    }}
                    title={title}
                    type={'medium'}
                    color={colors.black}
                  />
                )}
              />
            </ScrollView>
          ) : (
            <Empty visible={true} title={'Aucun service pour le moment'} />
          )}
        </View>
      </View>
      <Loading visible={loading} />

      {showFab && (
        <ActionButton
          activeOpacity={0.8}
          onPress={() => handleActionPress()}
          shadowStyle={{
            borderWidth: 2,
            borderRadius: 100,
          }}
          buttonColor={colors.buttonColor}
          icon={
            <View>
              <AntDesign name="arrowright" size={20} color={colors.white} />
              {services_count > 0 && (
                <Badge
                  status="error"
                  value={services_count}
                  containerStyle={{position: 'absolute', top: -20, right: -20}}
                />
              )}
            </View>
          }
        />
      )}
      {
        //CUSTOM ALERT
      }
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
    </View>
  );
};

export default Home;

//STYLES
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#C89632',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

  imageContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.57,
    justifyContent: 'space-around',
    marginVertical: Platform.OS == 'ios' ? hp(4) : hp(2),
  },
  barber: {
    height: 75,
    width: 75,
    borderRadius: 10,

    borderColor: '#ffff',
    shadowOpacity: 0.2,
    marginBottom: hp(2),
    justifyContent: 'center',
    alignItems: 'center',

    shadowOffset: {width: 0, height: 2},
  },

  scissor: {
    height: Platform.OS == 'ios' ? 65 : wp(15),
    width: Platform.OS == 'ios' ? 75 : wp(15),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    alignSelf: 'center',
  },
  horizontal: {
    justifyContent: 'space-around',
    paddingBottom: hp(1),

    marginHorizontal: 5,
  },
  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  black: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    // justifyContent: 'flex-end',
    paddingTop: hp(3),
  },
  avatar: {
    // height: hp(8),
    // width: wp(18),
    height: 60,
    width: 60,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 13,
  },
  white: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    // alignItems: 'center',
    paddingTop: hp(3),
  },
});
