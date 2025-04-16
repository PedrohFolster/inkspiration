import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import theme from '../../themes/theme';

const PersonalForm = ({ 
  formData, 
  handleChange, 
  handleBlur, 
  cpfError, 
  isArtist, 
  setIsArtist 
}) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  inputField: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  checkboxWrapper: {
    marginVertical: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PersonalForm; 