import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import MaggiButton from '../ui/MaggiButton';

const Header = ({
  userName = 'User',
  showLogo = true,
  showGreeting = true,
  title = null,
  rightAction = null,
}) => {
  const [showMaggi, setShowMaggi] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const openMaggi = () => {
    setShowMaggi(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const closeMaggi = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowMaggi(false));
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
          <TouchableOpacity onPress={openMaggi} activeOpacity={0.8}>
            <Image
              source={require('../../../assets/branding/maggi_icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
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

      <Modal
        visible={showMaggi}
        animationType="fade"
        transparent={true}
        onRequestClose={closeMaggi}
      >
        <TouchableOpacity
          style={maggiStyles.overlay}
          onPress={closeMaggi}
          activeOpacity={1}
        >
          <Animated.View style={[
            maggiStyles.card,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <Image
              source={require('../../../assets/branding/maggi_real.png')}
              style={maggiStyles.photo}
              resizeMode="cover"
            />
            <View style={maggiStyles.content}>
              <Text style={maggiStyles.emoji}>🐾</Text>
              <Text style={maggiStyles.title}>¡Hola, soy Maggi!</Text>
              <Text style={maggiStyles.message}>
                Bienvenid@ a mi aplicación...{'\n'}
                Donde guardo mis huesos 🦴{'\n'}
                y también tu dinero 💰
              </Text>
              <Text style={maggiStyles.subtitle}>
                *ladrido de aprobación*
              </Text>
              <MaggiButton
                title="¡Woof! 🐶"
                variant="primary"
                size="sm"
                onPress={closeMaggi}
                style={maggiStyles.button}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
    width: 60,
    height: 60,
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

const maggiStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  photo: {
    width: '100%',
    height: 480,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  button: {
    minWidth: 140,
  },
});

export default Header;
