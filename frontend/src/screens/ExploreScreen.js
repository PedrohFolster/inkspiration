import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Footer from '../components/Footer';
import Input from '../components/ui/Input';
import SearchInput from '../components/ui/SearchInput';
import FilterButton from '../components/FilterButton';
import { artists as originalArtists } from '../data/artists';
import Button from '../components/ui/Button';

// Componentes de exploração
import FiltersPanel from '../components/explore/FiltersPanel';
import ActiveFilters from '../components/common/ActiveFilters';
import RelevanceDropdown from '../components/explore/RelevanceDropdown';
import ArtistsGrid from '../components/explore/ArtistsGrid';
import Pagination from '../components/common/Pagination';
import MobileFiltersModal from '../components/common/MobileFiltersModal';
import FilterDropdown from '../components/common/FilterDropdown';

const ExploreScreen = ({ navigation }) => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(15);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('relevancia');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showRelevanceDropdown, setShowRelevanceDropdown] = useState(false);
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [filterButtonPosition, setFilterButtonPosition] = useState({ top: 0, left: 0 });
  const filterButtonRef = useRef(null);
  
  // Estado para resultados filtrados
  const [filteredArtists, setFilteredArtists] = useState(originalArtists);
  const [displayedArtists, setDisplayedArtists] = useState(originalArtists);
  const [currentPage, setCurrentPage] = useState(1);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setScreenWidth(width);
    };
    
    const dimensionsHandler = Dimensions.addEventListener('change', updateLayout);
    
    return () => {
      if (dimensionsHandler?.remove) {
        dimensionsHandler.remove();
      }
    };
  }, []);
  
  // Valores derivados baseados na largura da tela
  const isMobile = screenWidth < 768;
  
  // Update the numColumns calculation to work better on Android
  const numColumns = (() => {
    // Explicitly handle Android differently as it may need wider breakpoints
    if (Platform.OS === 'android') {
      return screenWidth >= 768 ? 3 : (screenWidth >= 360 ? 2 : 1);
    }
    // For web and iOS
    return screenWidth >= 768 ? 3 : (screenWidth >= 480 ? 2 : 1);
  })();

  // Função de busca
  const handleSearch = () => {
    const artistResults = originalArtists.filter((artist) => {
      const matchesSearch = 
        searchTerm === "" || 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = 
        locationTerm === "" || 
        artist.location.toLowerCase().includes(locationTerm.toLowerCase());

      return matchesSearch && matchesLocation;
    });

    setFilteredArtists(artistResults);
    applyFilters(artistResults);
    updateActiveFilters();
    setCurrentPage(1);
  };

  // Aplicar filtros
  const applyFilters = (artists = filteredArtists) => {
    const artistResults = artists.filter((artist) => {
      const matchesRating = artist.rating >= minRating;
      const matchesSpecialties =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((specialty) => artist.specialties.includes(specialty));

      return matchesRating && matchesSpecialties;
    });

    // Aplicar ordenação aos resultados filtrados
    const sortedResults = sortArtists(artistResults);
    
    setDisplayedArtists(sortedResults);
    updateActiveFilters();
  };

  // Atualizar filtros ativos
  const updateActiveFilters = () => {
    const filters = [];
    
    if (minRating > 0) {
      filters.push({ type: 'rating', value: `${minRating}★` });
    }
    
    if (maxDistance !== 15) {
      filters.push({ type: 'distance', value: `Distância: ${maxDistance}km` });
    }
    
    selectedSpecialties.forEach(specialty => {
      filters.push({ type: 'specialty', value: specialty });
    });
    
    setActiveFilters(filters);
  };

  // Alternar seleção de especialidade
  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]
    );
  };

  // Resetar filtros
  const resetFilters = () => {
    setMinRating(0);
    setMaxDistance(15);
    setSelectedSpecialties([]);
    setActiveFilters([]);
  };
  
  // Remover filtro específico
  const removeFilter = (filter) => {
    if (filter.type === 'rating') {
      setMinRating(0);
    } else if (filter.type === 'distance') {
      setMaxDistance(15);
    } else if (filter.type === 'specialty') {
      setSelectedSpecialties(prev => prev.filter(s => s !== filter.value));
    }
    updateActiveFilters();
  };

  // Efeito para aplicar filtros quando eles mudam
  useEffect(() => {
    applyFilters();
  }, [minRating, selectedSpecialties]);

  // Função para ordenar os artistas com base no critério de ordenação
  const sortArtists = (artists) => {
    const sortedArtists = [...artists];
    
    if (sortBy === 'melhorAvaliacao') {
      sortedArtists.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'maisRecente') {
      sortedArtists.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else {
      sortedArtists.sort((a, b) => {
        // Primeiro por avaliação
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
        
        // Em caso de empate, ordenar por nome
        return a.name.localeCompare(b.name);
      });
    }
    
    return sortedArtists;
  };
  
  // Efeito para reordenar artistas quando o critério de ordenação muda
  useEffect(() => {
    setDisplayedArtists(sortArtists(displayedArtists));
  }, [sortBy]);

  // Efeito para fechar o dropdown quando o usuário clicar fora dele
  useEffect(() => {
    const handlePressOutside = () => {
      if (showRelevanceDropdown) {
        setShowRelevanceDropdown(false);
      }
    };

    // Em React Native para Web poderia usar esse approach
    if (Platform?.OS === 'web' && typeof document !== 'undefined') {
      if (showRelevanceDropdown) {
        document.addEventListener('mousedown', handlePressOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handlePressOutside);
      };
    }

    return () => {};
  }, [showRelevanceDropdown]);

  // Função para lidar com o clique no botão de filtros
  const handleFilterPress = () => {
    if (isMobile) {
      setShowFiltersModal(true);
    } else {
      if (filterButtonRef.current) {
        filterButtonRef.current.measureInWindow((x, y, width, height) => {
          setFilterButtonPosition({ top: y, left: x });
          setIsFilterDropdownVisible(true);
        });
      } else {
        setIsFilterDropdownVisible(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Título da página */}
          <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
            <Text style={styles.title}>Explorar Artistas</Text>
          </View>
          
          {/* Layout principal */}
          <View style={[styles.mainContainer, isMobile && styles.mainContainerMobile]}>
            {/* Coluna de filtros (esquerda) */}
            {!isMobile && (
              <FiltersPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                locationTerm={locationTerm}
                setLocationTerm={setLocationTerm}
                minRating={minRating}
                setMinRating={setMinRating}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                selectedSpecialties={selectedSpecialties}
                toggleSpecialty={toggleSpecialty}
                handleSearch={handleSearch}
                resetFilters={resetFilters}
                updateActiveFilters={updateActiveFilters}
              />
            )}
            
            {/* Coluna de artistas (direita) */}
            <View style={[styles.artistsColumn, isMobile && styles.artistsColumnMobile]}>
              {/* Linha separadora para dispositivos móveis */}
              {isMobile && <View style={styles.separator} />}
              
              {/* Adicionar inputs de busca para dispositivos móveis */}
              {isMobile && (
                <View style={styles.mobileSearchContainer}>
                  <View style={styles.mobileInputWrapper}>
                    <SearchInput
                      icon="search"
                      placeholder="Buscar artistas"
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                    />
                  </View>
                  
                  <View style={styles.mobileInputWrapper}>
                    <SearchInput
                      icon="location-on"
                      placeholder="Sua localização"
                      value={locationTerm}
                      onChangeText={setLocationTerm}
                    />
                  </View>
                  
                  <Button 
                    variant="primary"
                    label="Buscar"
                    onPress={handleSearch}
                    style={styles.mobileSearchButton}
                    size="search"
                    fullWidth={true}
                  />
                </View>
              )}
              
              {/* Filtros e dropdown de relevância */}
              <View style={styles.filtersAndRelevanceRow}>
                {/* Lado esquerdo - Filtros */}
                <View style={styles.filtersContainer}>
                  {isMobile && (
                    <View ref={filterButtonRef}>
                      <FilterButton 
                        onPress={handleFilterPress} 
                        filterCount={activeFilters.length} 
                      />
                    </View>
                  )}
                  
                  {/* Filtros ativos (sempre visíveis) */}
                  <View style={styles.activeFiltersContainer}>
                    <ActiveFilters 
                      activeFilters={activeFilters} 
                      removeFilter={removeFilter} 
                      resetFilters={resetFilters} 
                    />
                  </View>
                </View>
                
                {/* Lado direito - Dropdown de relevância */}
                <View style={styles.relevanceContainer}>
                  <RelevanceDropdown 
                    sortBy={sortBy} 
                    setSortBy={setSortBy} 
                    showDropdown={showRelevanceDropdown} 
                    setShowDropdown={setShowRelevanceDropdown} 
                  />
                </View>
              </View>
              
              {/* Grid de artistas */}
              <View style={styles.artistsGridContainer}>
                <ArtistsGrid 
                  artists={displayedArtists} 
                  numColumns={numColumns} 
                  navigation={navigation} 
                />
              </View>
              
              {/* Paginação */}
              {displayedArtists.length > 0 && (
                <Pagination 
                  currentPage={currentPage} 
                  setCurrentPage={setCurrentPage} 
                />
              )}
            </View>
          </View>
        </View>
        
        <Footer />
      </ScrollView>
      
      {/* Modal de filtros para dispositivos móveis */}
      <MobileFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        locationTerm={locationTerm}
        setLocationTerm={setLocationTerm}
        minRating={minRating}
        setMinRating={setMinRating}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        selectedSpecialties={selectedSpecialties}
        toggleSpecialty={toggleSpecialty}
        handleSearch={handleSearch}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        updateActiveFilters={updateActiveFilters}
      />

      {/* FilterDropdown para desktop/tablet */}
      <FilterDropdown
        visible={isFilterDropdownVisible}
        onClose={() => setIsFilterDropdownVisible(false)}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedSpecialties={selectedSpecialties}
        toggleSpecialty={toggleSpecialty}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        anchorPosition={filterButtonPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  
  // Cabeçalho da página
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageHeaderMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  
  // Layout principal
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mainContainerMobile: {
    flexDirection: 'column',
  },
  
  // Coluna de artistas
  artistsColumn: {
    width: '75%',
    paddingLeft: 16,
  },
  artistsColumnMobile: {
    width: '100%',
    paddingLeft: 0,
  },
  
  // Separador
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  
  // Filtros móveis
  mobileFiltersButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  mobileFiltersButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Adicionar inputs de busca para dispositivos móveis
  mobileSearchContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },
  mobileInputWrapper: {
    flex: 1,
    width: '100%',
  },
  mobileSearchButton: {
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  
  // Filtros e dropdown de relevância
  filtersAndRelevanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    zIndex: 100,
    position: 'relative',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    zIndex: 101,
  },
  relevanceContainer: {
    alignItems: 'flex-end',
    zIndex: 101,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  artistsGridContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
});

export default ExploreScreen;