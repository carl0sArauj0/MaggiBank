import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiButton from '../../components/ui/MaggiButton';
import useAccounts from '../../hooks/useAccounts';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ACCOUNT_TYPES = [
  { label: 'Cuenta Corriente', icon: '🏦' },
  { label: 'Ahorros', icon: '💰' },
  { label: 'Efectivo', icon: '💵' },
  { label: 'Inversiones', icon: '📈' },
  { label: 'Tarjeta Crédito', icon: '💳' },
  { label: 'Otro', icon: '◈' },
];

const CURRENCIES = ['COP', 'USD', 'EUR'];

const AddAccount = ({ onClose }) => {
  const { createAccount } = useAccounts();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'El nombre es requerido';
    if (!balance) newErrors.balance = 'El balance es requerido';
    if (isNaN(parseFloat(balance))) newErrors.balance = 'Balance inválido';
    if (!selectedType) newErrors.type = 'Selecciona un tipo de cuenta';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await createAccount({
        name,
        balance: parseFloat(balance),
        type: selectedType,
        currency: selectedCurrency,
        color: '#1A1A1B',
      });
      Alert.alert('¡Listo!', 'Cuenta creada correctamente.');
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.overlay}
    >
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Nueva Cuenta</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <MaggiInput
            label="Nombre de la cuenta"
            placeholder="Ej: Bancolombia Ahorros"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          {/* Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <MaggiInput
  placeholder="0"
  value={balance ? parseInt(balance).toLocaleString('es-CO') : ''}
  onChangeText={(text) => {
    const clean = text.replace(/\./g, '').replace(/[^0-9]/g, '');
    setBalance(clean);
  }}
  keyboardType="numeric"
  error={errors.balance}
  style={styles.balanceInput}
/>
          </View>

          {/* Account type */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>TIPO DE CUENTA</Text>
            {errors.type && (
              <Text style={styles.errorText}>{errors.type}</Text>
            )}
            <View style={styles.typesGrid}>
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.label}
                  style={[
                    styles.typeChip,
                    selectedType === type.label && styles.typeChipActive,
                  ]}
                  onPress={() => setSelectedType(type.label)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.label && styles.typeLabelActive,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Currency */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>MONEDA</Text>
            <View style={styles.currencyRow}>
              {CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency}
                  style={[
                    styles.currencyChip,
                    selectedCurrency === currency && styles.currencyChipActive,
                  ]}
                  onPress={() => setSelectedCurrency(currency)}
                >
                  <Text style={[
                    styles.currencyChipText,
                    selectedCurrency === currency && styles.currencyChipTextActive,
                  ]}>
                    {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <MaggiButton
            title="Crear Cuenta"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...typography.styles.h2,
    color: colors.textPrimary,
  },
  closeButton: {
    ...typography.styles.body,
    color: colors.textSecondary,
    padding: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    ...typography.styles.h1,
    color: colors.textPrimary,
    marginRight: 8,
    marginBottom: 16,
  },
  balanceInput: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.error,
    marginBottom: 8,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundTertiary,
    gap: 6,
  },
  typeChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  typeIcon: {
    fontSize: 14,
  },
  typeLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  typeLabelActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundTertiary,
  },
  currencyChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  currencyChipText: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  currencyChipTextActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
});

export default AddAccount;
