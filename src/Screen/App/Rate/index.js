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
import {useNetInfo} from '@react-native-community/netinfo';
import {Loading} from '../../../Constant/Loading';
import {isConnected} from '../../../Constant/Internet';
import {Alert} from '../../../Constant/Alert';
import {ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Textarea from 'react-native-textarea';
import {Button} from '../../../Constant/Button';
import {employeeReview} from '../../../redux/actions/app';
import {CommonActions} from '@react-navigation/native';

const Rate = ({navigation, route}) => {
  const {promotions, bookingDetail} = useSelector(state => state.app);
  const {token} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [defaultRating, setDefaultRating] = useState(-1);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [review, setReview] = useState('');
  const [rated, setRated] = useState(false);
  const [ratinArr] = useState([
    {id: 0, color: '#ADADAD', bgColor: '#8A8A8A'},
    {id: 1, color: '#ADADAD', bgColor: '#8A8A8A'},
    {id: 2, color: '#ADADAD', bgColor: '#8A8A8A'},
    {id: 3, color: '#ADADAD', bgColor: '#8A8A8A'},
    {id: 4, color: '#ADADAD', bgColor: '#8A8A8A'},
  ]);

  //PREDIFEND TAGS TO SEND IN RATING
  const [compliment, setCompliment] = useState([
    {id: 0, title: 'Excellent'},
    {id: 1, title: 'Très bien'},
    {id: 2, title: 'Bien'},
    {id: 3, title: 'Moyenne'},
    {id: 4, title: 'Mal'},
  ]);

  //RENDER STARS
  const renderStars = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setDefaultRating(item.id);
        }}
        activeOpacity={1}
        style={{
          padding: 12,
          margin: 5,
          backgroundColor:
            item.id <= defaultRating ? colors.primaryDark : item.bgColor,
          borderRadius: 5,
        }}>
        <FontAwesome
          name="star"
          size={35}
          color={item.id <= defaultRating ? 'white' : item.color}
        />
      </TouchableOpacity>
    );
  };
  //RENDER PREDEFINED TAGS FOR COMENT IN RATING
  const renderCompliment = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={index}
      style={[
        styles.timeContainer,
        {
          backgroundColor: selectedSlot == item ? colors.darkBlack : 'white',
          borderWidth: 1,
          borderColor: '#E5E5E5',
        },
      ]}
      onPress={() => {
        setReview(item.title);
        setSelectedSlot(item);
      }}>
      <CustomText
        style={{
          fontSize: 15,
        }}
        title={item.title}
        type={'medium'}
        color={selectedSlot == item ? colors.white : colors.darkBlack}
      />
    </TouchableOpacity>
  );

  //SUBMIT REVIEW
  const handleReview = () => {
    if (defaultRating !== -1) {
      const formData = new FormData();
      formData.append('employee_id', route?.params?.emp_id);
      formData.append('rating', defaultRating == 0 ? 1 : defaultRating);
      formData.append('comment', review);
      new Promise((rsl, rej) => {
        setLoading(true);
        dispatch(employeeReview(formData, token, rsl, rej));
      })
        .then(res => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(res);
          setRated(true);
        })
        .catch(err => {
          if (err.success === 0) {
            setAlert(true);
            setAlertMsg(err?.message);
          }
          setLoading(false);
        });
    } else {
      setAlert(true);
      setAlertMsg('Merci de donner des étoiles');
    }
  };

  //RENDER
  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Paiement'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        style={styles.white}
        contentContainerStyle={{justifyContent: 'center', flexGrow: 0.5}}>
        <CustomText
          title={'Manqué'}
          type={'medium'}
          color={'black'}
          style={{fontSize: 28, marginHorizontal: hp(1)}}
        />
        <View style={{marginTop: 10}}>
          <FlatList
            contentContainerStyle={{
              marginHorizontal: hp(1),
            }}
            data={ratinArr}
            horizontal
            scrollEnabled={false}
            keyExtractor={item => item.id}
            renderItem={renderStars}
          />
          <View style={{height: hp(2)}} />
          <FlatList
            contentContainerStyle={{alignItems: 'center'}}
            data={compliment}
            numColumns={3}
            keyExtractor={item => item.id}
            renderItem={renderCompliment}
          />
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            onChangeText={note => {
              setReview(note);
              if (selectedSlot && note !== selectedSlot?.title) {
                setSelectedSlot('');
              }
            }}
            defaultValue={review}
            maxLength={300}
            placeholder={'la description'}
            placeholderTextColor={'#c7c7c7'}
            underlineColorAndroid={'transparent'}
          />
          <View style={{height: hp(2)}} />
          <Button
            name={'Manque'}
            btnTextColor="white"
            style={{fontSize: 20}}
            onPress={() => {
              handleReview();
            }}
            width={wp('95')}
          />
        </View>
      </ScrollView>
      <Loading visible={loading} />
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
          if (rated) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Root',
                  },
                ],
              }),
            );
            setRated(false);
          }
        }}
        // warning
        showSecondary={true}
        secondaryText={`d'accord`}
      />
    </View>
  );
};

export default Rate;

//STYLES
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
  textareaContainer: {
    padding: 10,
    width: '95%',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: 'transparent',
    color: 'black',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
  },
  timeContainer: {
    borderRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(1),
    marginVertical: hp(1),
    width: wp(28),
    padding: 15,
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
    backgroundColor: 'white',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    // justifyContent: 'center',

    // paddingTop: hp(5),
  },
});
