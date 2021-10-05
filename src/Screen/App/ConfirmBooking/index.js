import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  LogBox,
  Image,
  processColor,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {fcmService, localNotificationService} from '../../../services';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {FlatList} from 'react-native-gesture-handler';
import Picker from '../../../Constant/Picker';
import {Button} from '../../../Constant/Button';
import {useSelector} from 'react-redux';
const ConfirmBooking = ({navigation, route}) => {
  const [i, setIndex] = useState(0);
  const {selectedSlot, selectedDate, employee, selectedServices} =
    route?.params;
  const {user_details} = useSelector(state => state.auth);
  const [data] = useState([
    {time: '8:00 am'},
    {time: '8:00 am'},
    {time: '8:00 am'},
    {time: '8:00 am'},
  ]);
  const renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      key={index}
      style={[styles.dateContainer]}
      onPress={() => {
        setIndex(index);
      }}>
      <View style={{width: '75%'}}>
        <CustomText
          numberOfLines={1}
          style={{
            fontSize: 15,
          }}
          title={'Heure du rendez-vous '}
          type={'medium'}
          color={'#5C5C5C'}
        />
        <CustomText
          numberOfLines={1}
          style={{
            fontSize: 20,
            marginVertical: wp(3),
          }}
          title={'8:00 AM - 8:30 AM '}
          type={'large'}
          color={colors.darkBlack}
        />
      </View>
      <View style={styles.edit}>
        <CustomText
          style={{
            fontSize: 15,
          }}
          title={'Éditer'}
          type={'medium'}
          color={colors.white}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <Header
        icon={'close'}
        title={'Confirmer la réservation'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.black}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.avatar]}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY-wqCFNIo_1sm9wzusHgTifsT8MB9VyMS_BGab6RuSXTjKfrgN29zZ2Z20iTog1kGYvY&usqp=CAU',
              }}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomText
              style={{
                fontSize: 24,
              }}
              title={user_details?.first_name + ' ' + user_details?.last_name}
              type={'large'}
              color={colors.white}
            />
            <CustomText
              style={{
                fontSize: 14,
              }}
              title={'Sunday 26 June 2021'}
              type={'normal'}
              color={colors.white}
            />
          </View>
          <View style={styles.bellContainer}>
            <CustomText
              style={{
                fontSize: 14,
              }}
              title={'8:00 am'}
              type={'medium'}
              color={colors.white}
            />
          </View>
        </View>

        <View style={styles.white}>
          <FlatList
            renderItem={renderItem}
            keyExtractor={(item, index) => item + index.toString()}
            data={data}
            ListFooterComponent={
              <View style={styles.buttonContainer}>
                <Button
                  name={'Confirmer le rendez-vous'}
                  btnTextColor="white"
                  width={wp(90)}
                  style={{fontSize: 20}}
                  onPress={() => {
                    alert('proced');
                  }}
                />
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
};

export default ConfirmBooking;
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},
  header: {
    flex: 0.18,
    flexDirection: 'row',
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {marginVertical: hp(3), width: '100%'},

  dateContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
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
  timeContainer: {
    borderRadius: 5,
    paddingHorizontal: hp(2.2),
    paddingVertical: hp(1.7),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(2),
    marginVertical: hp(0.6),
  },
  imageContainer: {flex: 0.25, justifyContent: 'center', alignItems: 'center'},
  textContainer: {
    flex: 0.57,
    justifyContent: 'space-around',
    marginVertical: hp(4),
  },
  barber: {
    height: 75,
    width: 75,
    borderRadius: 10,
    // borderWidth: 3,
    borderColor: '#ffff',
    shadowOpacity: 0.2,
    marginBottom: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 15,
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
    paddingVertical: hp(3),
  },
  scissor: {
    height: 67,
    width: 67,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  week: {
    flex: 0.1,
    position: 'absolute',
    top: hp(3),
    alignItems: 'center',
    alignSelf: 'center',
  },
  bellContainer: {
    backgroundColor: colors.primaryDark,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  edit: {
    backgroundColor: colors.darkBlack,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  black: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    justifyContent: 'flex-end',
  },
  avatar: {
    height: 67,
    width: 67,

    // resizeMode: 'cover',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 13,
  },
  white: {
    flex: 0.81,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 39,
    paddingVertical: hp(3),
    borderTopLeftRadius: 39,
  },
});
