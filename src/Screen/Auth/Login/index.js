//import liraries

import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {appLogo, colors, hp, wp, appImages} from '../../../utilities';
import {SocialButton, Button} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {Loading} from '../../../Constant/Loading';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Divider} from 'react-native-paper';
import axios from 'axios';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {Alert} from '../../../Constant/Alert';
//redux
import {loginRequest, socialLogin} from '../../../redux/actions/auth';
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {fcmService, localNotificationService} from '../../../services';
import {isConnected} from '../../../Constant/Internet';
import {
  handleFacebookSignin,
  handleGoogleSignin,
} from '../../../Constant/Functions/Social';
import * as RNLocalize from 'react-native-localize';

const Login = ({loginRequest, connection, socialLogin}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setmailError] = useState('');
  const [passwordError, setpassError] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [FCMToken, setFCMToken] = useState('');
  const isFocused = useIsFocused();
  const [showOld, setShowOld] = useState(false);

  //REGEX FOR EMAIL VALIDATION
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //GET DEVICE TOKEN TO REGISTER DEVICE FOR FCM
  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister);
  }, []);

  function onRegister(FCMToken) {
    setFCMToken(FCMToken);
  }
  useEffect(() => {
    onRegister(FCMToken);
  }, [FCMToken]);

  useEffect(() => {
    setmailError('');
    setpassError('');
  }, [isFocused]);

  //HANDLE LOGIN
  const handleLogin = async () => {
    if (!email && !password) {
      setmailError(!email ? `* L'e-mail est requis` : '');
      setpassError(`* Mot de passe requis`);
    } else if (!re.test(email)) {
      setmailError(`* format de courrier incorrect`);
    } else if (password.length < 6) {
      setpassError(`* fau moins 6 chiffres`);
    } else if (await isConnected()) {
      let deviceId = DeviceInfo.getDeviceId();
      setmailError('');
      setpassError('');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('device_id', deviceId);
      formData.append('fcm_token', FCMToken);
      formData.append('time_zone', RNLocalize.getTimeZone());

      setLoading(true);
      new Promise((rsl, rej) => {
        loginRequest(formData, rsl, rej);
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
        .catch(({message, data}) => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(data?.error);
        });
    } else {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    }
  };

  //FB LOGIN
  const handleFBData = async (user, socialType) => {
    if (await isConnected()) {
      let {
        response,
        response: {additionalUserInfo},
        response: {
          additionalUserInfo: {profile},
        },
        fbToken,
      } = user;
      let deviceId = DeviceInfo.getDeviceId();

      const formData = new FormData();
      formData.append('email', profile?.email);
      formData.append('first_name', profile?.first_name);
      formData.append('last_name', profile?.last_name);
      formData.append('account_id', profile?.id);
      formData.append('provider_access_token', fbToken);
      formData.append('auth_provider', socialType); //1 for facebook 0 for Google
      formData.append('time_zone', RNLocalize.getTimeZone());
      formData.append('device_id', deviceId);
      formData.append('fcm_token', FCMToken);
      console.log(formData);

      setLoading(true);
      new Promise((rsl, rej) => {
        socialLogin(formData, rsl, rej);
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
        .catch(({message, data}) => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(data?.error);
        });
    } else {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    }
  };

  //GOOGLE LOGIN
  const handleGoogleData = async (user, socialType) => {
    if (await isConnected()) {
      let deviceId = DeviceInfo.getDeviceId();

      const formData = new FormData();

      formData.append('email', user?.user?.email);
      formData.append('first_name', user?.user?.givenName);
      formData.append('last_name', user?.user?.familyName);
      formData.append('account_id', user?.user?.id);
      formData.append('provider_access_token', user?.idToken);
      formData.append('auth_provider', socialType); //1 for facebook 0 for Google
      formData.append('time_zone', RNLocalize.getTimeZone());

      formData.append('device_id', deviceId);
      formData.append('fcm_token', FCMToken);
      setLoading(true);
      new Promise((rsl, rej) => {
        socialLogin(formData, rsl, rej);
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
        .catch(({message, data}) => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(data?.error);
        });
    } else {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    }
  };

  //RENDER
  return (
    <ImageBackground style={styles.container} source={appImages.background}>
      <View style={styles.logoContainer}>
        <Image source={appLogo.logo_transparent} style={styles.logo} />
      </View>
      <KeyboardAwareScrollView
        // scrollEnabled={false}
        style={styles.loginContainer}
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <CustomText
            style={{fontSize: 30, letterSpacing: 1.8, marginVertical: 10}}
            title={'Connexion'}
            type={'medium'}
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
                setmailError('');
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
                setpassError('');
              } else if (val.length < 6) {
                setpassError(`* fau moins 6 chiffres`);
              } else {
                setpassError('');
              }
            }}
            // onChangeText={val => setPassword(val)}
          />
          <View
            style={{
              width: wp(82),
              alignItems: 'flex-end',
              marginVertical: hp(1),
            }}>
            <CustomText
              onPress={() => {
                navigation.navigate('Forget');
              }}
              style={{
                fontSize: 14,
                alignSelf: 'flex-end',
              }}
              title={'Mot de passe oublié?'}
              type={'normal'}
              color={colors.black}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              name={'Connexion'}
              btnTextColor="white"
              style={{fontSize: 20}}
              onPress={() => {
                handleLogin();
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Divider style={{height: 1, width: '39%', alignSelf: 'center'}} />
              <CustomText
                onPress={() => {
                  navigation.navigate('Forget');
                }}
                style={{
                  fontSize: 18,
                  alignSelf: 'center',
                  marginVertical: 10,
                }}
                title={`  OR  `}
                type={'large'}
                color={colors.black}
              />
              <Divider style={{height: 1, width: '39%', alignSelf: 'center'}} />
            </View>

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
                  navigation.navigate('Signup');
                }}
                style={{
                  fontSize: 14,
                  alignSelf: 'center',
                }}
                title={`Inscrivez-vous`}
                type={'medium'}
                color={colors.buttonColor}
              />
            </View>
            <View style={{margin: hp(1)}}>
              <SocialButton
                social={'fb'}
                name={'Facebook'}
                onPress={async () => {
                  if (await isConnected()) {
                    handleFacebookSignin().then(userInfo => {
                      handleFBData(userInfo, 1); //1 for facebook 0 for google
                    });
                  } else {
                    setAlert(true);
                    setAlertMsg('Vérifiez votre connection internet');
                  }
                }}
              />
              <View style={{height: hp(1)}} />
              <SocialButton
                name={'Google'}
                onPress={() => {
                  handleGoogleSignin().then(res => {
                    res && handleGoogleData(res, 2);
                  });
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
      <Loading visible={loading} />
    </ImageBackground>
  );
};

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flexGrow: 1,
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
    flex: 0.3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginBottom: hp(2),
  },
  contentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//make this component available to the app
const mapStateToProps = state => {
  const {connection} = state.auth;
  return {connection};
};
export default connect(mapStateToProps, {loginRequest, socialLogin})(Login);
