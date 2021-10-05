import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {appIcons, colors, hp, wp} from '../../../utilities';
import CustomText from '../../../Constant/CustomText';
import Header from '../../../Constant/Header';
import {useSelector, useDispatch} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';
import {Loading} from '../../../Constant/Loading';
import {getPromo} from '../../../redux/actions/app';
import {Empty} from '../../../Constant/Empty';
import {isConnected} from '../../../Constant/Internet';
import {Alert} from '../../../Constant/Alert';
const Promotions = ({navigation}) => {
  const {promotions} = useSelector(state => state.app);
  const {token} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showAlert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [isRefreshing, setRefresh] = useState(false);

  //GET  AVAILABLE PROMOTIONS
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsub = getPromos();
      return () => unsub;
    }, []),
  );
  const getPromos = async () => {
    if (await isConnected()) {
      new Promise((rsl, rej) => {
        dispatch(getPromo(token, rsl, rej));
      })
        .then(res => {
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      setAlert(true);
      setAlertMsg('');
    }
  };
  //RENDER PROMOTIONS
  const renderPromotions = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          margin: hp(1.3),
          width: wp(90),
          height: 200,
          alignSelf: 'center',
        }}
        activeOpacity={1}>
        <ImageBackground
          imageStyle={{borderRadius: 10}}
          style={{
            flex: 1,
          }}
          source={{
            uri: item.image
              ? item.image
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzSc0E_-ezcw1juku7x_q9rIVtGDEFGDsZnA&usqp=CAU',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000',
              opacity: 0.8,
              borderRadius: 10,
              justifyContent: 'flex-end',
              padding: 10,
            }}>
            <CustomText
              style={{
                fontSize: 14,
                marginBottom: hp(1),
              }}
              title={item.promo_name}
              type={'normal'}
              color={colors.primaryDark}
            />
            <CustomText
              style={{
                fontSize: 24,
              }}
              title={`Utiliser ${item.promo_code} pour obtenir ${item.discount}% désactivé`}
              type={'large'}
              color={colors.white}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  //RENDER EMPTY ILLUSTRATION INCASE NO PROMOTIONS FOUND
  const renderEmpty = () => {
    if (
      promotions?.length == 0 ||
      promotions == [] ||
      promotions == undefined ||
      promotions == null
    ) {
      return <Empty visible={true} title={'Aucune promotion trouvée'} />;
    }
  };
  //REFRESH CONTROL
  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      getPromos();
      setRefresh(false);
    }, 3000);
  };

  //RENDER
  return (
    <View style={styles.main}>
      <Header
        icon={'chevron-left'}
        title={'Promotions'}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.black}>
        <CustomText
          style={{
            fontSize: 20,
            alignSelf: 'center',
            position: 'absolute',
            top: hp(3),
          }}
          title={'Dernières promotions'}
          type={'normal'}
          color={colors.white}
        />

        <View style={styles.white}>
          {promotions?.length > 0 && (
            <FlatList
              data={promotions}
              refreshControl={
                <RefreshControl
                  tintColor={colors.primaryDark}
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
              renderItem={renderPromotions}
              keyExtractor={(item, index) => item + index.toString()}
              showsVerticalScrollIndicator={false}
            />
          )}

          {renderEmpty()}
        </View>
      </View>
      <Loading visible={loading} />
    </View>
  );
};

export default Promotions;

//STYLES
const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#C89632'},

  card: {
    top: hp(-9),
    flex: 1,
    marginHorizontal: wp(4),
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 39,

    borderColor: '#E5E5E5',
    elevation: 5,
    // shadowColor: '#BDBDBD',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // paddingVertical: hp(3),
  },
  profile: {
    position: 'absolute',
    top: hp(7),
    width: '90%',
    // padding: 30,
    paddingTop: '18%',
    marginHorizontal: wp(2),
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    elevation: 5,
    borderRadius: 39,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignSelf: 'center',
  },
  bellContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  black: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    justifyContent: 'flex-end',
  },

  white: {
    flex: 0.9,
    backgroundColor: '#F4F4F4',
    borderTopRightRadius: 39,
    borderTopLeftRadius: 39,
    paddingVertical: hp(3),
  },
});
