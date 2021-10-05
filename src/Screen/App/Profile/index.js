import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  LogBox,
  Image,
  ScrollView,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {ProfileSection} from '../../../Constant/SetionItem';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert} from '../../../Constant/Alert';
import {Loading} from '../../../Constant/Loading';
import {updateimage, updatedUserDetail} from '../../../redux/actions/auth';
import {useNetInfo} from '@react-native-community/netinfo';
import {isConnected} from '../../../Constant/Internet';
import {Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Linking} from 'react-native';
const Profile = ({navigation}) => {
  const {user, user_details, token} = useSelector(state => state.auth);
  const [image, setImage] = useState(null);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const [primaryMsg, setPrimaryMsg] = useState('');

  //SECTION LIST FOR PROILE ITEMS
  const DATA = [
    {
      title: 'Informations personnelles',
      data: [
        {
          id: 0,
          icon: 'phone',
          title: user?.phone,
          onPress: '',
        },
        {
          id: 1,
          icon: 'envelope',
          onPress: '',
          title: user?.email,
        },
        {
          id: 1,
          icon: 'location-arrow',
          onPress: '',
          title: user_details?.address,
        },
      ],
    },
    {
      title: 'Autres',
      data: [
        {
          id: 0,
          icon: 'qrcode',
          title: 'Mon code QR',
          onPress: 'QR',
        },
        {
          id: 1,
          icon: 'medal',
          title: 'Historique des points',
          onPress: 'PointsHistory',
          fontAwesome5: true,
        },
        {
          id: 2,
          icon: 'bullhorn',
          title: 'Promotions',
          onPress: 'Promotions',
        },
        {
          id: 3,
          icon: 'share-alt',
          title: 'Référence',
          onPress: 'Share',
        },
        user?.auth_provider == null && {
          id: 4,
          icon: 'lock',
          title: 'mettre à jour le mot de passe',
          onPress: 'UpdatePassword',
        },
        {
          id: 5,
          icon: 'sign-out',
          title: 'Se déconnecter',
          onPress: 'logout',
        },
      ],
    },
  ];

  //IMAGE PICKER
  const handleImpagePicker = () => {
    //REQUEST PERMISSION FOR IOS
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              pickImage();
              break;
            case RESULTS.BLOCKED:
              setAlert(true);
              setAlertMsg(
                'Vous devez donner votre autorisation pour accéder à la galerie.',
              );
              setPrimaryMsg('Autoriser');
              break;
          }
        })
        .catch(error => {
          console.log(error);
          // …
        });
    } else {
      pickImage();
    }
  };
  //OPEN IMAGE GALLERY TO PICK IMAGE
  const pickImage = () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(async image => {
        if (await isConnected()) {
          setAlertMsg(`Voulez-vous changer l'image?`);
          setAlert(true);
          setImage(image);
        } else {
          setAlert(true);
          setAlertMsg('Vérifiez votre connection internet');
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  //UPLOAD PICKED IMAGE FROM GALLERY
  const handleUpdateImg = () => {
    try {
      if (!netInfo.isConnected) {
        setAlert(true);
        setAlertMsg('veuillez vérifier votre connectivité Internet');
      } else {
        setAlert(false);
        const formData = new FormData();
        formData.append('image', {
          name: 'IMG_' + image.modificationDate + Math.random().toFixed(4),
          type: image?.mime,
          uri: image?.path,
        });
        setLoading(true);
        new Promise((rsl, rej) => {
          dispatch(updateimage(formData, token, rsl, rej));
        })
          .then(res => {
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
          });
      }
    } catch (err) {}
  };
  //GET USER UPDATED DETAIL(IF IMAGE CHANGED OR NAME CHANGED ETC)
  useEffect(() => {
    setLoading(true);
    const unsub = getUserDetail();
    return () => {
      unsub;
    };
  }, [isFocused]);
  const getUserDetail = () => {
    const formData = new FormData();
    formData.append('user_id', user?.id);
    new Promise((rsl, rej) => {
      dispatch(updatedUserDetail(formData, token, user, rsl, rej));
    })
      .then(res => {
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.main}>
      <Header
        // icon={'chevron-left'}
        title={'Paramètres de profil'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.black}>
        <View style={styles.white}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: Platform.OS === 'android' ? hp(10) : hp(5),
            }}>
            <SectionList
              scrollEnabled={false}
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => {
                if (item?.title) {
                  return <ProfileSection item={item} navigation={navigation} />;
                } else {
                  return null;
                }
              }}
              renderSectionHeader={({section: {title}}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: hp(3),
                  }}>
                  <CustomText
                    style={{
                      fontSize: 18,
                      marginTop: hp(2),
                      marginBottom: hp(1),
                    }}
                    title={title}
                    type={'medium'}
                    color={colors.black}
                  />
                  {title == 'Informations personnelles' && (
                    <CustomText
                      onPress={() => {
                        navigation.navigate('EditProfile');
                      }}
                      style={{
                        fontSize: 16,
                        marginTop: hp(2),
                        marginLeft: hp(3),
                        marginBottom: hp(1),
                      }}
                      title={'Éditer'}
                      type={'medium'}
                      color={colors.buttonColor}
                    />
                  )}
                </View>
              )}
            />
          </ScrollView>
        </View>

        <View style={styles.profile}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: hp(3),
            }}>
            <CustomText
              style={{
                fontSize: 18,
                alignSelf: 'center',
                paddingTop: hp(3.4),
                marginTop: 10,
              }}
              title={user_details?.first_name + ' ' + user_details?.last_name}
              type={'large'}
              color={colors.black}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomLeftRadius: 39,
              borderBottomRightRadius: 39,

              borderColor: '#E5E5E5',
            }}>
            <View
              style={{
                width: '50%',
                // borderRightWidth: 1,
                padding: hp(1.5),
                borderColor: '#E5E5E5',
              }}>
              <CustomText
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                }}
                title={
                  user_details?.total_earned_points
                    ? user_details?.total_earned_points
                    : 0
                }
                type={'large'}
                color={colors.black}
              />
              <CustomText
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                }}
                title={'Points'}
                type={'large'}
                color={colors.black}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleImpagePicker();
            }}
            style={{
              position: 'absolute',
              top: -45,
              alignSelf: 'center',
              position: 'absolute',
            }}>
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.primaryDark,

                // top: hp(1),
              }}
              source={{
                uri: user_details?.photo
                  ? user_details?.photo
                  : 'https://wise.edu.pk/wp-content/uploads/2021/03/placeholder.png',
              }}
            />
            <TouchableOpacity
              onPress={() => {
                handleImpagePicker();
              }}
              style={styles.edit}>
              <Entypo name={'camera'} size={17} color={colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => {
          setAlert(false);
          setAlertMsg('');
        }}
        upload={netInfo.isConnected ? true : false}
        warning={netInfo.isConnected ? true : false}
        onprimaryPress={() => {
          if (primaryMsg === 'Autoriser') {
            setAlert(false);
            setAlertMsg('');
            Linking.openSettings();
          } else {
            handleUpdateImg();
          }
        }}
        primaryText={primaryMsg ? primaryMsg : 'Télécharger'}
        showPrimary={netInfo.isConnected ? true : false}
        secondaryText={!netInfo.isConnected ? `d'accord` : 'Annuler'}
      />
      <Loading visible={loading} />
    </View>
  );
};

export default Profile;

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
  edit: {
    position: 'absolute',
    right: 7,
    bottom: 1,
    backgroundColor: colors.primaryDark,
    // shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    borderRadius: 100,
    borderColor: '#BDBDBD',
    padding: 4,
    borderWidth: 1,
  },
  profile: {
    position: 'absolute',
    top: hp(9),
    width: '90%',

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
  black: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    justifyContent: 'flex-end',
  },

  white: {
    flex: 0.65,
    backgroundColor: '#F4F4F4',
    paddingBottom: 10,
  },
});
