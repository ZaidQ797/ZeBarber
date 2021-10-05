import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {appIcons, colors, hp, wp} from '../../utilities';
import {fonts} from '../../utilities/fonts';
import CustomText from '../../Constant/CustomText';
import {Divider, Overlay} from 'react-native-elements';
import moment from 'moment';
import TableRow from '../../Constant/TableRow';
import {getUTCtime, getLocalTime} from '../../Constant/Functions/utc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {updateBooking} from '../../redux/actions/app';
import {Alert} from '../../Constant/Alert';
import {Tooltip} from 'react-native-elements/dist/tooltip/Tooltip';

const BookingCard = ({item, index}) => {
  const {bookingDetail} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [toolTip, setToolTip] = useState(false);
  const renderToolTip = () => {
    return (
      <View style={{width: '100%'}}>
        <TableRow
          title={'Rabais'}
          value={item?.service?.promotion?.discount + '%'}
          fontSize={16}
          color={'white'}
        />
        <TableRow
          title={'Promo'}
          value={item?.service?.promotion?.promo_name}
          fontSize={16}
          color={'white'}
        />
        <TableRow
          title={'Points requis'}
          value={item?.service?.promotion?.required_points}
          fontSize={16}
          color={'white'}
        />
      </View>
    );
  };
  const handleRedeem = item => {
    let arr = {
      ...bookingDetail,
      reserve_services: bookingDetail?.reserve_services?.map(elem => {
        if (elem.id == item.id) {
          return {...elem, isRedeemed: !elem.isRedeemed};
        }
        return elem;
      }),
    };
    new Promise((rsl, rej) => {
      dispatch(updateBooking(arr, rsl, rej));
    });
  };
  const renderRedeemButton = () => {
    // console.log(item);
    if (
      bookingDetail?.point_redeem == 0 &&
      item?.service?.promotion &&
      bookingDetail?.status == 2
    ) {
      return (
        <TouchableOpacity
          style={[
            styles.redeem,
            {
              backgroundColor: item.isRedeemed
                ? colors.lightGreen
                : colors.primaryDark,
            },
          ]}
          onPress={() => {
            setAlert(true);
            setAlertMsg(
              item.isRedeemed
                ? 'VOULEZ-VOUS retirer'
                : `Vos ${item?.service?.promotion?.required_points} points seront déduits et vous bénéficierez d'une ${item?.service?.promotion?.discount} réduction`,
            );
            // handleRedeem(item);
          }}>
          <CustomText
            numberOfLines={1}
            style={{
              fontSize: 14,
            }}
            title={item.isRedeemed ? 'Redeemed' : 'Redeem'}
            type={'medium'}
            color={'white'}
          />
        </TouchableOpacity>
      );
    } else if (bookingDetail?.point_redeem == 1 && item?.service?.promotion) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          disabled
          style={[
            styles.redeem,
            {
              backgroundColor: colors.lightGreen,
            },
          ]}>
          <CustomText
            numberOfLines={1}
            style={{
              fontSize: 14,
            }}
            title={'Redeemed'}
            type={'medium'}
            color={'white'}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <TouchableOpacity key={index} activeOpacity={0.9} style={[styles.card]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 10,
        }}>
        <CustomText
          style={{
            fontSize: 20,

            width: '89%',
          }}
          numberOfLines={2}
          title={item?.service?.name}
          type={'medium'}
        />
        <View
          style={{
            flexDirection: 'row',

            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '12%',
          }}>
          {/* {renderRedeemButton()} */}
          {item?.service?.promotion && (
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                setToolTip(!toolTip);
              }}>
              <Ionicons
                name="information-circle"
                size={22}
                color={colors.black}
                style={{marginTop: 3}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Divider style={{marginVertical: 5}} />

      <TableRow title={'Temps'} value={item?.service?.time} />
      <TableRow
        title={'Prix ​​unitaire'}
        value={item?.service?.cost ? '€' + item?.service?.cost : '-'}
      />

      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
        }}
        onprimaryPress={() => {
          setAlert(false);
          setAlertMsg('');
          handleRedeem(item);
        }}
        showPrimary
        primaryText={item.isRedeemed ? 'Oui' : 'Racheter'}
        secondaryText={'Annuler'}
      />
      <Overlay
        visible={toolTip}
        overlayStyle={{backgroundColor: colors.darkBlack, width: '80%'}}
        onBackdropPress={() => {
          setToolTip(!toolTip);
        }}>
        {renderToolTip()}
      </Overlay>
    </TouchableOpacity>
  );
};

export default BookingCard;
const styles = StyleSheet.create({
  imageContainer: {flex: 0.25, justifyContent: 'center', alignItems: 'center'},
  redeem: {
    padding: 8,
    backgroundColor: colors.primaryDark,
    borderRadius: 3,
  },
  card: {
    borderTopWidth: 1.5,
    borderTopColor: colors.primaryDark,
    // backgroundColor: '#fff',
  },
});
