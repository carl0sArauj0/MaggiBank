import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const Header = ({
  userName = 'User',
  showLogo = true,
  showGreeting = true,
  title = null,
  rightAction = null,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftSection}>
        {showGreeting && !title && (
          <>
            <Text style={styles.greeting}>
              {getGreeting()},
            </Text>
            <Text style={styles.userName}>
              {userName} 👋
            </Text>
          </>
        )}
        {title && (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        {showLogo && (
          <Image
            source={require('../../../assets/branding/maggi_icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        {rightAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={rightAction.onPress}
          >
            <Text style={styles.actionText}>
              {rightAction.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.styles.h2,
    color: colors.textPrimary,
  },
  title: {
    ...typography.styles.h2,
    color: colors.textPrimary,
  },
  logo: {
    width: 40,
    height: 40,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionText: {
    ...typography.styles.bodySmall,
    color: colors.textPrimary,
  },
});

export default Header;
