import React from 'react';
import {Text, View} from 'react-native';
import {appImages, colors, hp, wp} from '../../utilities';
import CustomText from '../../Constant/CustomText';

export const Empty = ({visible, title, height = 350, width = 350}) => {
  return visible ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <appImages.empty height={height} width={width} />
      <CustomText
        style={{
          fontSize: 18,
          marginTop: hp(2),
          alignSelf: 'center',
        }}
        title={title}
        type={'medium'}
        color={colors.black}
      />
    </View>
  ) : (
    <></>
  );
};
