import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import Header from '../components/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Checkbox from '../components/ui/Checkbox';
import theme from '../themes/theme';
// Importante: Certifique-se de instalar o axios antes de usar
// Para instalar: npm install axios
import axios from 'axios';
import * as formatters from '../utils/formatters';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
    
    // Profissional (para artistas)
    experiencia: '1-3',
    bio: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    twitter: '',
    website: '',
    
    // Senha
    senha: '',
    confirmarSenha: '',
    termsAccepted: false
  });

  // Adicionar estados para gerenciar portfólio e horários
  const [portfolioImages, setPortfolioImages] = useState([
    '/placeholder.svg',
    '/placeholder.svg',
  ]);
  
  const [operatingHours, setOperatingHours] = useState([
    {
      day: "Segunda",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Terça",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Quarta",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Quinta",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Sexta",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Sábado",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
    {
      day: "Domingo",
      open: false,
      morningOpen: false,
      morningStart: "08:00",
      morningEnd: "12:00",
      afternoonOpen: false,
      afternoonStart: "13:00",
      afternoonEnd: "18:00",
    },
  ]);

  // Funções para gerenciar o portfólio e horários
  const handleAddPortfolioImage = () => {
    setPortfolioImages([...portfolioImages, '/placeholder.svg']);
  };

  const handleRemovePortfolioImage = (index) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  const handleHoursChange = (index, field, value) => {
    const newHours = [...operatingHours];

    // Se estiver desativando a disponibilidade do dia, desmarque manhã e tarde também
    if (field === "open" && value === false) {
      newHours[index] = {
        ...newHours[index],
        open: false,
        morningOpen: false,
        afternoonOpen: false,
      };
    } else {
      newHours[index] = { ...newHours[index], [field]: value };
    }

    setOperatingHours(newHours);
  };

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
      if (isArtist) {
        setActiveTab('professional');
      } else {
        setActiveTab('security');
      }
    } else if (activeTab === 'professional') {
      setActiveTab('portfolio');
    } else if (activeTab === 'portfolio') {
      setActiveTab('hours');
    } else if (activeTab === 'hours') {
      setActiveTab('security');
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'security') {
      if (isArtist) {
        setActiveTab('hours');
      } else {
        setActiveTab('address');
      }
    } else if (activeTab === 'address') {
      setActiveTab('personal');
    } else if (activeTab === 'professional') {
      setActiveTab('address');
    } else if (activeTab === 'portfolio') {
      setActiveTab('professional');
    } else if (activeTab === 'hours') {
      setActiveTab('portfolio');
    }
  };

  // Função para renderizar as abas de navegação
  const renderTabHeader = () => {
    // Determinar quais abas exibir com base no tipo de usuário
    const tabs = isArtist 
      ? [
          { id: 'personal', label: 'Dados Pessoais' },
          { id: 'address', label: 'Endereço Comercial' },
          { id: 'professional', label: 'Profissional' },
          { id: 'portfolio', label: 'Portfólio' },
          { id: 'hours', label: 'Horários' },
          { id: 'security', label: 'Segurança' }
        ]
      : [
          { id: 'personal', label: 'Dados Pessoais' },
          { id: 'address', label: 'Endereço' },
          { id: 'security', label: 'Segurança' }
        ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContainer}
      >
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.activeTabItem,
                isArtist && styles.artistTabItem
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
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

  const renderPersonalTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nome</Text>
            <Input
              placeholder="Seu nome"
              value={formData.nome}
              onChangeText={(text) => handleChange('nome', text)}
              style={styles.inputField}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Sobrenome</Text>
            <Input
              placeholder="Seu sobrenome"
              value={formData.sobrenome}
              onChangeText={(text) => handleChange('sobrenome', text)}
              style={styles.inputField}
            />
          </View>
        </View>
        
        <View style={styles.formFullWidth}>
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
        
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <Input
              placeholder="seu@email.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              style={styles.inputField}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Telefone</Text>
            <Input
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={formData.telefone}
              onChangeText={(text) => handleChange('telefone', text)}
              style={styles.inputField}
            />
          </View>
        </View>

        <View style={styles.formFullWidth}>
          <Text style={styles.formLabel}>Data de Nascimento</Text>
          <Input
            placeholder="DD/MM/AAAA"
            value={formData.dataNascimento}
            onChangeText={(text) => handleChange('dataNascimento', text)}
            keyboardType="numeric"
            style={styles.inputField}
          />
        </View>

        <View style={styles.checkboxWrapper}>
          <Checkbox
            checked={isArtist}
            onPress={() => setIsArtist(!isArtist)}
            label="Cadastrar-se como artista/profissional"
          />
        </View>
        
        <View style={styles.buttonsRow}>
          <View style={styles.buttonSpaceFill} />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNextTab}
          >
            <Text style={styles.primaryButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAddressTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CEP</Text>
            <Input
              placeholder="00000-000"
              value={formData.cep}
              onChangeText={(text) => handleChange('cep', text)}
              keyboardType="numeric"
              style={styles.inputField}
              maxLength={9}
            />
            <Text style={styles.helperText}>Digite o CEP para preenchimento automático</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Estado</Text>
            <Input
              placeholder="UF"
              value={formData.estado}
              onChangeText={(text) => handleChange('estado', text)}
              style={styles.inputField}
              maxLength={2}
            />
          </View>
        </View>
        
        <View style={styles.formFullWidth}>
          <Text style={styles.formLabel}>Rua</Text>
          <Input
            placeholder="Sua rua"
            value={formData.rua}
            onChangeText={(text) => handleChange('rua', text)}
            style={styles.inputField}
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Número</Text>
            <Input
              placeholder="123"
              keyboardType="numeric"
              value={formData.numero}
              onChangeText={(text) => handleChange('numero', text)}
              style={styles.inputField}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Complemento</Text>
            <Input
              placeholder="Apto, bloco, etc."
              value={formData.complemento}
              onChangeText={(text) => handleChange('complemento', text)}
              style={styles.inputField}
            />
          </View>
        </View>
        
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Bairro</Text>
            <Input
              placeholder="Seu bairro"
              value={formData.bairro}
              onChangeText={(text) => handleChange('bairro', text)}
              style={styles.inputField}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Cidade</Text>
            <Input
              placeholder="Sua cidade"
              value={formData.cidade}
              onChangeText={(text) => handleChange('cidade', text)}
              style={styles.inputField}
            />
          </View>
        </View>
        
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePrevTab}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNextTab}
          >
            <Text style={styles.primaryButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProfessionalTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
        <Text style={styles.sectionSubtitle}>
          Conte-nos sobre sua experiência como tatuador.
        </Text>
        
        <View style={styles.formGroup}>
          <View style={styles.formField}>
            <Text style={styles.label}>Experiência</Text>
            <View style={styles.experienceSelector}>
              {["1-3", "3-5", "5-10", "10+"].map((exp) => (
                <TouchableOpacity
                  key={exp}
                  style={[
                    styles.experienceOption,
                    formData.experiencia === exp && styles.experienceOptionActive,
                  ]}
                  onPress={() => handleChange("experiencia", exp)}
                >
                  <Text
                    style={[
                      styles.experienceOptionText,
                      formData.experiencia === exp && styles.experienceOptionTextActive,
                    ]}
                  >
                    {exp === "10+" ? "10+ anos" : `${exp} anos`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Redes Sociais</Text>
            
            <View style={styles.socialInput}>
              <Feather name="instagram" size={20} color={theme.colors.light.mutedForeground} style={styles.socialIcon} />
              <Input
                placeholder="@seu_instagram"
                value={formData.instagram}
                onChangeText={(text) => handleChange('instagram', text)}
                style={styles.socialField}
              />
            </View>
            
            <View style={styles.socialInput}>
              <Feather name="video" size={20} color={theme.colors.light.mutedForeground} style={styles.socialIcon} />
              <Input
                placeholder="@seu_tiktok"
                value={formData.tiktok}
                onChangeText={(text) => handleChange('tiktok', text)}
                style={styles.socialField}
              />
            </View>
            
            <View style={styles.socialInput}>
              <Feather name="facebook" size={20} color={theme.colors.light.mutedForeground} style={styles.socialIcon} />
              <Input
                placeholder="facebook.com/seuperfil"
                value={formData.facebook}
                onChangeText={(text) => handleChange('facebook', text)}
                style={styles.socialField}
              />
            </View>
            
            <View style={styles.socialInput}>
              <Feather name="twitter" size={20} color={theme.colors.light.mutedForeground} style={styles.socialIcon} />
              <Input
                placeholder="@seu_twitter"
                value={formData.twitter}
                onChangeText={(text) => handleChange('twitter', text)}
                style={styles.socialField}
              />
            </View>
            
            <View style={styles.socialInput}>
              <Feather name="globe" size={20} color={theme.colors.light.mutedForeground} style={styles.socialIcon} />
              <Input
                placeholder="www.seusite.com"
                value={formData.website}
                onChangeText={(text) => handleChange('website', text)}
                style={styles.socialField}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button onPress={handlePrevTab} variant="outline" style={styles.backButton}>
            Voltar
          </Button>
          <Button onPress={handleNextTab} style={styles.nextButton}>
            Próximo
          </Button>
        </View>
      </View>
    );
  };

  const renderPasswordTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Senha</Text>
            <Input
              placeholder="••••••••"
              secureTextEntry
              value={formData.senha}
              onChangeText={(text) => handleChange('senha', text)}
              style={styles.inputField}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Confirmar Senha</Text>
            <Input
              placeholder="••••••••"
              secureTextEntry
              value={formData.confirmarSenha}
              onChangeText={(text) => handleChange('confirmarSenha', text)}
              style={styles.inputField}
            />
          </View>
        </View>

        <View style={styles.checkboxWrapper}>
          <Checkbox
            checked={formData.termsAccepted}
            onPress={() => handleChange('termsAccepted', !formData.termsAccepted)}
            label="Eu aceito os Termos de Uso e a Política de Privacidade"
          />
        </View>
        
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePrevTab}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Criando...' : 'Criar Conta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPortfolioTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Portfólio</Text>
        <Text style={styles.sectionSubtitle}>
          Adicione imagens do seu trabalho para mostrar aos clientes.
        </Text>
        
        <View style={styles.portfolioHeader}>
          <Text style={styles.label}>Imagens do portfólio</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPortfolioImage}>
            <Feather name="plus" size={18} color={theme.colors.light.foreground} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.portfolioGrid}>
          {portfolioImages.map((image, index) => (
            <View key={index} style={styles.portfolioItem}>
              <View style={styles.imageContainer}>
                <Image 
                  source={typeof image === 'string' ? { uri: image } : image} 
                  style={styles.portfolioImage}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemovePortfolioImage(index)}
                >
                  <Feather name="x" size={18} color={theme.colors.light.foreground} />
                </TouchableOpacity>
                <View style={styles.imageOverlay}>
                  <TouchableOpacity style={styles.uploadButton}>
                    <Feather name="upload" size={18} color={theme.colors.light.foreground} />
                    <Text style={styles.uploadButtonText}>Alterar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button onPress={handlePrevTab} variant="outline" style={styles.backButton}>
            Voltar
          </Button>
          <Button onPress={handleNextTab} style={styles.nextButton}>
            Próximo
          </Button>
        </View>
      </View>
    );
  };

  const renderHoursTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Horários</Text>
        <Text style={styles.sectionSubtitle}>
          Configure os horários em que você está disponível para atender.
        </Text>
        
        <ScrollView style={styles.hoursContainer}>
          {operatingHours.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.day}</Text>
                <View style={styles.dayCheckbox}>
                  <Checkbox
                    checked={day.open}
                    onPress={() => handleHoursChange(index, "open", !day.open)}
                    label="Disponível"
                  />
                </View>
              </View>
              
              {day.open && (
                <View style={styles.daySchedule}>
                  <View style={styles.periodContainer}>
                    <View style={styles.periodHeader}>
                      <Checkbox
                        checked={day.morningOpen}
                        onPress={() =>
                          handleHoursChange(index, "morningOpen", !day.morningOpen)
                        }
                        label="Manhã"
                      />
                    </View>
                    
                    {day.morningOpen && (
                      <View style={styles.hoursInput}>
                        <Input
                          value={day.morningStart}
                          onChangeText={(text) =>
                            handleHoursChange(index, "morningStart", text)
                          }
                          style={styles.timeInput}
                        />
                        <Text style={styles.timeText}>até</Text>
                        <Input
                          value={day.morningEnd}
                          onChangeText={(text) =>
                            handleHoursChange(index, "morningEnd", text)
                          }
                          style={styles.timeInput}
                        />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.periodContainer}>
                    <View style={styles.periodHeader}>
                      <Checkbox
                        checked={day.afternoonOpen}
                        onPress={() =>
                          handleHoursChange(index, "afternoonOpen", !day.afternoonOpen)
                        }
                        label="Tarde"
                      />
                    </View>
                    
                    {day.afternoonOpen && (
                      <View style={styles.hoursInput}>
                        <Input
                          value={day.afternoonStart}
                          onChangeText={(text) =>
                            handleHoursChange(index, "afternoonStart", text)
                          }
                          style={styles.timeInput}
                        />
                        <Text style={styles.timeText}>até</Text>
                        <Input
                          value={day.afternoonEnd}
                          onChangeText={(text) =>
                            handleHoursChange(index, "afternoonEnd", text)
                          }
                          style={styles.timeInput}
                        />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          <Button onPress={handlePrevTab} variant="outline" style={styles.backButton}>
            Voltar
          </Button>
          <Button onPress={handleNextTab} style={styles.nextButton}>
            Próximo
          </Button>
        </View>
      </View>
    );
  };

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
                {renderTabHeader()}
              </View>
              
              <View style={styles.formContainer}>
                {activeTab === 'personal' && renderPersonalTab()}
                {activeTab === 'address' && renderAddressTab()}
                {activeTab === 'professional' && isArtist && renderProfessionalTab()}
                {activeTab === 'portfolio' && isArtist && renderPortfolioTab()}
                {activeTab === 'hours' && isArtist && renderHoursTab()}
                {activeTab === 'security' && renderPasswordTab()}
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
  tabsScrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 0,
    width: '100%',
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    flex: 1,
  },
  artistTabItem: {
    flex: 1,
    width: 110,
    minWidth: 110,
    paddingHorizontal: 5,
  },
  activeTabItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderBottomColor: '#eaeaea',
  },
  tabText: {
    fontSize: 13.5,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#111',
  },
  formContainer: {
    padding: 30,
  },
  tabContent: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: -10,
  },
  formGroup: {
    flex: 1,
    marginHorizontal: 10,
  },
  formFullWidth: {
    marginBottom: 24,
  },
  formLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  checkboxWrapper: {
    marginVertical: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  buttonSpaceFill: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 12,
  },
  secondaryButtonText: {
    color: '#111',
    fontSize: 16,
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
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.light.foreground,
    marginBottom: theme.spacing[2],
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.light.mutedForeground,
    marginBottom: theme.spacing[4],
  },
  experienceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  experienceOption: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[1],
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.md,
    marginRight: theme.spacing[2],
    alignItems: 'center',
  },
  experienceOptionActive: {
    backgroundColor: theme.colors.light.primary,
    borderColor: theme.colors.light.primary,
  },
  experienceOptionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.light.foreground,
  },
  experienceOptionTextActive: {
    color: theme.colors.light.primaryForeground,
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  socialIcon: {
    marginRight: theme.spacing[2],
  },
  socialField: {
    flex: 1,
  },
  bioContainer: {
    marginBottom: theme.spacing[4],
  },
  bioInput: {
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing[3],
    minHeight: 150,
    textAlignVertical: 'top',
    color: theme.colors.light.foreground,
    fontSize: theme.fontSizes.md,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.md,
  },
  addButtonText: {
    marginLeft: theme.spacing[2],
    fontSize: theme.fontSizes.sm,
    color: theme.colors.light.foreground,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  portfolioItem: {
    width: '48%',
    marginBottom: theme.spacing[4],
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    backgroundColor: theme.colors.light.background + '80',
    borderRadius: 9999,
    padding: 6,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.light.background + '50',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light.card,
    padding: theme.spacing[2],
    borderRadius: theme.radius.md,
  },
  uploadButtonText: {
    marginLeft: theme.spacing[2],
    fontSize: theme.fontSizes.sm,
    color: theme.colors.light.foreground,
  },
  profileImageContainer: {
    marginBottom: theme.spacing[4],
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    padding: theme.spacing[6],
    alignItems: 'center',
  },
  uploadText: {
    marginTop: theme.spacing[2],
    fontSize: theme.fontSizes.sm,
    color: theme.colors.light.mutedForeground,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.light.mutedForeground,
    marginTop: theme.spacing[1],
  },
  selectImageButton: {
    marginTop: theme.spacing[4],
    backgroundColor: theme.colors.light.muted,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.md,
  },
  selectImageText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.light.foreground,
  },
  hoursContainer: {
    marginTop: theme.spacing[4],
  },
  dayCard: {
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.light.muted + '20',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  dayTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.light.foreground,
  },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daySchedule: {
    marginTop: theme.spacing[2],
  },
  periodContainer: {
    marginBottom: theme.spacing[4],
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  hoursInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timeInput: {
    width: 100,
  },
  timeText: {
    marginHorizontal: theme.spacing[2],
    color: theme.colors.light.foreground,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing[2],
  },
  backButton: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  nextButton: {
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  termsCheckbox: {
    marginVertical: theme.spacing[4],
  },
  formColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  formColumn: {
    width: '48%',
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
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ef9a9a',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  inputError: {
    borderColor: '#ff0000',
  },
});

export default RegisterScreen;
