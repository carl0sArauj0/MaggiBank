import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import MaggiButton from './MaggiButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const MaggiAlert = ({
  visible,
  title,
  message,
  type = 'success',
  onClose,
  buttons = null,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'i';
      default: return '✓';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'info': return colors.silver;
      default: return colors.success;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={[styles.icon, { color: getIconColor() }]}>
            {getIcon()}
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {buttons ? (
            <View style={styles.buttonsRow}>
              {buttons.map((btn, index) => (
                <MaggiButton
                  key={index}
                  title={btn.text}
                  variant={btn.style === 'destructive' ? 'danger' : btn.style === 'cancel' ? 'outline' : 'primary'}
                  size="sm"
                  onPress={btn.onPress}
                  style={styles.button}
                />
              ))}
            </View>
          ) : (
            <MaggiButton
              title="OK"
              variant="primary"
              size="sm"
              onPress={onClose}
              style={styles.singleButton}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  singleButton: {
    minWidth: 120,
  },
});

export default MaggiAlert;
