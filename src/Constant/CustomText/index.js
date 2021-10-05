import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {fonts} from '../../utilities/fonts';
import propTypes from 'prop-types';

const CustomText = ({
  title,
  color,
  type,
  textAlign,
  style,
  numberOfLines,
  children,
  onPress,
  size,
}) => {
  const {normalStyle, semiBoldStyle, boldStyle} = styles;
  const textStyle =
    type === 'normal'
      ? normalStyle
      : type === 'medium'
      ? semiBoldStyle
      : boldStyle;
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[textStyle, style, {color, textAlign}]}>
      {title}
      {children}
    </Text>
  );
};

const margin = 10;
const styles = StyleSheet.create({
  normalStyle: {
    fontFamily: fonts.WorkSansRegular,
    fontSize: 14,
    //  margin,
  },
  semiBoldStyle: {
    fontFamily: fonts.WorkSansMedium,
    fontSize: 16,
    // margin,
  },
  boldStyle: {
    fontFamily: fonts.WorkSansBold,
    fontSize: 16,
    // margin,
  },
});

CustomText.propTypes = {
  type: propTypes.string,
  color: propTypes.string,
  title: propTypes.string,
  textAlign: propTypes.string,
  style: propTypes.any,
  size: propTypes.number,
};

export default CustomText;
