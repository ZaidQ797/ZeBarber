import {StyleSheet} from 'react-native';
import {size} from '../../utilities';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  ImageBgStyle: {
    flex: 1,
    justifyContent: size.center,
    alignItems: size.center,
  },
  logo: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
});
export {styles};
