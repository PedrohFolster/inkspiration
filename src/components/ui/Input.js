import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType,
  multiline,
  numberOfLines,
  style,
  ...props 
}) => {
  return (
    <TextInput
      style={[styles.input, style, multiline && { textAlignVertical: 'top', minHeight: 100 }]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      numberOfLines={multiline ? (numberOfLines || 4) : 1}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});

export default Input; 