//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import {appLogo, colors, hp, wp, appImages} from '../../../utilities';
import {Alert} from '../../../Constant/Alert';

import {Button} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {Loading} from '../../../Constant/Loading';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {color} from 'react-native-elements/dist/helpers';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {fonts} from '../../../utilities/fonts';
import {CommonActions} from '@react-navigation/routers';
//redux
import {verifyOTP} from '../../../redux/actions/auth';
import {connect} from 'react-redux';
import {isConnected} from '../../../Constant/Internet';

const OTP = ({verifyOTP, route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const handleCode = async code => {
    console.log(route?.params?.token?.verification_code);
    if (!(await isConnected())) {
      setAlert(true);
      setAlertMsg('Prüfen Sie bitte Ihre Internetverbindung');
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append('user_id', route?.params?.token?.id);
      formData.append('token', code);

      new Promise((rsl, rej) => {
        verifyOTP(formData, rsl, rej);
      })
        .then(res => {
          setLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'ChangePassword',
                  params: {token: res?.data?.accessToken},
                },
              ],
            }),
          );
        })
        .catch(err => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(err?.data?.error);
          setCode('');

          // Alert.alert(err?.message, err?.data?.error);
        });
      if (res?.data?.success == 0) {
        Alert.alert(res?.data?.message, res?.data?.data?.error);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'DashBoard'}],
          }),
        );
      }
    }
  };

  return (
    <ImageBackground style={styles.container} source={appImages.background}>
      <View style={styles.logoContainer}>
        <Image source={appLogo.logo_transparent} style={styles.logo} />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <CustomText
            style={{fontSize: 25, letterSpacing: 1.8, marginVertical: 10}}
            title={'Vérifier OTP'}
            type={'medium'}
          />
          <View style={styles.phoneNumberContainer}>
            <OTPInputView
              style={{
                width: '50%',
                height: 100,
              }}
              code={code}
              contextMenuHidden={true}
              pinCount={6}
              autoFocusOnLoad
              codeInputHighlightStyle={styles.borderStyleHighLighted}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                handleCode(code);
              }}
              onCodeChanged={code => {
                setCode(code);
              }}
            />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentStyle: {
    alignItems: 'center',
    // backgroundColor: 'white',
    flexGrow: 1,
    justifyContent: 'center',
  },
  underlineStyleBase: {
    width: wp(12),
    height: hp(7),

    borderWidth: 0,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    color: colors.primaryDark,
    fontFamily: fonts.WorkSansBold,
    fontSize: 24,
    shadowOpacity: 1,
    shadowColor: '#eee',
    shadowRadius: 4,
    shadowOffset: {height: 0, width: 1},
    borderColor: '#E5E5E5',
  },
  loginContainer: {
    flexGrow: 0.7,
    flex: 1,
    padding: 4,

    backgroundColor: 'white',
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  underlineStyleHighLighted: {
    borderColor: colors.primaryDark,
  },

  logo: {
    height: hp(52),
    width: wp(51),
    resizeMode: 'contain',
  },
  buttonContainer: {marginTop: hp(5)},
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3,
  },
  inputContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
});

export default connect(null, {verifyOTP})(OTP);
