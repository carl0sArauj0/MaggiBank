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
  Modal,        
} from 'react-native';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiButton from '../../components/ui/MaggiButton';
import CardContainer from '../../components/ui/CardContainer';
import useExpenses from '../../hooks/useExpenses';
import useAccounts from '../../hooks/useAccounts';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { formatCurrency } from '../../utils/formatters';




const CATEGORIES = [
  { label: 'Comida', icon: '🍔' },
  { label: 'Transporte', icon: '🚗' },
  { label: 'Arriendo', icon: '🏠' },
  { label: 'Salud', icon: '💊' },
  { label: 'Entretenimiento', icon: '🎬' },
  { label: 'Ropa', icon: '👕' },
  { label: 'Educación', icon: '📚' },
  { label: 'Otros', icon: '◈' },
];

const AddTransaction = ({ onClose }) => {
  const { addExpense } = useExpenses();
  const { accounts } = useAccounts();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'El título es requerido';
    if (!amount) newErrors.amount = 'El monto es requerido';
    if (isNaN(parseFloat(amount))) newErrors.amount = 'Monto inválido';
    if (parseFloat(amount) <= 0) newErrors.amount = 'Debe ser mayor a 0';
    if (!selectedCategory) newErrors.category = 'Selecciona una categoría';
    if (!selectedAccount) newErrors.account = 'Selecciona una cuenta';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validate()) return;
  try {
    setLoading(true);
    await addExpense({
      title,
      amount: parseFloat(amount),
      category: selectedCategory,
      accountId: selectedAccount,
      notes,
      date: new Date().toISOString(),
    });
    setShowSuccess(true); // ← this shows the modal
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
        {/* Handle */}
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Nuevo Gasto</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Amount input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <MaggiInput
  placeholder="0"
  value={amount ? parseInt(amount).toLocaleString('es-CO') : ''}
  onChangeText={(text) => {
    const clean = text.replace(/\./g, '').replace(/[^0-9]/g, '');
    setAmount(clean);
  }}
  keyboardType="numeric"
  error={errors.amount}
  style={styles.amountInput}
/>
          </View>

          {/* Title input */}
          <MaggiInput
            label="Descripción"
            placeholder="¿En qué gastaste?"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          {/* Category selector */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>CATEGORÍA</Text>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.label &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.label)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === cat.label &&
                      styles.categoryLabelActive,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account selector */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>CUENTA</Text>
            {errors.account && (
              <Text style={styles.errorText}>{errors.account}</Text>
            )}
            <View style={styles.accountsList}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountChip,
                    selectedAccount === account.id &&
                      styles.accountChipActive,
                  ]}
                  onPress={() => setSelectedAccount(account.id)}
                >
                  <Text style={[
                    styles.accountChipText,
                    selectedAccount === account.id &&
                      styles.accountChipTextActive,
                  ]}>
                    {account.name}
                  </Text>
                  <Text style={styles.accountBalance}>
                    {formatCurrency(account.balance)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <MaggiInput
            label="Notas (opcional)"
            placeholder="Agrega una nota..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          {/* Submit */}
          <MaggiButton
            title="Agregar Gasto"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </View>
      {/* Success Modal */}
<Modal
  visible={showSuccess}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setShowSuccess(false)}
>
  <View style={successStyles.overlay}>
    <View style={successStyles.modal}>
      <Text style={successStyles.icon}>✓</Text>
      <Text style={successStyles.title}>¡Listo!</Text>
      <Text style={successStyles.message}>Gasto agregado correctamente.</Text>
      <MaggiButton
        title="OK"
        variant="primary"
        size="sm"
        onPress={() => {
          setShowSuccess(false);
          onClose();
        }}
        style={successStyles.button}
      />
    </View>
  </View>
</Modal>
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
  amountContainer: {
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
  amountInput: {
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
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
  categoryChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  categoryLabelActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  accountsList: {
    gap: 8,
  },
  accountChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundTertiary,
  },
  accountChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  accountChipText: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
  accountChipTextActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  accountBalance: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
});

const successStyles = StyleSheet.create({
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
    color: colors.success,
    marginBottom: 12,
  },
  title: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  message: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});

export default AddTransaction;
