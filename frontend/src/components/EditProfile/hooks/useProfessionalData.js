import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '../../../services/ApiService';
import toastHelper from '../../../utils/toastHelper';
import { editProfileMessages } from '../messages';

const useProfessionalData = (userData) => {
  const [professionalFormData, setProfessionalFormData] = useState({
    experience: '1-3 anos',
    specialties: {
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
    },
    socialMedia: {
      instagram: '',
      tiktok: '',
      facebook: '',
      twitter: '',
      website: ''
    },
    workHours: [
      {
        day: 'Segunda',
        available: true,
        morning: { enabled: true, start: '07:00', end: '11:00' },
        afternoon: { enabled: true, start: '13:00', end: '20:00' }
      },
      {
        day: 'Terça',
        available: true,
        morning: { enabled: true, start: '07:00', end: '11:00' },
        afternoon: { enabled: true, start: '13:00', end: '20:00' }
      },
      {
        day: 'Quarta',
        available: true,
        morning: { enabled: true, start: '07:00', end: '11:00' },
        afternoon: { enabled: true, start: '13:00', end: '20:00' }
      },
      {
        day: 'Quinta',
        available: true,
        morning: { enabled: true, start: '07:00', end: '11:00' },
        afternoon: { enabled: true, start: '13:00', end: '20:00' }
      },
      {
        day: 'Sexta',
        available: true,
        morning: { enabled: true, start: '07:00', end: '11:00' },
        afternoon: { enabled: true, start: '13:00', end: '20:00' }
      },
      {
        day: 'Sábado',
        available: false,
        morning: { enabled: false, start: '07:00', end: '11:00' },
        afternoon: { enabled: false, start: '13:00', end: '20:00' }
      },
      {
        day: 'Domingo',
        available: false,
        morning: { enabled: false, start: '07:00', end: '11:00' },
        afternoon: { enabled: false, start: '13:00', end: '20:00' }
      }
    ],
    biography: '',
    portfolioImages: [],
    tiposServico: [],
    tipoServicoSelecionados: {},
    precosServicos: {}
  });

  // Carregar dados profissionais
  const loadProfessionalData = async () => {
    try {
      if (!userData?.idUsuario) {
        toastHelper.showError(editProfileMessages.validations.professionalDataError);
        return;
      }

      const response = await ApiService.get(`/profissional/usuario/${userData.idUsuario}`);
      
      if (response.success && response.data) {
        const data = response.data;
        const { portfolio, endereco, profissional } = data;
        
        // Buscar dados das imagens do portfólio
        let imagens = [];
        if (portfolio?.idPortfolio) {
          try {
            const imagensResponse = await ApiService.get(`/imagem/portfolio/${portfolio.idPortfolio}`);
            if (imagensResponse.success && imagensResponse.data) {
              imagens = imagensResponse.data;
            }
          } catch (error) {
            console.warn('Não foi possível carregar as imagens do portfólio:', error);
          }
        }

        // Buscar tipos de serviço
        let allTiposServico = [];
        let tipoServicoSelecionados = {};
        let precosCarregados = {};
        
        try {
          const tiposServicoResponse = await ApiService.get('/tipo-servico');
          if (tiposServicoResponse.success && tiposServicoResponse.data) {
            allTiposServico = tiposServicoResponse.data;
            
            if (profissional?.idProfissional) {
              const servicosResponse = await ApiService.get(`/profissional/${profissional.idProfissional}/servicos`);
              if (servicosResponse.success && servicosResponse.data) {
                servicosResponse.data.forEach(servico => {
                  tipoServicoSelecionados[servico.tipoServico.tipo] = true;
                  precosCarregados[servico.tipoServico.tipo] = servico.preco ? servico.preco.toString().replace('.', ',') : '';
                });
              }
            }
          }
        } catch (error) {
          console.warn('Não foi possível carregar tipos de serviço:', error);
        }

        // Transformar especialidades
        const specialties = portfolio?.especialidade ? 
          portfolio.especialidade.split(', ').reduce((acc, style) => {
            acc[style] = true;
            return acc;
          }, {
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
          }) : {
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
          };

        // Transformar horários de trabalho
        const workHours = [
          { day: 'Segunda', available: true, morning: { enabled: true, start: '07:00', end: '11:00' }, afternoon: { enabled: true, start: '13:00', end: '20:00' } },
          { day: 'Terça', available: true, morning: { enabled: true, start: '07:00', end: '11:00' }, afternoon: { enabled: true, start: '13:00', end: '20:00' } },
          { day: 'Quarta', available: true, morning: { enabled: true, start: '07:00', end: '11:00' }, afternoon: { enabled: true, start: '13:00', end: '20:00' } },
          { day: 'Quinta', available: true, morning: { enabled: true, start: '07:00', end: '11:00' }, afternoon: { enabled: true, start: '13:00', end: '20:00' } },
          { day: 'Sexta', available: true, morning: { enabled: true, start: '07:00', end: '11:00' }, afternoon: { enabled: true, start: '13:00', end: '20:00' } },
          { day: 'Sábado', available: false, morning: { enabled: false, start: '07:00', end: '11:00' }, afternoon: { enabled: false, start: '13:00', end: '20:00' } },
          { day: 'Domingo', available: false, morning: { enabled: false, start: '07:00', end: '11:00' }, afternoon: { enabled: false, start: '13:00', end: '20:00' } }
        ];

        setProfessionalFormData(prev => ({
          ...prev,
          experience: portfolio?.experiencia || '1-3 anos',
          specialties,
          socialMedia: {
            instagram: portfolio?.instagram || '',
            tiktok: portfolio?.tiktok || '',
            facebook: portfolio?.facebook || '',
            twitter: portfolio?.twitter || '',
            website: portfolio?.website || ''
          },
          workHours,
          biography: portfolio?.descricao || '',
          portfolioImages: (imagens || []).map(img => ({
            uri: img.imagemBase64 || img.imagem,
            base64: img.imagemBase64 || img.imagem,
            type: 'image/jpeg',
            name: `portfolio_${img.idImagem || Date.now()}.jpg`
          })),
          tiposServico: allTiposServico,
          tipoServicoSelecionados,
          precosServicos: precosCarregados
        }));
      }
    } catch (error) {
      toastHelper.showError(editProfileMessages.validations.professionalDataError);
    }
  };

  // Atualizar dados profissionais
  const updateProfessionalData = async () => {
    try {
      const disponibilidades = {};
      professionalFormData.workHours.forEach(day => {
        if (day.available) {
          const horariosDia = [];
          if (day.morning.enabled) {
            horariosDia.push({
              inicio: day.morning.start,
              fim: day.morning.end
            });
          }
          if (day.afternoon.enabled) {
            horariosDia.push({
              inicio: day.afternoon.start,
              fim: day.afternoon.end
            });
          }
          if (horariosDia.length > 0) {
            disponibilidades[day.day] = horariosDia;
          }
        }
      });

      const tiposServicoSelecionados = Object.entries(professionalFormData.tipoServicoSelecionados)
        .filter(([_, selected]) => selected)
        .map(([nome]) => nome);

      const especialidades = Object.entries(professionalFormData.specialties)
        .filter(([_, selected]) => selected)
        .map(([name]) => name)
        .join(', ');

      const portfolioData = {
        descricao: professionalFormData.biography,
        especialidade: especialidades,
        experiencia: professionalFormData.experience,
        instagram: professionalFormData.socialMedia.instagram || null,
        tiktok: professionalFormData.socialMedia.tiktok || null,
        facebook: professionalFormData.socialMedia.facebook || null,
        twitter: professionalFormData.socialMedia.twitter || null,
        website: professionalFormData.socialMedia.website || null
      };

      // Preparar preços formatados para o backend
      const precosFormatados = {};
      Object.entries(professionalFormData.precosServicos || {}).forEach(([tipo, preco]) => {
        if (preco) {
          // Converter vírgula para ponto e garantir formato decimal
          const precoLimpo = typeof preco === 'string' ? preco.replace(',', '.') : preco.toString();
          const precoNumerico = parseFloat(precoLimpo);
          if (!isNaN(precoNumerico) && precoNumerico > 0) {
            precosFormatados[tipo] = precoNumerico;
          }
        }
      });
      
      console.log('LOG: Preços formatados para envio:', precosFormatados);

      const requestData = {
        profissional: {},
        portfolio: portfolioData,
        imagens: professionalFormData.portfolioImages.map(img => ({
          imagemBase64: img.base64
        })),
        disponibilidades,
        tiposServico: tiposServicoSelecionados,
        precosServicos: precosFormatados
      };

      await ApiService.put(`/profissional/usuario/${userData.idUsuario}/atualizar-completo-com-imagens`, requestData);
      toastHelper.showSuccess(editProfileMessages.success.profileUpdated);
      return true;
    } catch (error) {
      // console.error('Erro ao atualizar dados profissionais:', error);
      toastHelper.showError(editProfileMessages.errors.saveProfile);
      return false;
    }
  };

  const handleSpecialtyChange = (specialty) => {
    setProfessionalFormData(prev => ({
      ...prev,
      specialties: {
        ...prev.specialties,
        [specialty]: !prev.specialties[specialty]
      }
    }));
  };
  
  const handleSocialMediaChange = (platform, value) => {
    setProfessionalFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };
  
  const handleWorkHourChange = (index, period, field, value) => {
    const newWorkHours = [...professionalFormData.workHours];
    
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
    
    setProfessionalFormData(prev => ({
      ...prev,
      workHours: newWorkHours
    }));
  };
  
  const handleAddPortfolioImage = () => {
    pickImage('portfolio');
  };
  
  const handleRemovePortfolioImage = (index) => {
    const newImages = [...professionalFormData.portfolioImages];
    newImages.splice(index, 1);
    setProfessionalFormData(prev => ({
      ...prev,
      portfolioImages: newImages
    }));
  };
  
  const pickImage = async (imageType, index = null) => {
    try {
      const imagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
        aspect: [4, 3] // Para portfólio, formato mais livre
      };

      const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
      if (!result.canceled) {
        const selectedImage = result.assets[0];
        const imageUri = selectedImage.uri;
        const imageBase64 = `data:image/jpeg;base64,${selectedImage.base64}`;
        
        if (imageType === 'portfolio') {
          setProfessionalFormData(prev => ({
            ...prev,
            portfolioImages: [
              ...prev.portfolioImages,
              {
                uri: imageUri,
                base64: imageBase64,
                type: 'image/jpeg',
                name: `portfolio_${prev.portfolioImages.length}.jpg`
              }
            ]
          }));
        }
      }
    } catch (error) {
      toastHelper.showError(editProfileMessages.validations.imageSelectionFailed);
    }
  };
  
  const setBiography = (value) => {
    setProfessionalFormData(prev => ({
      ...prev,
      biography: value
    }));
  };

  const handleTipoServicoChange = (tipoNome) => {
    const isSelected = !professionalFormData.tipoServicoSelecionados[tipoNome];
    
    setProfessionalFormData(prev => ({
      ...prev,
      tipoServicoSelecionados: {
        ...prev.tipoServicoSelecionados,
        [tipoNome]: isSelected
      },
      // Se o serviço foi desmarcado, remove o preço
      precosServicos: isSelected ? prev.precosServicos : {
        ...prev.precosServicos,
        [tipoNome]: undefined
      }
    }));
  };
  
  const handlePrecoServicoChange = (tipoNome, valor) => {
    // Limpar caracteres não numéricos exceto vírgula e ponto
    const valorLimpo = valor.replace(/[^\d,.]/, '');
    
    setProfessionalFormData(prev => ({
      ...prev,
      precosServicos: {
        ...prev.precosServicos,
        [tipoNome]: valorLimpo
      }
    }));
  };

  // Carregar dados quando userData mudar
  useEffect(() => {
    if (userData?.role === 'ROLE_PROF') {
      loadProfessionalData();
    }
  }, [userData]);

  return {
    professionalFormData,
    setProfessionalFormData,
    loadProfessionalData,
    updateProfessionalData,
    handleSpecialtyChange,
    handleSocialMediaChange,
    handleWorkHourChange,
    handleAddPortfolioImage,
    handleRemovePortfolioImage,
    pickImage,
    setBiography,
    handleTipoServicoChange,
    handlePrecoServicoChange
  };
};

export default useProfessionalData; 