//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Keyboard,
} from 'react-native';
import {appLogo, colors, hp, wp, appImages} from '../../../utilities';
import {Button} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {Loading} from '../../../Constant/Loading';
import {useNavigation, useIsFocused} from '@react-navigation/core';
import {CommonActions} from '@react-navigation/routers';
import {Alert} from '../../../Constant/Alert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//redux
import {verifyMail} from '../../../redux/actions/auth';
import {connect, useSelector} from 'react-redux';
import {isConnected} from '../../../Constant/Internet';

const Forget = ({verifyMail}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState('');
  const [emailError, setmailError] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const isFocused = useIsFocused();

  //REGEX FOR EMAIL
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //VERIFY EMAIL IF  EXISTS
  const handleEmail = async () => {
    if (!email) {
      setmailError(!email ? `* L'e-mail est requis` : '');
    } else if (!re.test(email)) {
      setmailError(`* Le format de l'e-mail n'est pas correct`);
    } else if (!(await isConnected())) {
      setAlert(true);
      setAlertMsg('Vérifiez votre connection internet');
    } else {
      setAlert(false);
      setAlertMsg('');
      setLoading(true);
      const formData = new FormData();

      formData.append('email', email);
      formData.append('user_id', 4);

      new Promise((rsl, rej) => {
        verifyMail(formData, rsl, rej);
      })
        .then(res => {
          setTimeout(() => {
            setLoading(false);
            navigation.navigate('OTP', {token: res?.data?.token});
          }, 500);
        })
        .catch(err => {
          setLoading(false);
          setAlert(true);
          setAlertMsg(err);
        });
    }
  };

  useEffect(() => {
    setmailError('');
  }, [isFocused]);

  //RENDER
  return (
    <ImageBackground style={styles.container} source={appImages.background}>
      <View style={styles.logoContainer}>
        <Image source={appLogo.logo_transparent} style={styles.logo} />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentStyle}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <CustomText
            style={{fontSize: 25, letterSpacing: 1.8}}
            title={'Générer OTP'}
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
                setmailError(``);
              } else if (!re.test(val)) {
                setmailError(`* format de courrier incorrect`);
              } else {
                setmailError('');
              }
            }}
          />

          <View style={styles.buttonContainer}>
            <Button
              name={'Vérifier'}
              btnTextColor="white"
              onPress={() => {
                handleEmail();
              }}
            />
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

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logo: {
    height: hp(52),
    width: wp(51),
    resizeMode: 'contain',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.28,
  },
  contentStyle: {
    alignItems: 'center',
    // backgroundColor: 'white',
    flexGrow: 0.5,
  },
  buttonContainer: {marginTop: hp(3)},
  loginContainer: {
    flexGrow: 0.7,
    flex: 1,
    padding: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  inputContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(null, {verifyMail})(Forget);
