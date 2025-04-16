import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const toastConfig = {
  success: (props) => (
    <View style={[styles.toast, styles.successToast]}>
      <Text style={styles.text1}>{props.text1}</Text>
      <Text style={styles.text2}>{props.text2}</Text>
    </View>
  ),
  error: (props) => (
    <View style={[styles.toast, styles.errorToast]}>
      <Text style={styles.text1}>{props.text1}</Text>
      <Text style={styles.text2}>{props.text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: '#4CAF50',
  },
  errorToast: {
    backgroundColor: '#F44336',
  },
  text1: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text2: {
    color: 'white',
    fontSize: 14,
  },
});

export default toastConfig; 