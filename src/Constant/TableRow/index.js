import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import CustomText from '../../Constant/CustomText';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import {colors} from '../../utilities';
import {fonts} from '../../utilities/fonts';

export default TableRow = ({
  title,
  value,
  fontSize = 18,
  color = colors.black,
  paddingVertical = 15,
  image = false,
  uri,
  onPress,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: paddingVertical,
        }}>
        <CustomText
          style={{
            fontSize: fontSize,
          }}
          numberOfLines={2}
          title={title}
          type={'medium'}
          color={color}
        />
        <CustomText
          style={{
            fontSize: fontSize,
          }}
          numberOfLines={2}
          title={value}
          type={'large'}
          color={color}>
          {title === 'Temps' && (
            <CustomText
              style={{
                fontSize: 12,
              }}
              numberOfLines={2}
              title={'mins'}
              type={'normal'}
              color={color}
            />
          )}
        </CustomText>

        {image && (
          <TouchableOpacity onPress={onPress}>
            <Image
              source={{
                uri: uri,
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 3,
                borderColor: '#f3f3f3',
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <Divider style={{width: '100%'}} />
    </View>
  );
};
