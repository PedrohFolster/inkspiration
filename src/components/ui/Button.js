import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../themes/theme';

const Button = ({ 
  children, 
  onPress, 
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.light.primary,
          borderColor: theme.colors.light.primary,
          color: theme.colors.light.primaryForeground,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.light.secondary,
          borderColor: theme.colors.light.border,
          color: theme.colors.light.secondaryForeground,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.light.border,
          color: theme.colors.light.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: theme.colors.light.primary,
        };
      case 'destructive':
        return {
          backgroundColor: theme.colors.light.destructive,
          borderColor: theme.colors.light.destructive,
          color: theme.colors.light.destructiveForeground,
        };
      default:
        return {
          backgroundColor: theme.colors.light.primary,
          borderColor: theme.colors.light.primary,
          color: theme.colors.light.primaryForeground,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: variantStyle.backgroundColor, borderColor: variantStyle.borderColor },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.color} size="small" />
      ) : (
        <Text style={[styles.text, { color: variantStyle.color }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button; 