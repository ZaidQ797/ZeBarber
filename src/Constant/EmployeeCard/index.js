import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {appIcons, colors, hp, wp} from '../../utilities';
import {fonts} from '../../utilities/fonts';
import CustomText from '../../Constant/CustomText';

const EmployeeCard = ({item, index, onPress, employee}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      key={index}
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor:
            employee?.id == item?.id ? colors.primaryDark : colors.white,
          justifyContent: 'space-between',
        },
      ]}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={[styles.avatar]}
          source={{
            uri: item.details.photo
              ? item.details.photo
              : 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png',
          }}
        />
      </View>

      <CustomText
        style={{
          fontSize: 16,
          margin: hp(1),
        }}
        numberOfLines={2}
        title={`${item.details.first_name} ${item.details.last_name}  `}
        type={'medium'}
        textAlign="center"
        color={item?.id == employee?.id ? colors.white : colors.darkBlack}
      />
    </TouchableOpacity>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  imageContainer: {flex: 0.25, justifyContent: 'center', alignItems: 'center'},
  avatar: {
    height: 65,
    width: 65,
    marginVertical: hp(1),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  card: {
    // padding: 20,
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#BDBDBD',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
});
