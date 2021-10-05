import {Appearance} from 'react-native';

export const getColorScheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? true : false;
};
