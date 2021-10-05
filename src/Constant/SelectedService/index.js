import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, hp, wp} from '../../utilities';
import CustomText from '../../Constant/CustomText';
import {useSelector, useDispatch} from 'react-redux';
import {updateServices} from '../../redux/actions/app';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Alert} from '../../Constant/Alert';
import Swipeout from 'react-native-swipeout';

const SelectedService = ({item, index, handleRemove}) => {
  const {services} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [singleItem, setSingle] = useState(null);
  let swipeoutBtns = [
    {
      component: (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <MaterialIcons name="delete" size={30} color="white" />
        </View>
      ),
      backgroundColor: '#ff364a',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: async () => {
        setAlert(true);
        setAlertMsg('Êtes-vous sûr de vouloir supprimer');
        setSingle(item);
      },
    },
  ];
  return (
    <Swipeout
      right={swipeoutBtns}
      autoClose
      style={[
        styles.serviceContainer,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        style={[
          styles.serviceContainer,
          {borderWidth: 0, borderColor: 'transparent'},
        ]}>
        <View style={{width: '65%'}}>
          <CustomText
            numberOfLines={1}
            style={{
              fontSize: 16,
              paddingTop: hp(1),
            }}
            title={item?.name + '' + item?.name}
            type={'large'}
            color={colors.darkGrey}
          />
          <CustomText
            numberOfLines={1}
            style={{
              fontSize: 15,
              marginBottom: hp(1),
              marginTop: hp(0.4),
            }}
            title={'Temps total: ' + item?.time + ' mins'}
            type={'medium'}
            color={colors.mediumGrey}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={styles.price}>
            <CustomText
              style={{
                fontSize: 15,
              }}
              title={'€ ' + item?.cost}
              type={'medium'}
              color={colors.white}
            />
          </View>

          {/* <MaterialIcons
          onPress={() => {
           
          }}
          name="delete"
          size={30}
          color={colors.black}
          style={{alignSelf: 'center'}}
        /> */}
        </View>
        <Alert
          visible={showAlert}
          alertMsg={alertMsg}
          onSecondaryPress={() => {
            setAlert(false);
            setAlertMsg('');
          }}
          // warning
          del={true}
          showPrimary
          primaryText={'OUI'}
          showSecondary={true}
          secondaryText={'Annuler'}
          onprimaryPress={() => {
            setAlert(false);
            handleRemove(item.service_category_id, item.id);
          }}
        />
      </TouchableOpacity>
    </Swipeout>
  );
};
export default SelectedService;
const styles = StyleSheet.create({
  serviceContainer: {
    marginVertical: wp(0.8),
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.primaryDark,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingVertical: hp(0.8),
  },

  price: {
    backgroundColor: colors.darkBlack,
    borderRadius: 5,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    alignSelf: 'center',
    marginRight: wp(3),
  },
});
