import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {appLogo, colors, hp, wp, appImages} from '../../../utilities';
import {Button, SocialButton} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {Loading} from '../../../Constant/Loading';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useDispatch, useSelector} from 'react-redux';
import {scanQR} from '../../../redux/actions/auth';
import {Alert} from '../../../Constant/Alert';
import {isConnected} from '../../../Constant/Internet';

const Scanner = ({signupRequest, route}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const dispatch = useDispatch();
  const handleSecondary = () => {
    setAlert(false);
    setAlertMsg('');
    navigation.goBack();
  };
  const onSuccess = async e => {
    if (await isConnected()) {
      new Promise((rsl, rej) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('referral_qr_code', e?.data);
        dispatch(scanQR(formData, rsl, rej));
      })
        .then(res => {
          setLoading(false);

          navigation.navigate('Signup', {
            qrcode: res?.user_reference?.referral_short_code,
          });
        })
        .catch(err => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(
            res?.message ? res?.message : `Quelque chose s'est mal passé`,
          );

          navigation.navigate('Signup', {qrcode: ''});
        });
    } else {
      setAlert(true);
      setAlertMsg('Veuillez vérifier votre internet');
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
            style={{fontSize: 20, letterSpacing: 1.8, marginTop: 10}}
            title={'Scannez le code QR pour obtenir des points'}
            type={'medium'}
            color={'black'}
            textAlign={'center'}
          />
        </View>

        <QRCodeScanner onRead={onSuccess} />
      </KeyboardAwareScrollView>
      <Loading visible={loading} />

      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={() => handleSecondary()}
        warning
        secondaryText={`d'accord`}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    backgroundColor: 'white',
  },
  logo: {
    height: hp(22),
    width: wp(51),
    resizeMode: 'contain',
  },
  buttonContainer: {marginTop: hp(1), width: '100%', backgroundColor: 'tomato'},
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    alignItems: 'center',
    flex: 0.3,
    justifyContent: 'center',
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default Scanner;
