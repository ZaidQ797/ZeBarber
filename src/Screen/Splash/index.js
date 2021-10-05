//import liraries
import React from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {colors} from '../../utilities';
import {styles} from './styles';
import {appImages, appLogo} from '../../utilities/assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
// create a component
import {useSelector} from 'react-redux';
import {useNavigation, CommonActions} from '@react-navigation/native';
const Splash = () => {
  const {isLoggedIn} = useSelector(state => state.auth);
  const navigation = useNavigation();
  React.useEffect(() => {
    setTimeout(async () => {
      const intro = await AsyncStorage.getItem('intro');

      if (isLoggedIn) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Root'}],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'auth'}],
          }),
        );
      }
    }, 2000);
  }, []);
  return (
    <ImageBackground style={styles.container} source={appImages.splash}>
      <Image source={appLogo.appLogo} style={styles.logo} />
    </ImageBackground>
  );
};
//make this component available to the app
export {Splash};
