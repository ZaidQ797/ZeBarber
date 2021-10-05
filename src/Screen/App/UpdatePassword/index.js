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
import {Button} from '../../../Constant/Button';
import CustomText from '../../../Constant/CustomText';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {Loading} from '../../../Constant/Loading';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//redux
import {Alert} from '../../../Constant/Alert';
import {CommonActions} from '@react-navigation/routers';
import {connect, useSelector} from 'react-redux';
import {updatePassword} from '../../../redux/actions/auth';
import {isConnected} from '../../../Constant/Internet';

const UpdatePassword = ({updatePassword, route}) => {
  const navigation = useNavigation();
  const {token, user} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [cnfPass, setConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [old, setOld] = useState('');
  const [passErr, setpassErr] = useState('');
  const [cnfErr, setcnfErr] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [oldErr, setoldErr] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setNew] = useState(false);
  const [shouldGoBack, setGoBack] = useState(false);

  //REGEX FOR EMAIL VALIDATION
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //UPDATE PASSWORD
  const handleNewPass = async () => {
    if (!(await isConnected())) {
      setAlert(true);
      setAlertMsg('Veuillez vérifier votre internet');
    } else if (!password && !cnfPass && !old) {
      setpassErr(` * un nouveau mot de passe est requis`);
      setcnfErr('* Confirmez le mot de passe');
      setoldErr('* Ancien mot de passe requis');
    } else if (!password) {
      setpassErr(`* Mot de passe requis`);
    } else if (!cnfPass) {
      setcnfErr('* Confirmez le mot de passe');
    } else if (password !== cnfPass) {
      setcnfErr(`* le mot de passes ne correspond pas`);
      setpassErr(`* le mot de passes ne correspond pas`);
    } else {
      setcnfErr('');
      setpassErr('');
      setLoading(true);
      const formData = new FormData();

      formData.append('current_password', old);
      formData.append('password', password);
      formData.append('password_confirmation', password);

      new Promise((rsl, rej) => {
        updatePassword(formData, token, rsl, rej);
      })
        .then(res => {
          setGoBack(true);
          setAlert(true);
          setAlertMsg(res?.data?.message);

          setLoading(false);
        })
        .catch(err => {
          setGoBack(false);
          setAlert(true);
          setAlertMsg(err?.data?.data?.message);
          setLoading(false);
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
        contentContainerStyle={styles.contentStyle}
        scrollEnabled={true}
        style={styles.loginContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <CustomText
            style={{fontSize: 25, letterSpacing: 1.8, marginVertical: 10}}
            title={'Changer passe'}
            type={'medium'}
          />
          <OutLinedInput
            error={oldErr}
            value={old}
            secure={showOld ? false : true}
            onRightPress={() => {
              setShowOld(!showOld);
            }}
            rightIcon={showOld ? 'eye-off' : 'eye'}
            label={`Entrez l'ancien mot de passe`}
            placeholder="******"
            onChangeText={val => {
              setOld(val);
              if (!val) {
                setoldErr(``);
              } else if (val.length < 6) {
                setoldErr(`* fau moins 6 chiffres`);
              } else {
                setoldErr('');
              }
            }}
          />
          <OutLinedInput
            error={passErr}
            value={password}
            // secure={true}
            secure={showNew ? false : true}
            onRightPress={() => {
              setNew(!showNew);
            }}
            rightIcon={showNew ? 'eye-off' : 'eye'}
            label={`Entrez un nouveau mot de passe`}
            placeholder="******"
            onChangeText={val => {
              setPassword(val);
              if (!val) {
                setpassErr(``);
              } else if (val.length < 6) {
                setpassErr(`* fau moins 6 chiffres`);
              } else if (cnfPass && val !== cnfPass) {
                setpassErr(`* le mot de passe ne correspond pas`);
              } else {
                setpassErr('');
              }
            }}
          />

          <OutLinedInput
            error={cnfErr}
            value={cnfPass}
            secure={showNew ? false : true}
            onRightPress={() => {
              setNew(!showNew);
            }}
            rightIcon={showNew ? 'eye-off' : 'eye'}
            // secure={true}
            label={`Entrez un nouveau mot de passe`}
            placeholder="******"
            onChangeText={val => {
              setConfirm(val);
              if (!val) {
                setcnfErr(``);
              } else if (val.length < 6) {
                setcnfErr(`* fau moins 6 chiffres`);
              } else if (password && val !== password) {
                setcnfErr(`* le mot de passe ne correspond pas`);
              } else {
                setcnfErr('');
              }
            }}
          />
          <View style={styles.buttonContainer}>
            <Button
              name={'Réinitialiser'}
              btnTextColor="white"
              onPress={() => {
                handleNewPass();
              }}
            />
          </View>
        </View>
        <Alert
          visible={showAlert}
          alertMsg={alertMsg}
          onSecondaryPress={async () => {
            setAlert(false);
            setAlertMsg('');
            shouldGoBack && navigation.goBack();
          }}
          secondaryText={`d'accord`}
        />
        <Loading visible={loading} />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  logo: {
    height: hp(52),
    width: wp(51),
    resizeMode: 'contain',
  },
  loginContainer: {
    flexGrow: 0.7,
    flex: 1,
    padding: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  buttonContainer: {marginTop: hp(5)},
  logoContainer: {
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3,
  },
  contentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  inputContainer: {
    // flex: 0.3,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default connect(null, {updatePassword})(UpdatePassword);
