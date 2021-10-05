import React from 'react';
import {Text, View, RefreshControl} from 'react-native';
import {colors} from '../../utilities';
const Refresh = ({isRefreshing, onRefresh}) => (
  <RefreshControl
    refreshing={isRefreshing}
    onRefresh={onRefresh}
    title="S'il vous plaît, attendez..."
    tintColor={colors.primaryDark}
    titleColor={colors.primaryDark}
  />
);

export default Refresh;
