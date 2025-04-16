import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import FormNavigation from '../ui/FormNavigation';

const SecurityForm = ({ 
  formData, 
  handleChange, 
  handleRegister, 
  handlePrevTab, 
  isLoading, 
  errorMessage 
}) => {
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
      
      <FormNavigation
        onPrev={handlePrevTab}
        onNext={handleRegister}
        showNext={true}
        showPrev={true}
        nextText="Criar Conta"
        isLoading={isLoading}
      />
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
  }
});

export default SecurityForm; 