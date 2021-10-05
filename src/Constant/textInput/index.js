/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, TextInput} from 'react-native';

export default class UserInput extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          width: this.props.width,
          backgroundColor: this.props.backgroundColor,
          borderRadius: this.props.borderRadius,
          borderWidth: this.props.borderWidth,
          borderColor: this.props.borderColor,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            marginHorizontal: this.props.marginHorizontal,
          }}>
          {/* <View style={{flex: this.props.icon ? 0.85 : 1}}> */}
          <TextInput
            keyboardType={this.props.keyboard}
            // keyboardType={'number-pad'}
            style={this.props.textStyle}
            iconProp={this.props.iconProp}
            textValue={this.props.textValue}
            placeholder={this.props.placeholder}
            secureTextEntry={this.props.secureTextEntry}
            autoCorrect={this.props.autoCorrect}
            autoCapitalize={this.props.autoCapitalize}
            returnKeyType={this.props.returnKeyType}
            placeholderTextColor={this.props.placeholderTextColor}
            underlineColorAndroid="transparent"
            onChangeText={this.props.onChangeText}
            value={this.props.value}
            maxLength={this.props.maxLength}
            textAlignVertical={this.props.textAlignVertical}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            blurOnSubmit={this.props.blurOnSubmit}
            onSubmitEditing={this.onSubmitEditing}
            editable={this.props.editable}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            ref={this.props.inputRef}
          />
        </View>
      </View>
    );
  }
}
