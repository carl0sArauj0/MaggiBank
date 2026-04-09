import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiButton from '../../components/ui/MaggiButton';
import MaggiAlert from '../../components/ui/MaggiAlert';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'error', buttons: null });
  const closeAlert = () => setAlertConfig(c => ({ ...c, visible: false }));

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo es requerido';
    if (!email.includes('@')) newErrors.email = 'Correo inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    if (password.length < 6)
      newErrors.password = 'Mínimo 6 caracteres';
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirma tu contraseña';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await register(email, password);
      setAlertConfig({
        visible: true,
        title: '¡Cuenta creada!',
        message: 'Revisa tu correo para confirmar tu cuenta.',
        type: 'success',
        buttons: [{ text: 'OK', onPress: () => { closeAlert(); navigation.navigate('Login'); } }],
      });
    } catch (err) {
      setAlertConfig({ visible: true, title: 'Error', message: err.message, type: 'error', buttons: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Únete a MaggiBank hoy.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <MaggiInput
              label="Correo"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            <MaggiInput
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              hint="Mínimo 6 caracteres"
            />
            <MaggiInput
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <MaggiButton
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <MaggiAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        buttons={alertConfig.buttons}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    marginBottom: 48,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  title: {
    ...typography.styles.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginTop: 8,
    letterSpacing: 1,
  },
  form: {
    marginBottom: 32,
  },
  registerButton: {
    marginTop: 8,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.styles.bodySmall,
    color: colors.textPrimary,
    fontFamily: typography.heading,
  },
});

export default RegisterScreen;
