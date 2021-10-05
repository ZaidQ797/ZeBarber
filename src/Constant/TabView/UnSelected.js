//import liraries
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {styles} from './Styles';
import {Icon} from 'react-native-elements';
// create a component
const UnSelected = ({name}) => {
  return (
    <View style={styles.elseTab}>
      <Icon
        raised
        name="heartbeat"
        type="font-awesome"
        color="#f50"
        // onPress={() => ('hello')}
      />
    </View>
  );
};

//make this component available to the app
export {UnSelected};
