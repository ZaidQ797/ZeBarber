import NetInfo from '@react-native-community/netinfo';

export const isConnected = async () => {
  const {isConnected} = await NetInfo.fetch();
  return isConnected;
};
