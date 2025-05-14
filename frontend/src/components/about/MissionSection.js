import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SectionTitle from './SectionTitle';
import ChecklistItem from './ChecklistItem';

/**
 * Mission section component for the About page
 * @param {Object} props Component properties
 * @param {boolean} props.isMobile Whether the screen is in mobile view
 */
const MissionSection = ({ isMobile }) => {
  const missionContainerStyle = [
    styles.container,
    !isMobile && { flexDirection: 'row' }
  ];

  return (
    <View style={styles.section}>
      <View style={missionContainerStyle}>
        <View style={styles.textContainer}>
          <SectionTitle>Nossa Missão</SectionTitle>
          <Text style={styles.text}>
            O Inkspiration nasceu da paixão por arte e da necessidade de criar uma ponte entre
            artistas talentosos e pessoas que desejam eternizar momentos através da tatuagem.
          </Text>
          <Text style={styles.text}>
            Nossa missão é democratizar o acesso à arte da tatuagem, oferecendo uma plataforma
            onde você pode encontrar o artista perfeito para o seu estilo, verificar portfólios,
            ler avaliações e agendar sua sessão com facilidade e segurança.
          </Text>
          
          <View style={styles.checklistContainer}>
            {[
              "Conectar tatuadores e clientes de forma eficiente",
              "Promover artistas talentosos e seus trabalhos",
              "Garantir uma experiência segura e transparente",
              "Elevar o padrão da indústria de tatuagem no Brasil",
            ].map((item, index) => (
              <ChecklistItem key={index} text={item} />
            ))}
          </View>
        </View>
        
        {!isMobile && (
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="image" size={48} color="#d1d5db" />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 32,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'column',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  checklistContainer: {
    marginTop: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default MissionSection; 