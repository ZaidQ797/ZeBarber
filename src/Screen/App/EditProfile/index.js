import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Header from '../../../Constant/Header';
import CustomText from '../../../Constant/CustomText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {appIcons, colors, hp, wp} from '../../../utilities';
import {OutLinedInput} from '../../../Constant/textInput/OutlinedInput';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from '../../../Constant/Button';
import {useNetInfo} from '@react-native-community/netinfo';
import {updateProfile} from '../../../redux/actions/auth';
import {Loading} from '../../../Constant/Loading';
import {Alert} from '../../../Constant/Alert';
import {isConnected} from '../../../Constant/Internet';

const EditProfile = ({params, navigation}) => {
  const {user, token, user_details} = useSelector(state => state.auth);
  const [fname, setFName] = useState(user_details?.first_name);
  const [lname, setLname] = useState(user_details?.last_name);
  const [address, setAddress] = useState(user_details?.address);
  const netInfo = useNetInfo();
  const [fError, setfError] = useState('');
  const [lError, setLError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(user?.phone);
  const [phoneError, setPhoneErr] = useState('');
  //handle user profile
  var re = /^[\d\(\)\-+]+$/m;

  //UPDATE PORFILE DETAIL
  const handleUpdate = async () => {
    try {
      if (!fname || !lname || !phone || !address) {
        !fname && setfError(`* Le prénom est re quis`);
        !lname && setLError(`* nom de famille requis`);
        !phone && setPhoneErr(`* le numéro de téléphone est requis`);
        !address && setAddressError(`* l'adresse est requise`);
      } else if (!fname) {
        setfError(`* Le prénom est requis`);
      } else if (!lname) {
        setLError(`* le nom de famille est requis`);
      } else if (!phone) {
        setPhoneErr(`* le numéro de téléphone est requis`);
      } else if (!address) {
        setAddressError(`* l'adresse est requise`);
      } else if (!(await isConnected())) {
        setAlert(true);
        setAlertMsg('veuillez vérifier votre connectivité Internet');
      } else {
        setLoading(true);
        const formData = new FormData();
        formData.append('first_name', fname);
        formData.append('last_name', lname);
        formData.append('address', address);
        formData.append('phone', phone);
        new Promise((rsl, rej) => {
          dispatch(updateProfile(formData, token, rsl, rej));
        })
          .then(res => {
            setAlertMsg(res?.message);
            setAlert(true);

            setLoading(false);
          })
          .catch(err => {
            setAlertMsg(err?.data?.message);
            setAlert(true);
            setLoading(false);
          });
      }
    } catch (err) {}
  };

  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Editer le profil'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <OutLinedInput
        error={fError}
        value={fname}
        label={'entrez votre prénom'}
        placeholder={'Prénom'}
        onChangeText={val => {
          setFName(val);
          if (!val) {
            setfError(``);
          } else {
            setfError('');
          }
        }}
      />
      <OutLinedInput
        label={'Entrer le nom de famille'}
        placeholder={'nom de famille'}
        error={lError}
        onChangeText={val => {
          setLname(val);
          if (!val) {
            setLError(``);
          } else {
            setLError('');
          }
        }}
        value={lname}
      />
      <OutLinedInput
        error={phoneError}
        value={phone}
        contextMenuHidden={true}
        keyboardType={'phone-pad'}
        label={'Entrez le numéro de téléphone'}
        placeholder={'Numéro de téléphone'}
        onChangeText={val => {
          setPhone(val);
          if (!val) {
            setPhoneErr(``);
          } else if (re.test(val)) {
            setPhone(val);
          } else {
            setPhoneErr('');
          }
        }}
      />
      <OutLinedInput
        label={`Entrer l'adresse`}
        placeholder={'Adresse'}
        error={addressError}
        onChangeText={val => {
          setAddress(val);
          if (!val) {
            setAddressError(``);
          } else {
            setAddressError('');
          }
        }}
        value={address}
      />
      <View style={styles.buttonContainer}>
        <Button
          name={'Mettre à jour'}
          btnTextColor="white"
          style={{fontSize: 20}}
          onPress={() => {
            handleUpdate();
          }}
        />
      </View>
      <Loading visible={loading} />
      <Alert
        visible={showAlert}
        alertMsg={alertMsg}
        onSecondaryPress={async () => {
          setAlert(false);
          setAlertMsg('');
          (await isConnected()) && navigation.goBack();
        }}
        secondaryText={`d'accord`}
      />
    </View>
  );
};

export default EditProfile;

//STYLES
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  buttonContainer: {marginTop: hp(3.4), width: '100%'},
});
