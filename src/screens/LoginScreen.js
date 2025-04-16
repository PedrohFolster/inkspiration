import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as formatters from '../utils/formatters';

import Header from '../components/Header';
import LoginForm from '../components/forms/LoginForm';

const API_URL = 'http://localhost:8080';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState('');

  const handleChange = (field, value) => {
    let formattedValue = value;
    
    // Apply CPF formatter
    if (field === 'cpf') {
      formattedValue = formatters.formatCPF(value);
      // Clear error when typing
      setCpfError('');
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleBlur = (field) => {
    if (field === 'cpf' && formData.cpf) {
      if (!formatters.validateCPF(formData.cpf)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError('');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.cpf || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos',
      });
      return;
    }

    if (!formatters.validateCPF(formData.cpf)) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'CPF inválido',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: formData.cpf.replace(/\D/g, ''),
          senha: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400 && data.message.includes('CPF')) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'CPF inválido',
          });
        } else if (response.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'CPF ou senha inválidos',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: data.message || 'Ocorreu um erro ao fazer login',
          });
        }
        return;
      }

      // A resposta é apenas o token como string
      const token = await response.text();

      // Salvar token e dados do usuário
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify({ cpf: formData.cpf }));

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!',
      });

      // Navegar para a tela principal
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um erro ao fazer login. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
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

            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              cpfError={cpfError}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              loading={loading}
            />

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