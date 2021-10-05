import {StyleSheet} from 'react-native';
import {colors, hp} from '../../utilities';
const SIZE = hp(8);
const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    width: SIZE,
    borderWidth: 5,
    height: SIZE,
    borderRadius: SIZE / 2,
    bottom: SIZE / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBg: {
    // backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 20,
    height: 70,
    bottom: 0,
    paddingHorizontal: 19,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
export {styles};
