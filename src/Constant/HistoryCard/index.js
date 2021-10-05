import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, hp, wp, appIcons} from '../../utilities';
import CustomText from '../../Constant/CustomText';
import {useSelector, useDispatch} from 'react-redux';
import {updateServices} from '../../redux/actions/app';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDeviceSync} from 'react-native-device-info';
import moment from 'moment';
const HistoryCard = ({item, index, enableSelect = true}) => {
  const {services} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const handleSelect = (parentItemID, childItemID) => {
    let arr = services?.map(elem => {
      if (elem.id === parentItemID) {
        return {
          ...elem,
          data: elem?.data?.map(item => {
            if (item.id === childItemID) {
              return {
                ...item,
                selected: !item.selected,
              };
            }
            return {
              ...item,
              selected: false,
            };
          }),
        };
      }
      return elem;
    });

    new Promise((rsl, rej) => {
      dispatch(updateServices(arr, rsl, rej));
    });
  };
  const getDescription = type => {
    return [
      '',
      'QrCode scanné',
      'Références',
      'Déduire des points',
      'Hi',
      '',
      'ajouté manuellement',
      `pour cause d'inactivité`,
    ][type];
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      key={index}
      style={[
        styles.serviceContainer,
        {
          backgroundColor: item?.selected ? colors.primaryDark : colors.white,
        },
      ]}
      onPress={() => {
        enableSelect && handleSelect(item.service_category_id, item.id);
      }}>
      <View style={{width: '75%', padding: wp(3)}}>
        <CustomText
          style={{
            fontSize: 18,
          }}
          title={`Points ${item?.type === 3 ? 'déduire' : 'ajoutés'}`}
          type={'large'}
          color={item?.selected ? colors.white : colors.darkBlack}
        />
        <CustomText
          style={{
            fontSize: 12,
            marginVertical: hp(0.3),
          }}
          title={`${getDescription(item.type)}  | ${moment(
            item?.updated_at,
          ).format('LT')}`}
          type={'normal'}
          color={item.selected ? colors.white : '#5C5C5C'}
        />
      </View>

      <View style={[styles.price]}>
        <CustomText
          style={{
            fontSize: 15,
          }}
          title={
            item.type == '3'
              ? `- ${item.points} Points`
              : `+ ${item.points} Points`
          }
          type={'large'}
          color={item.type == '3' ? colors.red : colors.lightGreen}
        />
      </View>
    </TouchableOpacity>
  );
};
export default HistoryCard;
const styles = StyleSheet.create({
  serviceContainer: {
    paddingHorizontal: wp(2),
    // paddingTop: hp(2),
    paddingVertical: hp(1),
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp(0.7),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  price: {
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),

    width: '35%',

    alignItems: 'center',
    alignSelf: 'center',
  },
});
