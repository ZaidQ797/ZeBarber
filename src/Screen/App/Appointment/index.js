import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {AppointmentSection} from '../../../Constant/SetionItem';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getMyReservations} from '../../../redux/actions/app';
import {Loading} from '../../../Constant/Loading';
import {Alert} from '../../../Constant/Alert';
import {FlatList} from 'react-native';
import {isConnected} from '../../../Constant/Internet';
import {Empty} from '../../../Constant/Empty';
import Refresh from '../../../Constant/RefreshControl';

const Appointments = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, user} = useSelector(state => state.auth);
  const {reservations} = useSelector(state => state.app);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefresh] = useState(false);

  //GET BOOKINGS WILL SHOW ONLY 3 LATEST BOOKINGS
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsub = getBookings();
      return () => unsub;
    }, []),
  );
  const getBookings = async () => {
    if (await isConnected()) {
      new Promise((rsl, rej) => {
        dispatch(getMyReservations(token, rsl, rej));
      })
        .then(res => {
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(err?.message);
        });
    }
  };
  //RENDER EMPTYP ILLUSTRATION IN CASE NO DATA AVAILABLE
  const renderEmpty = () => {
    if (
      reservations?.length == 0 ||
      reservations == [] ||
      reservations == undefined ||
      reservations == null
    ) {
      return <Empty visible={true} title={'Aucune réservation trouvée'} />;
    }
  };
  //REFRESH CONTROL
  const handleOnRefresh = () => {
    setIsRefresh(true);
    setTimeout(() => {
      getBookings();
      setIsRefresh(false);
    }, 3000);
  };

  //RENDER
  return (
    <View style={styles.main}>
      <Header
        title={'Rendez-vous'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.white}>
        {reservations && (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={colors.primaryDark}
                refreshing={isRefreshing}
                onRefresh={handleOnRefresh}
              />
            }
            data={reservations}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <AppointmentSection item={item} navigation={navigation} />
            )}
          />
        )}
        {renderEmpty()}
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

export default Appointments;

//STYLES
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},

  textContainer: {
    flex: 0.57,
    justifyContent: 'space-around',
    marginVertical: hp(3),
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
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    paddingVertical: hp(2),
  },
});
