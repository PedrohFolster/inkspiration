import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Checkbox from '../components/ui/Checkbox';
import theme from '../themes/theme';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Login:', formData);
    // Implementar lógica de login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Header />
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Entrar</Text>
              <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.formFieldGroup}>
                <Text style={styles.formLabel}>CPF</Text>
                <Input
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChangeText={(text) => handleChange('cpf', text)}
                  keyboardType="numeric"
                  style={styles.inputField}
                />
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

              <Button onPress={handleSubmit} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Entrar</Text>
              </Button>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Não tem uma conta?{' '}
                <Text 
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                >
                  Registre-se
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  formFieldGroup: {
    marginBottom: 24,
  },
  passwordContainer: {
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
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    color: '#000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 