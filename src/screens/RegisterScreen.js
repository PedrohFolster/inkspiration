import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import * as formatters from '../utils/formatters';

import Header from '../components/Header';
import TabHeader from '../components/ui/TabHeader';
import PersonalForm from '../components/forms/PersonalForm';
import AddressForm from '../components/forms/AddressForm';
import SecurityForm from '../components/forms/SecurityForm';
import FormNavigation from '../components/ui/FormNavigation';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('personal');
  const [isArtist, setIsArtist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cpfError, setCpfError] = useState('');
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    sobrenome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    
    // Endereço
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Senha
    senha: '',
    confirmarSenha: '',
    termsAccepted: false
  });

  const handleChange = (field, value) => {
    let formattedValue = value;
    
    // Apply appropriate formatter based on field type
    switch (field) {
      case 'cpf':
        formattedValue = formatters.formatCPF(value);
        // Clear error when typing
        setCpfError('');
        break;
      case 'cep':
        formattedValue = formatters.formatCEP(value);
        break;
      case 'telefone':
        formattedValue = formatters.formatPhone(value);
        break;
      case 'dataNascimento':
        formattedValue = formatters.formatBirthDate(value);
        break;
      case 'email':
        if (!formatters.validateEmail(value) && value.length > 0) {
          setErrorMessage('Por favor, insira um email válido');
        } else {
          setErrorMessage('');
        }
        break;
    }

    setFormData({
      ...formData,
      [field]: formattedValue,
    });

    // If the field is CEP and has 8 digits (without hyphen), fetch address
    if (field === 'cep' && value.replace(/\D/g, '').length === 8) {
      buscarCep(value);
    }
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

  const buscarCep = async (cep) => {
    try {
      // Remove caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, '');
      
      // URL da API ViaCEP
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (response.data && !response.data.erro) {
        const endereco = response.data;
        
        // Atualiza os campos do formulário com os dados retornados
        setFormData(prev => ({
          ...prev,
          rua: endereco.logradouro || '',
          bairro: endereco.bairro || '',
          cidade: endereco.localidade || '',
          estado: endereco.uf || '',
        }));
      } else {
        console.log('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleNextTab = () => {
    if (activeTab === 'personal') {
      setActiveTab('address');
    } else if (activeTab === 'address') {
      setActiveTab('security');
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'security') {
      setActiveTab('address');
    } else if (activeTab === 'address') {
      setActiveTab('personal');
    }
  };

  const validateForm = () => {
    if (!formData.nome || !formData.sobrenome) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nome e sobrenome são obrigatórios',
      });
      return false;
    }
    
    if (!formData.cpf) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'CPF é obrigatório',
      });
      return false;
    }

    if (!formatters.validateCPF(formData.cpf)) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'CPF inválido',
      });
      return false;
    }
    
    if (!formData.email) {
      setErrorMessage('Email é obrigatório');
      return false;
    }
    
    if (!formData.dataNascimento) {
      setErrorMessage('Data de nascimento é obrigatória');
      return false;
    }
    
    if (!formData.cep || !formData.rua || !formData.numero || !formData.bairro || !formData.cidade || !formData.estado) {
      setErrorMessage('Todos os campos de endereço são obrigatórios');
      return false;
    }
    
    if (!formData.senha || formData.senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const formatDateToBackend = (dateString) => {
    if (!dateString) return null;
    
    // Remove caracteres não numéricos
    const numbers = dateString.replace(/\D/g, '');
    
    // Garantir que a data esteja no formato DD/MM/YYYY
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) {
      const day = numbers.slice(0, 2);
      const month = numbers.slice(2);
      return `${day}/${month}`;
    }
    
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);
    
    // Validar dia (1-31) e mês (1-12)
    const validDay = Math.min(parseInt(day), 31);
    const validMonth = Math.min(parseInt(month), 12);
    
    return `${validDay.toString().padStart(2, '0')}/${validMonth.toString().padStart(2, '0')}/${year}`;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      // Formatar data de nascimento para o formato esperado pelo backend (DD/MM/YYYY)
      const dataNascFormatada = formatDateToBackend(formData.dataNascimento);
      
      // Preparar objeto de endereço conforme esperado pelo backend
      const endereco = {
        cep: formData.cep,
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento || '',
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      };

      // Preparar dados para envio conforme o DTO do backend
      const userData = {
        nome: `${formData.nome} ${formData.sobrenome}`.trim(),
        cpf: formData.cpf.replace(/[^\d]/g, ''), // Remove caracteres não numéricos
        email: formData.email,
        dataNascimento: dataNascFormatada,
        telefone: formData.telefone,
        senha: formData.senha,
        endereco: endereco,
        role: 'user' // Registrando como usuário comum
      };

      const baseUrl = 'http://localhost:8080'; 
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Se houver erros de validação do backend
        if (data.errors) {
          // Exibe cada erro em um toast separado
          Object.entries(data.errors).forEach(([field, message]) => {
            Toast.show({
              type: 'error',
              text1: 'Erro de Validação',
              text2: message,
              position: 'top',
              visibilityTime: 4000,
            });
          });
        } else {
          // Se houver um erro geral
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: data.message || 'Ocorreu um erro ao cadastrar',
            position: 'top',
            visibilityTime: 4000,
          });
        }
        return;
      }

      // Exibe mensagem de sucesso do backend ou uma mensagem padrão
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: data.message || 'Cadastro realizado com sucesso!',
        position: 'top',
        visibilityTime: 4000,
      });

      // Aguarda um momento para mostrar o toast antes de navegar
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um erro ao cadastrar. Tente novamente.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Dados Pessoais' },
    { id: 'address', label: 'Endereço' },
    { id: 'security', label: 'Segurança' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.pageHeaderContainer}>
            <Text style={styles.pageTitle}>Criar Conta</Text>
            <Text style={styles.pageSubtitle}>Registre-se para encontrar os melhores tatuadores</Text>
          </View>
          
          <View style={styles.cardWrapper}>
            <View style={styles.formCard}>
              <View style={styles.tabHeaderWrapper}>
                <TabHeader 
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </View>
              
              <View style={styles.formContainer}>
                {activeTab === 'personal' && (
                  <>
                    <PersonalForm
                      formData={formData}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      cpfError={cpfError}
                      isArtist={isArtist}
                      setIsArtist={setIsArtist}
                    />
                    <FormNavigation
                      onNext={handleNextTab}
                      showPrev={false}
                    />
                  </>
                )}

                {activeTab === 'address' && (
                  <>
                    <AddressForm
                      formData={formData}
                      handleChange={handleChange}
                      buscarCep={buscarCep}
                    />
                    <FormNavigation
                      onPrev={handlePrevTab}
                      onNext={handleNextTab}
                    />
                  </>
                )}

                {activeTab === 'security' && (
                  <SecurityForm
                    formData={formData}
                    handleChange={handleChange}
                    handleRegister={handleRegister}
                    handlePrevTab={handlePrevTab}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                  />
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>
              Já tem uma conta?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Entrar
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    marginTop: 40,
  },
  pageHeaderContainer: {
    marginBottom: 30,
    alignItems: 'center',
    zIndex: 2,
    marginTop: 30,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    zIndex: 1,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    padding: 15,
  },
  tabHeaderWrapper: {
    marginBottom: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#f8f8f8',
    width: '100%',
  },
  formContainer: {
    padding: 30,
  },
  loginPrompt: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
