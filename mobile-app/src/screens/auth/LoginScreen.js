import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiButton from '../../components/ui/MaggiButton';
import { useAuth } from '../../../src/context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo es requerido';
    if (!email.includes('@')) newErrors.email = 'Correo inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      Alert.alert('Error', err.message);
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
          {/* Logo & Title */}
          <View style={styles.header}>
            <Image
  source={require('../../../assets/branding/maggi_logo_dark.png')}
  style={styles.logoImage}
  resizeMode="contain"
/>
            <Text style={styles.title}>MaggiBank</Text>
            <Text style={styles.subtitle}>
              Tu patrimonio, bajo control.
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
            />

            <MaggiButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ¿No tienes cuenta?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    color: colors.light,
    marginBottom: 16,
  },
  title: {
    ...typography.styles.h1,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  logoImage: {
  width: 320,
  height: 320,
  marginBottom: -80,
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
  loginButton: {
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

export default LoginScreen;
