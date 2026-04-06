import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const MaggiButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  style,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smallButton;
      case 'md':
        return styles.mediumButton;
      case 'lg':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.dark : colors.light}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[getTextStyle(), styles.text]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.light,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundSecondary,
  },
  outlineButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  ghostButton: {
    backgroundColor: colors.transparent,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },

  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },

  // Text styles
  primaryText: {
    ...typography.styles.body,
    color: colors.dark,
    fontFamily: typography.heading,
  },
  secondaryText: {
    ...typography.styles.body,
    color: colors.light,
    fontFamily: typography.heading,
  },
  outlineText: {
    ...typography.styles.body,
    color: colors.light,
    fontFamily: typography.heading,
  },
  ghostText: {
    ...typography.styles.body,
    color: colors.accent,
    fontFamily: typography.heading,
  },
  dangerText: {
    ...typography.styles.body,
    color: colors.light,
    fontFamily: typography.heading,
  },
  text: {
    letterSpacing: 0.5,
  },

  // States
  disabled: {
    opacity: 0.4,
  },
});

export default MaggiButton;
