import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArtistCard from '../ArtistCard';

const ArtistsGrid = ({ artists, numColumns, navigation }) => {
  if (artists.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsTitle}>Nenhum resultado encontrado</Text>
        <Text style={styles.noResultsSubtitle}>
          Tente ajustar seus filtros ou termos de busca para encontrar mais resultados.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.artistsGrid}>
      {artists.map((artist) => (
        <TouchableOpacity 
          key={artist.id}
          style={[
            styles.artistCard,
            numColumns === 3 ? { width: '32%', marginHorizontal: '0.66%' } :
            numColumns === 2 ? { width: '48%', marginHorizontal: '1%' } :
            { width: '100%' }
          ]}
          onPress={() => navigation.navigate('Artist', { artistId: artist.id })}
        >
          <ArtistCard artist={artist} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  artistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginTop: 8,
  },
  artistCard: {
    marginBottom: 16,
  },
  noResultsContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ArtistsGrid; 