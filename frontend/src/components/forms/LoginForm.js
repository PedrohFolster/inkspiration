import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

const LoginForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  handleSubmit, 
  cpfError, 
  rememberMe, 
  setRememberMe, 
  loading 
}) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.form}>
      <View style={styles.formFieldGroup}>
        <Text style={styles.formLabel}>CPF</Text>
        <Input
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChangeText={(text) => handleChange('cpf', text)}
          onBlur={() => handleBlur('cpf')}
          keyboardType="numeric"
          style={[styles.inputField, cpfError && styles.inputError]}
        />
        {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}
      </View>

      <View style={styles.formFieldGroup}>
        <View style={styles.passwordHeader}>
          <Text style={styles.formLabel}>Senha</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
        <Input
          placeholder="••••••••"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
          style={styles.inputField}
        />
      </View>

      <View style={styles.checkboxWrapper}>
        <Checkbox
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
          label="Lembrar de mim"
        />
      </View>

      <Button 
        variant="primary"
        label={loading ? "" : "Entrar"}
        onPress={handleSubmit} 
        style={styles.primaryButton}
        fullWidth={true}
      >
        {loading && <ActivityIndicator color="#fff" />}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 30,
  },
  formFieldGroup: {
    marginBottom: 24,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'underline',
  },
  checkboxWrapper: {
    marginBottom: 24,
  },
  inputField: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default LoginForm; 