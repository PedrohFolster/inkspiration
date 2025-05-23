import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import TabHeader from '../components/ui/TabHeader';
import Button from '../components/ui/Button';
import FormNavigation from '../components/ui/FormNavigation';
import toastHelper from '../utils/toastHelper';
import { TimeInput } from '../components/TimeInput';

const ProfessionalRegisterScreen = () => {
  const navigation = useNavigation();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [showExperienceOptions, setShowExperienceOptions] = useState(false);
  const [experienceDropdownOpen, setExperienceDropdownOpen] = useState(false);
  
  // Estados para as informações básicas
  const [experience, setExperience] = useState('1-3 anos');
  const [specialties, setSpecialties] = useState({
    Tradicional: false,
    Blackwork: false,
    'Neo-Tradicional': false,
    Fineline: false,
    Realista: false,
    Geométrico: false,
    Minimalista: false,
    Aquarela: false,
    Japonês: false,
    'Old School': false
  });
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    tiktok: '',
    facebook: '',
    twitter: '',
    website: ''
  });
  
  // Estado para horários de trabalho
  const [workHours, setWorkHours] = useState([
    {
      day: 'Segunda',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: true,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Terça',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: true,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Quarta',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: true,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Quinta',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: true,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Sexta',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: true,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Sábado',
      available: true,
      morning: {
        enabled: true,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: false,
        start: '13:00',
        end: '18:00'
      }
    },
    {
      day: 'Domingo',
      available: false,
      morning: {
        enabled: false,
        start: '08:00',
        end: '12:00'
      },
      afternoon: {
        enabled: false,
        start: '13:00',
        end: '18:00'
      }
    }
  ]);
  
  // Estado para portfólio
  const [biography, setBiography] = useState('');
  const [portfolioImages, setPortfolioImages] = useState([null, null]);
  const [profileImage, setProfileImage] = useState(null);
  
  // Opções de experiência
  const experienceOptions = [
    'Menos de 1 ano',
    '1-3 anos',
    '3-5 anos',
    '5-10 anos',
    'Mais de 10 anos'
  ];
  
  const dropdownRef = useRef(null);
  
  // Verificar se o usuário está logado
  useEffect(() => {
    if (!userData) {
      navigation.navigate('Login');
    } else if (userData.role === 'ROLE_PROF') {
      navigation.navigate('Home');
    }
  }, [userData, navigation]);
  
  // Fechar dropdown quando clicar fora do componente
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setExperienceDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);
  
  const tabs = [
    { id: 'basic', label: 'Informações Básicas' },
    { id: 'hours', label: 'Horário de Trabalho' },
    { id: 'portfolio', label: 'Portfólio' }
  ];
  
  const handleSpecialtyChange = (specialty) => {
    setSpecialties(prev => ({
      ...prev,
      [specialty]: !prev[specialty]
    }));
  };
  
  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  const handleWorkHourChange = (index, period, field, value) => {
    const newWorkHours = [...workHours];
    
    if (field === 'available') {
      newWorkHours[index].available = value;
      if (!value) {
        newWorkHours[index].morning.enabled = false;
        newWorkHours[index].afternoon.enabled = false;
      }
    }
    else if (period === 'morning' || period === 'afternoon') {
      newWorkHours[index][period][field] = value;
    }
    
    setWorkHours(newWorkHours);
  };
  
  const handleAddPortfolioImage = () => {
    setPortfolioImages([...portfolioImages, null]);
  };
  
  const handleRemovePortfolioImage = (index) => {
    const newImages = [...portfolioImages];
    newImages.splice(index, 1);
    setPortfolioImages(newImages);
  };
  
  const pickImage = async (imageType, index = null) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });
      
      if (!result.canceled) {
        const selectedImage = result.assets[0].uri;
        
        if (imageType === 'portfolio') {
          const newPortfolioImages = [...portfolioImages];
          newPortfolioImages[index] = selectedImage;
          setPortfolioImages(newPortfolioImages);
        } else if (imageType === 'profile') {
          setProfileImage(selectedImage);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  };
  
  const handleNextTab = () => {
    if (activeTab === 'basic') {
      setActiveTab('hours');
    } else if (activeTab === 'hours') {
      setActiveTab('portfolio');
    }
  };
  
  const handlePrevTab = () => {
    if (activeTab === 'hours') {
      setActiveTab('basic');
    } else if (activeTab === 'portfolio') {
      setActiveTab('hours');
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Coletar dados para enviar
      const selectedSpecialties = Object.keys(specialties).filter(key => specialties[key]);
      
      // Preparar horários de trabalho
      const workSchedules = [];
      workHours.forEach(day => {
        if (day.available) {
          if (day.morning.enabled) {
            workSchedules.push({
              hrAtendimento: `${day.day}-${day.morning.start}-${day.morning.end}`
            });
          }
          if (day.afternoon.enabled) {
            workSchedules.push({
              hrAtendimento: `${day.day}-${day.afternoon.start}-${day.afternoon.end}`
            });
          }
        }
      });
      
      // Objeto para enviar à API
      const professionalData = {
        idUsuario: userData?.idUsuario,
        idEndereco: userData?.endereco?.idEndereco,
        experiencia: experience,
        especialidade: selectedSpecialties.join(', '),
        descricao: biography,
        estilosTatuagem: selectedSpecialties,
        instagram: socialMedia.instagram,
        tiktok: socialMedia.tiktok,
        facebook: socialMedia.facebook,
        twitter: socialMedia.twitter,
        website: socialMedia.website,
        disponibilidades: workSchedules
      };
      
      console.log('Dados a serem enviados:', professionalData);
      
      // Aqui você faria o envio para a API
      
      // Simular sucesso após 1.5 segundos
      setTimeout(() => {
        setIsLoading(false);
        toastHelper.showSuccess('Cadastro realizado com sucesso!');
        navigation.navigate('Home');
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error);
      setIsLoading(false);
      toastHelper.showError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
    }
  };
  
  const handleExperienceSelect = (option) => {
    setExperience(option);
    setExperienceDropdownOpen(false);
  };
  
  // Renderizar o conteúdo para informações básicas
  const renderBasicInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Anos de Experiência</Text>
        <View style={styles.dropdownContainer} ref={dropdownRef}>
          <TouchableOpacity 
            style={styles.selectField}
            onPress={() => setExperienceDropdownOpen(!experienceDropdownOpen)}
          >
            <Text>{experience}</Text>
            <Feather name={experienceDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
          </TouchableOpacity>
          
          {experienceDropdownOpen && (
            <View style={styles.dropdownList}>
              {experienceOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    option === experience && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleExperienceSelect(option)}
                >
                  {option === experience && (
                    <View style={{width: 20}}>
                      <Feather name="check" size={16} color="#000" />
                    </View>
                  )}
                  {option !== experience && <View style={{width: 20}} />}
                  <Text 
                    style={option === experience ? styles.dropdownItemTextSelected : styles.dropdownItemText}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Especialidades</Text>
        <View style={styles.checkboxGrid}>
          {Object.entries(specialties).map(([name, checked], index) => (
            <View key={index} style={styles.checkboxItem}>
              <TouchableOpacity 
                style={[styles.checkbox, checked && styles.checkboxChecked]}
                onPress={() => handleSpecialtyChange(name)}
              >
                {checked && <Feather name="check" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Redes Sociais</Text>
        
        <View style={styles.socialInputRow}>
          <Feather name="instagram" size={20} color="#666" />
          <TextInput
            style={styles.socialInput}
            placeholder="@seu_instagram"
            value={socialMedia.instagram}
            onChangeText={(text) => handleSocialMediaChange('instagram', text)}
          />
        </View>
        
        <View style={styles.socialInputRow}>
          <Feather name="music" size={20} color="#666" />
          <TextInput
            style={styles.socialInput}
            placeholder="@seu_tiktok"
            value={socialMedia.tiktok}
            onChangeText={(text) => handleSocialMediaChange('tiktok', text)}
          />
        </View>
        
        <View style={styles.socialInputRow}>
          <Feather name="facebook" size={20} color="#666" />
          <TextInput
            style={styles.socialInput}
            placeholder="facebook.com/seuperfil"
            value={socialMedia.facebook}
            onChangeText={(text) => handleSocialMediaChange('facebook', text)}
          />
        </View>
        
        <View style={styles.socialInputRow}>
          <Feather name="twitter" size={20} color="#666" />
          <TextInput
            style={styles.socialInput}
            placeholder="@seu_twitter"
            value={socialMedia.twitter}
            onChangeText={(text) => handleSocialMediaChange('twitter', text)}
          />
        </View>
        
        <View style={styles.socialInputRow}>
          <Feather name="globe" size={20} color="#666" />
          <TextInput
            style={styles.socialInput}
            placeholder="seusite.com"
            value={socialMedia.website}
            onChangeText={(text) => handleSocialMediaChange('website', text)}
          />
        </View>
      </View>
      
      <FormNavigation
        onNext={handleNextTab}
        showPrev={false}
      />
    </View>
  );
  
  // Renderizar o conteúdo para horários de trabalho
  const renderWorkHours = () => (
    <View style={styles.tabContent}>
      <Text style={styles.workHoursTitle}>Horário de Trabalho</Text>
      <Text style={styles.workHoursSubtitle}>Defina seus horários de disponibilidade para agendamentos.</Text>
      
      <View style={styles.daysContainer}>
        {workHours.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day.day}</Text>
              <View style={styles.availableCheckbox}>
                <TouchableOpacity 
                  style={[styles.checkbox, day.available && styles.checkboxChecked]}
                  onPress={() => handleWorkHourChange(index, null, 'available', !day.available)}
                >
                  {day.available && <Feather name="check" size={16} color="#fff" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Disponível</Text>
              </View>
            </View>
            
            {day.available && (
              <View style={styles.dayHours}>
                <View style={styles.periodRow}>
                  <View style={styles.periodCheckbox}>
                    <TouchableOpacity 
                      style={[styles.checkbox, day.morning.enabled && styles.checkboxChecked]}
                      onPress={() => handleWorkHourChange(index, 'morning', 'enabled', !day.morning.enabled)}
                    >
                      {day.morning.enabled && <Feather name="check" size={16} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>Manhã:</Text>
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <TimeInput
                      value={day.morning.start}
                      onChange={(value) => handleWorkHourChange(index, 'morning', 'start', value)}
                      disabled={!day.morning.enabled}
                    />
                    <Text style={styles.timeInputSeparator}>às</Text>
                    <TimeInput
                      value={day.morning.end}
                      onChange={(value) => handleWorkHourChange(index, 'morning', 'end', value)}
                      disabled={!day.morning.enabled}
                    />
                  </View>
                </View>
                
                <View style={styles.periodRow}>
                  <View style={styles.periodCheckbox}>
                    <TouchableOpacity 
                      style={[styles.checkbox, day.afternoon.enabled && styles.checkboxChecked]}
                      onPress={() => handleWorkHourChange(index, 'afternoon', 'enabled', !day.afternoon.enabled)}
                    >
                      {day.afternoon.enabled && <Feather name="check" size={16} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>Tarde:</Text>
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <TimeInput
                      value={day.afternoon.start}
                      onChange={(value) => handleWorkHourChange(index, 'afternoon', 'start', value)}
                      disabled={!day.afternoon.enabled}
                    />
                    <Text style={styles.timeInputSeparator}>às</Text>
                    <TimeInput
                      value={day.afternoon.end}
                      onChange={(value) => handleWorkHourChange(index, 'afternoon', 'end', value)}
                      disabled={!day.afternoon.enabled}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
      
      <FormNavigation
        onPrev={handlePrevTab}
        onNext={handleNextTab}
      />
    </View>
  );
  
  // Renderizar o conteúdo para portfólio
  const renderPortfolio = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Biografia</Text>
        <TextInput
          style={styles.biographyInput}
          placeholder="Conte sobre sua experiência, estilo e trajetória como tatuador"
          multiline={true}
          numberOfLines={6}
          value={biography}
          onChangeText={setBiography}
        />
      </View>
      
      <View style={styles.formGroup}>
        <View style={styles.portfolioHeader}>
          <Text style={styles.label}>Portfólio de Trabalhos</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddPortfolioImage}
          >
            <Feather name="plus" size={16} color="#000" style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>Adicionar Trabalho</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.portfolioGrid}>
          {portfolioImages.map((image, index) => (
            <View key={index} style={styles.portfolioItem}>
              <TouchableOpacity 
                style={styles.portfolioImageContainer}
                onPress={() => pickImage('portfolio', index)}
              >
                <Image 
                  source={image ? { uri: image } : { uri: 'https://via.placeholder.com/200' }}
                  style={styles.portfolioImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Foto de Perfil</Text>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={() => pickImage('profile')}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="upload" size={24} color="#666" />
              <Text style={styles.profileImageText}>
                Arraste e solte uma imagem aqui, ou clique para selecionar
              </Text>
              <Text style={styles.profileImageSubtext}>
                Recomendado: formato quadrado, máximo 5MB
              </Text>
              <Button
                label="Selecionar Imagem"
                variant="secondary"
                onPress={() => pickImage('profile')}
                size="sm"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <FormNavigation
        onPrev={handlePrevTab}
        onNext={handleSubmit}
        nextText="Finalizar Cadastro"
        isLoading={isLoading}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Cadastro de Profissional</Text>
            <Text style={styles.subtitle}>Cadastre-se como tatuador e atraia mais clientes</Text>
          </View>
          
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <TabHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              
              {activeTab === 'basic' && renderBasicInfo()}
              {activeTab === 'hours' && renderWorkHours()}
              {activeTab === 'portfolio' && renderPortfolio()}
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  cardWrapper: {
    marginHorizontal: 'auto',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
    overflow: 'hidden',
  },
  tabContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  selectField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 2,
    maxHeight: 300,
    zIndex: 1001,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...(Platform.OS === 'web' ? { 
      position: 'absolute', 
      overflow: 'auto',
      width: '100%'
    } : {}),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextSelected: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33.33%',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  socialInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginLeft: 10,
  },
  // Estilos para a aba de horários
  workHoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  workHoursSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  daysContainer: {
    marginBottom: 20,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
  },
  availableCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayHours: {
    marginTop: 12,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  periodCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputSeparator: {
    marginHorizontal: 8,
  },
  // Estilos para a aba de portfólio
  biographyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButtonIcon: {
    marginRight: 5,
  },
  addButtonText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  portfolioItem: {
    width: '50%',
    padding: 8,
  },
  portfolioImageContainer: {
    aspectRatio: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: 200,
  },
  profileImagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileImageText: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#666',
    fontSize: 14,
  },
  profileImageSubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 16,
  },
});

export default ProfessionalRegisterScreen; 