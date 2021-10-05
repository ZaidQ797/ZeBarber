import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PlatformColor,
  Platform,
} from 'react-native';
import {colors, hp, wp, appIcons} from '../../utilities';
import CustomText from '../../Constant/CustomText';
import {useSelector, useDispatch} from 'react-redux';
import {updateServices} from '../../redux/actions/app';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ServiceCard = ({item, index, enableSelect = true}) => {
  const {services} = useSelector(state => state.app);
  const {user_details} = useSelector(state => state.auth);
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
  const renderOffer = item => {
    if (
      item?.promotion &&
      item.promotion?.required_points <= user_details?.total_earned_points
    ) {
      return (
        <View
          style={{
            height: 30,
            width: 57,
            backgroundColor: item.selected
              ? colors.darkBlack
              : colors.primaryDark,
            borderWidth: item.selected ? 1 : 0,
            borderColor: '#707070',

            borderRadius: 4,
            position: 'absolute',
            left: Platform.OS === 'android' ? -22 : -21,
            justifyContent: 'center',
          }}>
          <CustomText
            style={{
              fontSize: 10,
              marginLeft: 3,
            }}
            title={`${item?.promotion?.discount}%`}
            type={'large'}
            color={colors.white}>
            <CustomText
              style={{
                fontSize: 8,
              }}
              title={`\nOFF`}
              type={'large'}
              color={colors.white}
            />
          </CustomText>
        </View>
      );
    }
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
            fontSize: 15,
            width: item?.promotion ? '90%' : '100%',
          }}
          title={item?.name}
          type={'large'}
          color={item?.selected ? colors.white : colors.darkBlack}
        />
        <CustomText
          style={{
            fontSize: 15,
            marginVertical: hp(0.3),
          }}
          title={'Temps total: ' + item?.time + ' mins'}
          type={'medium'}
          color={item.selected ? colors.white : '#5C5C5C'}
        />
      </View>
      <View
        style={{
          width: '25%',
          justifyContent: 'center',
        }}>
        {renderOffer(item)}
        <View style={[styles.price]}>
          <CustomText
            style={{
              fontSize: 15,
            }}
            title={'€' + item?.cost}
            type={'medium'}
            color={colors.white}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ServiceCard;
const styles = StyleSheet.create({
  serviceContainer: {
    paddingHorizontal: wp(2),
    // paddingTop: hp(2),
    // paddingVertical: hp(0.8),
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
    backgroundColor: colors.darkBlack,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),

    width: '80%',

    alignItems: 'center',
    alignSelf: 'center',
  },
});
