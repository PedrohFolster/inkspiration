import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text, Platform, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Changed to react-native-vector-icons
import { MaterialIcons } from '@expo/vector-icons';

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  onSubmitEditing,
  secureTextEntry, 
  keyboardType,
  multiline,
  numberOfLines,
  style,
  icon,
  showSearchButton = false,
  onSearch,
  searchButtonText = "Buscar",
  ...props 
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        // Force a re-render to prevent white rectangle on iOS
        setIsFocused(false);
      });

      return () => {
        keyboardDidHideListener?.remove();
      };
    }
  }, []);

  const handleKeyPress = (event) => {
    const key = event.nativeEvent?.key || event.key;
    if (key === 'Enter' && onSubmitEditing) {
      onSubmitEditing();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Force layout cleanup on iOS
    if (Platform.OS === 'ios') {
      // Dismiss keyboard explicitly first
      Keyboard.dismiss();
      
      // Then update state after a brief delay
      setTimeout(() => {
        setIsFocused(false);
      }, 100);
    } else {
      setIsFocused(false);
    }
  };

  const handleSubmitEditing = () => {
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
    }
    if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  const renderPasswordToggle = () => {
    if (!secureTextEntry) return null;
    
    return (
      <TouchableOpacity 
        style={styles.eyeIcon} 
        onPress={() => setPasswordVisible(!passwordVisible)}
        activeOpacity={0.7}
      >
        <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={18} color="#555" />
      </TouchableOpacity>
    );
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={20} color="#9CA3AF" />
      </View>
    );
  };

  return (
    <View style={[styles.container, Platform.OS === 'ios' && styles.containerIOS]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        Platform.OS === 'ios' && styles.inputContainerIOS
      ]}>
        {renderIcon()}
        <TextInput
          style={[
            styles.input, 
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
            secureTextEntry && styles.inputWithPassword,
            Platform.OS === 'ios' && styles.inputIOS,
            style
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          onKeyPress={handleKeyPress}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          numberOfLines={multiline ? (numberOfLines || 4) : 1}
          placeholderTextColor="#9CA3AF"
          blurOnSubmit={true}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          enablesReturnKeyAutomatically={true}
          {...props}
        />
        {renderPasswordToggle()}
      </View>
      
      {showSearchButton && (
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={onSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>{searchButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  containerIOS: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
    }),
  },
  inputContainerIOS: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    opacity: 1,
  },
  inputContainerFocused: {
    borderColor: '#000000',
    borderWidth: 1.5,
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#000',
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 8,
      },
    }),
  },
  inputIOS: {
    backgroundColor: 'transparent',
    color: '#000',
    opacity: 1,
  },
  inputWithIcon: {
    paddingLeft: 36,
  },
  inputWithPassword: {
    paddingRight: 40,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
    paddingTop: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
    zIndex: 1,
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#000000',
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    minWidth: 80,
    overflow: 'hidden',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Input; 