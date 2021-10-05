import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import {appIcons, colors, hp, wp} from '../../../utilities';
import {Button} from '../../../Constant/Button';

import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  getReservationDetail,
  redeemPoints,
  cancelReservation,
} from '../../../redux/actions/app';
import {Loading} from '../../../Constant/Loading';
import {Alert} from '../../../Constant/Alert';
import {isConnected} from '../../../Constant/Internet';
import {FlatList} from 'react-native';
import BookingCard from '../../../Constant/BookingCard';
import TableRow from '../../../Constant/TableRow';
import Entypo from 'react-native-vector-icons/Entypo';
import {getUTCtime, getLocalTime} from '../../../Constant/Functions/utc';
import {Overlay} from 'react-native-elements';
const AppointDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {token, user} = useSelector(state => state.auth);
  const {reservations, bookingDetail} = useSelector(state => state.app);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const res_id = route?.params?.reserv_id;
  const [showPri, setShowPrimary] = useState(false);
  const [update, setUpdate] = useState(true);
  const [canceled, setCancel] = useState(false);
  const [isRefreshing, setIsRefresh] = useState(false);
  const [visible, setVisible] = useState(false);

  //Booking Detail
  useEffect(() => {
    setLoading(true);
    const unsub = getBookingDetail();
    return () => {
      unsub;
    };
  }, [res_id]);

  useEffect(() => {
    if (update) {
      const unsub = getBookingDetail();
      setUpdate(false);
      return () => {
        unsub;
      };
    }
  }, [update]);

  const getBookingDetail = async () => {
    if (await isConnected()) {
      const formData = new FormData();
      formData.append('reservation_id', res_id);
      new Promise((rsl, rej) => {
        dispatch(getReservationDetail(formData, token, rsl, rej));
      })
        .then(res => {
          setCancel(false);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setAlert(true);
          setCancel(false);

          setAlertMsg(err?.message);
        });
    } else {
      setAlert(true);
      setAlertMsg('veuillez vérifier votre internet');
      new Promise((rsl, rej) => {
        dispatch(getReservationDetail(null, rsl, rej));
      });
    }
  };
  // dispay booking status (i.e. complete,booked,started)
  const renderStatus = status => {
    return ['Réservé', '', 'Démarré', 'Rejeté', 'Annulé', 'Complété'][status];
  };

  // render different color as per status (i.e. red--> canceled, completed--> green)
  const renderColor = status => {
    return ['#454545', '', colors.primaryDark, '#f03c3c', '#c9c9c9', '#4dc46d'][
      status
    ];
  };

  // TOTAL PAYABLE PRICE
  const renderValue = total_after_discount => {
    if (total_after_discount) {
      return '€' + bookingDetail?.total_after_discount.toFixed(2);
    } else if (bookingDetail?.total_reservation_cost) {
      return '€' + bookingDetail?.total_reservation_cost.toFixed(2);
    }
  };

  //REFRESH CONTROL FOR BOOKING DETAIL
  const handleOnRefresh = () => {
    setIsRefresh(true);
    setTimeout(() => {
      getBookingDetail();
      setIsRefresh(false);
    }, 3000);
  };

//RENDER BOOKING DETAIL WITH BOOKED SERVICES
  const renderHistory = () => {
    return (
      <View style={styles.black}>
        {bookingDetail?.employee_detail && (
          <View style={styles.header}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imageContainer}>
                <Image
                  style={[styles.avatar]}
                  source={{
                    uri: bookingDetail?.employee_detail?.photo
                      ? bookingDetail?.employee_detail?.photo
                      : 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-512.png',
                  }}
                />
              </View>

              <View style={styles.textContainer}>
                <CustomText
                  numberOfLines={2}
                  style={{
                    fontSize: 22,
                  }}
                  title={
                    bookingDetail?.employee_detail?.first_name +
                    ' ' +
                    bookingDetail?.employee_detail?.last_name
                  }
                  type={'large'}
                  color={colors.white}
                />
                {bookingDetail?.employee_detail?.address && (
                  <View style={{flexDirection: 'row'}}>
                    <Entypo
                      name="location-pin"
                      color={'white'}
                      size={18}
                      style={{alignSelf: 'center'}}
                    />
                    <CustomText
                      style={{
                        fontSize: 16,
                        marginVertical: 5,
                        marginLeft: 4,
                      }}
                      title={bookingDetail?.employee_detail?.address}
                      type={'medium'}
                      color={colors.white}
                    />
                  </View>
                )}
              </View>
            </View>
            {bookingDetail?.status == '0' && (
              <CustomText
                onPress={() => {
                  setShowPrimary(true);
                  setAlert(true);
                  setAlertMsg('Voulez-vous vraiment annuler ?');
                }}
                style={{
                  fontSize: 12,
                  marginTop: hp(1),
                }}
                title={'Annuler'}
                type={'large'}
                color={'#ff5c5f'}
              />
            )}
          </View>
        )}
        <View style={styles.white}>
          {bookingDetail && (
            <TableRow
              title={'Le total Prix:'}
              value={
                bookingDetail
                  ? renderValue(bookingDetail?.total_after_discount)
                  : ''
              }
              fontSize={25}
              color={colors.primaryDark}
            />
          )}

          {
            //BOOKED SERVICES LIST
          }
          <FlatList
            data={bookingDetail?.reserve_services}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <TableRow
                  title={'Dated'}
                  value={getLocalTime(
                    bookingDetail?.reservation_date,
                    'll HH:mm',
                  )}
                  fontSize={16}
                  color={colors.black}
                />
                {bookingDetail?.reservation_qr_code?.qrcode_path && (
                  <TableRow
                    title={'QR Code'}
                    uri={bookingDetail?.reservation_qr_code?.qrcode_path}
                    image={true}
                    fontSize={16}
                    onPress={() => {
                      setVisible(!visible);
                    }}
                    color={colors.black}
                  />
                )}
                <TableRow
                  title={'Statut'}
                  value={
                    <CustomText
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
                      }}
                      title={renderStatus(bookingDetail?.status)}
                      type={'medium'}
                      color={renderColor(bookingDetail?.status)}
                    />
                  }
                  fontSize={16}
                  color={colors.black}
                />
                <View
                  style={{
                    width: '100%',

                    paddingVertical: hp(2),
                  }}>
                  <CustomText
                    style={{
                      fontSize: 20,

                      marginHorizontal: hp(2),
                    }}
                    numberOfLines={2}
                    title={'Services'}
                    type={'medium'}
                    color={colors.primaryDark}
                  />
                </View>
              </View>
            }
            renderItem={({item, index}) => (
              <BookingCard item={item} index={index} />
            )}
            ListFooterComponent={
              bookingDetail?.description && (
                <View>
                  <CustomText
                    style={{
                      fontSize: 16,
                      marginVertical: 5,
                      marginLeft: 14,
                    }}
                    title={'Description'}
                    type={'medium'}
                    color={colors.primaryDark}
                  />
                  <CustomText
                    style={{
                      fontSize: 12,
                      marginVertical: 5,
                      marginLeft: 14,
                    }}
                    title={bookingDetail?.description}
                    type={'medium'}
                    color={colors.black}
                  />
                </View>
              )
            }
            refreshControl={
              <RefreshControl
                tintColor={colors.primaryDark}
                refreshing={isRefreshing}
                onRefresh={handleOnRefresh}
              />
            }
            keyExtractor={(item, index) => item + index.toString()}
          />
        </View>
      </View>
    );
  };

  //CANCEL RESERVATION
  const handleCancel = () => {
    const formData = new FormData();
    formData.append('reservation_id', bookingDetail?.id);
    new Promise((rsl, rej) => {
      setLoading(true);
      dispatch(cancelReservation(formData, token, rsl, rej));
    })
      .then(res => {
        setLoading(false);
        setShowPrimary(false);

        setAlert(true);
        setAlertMsg(res?.message);
        setCancel(true);
      })
      .catch(err => {
        setLoading(false);
        setCancel(false);
        setAlert(true);
        setShowPrimary(false);
        setAlertMsg(err?.data?.error);
      });
  };

  //RENDER 
  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Détail du rendez-vous'}
        onLeftPress={() => {
          navigation.navigate('Root');
        }}
      />
      {renderHistory()}
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          canceled && navigation.goBack();
          setAlert(false);
          setAlertMsg('');
        }}
        warning
        showPrimary={showPri}
        onprimaryPress={() => {
          setAlert(false);
          setAlertMsg('');
          handleCancel();
        }}
        secondaryText={`d'accord`}
      />
      <Loading visible={loading} />
      <Overlay
        isVisible={visible}
        onBackdropPress={() => {
          setVisible(!visible);
        }}>
        <Image
          source={{
            uri: bookingDetail?.reservation_qr_code?.qrcode_path,
          }}
          style={{
            height: 230,
            width: 230,
            borderRadius: 3,
            borderColor: '#f3f3f3',
          }}
        />
      </Overlay>
    </View>
  );
};

export default AppointDetail;

//STYLES
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},

  textContainer: {
    flex: 0.6,
    justifyContent: 'space-around',
    marginVertical: hp(3),
  },
  imageContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 13,
  },
  header: {
    flex: 0.18,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: wp(2),
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E5E5',
    elevation: 5,
    // shadowColor: '#BDBDBD',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // paddingVertical: hp(3),
  },

  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },

  white: {
    flex: 0.9,
    backgroundColor: '#fff',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    // paddingVertical: hp(2),
  },

  black: {
    flex: 1,
    backgroundColor: colors.darkBlack,
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    justifyContent: 'flex-end',
  },
  buttonContainer: {marginVertical: hp(1), width: '100%'},
});
