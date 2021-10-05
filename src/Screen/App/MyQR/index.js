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
} from 'react-native';
import {appImages, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {Alert} from '../../../Constant/Alert';
import {Loading} from '../../../Constant/Loading';
import {useNetInfo} from '@react-native-community/netinfo';
import {Empty} from '../../../Constant/Empty';
const QR = ({navigation}) => {
  const {user, user_details, token, user_qr_code} = useSelector(
    state => state.auth,
  );
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();

  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Mon code QR'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.black}>
        {user_qr_code ? (
          <View>
            <Image
              source={{uri: user_qr_code?.qrcode_path}}
              style={styles.qrCode}
            />
            <View style={{marginTop: hp(2)}}>
              {user_qr_code?.qrcode_value && (
                <CustomText
                  style={{
                    fontSize: 18,
                    alignSelf: 'center',
                  }}
                  title={user?.referral_short_code}
                  type={'medium'}
                  color={colors.primaryDark}
                />
              )}
              {user_qr_code?.qrcode_path && (
                <CustomText
                  style={{
                    fontSize: 20,
                    marginTop: hp(2),
                    alignSelf: 'center',
                  }}
                  title={'Scanner mon code QR'}
                  type={'medium'}
                  color={colors.black}
                />
              )}
            </View>
          </View>
        ) : (
          <Empty visible={true} title={'CODE QR INTROUVABLE'} />
        )}
      </View>

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
    </View>
  );
};

export default QR;
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},
  qrCode: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },

  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  black: {
    flex: 1,
    backgroundColor: 'white',

    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
