import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Checkbox = ({ checked, onPress, label, disabled }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled
      ]}>
        {checked && (
          <Feather name="check" size={15} color="#fff" />
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default Checkbox; 