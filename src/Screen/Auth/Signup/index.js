//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
  ToucableOpacity,
} from 'react-native';
import {appLogo, colors, hp, wp, appImages} from '../../../utilities';
import UserInput from '../../../Constant/textInput';
import {Button, SocialButton} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {Loading} from '../../../Constant/Loading';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '588965472745-rt3bsprcn2410nvp0anb3tgqplrmjs89.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '588965472745-93kv8g8dqjvmgvaqia1n8osd46gtbso9.apps.googleusercontent.com',
});
import {CommonActions} from '@react-navigation/native';
//redux
import {connect} from 'react-redux';
import {signupRequest} from '../../../redux/actions/auth';
import {Alert} from '../../../Constant/Alert';
import {isConnected} from '../../../Constant/Internet';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {fonts} from '../../../utilities/fonts';
import {Platform} from 'react-native';
import * as RNLocalize from 'react-native-localize';

const Signup = ({signupRequest, route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [emailError, setmailError] = useState('');
  const [passwordError, setpassError] = useState('');
  const [fnameErr, setfnameErr] = useState('');
  const [lnameErr, setlnameErr] = useState('');
  const [netError, setNetError] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [qrValue, setQRValue] = useState(route?.params?.qrcode);
  const [showOld, setShowOld] = useState(false);

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  useEffect(() => {
    setQRValue(route?.params?.qrcode);
  }, [route]);

  //SIGNUP
  const handleSignup = async () => {
    if (!fname || !lname || !password || !email) {
      !fname && setfnameErr(`* Le prénom est re quis`);
      !lname && setlnameErr(`* nom de famille requis`);
      !email && setmailError(`* L'e-mail est requis`);
      !password && setpassError(`* Mot de passe requis`);
    } else if (!fname) {
      setfnameErr(`* Le prénom est re quis`);
    } else if (!lname) {
      setlnameErr(`* nom de famille requis`);
    } else if (!email) {
      setmailError(`* L'e-mail est requis`);
    } else if (!password) {
      setpassError(`* Mot de passe requis`);
    } else if (!re.test(email)) {
      setmailError(`* format de courrier incorrect`);
    } else if (password.length < 6) {
      setpassError(`* fau moins 6 chiffres`);
    } else if (!(await isConnected())) {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    } else {
      setLoading(true);
      const formData = new FormData();

      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', password);
      formData.append('first_name', fname);
      formData.append('last_name', lname);
      formData.append('time_zone', RNLocalize.getTimeZone());

      console.log(formData);
      qrValue && formData.append('user_reference', qrValue);
      new Promise((rsl, rej) => {
        signupRequest(formData, rsl, rej);
      })
        .then(res => {
          setLoading(false);

          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Root'}],
            }),
          );
        })
        .catch(err => {
          setLoading(false);

          if (err?.data?.errors?.email?.length > 0) {
            setAlert(true);
            setAlertMsg(err?.data?.errors.email[0]);
          } else {
            setAlert(true);
            setAlertMsg(err?.message);
          }

          // Alert.alert('Erreur', data?.errors?.email[0]);
        });
    }
  };

  //RENDER
  return (
    <ImageBackground style={styles.container} source={appImages.background}>
      <View style={styles.logoContainer}>
        <Image source={appLogo.logo_transparent} style={styles.logo} />
      </View>
      <KeyboardAwareScrollView
        // scrollEnabled={true}
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <CustomText
            style={{fontSize: 25, letterSpacing: 1.8, marginTop: 10}}
            title={'Inscrivez-vous'}
            type={'medium'}
          />
          <OutLinedInput
            value={fname}
            error={fnameErr}
            label={`Prénom`}
            placeholder="Entrez votre prénom"
            onChangeText={val => {
              setFname(val);
              if (!val) {
                setfnameErr(``);
              } else {
                setfnameErr('');
              }
            }}
            // onChangeText={val => setFname(val)}
          />
          <OutLinedInput
            error={lnameErr}
            value={lname}
            label={`Nom de famille`}
            placeholder="Entrez votre prénom"
            onChangeText={val => {
              setLname(val);
              if (!val) {
                setlnameErr(``);
              } else {
                setlnameErr('');
              }
            }}
          />
          <OutLinedInput
            value={email}
            error={emailError}
            keyboardType={'email-address'}
            label={`Entrer l’e-mail`}
            placeholder="Entrez votre adresse email"
            onChangeText={val => {
              setMail(val);
              if (!val) {
                setmailError(``);
              } else if (!re.test(val)) {
                setmailError(`* format de courrier incorrect`);
              } else {
                setmailError('');
              }
            }}
          />
          <OutLinedInput
            value={password}
            error={passwordError}
            label={`Entrer le mot de passe`}
            placeholder="******"
            secure={showOld ? false : true}
            onRightPress={() => {
              setShowOld(!showOld);
            }}
            rightIcon={showOld ? 'eye-off' : 'eye'}
            onChangeText={val => {
              setPassword(val);
              if (!val) {
                setpassError(``);
              } else if (val.length < 6) {
                setpassError(`* fau moins 6 chiffres`);
              } else {
                setpassError('');
              }
            }}
          />

          <View
            style={{
              width: wp(82),
              alignItems: 'flex-end',
              marginTop: hp(0.7),
            }}
          />
          <View style={styles.buttonContainer}>
            <View style={{marginBottom: hp(3), width: wp(82)}}>
              <CustomText
                style={{
                  fontSize: 20,
                  marginVertical: 4,
                }}
                title={`Référence à un ami `}
                type={'medium'}
                color={colors.g1}
              />
              <View
                style={{
                  backgroundColor: 'white',

                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <View
                  activeOpacity={1}
                  style={{
                    // paddingVertical: 20,
                    paddingHorizontal: 14,
                    width: '50%',
                    justifyContent: 'center',
                    borderTopLeftRadius: 4,
                    borderTopLeftRadius: 4,
                  }}>
                  <TextInput
                    maxLength={6}
                    value={qrValue?.toUpperCase()}
                    onChangeText={val => {
                      setQRValue(val);
                    }}
                    placeholderTextColor="#BDBDBD"
                    placeholder={'Code'}
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.WorkSansMedium,
                      color: 'gray',
                    }}
                  />
                </View>

                <TouchableOpacity
                  disabled
                  style={{
                    backgroundColor: 'black',
                    width: '50%',
                    // padding: 10,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      left: -35,
                      top: 12,
                      height: 35,
                      width: 60,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 0.3,
                      shadowOpacity: 0.3,
                      shadowColor: '#BDBDBD',
                      borderColor: '#BDBDBD',
                    }}>
                    <CustomText
                      style={{
                        fontSize: 15,
                      }}
                      title={`OR`}
                      type={'medium'}
                      textAlign={'center'}
                      color={colors.black}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      alignSelf: 'flex-end',
                      paddingVertical: 20,
                      paddingHorizontal: 16,
                    }}
                    onPress={() => {
                      navigation.navigate('Scanner');
                    }}>
                    <CustomText
                      style={{
                        fontSize: Platform.OS == 'ios' ? 15 : 13,
                        alignSelf: 'flex-end',
                      }}
                      title={`Scannez le QR`}
                      type={'medium'}
                      textAlign={'center'}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
            <Button
              name={`S'inscrire`}
              btnTextColor="white"
              style={{fontSize: 20}}
              onPress={() => {
                handleSignup();
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.signupContainer}>
              <CustomText
                style={{
                  fontSize: 14,
                  alignSelf: 'center',
                }}
                title={`Vous n'avez pas de compte ? `}
                type={'medium'}
                color={colors.g1}
              />
              <CustomText
                onPress={() => {
                  navigation.navigate('Login');
                }}
                style={{
                  fontSize: 14,
                  alignSelf: 'center',
                }}
                title={`Connexion`}
                type={'medium'}
                color={colors.buttonColor}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Loading visible={loading} />
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
    </ImageBackground>
  );
};

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flexGrow: 0.9,
    flex: 1,
    padding: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  logo: {
    height: hp(22),
    width: wp(51),
    resizeMode: 'contain',
  },
  buttonContainer: {marginTop: hp(1), width: '100%'},
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.28,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(5),
  },
  contentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(null, {signupRequest})(Signup);
