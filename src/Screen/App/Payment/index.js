import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {Loading} from '../../../Constant/Loading';
import {isConnected} from '../../../Constant/Internet';
import {Alert} from '../../../Constant/Alert';
import {ToggleButton} from '../../../Constant/ToggleButton';
import {ScrollView} from 'react-native';

const Payment = ({navigation}) => {
  const {promotions, bookingDetail} = useSelector(state => state.app);
  const {token} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Paiement'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollView style={styles.white}>
        <CustomText
          title={'Choisissez le mode de paiement'}
          type={'medium'}
          color={'black'}
          style={{fontSize: 28}}
          textAlign={'center'}
        />
        <View style={{height: hp(6)}} />
        <CustomText
          style={{
            fontSize: 20,
            margin: 10,
          }}
          title={'le reçu'}
          type={'large'}
          color={colors.black}
        />
        <View style={{backgroundColor: 'white', paddingVertical: 20}}>
          <TableRow
            title={'Montant total'}
            value={bookingDetail?.total_reservation_cost}
            fontSize={18}
            color={'black'}
            paddingVertical={20}
          />

          <TableRow
            title={'Remise'}
            value={bookingDetail?.discount ? bookingDetail?.discount : 0}
            fontSize={18}
            color={'black'}
            paddingVertical={20}
          />
          <TableRow
            title={'Total à payer'}
            value={
              bookingDetail?.total_after_discount
                ? bookingDetail?.total_after_discount
                : bookingDetail?.total_reservation_cost
            }
            fontSize={18}
            color={'black'}
            paddingVertical={20}
          />
        </View>
        <View style={{height: hp(2)}} />
        <CustomText
          style={{
            fontSize: 20,
            margin: 10,
          }}
          title={'Modalité de paiement'}
          type={'large'}
          color={colors.black}
        />
        <ToggleButton
          name={'Paiement en espèces'}
          icon={'wallet'}
          onPress={() => {
            setSelected('wallet');
            setTimeout(() => {
              navigation.navigate('Rate');
            }, 200);
          }}
          iconColor={selected == 'wallet' ? 'white' : 'black'}
          style={{
            backgroundColor:
              selected == 'wallet' ? colors.primaryDark : 'white',
          }}
        />
        <View style={{height: hp(2)}} />
        <ToggleButton
          style={{
            backgroundColor:
              selected == 'online' ? colors.primaryDark : 'white',
          }}
          name={'Paiement en ligne'}
          icon={'credit-card'}
          iconColor={selected == 'online' ? 'white' : 'black'}
          onPress={() => {
            setSelected('online');
            setAlert(true);
            setAlertMsg('À venir ...');
          }}
        />
      </ScrollView>
      <Loading visible={loading} />
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
        }}
        // warning
        showSecondary={true}
        secondaryText={`d'accord`}
      />
    </View>
  );
};

export default Payment;
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},

  card: {
    top: hp(-9),
    flex: 1,
    marginHorizontal: wp(4),
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 39,

    borderColor: '#E5E5E5',
    elevation: 5,
    // shadowColor: '#BDBDBD',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // paddingVertical: hp(3),
  },
  profile: {
    position: 'absolute',
    top: hp(7),
    width: '90%',
    // padding: 30,
    paddingTop: '18%',
    marginHorizontal: wp(2),
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    elevation: 5,
    borderRadius: 39,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignSelf: 'center',
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
    // justifyContent: 'center',
    paddingTop: hp(5),
  },
});
