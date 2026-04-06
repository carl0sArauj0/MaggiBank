import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

const CardContainer = ({
  children,
  variant = 'dark',
  glass = false,
  onPress = null,
  style,
  padding = true,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'dark':
        return styles.darkCard;
      case 'light':
        return styles.lightCard;
      case 'secondary':
        return styles.secondaryCard;
      case 'transparent':
        return styles.transparentCard;
      default:
        return styles.darkCard;
    }
  };

  // Glassmorphism variant
  if (glass) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.9}
        style={[styles.glassWrapper, style]}
      >
        <BlurView
          intensity={20}
          tint="dark"
          style={[
            styles.base,
            styles.glassCard,
            padding && styles.padded,
          ]}
        >
          {children}
        </BlurView>
      </TouchableOpacity>
    );
  }

  // Regular card
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          styles.base,
          getCardStyle(),
          padding && styles.padded,
          style,
        ]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.base,
        getCardStyle(),
        padding && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  padded: {
    padding: 20,
  },

  // Variants
  darkCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lightCard: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  secondaryCard: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transparentCard: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // Glassmorphism
  glassWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  glassCard: {
    backgroundColor: colors.cardGlass,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});

export default CardContainer;
