import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import theme from '../../themes/theme';

const AddressForm = ({ 
  formData, 
  handleChange, 
  buscarCep 
}) => {
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
  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});

export default AddressForm; 