import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Logo à esquerda */}
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.logoText}>Inkspiração</Text>
        </TouchableOpacity>
        
        {/* Navegação no centro */}
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Explorar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Sobre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Contato</Text>
          </TouchableOpacity>
        </View>

        {/* Botões à direita */}
        <View style={styles.authContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    maxWidth: 1200,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    paddingVertical: 4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navText: {
    fontSize: 16,
    color: '#666',
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#111',
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 4,
  },
  registerText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default Header;