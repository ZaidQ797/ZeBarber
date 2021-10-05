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
  FlatList,
  SectionList,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {fcmService, localNotificationService} from '../../../services';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import Picker from '../../../Constant/Picker';
import {Button} from '../../../Constant/Button';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {ScrollView} from 'react-native';
import {Loading} from '../../../Constant/Loading';
import Textarea from 'react-native-textarea';

import {
  getAllEmployees,
  getAvailableSlots,
  confirmBooking,
  getServices,
  updateServices,
} from '../../../redux/actions/app';
import CalendarStrip from 'react-native-calendar-strip';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {Alert} from '../../../Constant/Alert';
import {fonts} from '../../../utilities/fonts';
import {isConnected} from '../../../Constant/Internet';
import SelectedService from '../../../Constant/SelectedService';
import EmployeeCard from '../../../Constant/EmployeeCard';
import {getUTCtime} from '../../../Constant/Functions/utc';
//DISABLED DATES THAT ARE PASSED
let datesBlacklist = [
  {
    start: moment()?.subtract(100, 'year'),
    end: moment()?.subtract(1, 'day'),
  },
];

const Slots = ({navigation, route}) => {
  const [active, setActive] = useState('haircuts');
  const [i, setIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [week, setweek] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const {token, user, connection} = useSelector(state => state.auth);
  const {employees, services} = useSelector(state => state.app);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const [isWrongDate, setIsWrong] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const selectedServices = route?.params?.selectedServices;
  const [slots, setSlots] = useState([]);
  const [note, setNote] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [errMsg, setErrorMsg] = useState('');
  const [selectedS, setSelected] = useState([]);
  const [resId, setResId] = useState('');

  //GET EMPLOYEES LIST
  useEffect(() => {
    const unsub = getEmployees();
    return () => unsub;
  }, []);
  const getEmployees = async () => {
    if (await isConnected()) {
      setAlert(false);

      new Promise((rsl, rej) => {
        setLoading(true);
        dispatch(getAllEmployees(token, rsl, rej));
      })
        .then(res => {
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      // setAlert(true);
      // setAlertMsg('Veuillez vérifier votre connexion Internet');
    }
  };

  useEffect(() => {
    const unsub = showServices();
    return () => unsub;
  }, []);

  //GET SLOTS
  useEffect(() => {
    const unsub = getSlots();
    return () => unsub;
    // }
  }, [selectedDate, employee]);

  const getSlots = async () => {
    if (await isConnected()) {
      setAlert(false);
      const formData = new FormData();
      selectedServices?.map(item => {
        formData.append('service_ids[]', item.id);
      });
      employee && formData.append('employee_id', employee?.id);
      formData.append('reservation_date', selectedDate);

      new Promise((rsl, rej) => {
        setLoading(true);
        dispatch(getAvailableSlots(formData, token, rsl, rej));
      })
        .then(res => {
          setLoading(false);
          handleSlots(res?.data?.time_slots);
          // setSlots(res?.data?.time_slots);
        })
        .catch(err => {
          setLoading(false);
          setSlots([]);
        });
    } else {
      setAlert(true);
      setAlertMsg('Veuillez vérifier votre connexion Internet');
      setLoading(false);
    }
  };
//FILTER ONLY THOSE SLOTS WHICH ARE AHEAD FROM CURRENT TIME
  const handleSlots = slots => {
    if (selectedDate == moment().format('YYYY-MM-DD')) {
      let newArr = slots?.filter(item => {
        if (
          moment(item, 'HH:mm').unix() - moment(new Date(), 'HH:mm').unix() >=
          1800
        ) {
          return item;
        }
      });

      setSlots(newArr);
    } else {
      setSlots(slots);
    }
  };

//RENDER TIME SLOTS
  const renderTime = ({item, index}) => (
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
        setSelectedSlot(item);
      }}>
      <CustomText
        style={{
          fontSize: 15,
        }}
        title={item}
        type={'normal'}
        color={selectedSlot == item ? colors.white : colors.darkBlack}
      />
    </TouchableOpacity>
  );

  //CONFIRM BOOKING
  const handleBooking = () => {
    if (!selectedSlot) {
      setAlert(true);
      setAlertMsg('Veuillez choisir la plage horaire');
    } else {
      setAlert(false);
      const formData = new FormData();
      formData.append('description', note);
      formData.append(
        'reservation_date',
        getUTCtime(`${selectedDate} ${selectedSlot}`),
      );

      formData.append(
        'employee_id',
        employee ? employee?.id : employees[0]?.id,
      );
      selectedS?.map(service => {
        formData.append('service_ids[]', service.id);
      });
      console.log(formData);
      new Promise((rsl, rej) => {
        setLoading(true);

        dispatch(confirmBooking(formData, token, rsl, rej));
      })

        .then(res => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(res?.message);
          setNote('');
          setResId(res?.data?.reservation?.id);
        })
        .catch(err => {
          setAlert(true);
          setAlertMsg(err?.message);
          setLoading(false);
        });
    }
  };

//Show SELECTED SERVICES
  const showServices = () => {
    let arr = [];
    services?.reduce((result, sectionData) => {
      const {data} = sectionData;
      data.filter(element => {
        element?.selected && arr.push(element);
      });
    }, []);

    setSelected(arr);
    arr.forEach(item => {
      setTotal(total + item?.cost);
    });
  };

  //REMOVE SELECTED SERVICE
  const handleRmv = (parent, child) => {
    let updated = selectedS?.filter(item => {
      return item.id !== child && item.service_category_id !== parent;
    });
    handleSelect(parent, child);
    if (updated.length > 0) {
      setSelected(updated);
      calculate();
    } else {
      setSelected([]);

      navigation.goBack();
    }
  };
//SELECT UNSELECT FROM SERVICES POOL
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

  //CALCULATE TOTAL COST OF SELECTED SERVICES
  const calculate = () => {
    let total = 0;
    selectedS.forEach(elem => {
      total = total + elem.cost;
    });
    return '€' + total;
  };

  //RENDER
  return (
    <View style={styles.main}>
      <Header
        icon={'close'}
        title={'Prendre rendez-vous'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.black}>
        <CalendarStrip
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'border',
            duration: 200,

            borderHighlightColor: colors.p1,
          }}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          highlightDateNameStyle={{color: 'white'}}
          highlightDateNumberStyle={{color: 'white'}}
          style={{
            flex: 0.2,
            paddingTop: hp(1),
            // paddingBottom: hp(2),
          }}
          highlightDateContainerStyle={{
            backgroundColor: colors.primaryDark,
            borderRadius: 3,
            height: 50,
          }}
          selectedDate={selectedDate}
          onDateSelected={date => {
            setSelectedSlot(null);
            setSelectedDate(moment(date).format('YYYY-MM-DD'));
          }}
          calendarHeaderStyle={{color: 'white'}}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          minDate={moment()}
          iconLeft={appIcons.arrow_left}
          iconRight={appIcons.arrow_right}
          iconLeftStyle={{tintColor: 'white'}}
          iconRightStyle={{tintColor: 'white'}}
          useIsoWeekday={true}
          disabledDateNameStyle={{color: '#ebebeb'}}
          disabledDateNumberStyle={{color: '#ebebeb'}}
          datesBlacklist={datesBlacklist}
        />

        <View style={styles.white}>
          <ScrollView
            nestedScrollEnabled
            style={{flexGrow: 1, flex: 1}}
            showsVerticalScrollIndicator={false}>
            <CustomText
              style={{
                fontSize: 20,
                marginLeft: hp(1),
                marginTop: hp(2),
              }}
              title={'Services sélectionnés'}
              type={'medium'}
              color={colors.darkBlack}
            />
            <View style={{margin: 10}}>
              <FlatList
                data={selectedS}
                showsHorizontalScrollIndicator={false}
                // horizontal
                extraData={selectedS}
                renderItem={({item, index}) => {
                  return (
                    <SelectedService
                      item={item}
                      selected={selectedS}
                      index={index}
                      navigation={navigation}
                      handleRemove={(parent, child) => {
                        handleRmv(parent, child);
                      }}
                    />
                  );
                }}
                keyExtractor={(item, index) => item + index.toString()}
              />
            </View>
            <CustomText
              style={{
                fontSize: 20,
                marginLeft: hp(1),
                marginTop: hp(2),
              }}
              title={'Choisissez Barbier '}
              type={'medium'}
              color={colors.darkBlack}>
              <Text style={{fontSize: 13}}>(optionnelle)</Text>
            </CustomText>

            <View style={{marginVertical: 10}}>
              <FlatList
                data={employees}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({item, index}) => (
                  <EmployeeCard
                    item={item}
                    index={index}
                    onPress={() => {
                      setSelectedSlot(null);
                      setEmployee(item?.id == employee?.id ? null : item);
                    }}
                    employee={employee}
                  />
                )}
                keyExtractor={(item, index) => item + index.toString()}
              />
            </View>

            {slots?.length > 0 && (
              <CustomText
                style={{
                  fontSize: 18,
                  marginLeft: hp(1),
                  marginTop: hp(2),
                }}
                title={'Choisissez votre prestation'}
                type={'medium'}
                color={colors.darkBlack}
              />
            )}
            <View
              style={{
                marginTop: hp(1),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {slots?.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  numColumns={4}
                  data={slots}
                  keyExtractor={(item, index) => item + index.toString()}
                  renderItem={renderTime}
                />
              ) : (
                <CustomText
                  style={{
                    fontSize: 14,
                    marginVertical: hp(3),
                  }}
                  title={'Aucun créneau disponible pour le moment'}
                  type={'medium'}
                  color={colors.darkBlack}
                />
              )}

              <View style={{width: '100%'}}>
                <Textarea
                  containerStyle={styles.textareaContainer}
                  style={styles.textarea}
                  onChangeText={note => {
                    setNote(note);
                    if (note) {
                      setErrorMsg('');
                    } else {
                      setErrorMsg('Veuillez entrer la description');
                    }
                  }}
                  defaultValue={note}
                  maxLength={300}
                  placeholder={'la description'}
                  placeholderTextColor={'#c7c7c7'}
                  underlineColorAndroid={'transparent'}
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              name={`Procédez à  ${calculate()}`}
              btnTextColor="white"
              width={wp(90)}
              onPress={() => {
                handleBooking();
              }}
            />
          </View>
        </View>
      </View>
      <Loading visible={loading} />
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
          if (selectedSlot && resId) {
            navigation.push('Root');
            navigation.navigate('AppointDetail', {reserv_id: resId});
          }
        }}
        // warning
        showSecondary={true}
        secondaryText={`d'accord`}
      />
    </View>
  );
};

export default Slots;

//STYLES
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},
  header: {
    flex: 0.18,
    flexDirection: 'row',
    paddingHorizontal: wp(2),
  },
  buttonContainer: {marginVertical: hp(2), width: '100%'},
  textareaContainer: {
    padding: 10,
    width: '95%',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: colors.white,
    fontFamily: fonts.WorkSansRegular,
    color: 'black',
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
    fontFamily: fonts.WorkSansMedium,
  },
  dateContainer: {
    backgroundColor: 'tomato',
    paddingHorizontal: wp(4),
    borderRadius: 10,
    backgroundColor: colors.primaryDark,
  },
  timeContainer: {
    borderRadius: 5,
    // paddingHorizontal: hp(1),
    // paddingVertical: hp(1.7),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: hp(1),
    marginVertical: hp(0.6),
    height: hp(5),
    width: wp(20),
  },
  imageContainer: {flex: 0.25, justifyContent: 'center', alignItems: 'center'},
  textContainer: {
    flex: 0.57,
    justifyContent: 'space-around',
    marginVertical: hp(3),
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
    height: hp(16),
    width: wp(35),
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

  week: {
    justifyContent: 'space-around',
    flex: 0.19,
    backgroundColor: 'green',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  black: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 39,
    alignSelf: 'flex-end',

    borderTopLeftRadius: 39,
  },
  avatar: {
    height: hp(15),
    width: wp(15),
    resizeMode: 'contain',
    shadowOpacity: 0.4,
    shadowColor: '#BDBDBD',

    shadowOffset: {height: 1, width: 1},
  },
  white: {
    flex: 0.85,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 39,

    borderTopLeftRadius: 39,
    padding: 10,
  },
});
