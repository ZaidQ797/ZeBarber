import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, Image} from 'react-native';
import {appImages, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {Alert} from '../../../Constant/Alert';
import {Loading} from '../../../Constant/Loading';
import {Empty} from '../../../Constant/Empty';
import {isConnected} from '../../../Constant/Internet';
import {pointsHistory} from '../../../redux/actions/app';
import {useFocusEffect} from '@react-navigation/core';
import moment from 'moment';
import HistoryCard from '../../../Constant/HistoryCard';

const PointsHistory = ({navigation}) => {
  const {token, user, user_detail} = useSelector(state => state.auth);
  const {pointHistory} = useSelector(state => state.app);
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //RENDER EMPTY INCASE OF NO POINTS HISTORY
  const renderEmpty = () => {
    if (
      pointHistory?.length == 0 ||
      pointHistory == [] ||
      pointHistory == undefined ||
      pointHistory == null
    ) {
      return <Empty visible={true} title={'Aucun Enregistrement Trouvé'} />;
    }
  };

  //GET POIN HISTORY
  useFocusEffect(
    React.useCallback(() => {
      const unsub = getPointHis();
      return () => unsub;
    }, []),
  );

  const getPointHis = async () => {
    if (await isConnected()) {
      const formData = new FormData();
      formData.append('user_id', user?.id);
      new Promise((rsl, rej) => {
        setLoading(true);
        dispatch(pointsHistory(formData, token, rsl, rej));
      })
        .then(res => {
          res.error && setAlert(true);
          res.error && setAlertMsg(res.error);
          setLoading(false);
        })
        .catch(err => {
          setAlert(true);
          setAlertMsg(err.data?.error);
          setLoading(false);
        });
    }
  };
  
//RENDER
  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Histoire de points'}
        onLeftPress={() => {
          navigation.goBack();
        }}
        showRight={false}
      />
      <View style={styles.black}>
        {!loading && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: wp(6),
              marginBottom: hp(2),
            }}>
            <CustomText
              numberOfLines={2}
              style={{
                fontSize: 20,
                alignSelf: 'center',
              }}
              title={'Total des points'}
              type={'medium'}
              color={colors.white}
            />

            <CustomText
              numberOfLines={2}
              style={{
                fontSize: 20,
                alignSelf: 'center',
              }}
              title={
                user?.details?.total_earned_points
                  ? user?.details?.total_earned_points
                  : 0
              }
              type={'medium'}
              color={colors.white}
            />
          </View>
        )}
        <View style={styles.white}>
          {renderEmpty()}
          {pointHistory && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pointHistory}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => <HistoryCard item={item} />}
            />
          )}
        </View>
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

export default PointsHistory;
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
  white: {
    flex: 0.96,
    backgroundColor: 'white',

    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    paddingTop: hp(2),
  },
  black: {
    flex: 1,
    backgroundColor: 'black',

    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    paddingTop: hp(2),
    justifyContent: 'flex-end',
  },
  item: {
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowOpacity: 0.7,
    shadowColor: '#eee',
    backgroundColor: 'white',
    elevation: 1,
  },
  imageContainer: {
    flex: 0.27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.7,
    paddingVertical: hp(2.5),
    marginLeft: wp(2),
  },

  avatar: {
    height: 65,
    width: 65,
    alignSelf: 'center',
    borderRadius: 13,
  },
  shadowContainer: {
    height: 70,
    width: 70,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#ffff',
    shadowOpacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
  },
});
