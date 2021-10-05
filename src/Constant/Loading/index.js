import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Overlay} from 'react-native-elements';
import {colors} from '../../utilities/colors';
export const Loading = ({visible}) => (
  <Overlay
    isVisible={visible}
    overlayStyle={{
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      width: 100,
    }}>
    <ActivityIndicator
      animating
      color={colors.primaryDark}
      // style={visible ? loader.centering : loader.hideIndicator}
      size="large"
    />
  </Overlay>
);
const loader = StyleSheet.create({
  centering: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 70,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  hideIndicator: {
    position: 'absolute',
    top: -100,
    opacity: 0,
  },
});
