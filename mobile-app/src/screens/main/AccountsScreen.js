import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';
import CardContainer from '../../components/ui/CardContainer';
import MaggiButton from '../../components/ui/MaggiButton';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiAlert from '../../components/ui/MaggiAlert';
import AddAccount from './AddAccount';
import useAccounts from '../../hooks/useAccounts';
import useExpenses from '../../hooks/useExpenses';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { addBalanceToAccount, deleteAccount } from '../../api/accounts';
import { supabase } from '../../api/supabaseClient';
import { formatCurrency } from '../../utils/formatters';

const AccountDetail = ({ account, onClose, onDeleted, onUpdated, onAccountUpdated }) => {
  const { expenses, fetchExpenses } = useExpenses();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success', buttons: null });
  const [addAmount, setAddAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(account.balance);

  React.useEffect(() => {
    setCurrentBalance(account.balance);
  }, [account.balance]);

  const showAlert = (title, message, type = 'success', buttons = null) => {
    setAlertConfig({ title, message, type, buttons });
    setAlertVisible(true);
  };
  const [amountError, setAmountError] = useState('');
  const [loading, setLoading] = useState(false);

 const formatInputAmount = (value) => {
    const clean = value.replace(/\./g, '').replace(/,/g, '');
    if (!clean) return '';
    const number = parseInt(clean);
    if (isNaN(number)) return '';
    return formatCurrency(number);
  };

  const accountExpenses = expenses
  .filter((e) => e.account_id === account.id)
  .slice(0, 5);

  const handleDelete = () => {
    showAlert(
      'Eliminar cuenta',
      `¿Estás seguro que deseas eliminar "${account.name}"?`,
      'warning',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setAlertVisible(false) },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            setAlertVisible(false);
            setTimeout(() => {
              showAlert(
                'Confirmación final',
                'Esta acción es irreversible. Se eliminarán todos los datos asociados a esta cuenta.',
                'warning',
                [
                  { text: 'Cancelar', style: 'cancel', onPress: () => setAlertVisible(false) },
                  {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                      setAlertVisible(false);
                      try {
                        await deleteAccount(account.id);
                        onDeleted();
                        onClose();
                      } catch (err) {
                        showAlert('Error', err.message, 'error');
                      }
                    },
                  },
                ]
              );
            }, 300);
          },
        },
      ]
    );
  };

  const handleAddBalance = async () => {
  if (!addAmount || isNaN(parseFloat(addAmount))) {
    setAmountError('Ingresa un monto válido');
    return;
  }
  if (parseFloat(addAmount) <= 0) {
    setAmountError('El monto debe ser mayor a 0');
    return;
  }
  try {
    setLoading(true);
    const updatedAccount = await addBalanceToAccount(account.id, parseFloat(addAmount));
    setCurrentBalance(updatedAccount.balance);
    onAccountUpdated(updatedAccount);

    const { error } = await supabase
      .from('expenses')
      .insert([{
        description: 'Ingreso de dinero',
        amount: parseFloat(addAmount),
        category_name: 'Ingreso',
        account_id: account.id,
        date: new Date().toISOString(),
      }]);

    if (error) throw error;

    await fetchExpenses();
    setShowUpdateModal(false);
    setAddAmount('');
    setAmountError('');
    showAlert(
      '¡Listo!',
      `Se agregaron $${parseInt(addAmount).toLocaleString('es-CO')} a ${account.name}`,
      'success'
    );
    await onUpdated();
  } catch (err) {
    showAlert('Error', err.message, 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.detailOverlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={styles.detailSheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Account header */}
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailAccountType}>
                {account.type?.toUpperCase()}
              </Text>
              <Text style={styles.detailAccountName}>{account.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Balance */}
          <CardContainer variant="dark" style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>BALANCE ACTUAL</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(currentBalance)}
            </Text>
          </CardContainer>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <MaggiButton
              title="+ Agregar dinero"
              variant="primary"
              size="md"
              style={styles.addMoneyButton}
              onPress={() => setShowUpdateModal(true)}
            />
            <MaggiButton
              title="Eliminar"
              variant="danger"
              size="md"
              style={styles.deleteButton}
              onPress={handleDelete}
            />
          </View>

          {/* Recent transactions */}
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Transacciones recientes</Text>
            {accountExpenses.length === 0 ? (
              <CardContainer variant="secondary" style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No hay transacciones en esta cuenta.
                </Text>
              </CardContainer>
            ) : (
              accountExpenses.map((expense) => (
                <CardContainer
                  key={expense.id}
                  variant="secondary"
                  style={styles.expenseItem}
                >
                  <View style={styles.expenseRow}>
                    <View style={styles.expenseLeft}>
                      <Text style={styles.expenseTitle}>
                        {expense.title}
                      </Text>
                      <Text style={styles.expenseCategory}>
                        {expense.category}
                      </Text>
                    </View>
                    <Text style={[
                      styles.expenseAmount,
                      (expense.category_name === 'Ingreso' || expense.category === 'Ingreso')
                        ? styles.incomeAmount
                        : styles.expenseAmount
                    ]}>
                      {(expense.category_name === 'Ingreso' || expense.category === 'Ingreso') ? '+' : '-'}
                      {formatCurrency(expense.amount)}
                    </Text>
                  </View>
                </CardContainer>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Update balance modal */}
        <Modal
          visible={showUpdateModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowUpdateModal(false)}
        >
          <View style={styles.updateOverlay}>
            <View style={styles.updateModal}>
              <Text style={styles.updateTitle}>Agregar dinero</Text>
              <Text style={styles.updateSubtitle}>
                Balance actual: {formatCurrency(currentBalance)}
              </Text>
              <View style={styles.updateInputRow}>
                <Text style={styles.updateCurrency}>$</Text>
                 <MaggiInput
    placeholder="0"
    value={addAmount ? formatCurrency(parseInt(addAmount)) : ''}
    onChangeText={(text) => {
      const clean = text.replace(/\./g, '').replace(/[^0-9]/g, '');
      setAddAmount(clean);
    }}
    keyboardType="numeric"
    error={amountError}
    style={styles.updateInput}
  />
</View>
              <View style={styles.updateButtons}>
                <MaggiButton
                  title="Cancelar"
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    setShowUpdateModal(false);
                    setAddAmount('');
                    setAmountError('');
                  }}
                  style={styles.updateCancelBtn}
                />
                <MaggiButton
                  title="Agregar"
                  variant="primary"
                  size="sm"
                  loading={loading}
                  onPress={handleAddBalance}
                  style={styles.updateConfirmBtn}
                />
              </View>
            </View>
          </View>
        </Modal>
        <MaggiAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => setAlertVisible(false)}
          buttons={alertConfig.buttons}
        />
      </View>
    </View>
  );
};

const AccountsScreen = () => {
  const {
    accounts,
    loading,
    totalPatrimonio,
    fetchAccounts,
  } = useAccounts();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <ScreenWrapper>
      <Header
        title="Mis Cuentas"
        showGreeting={false}
        showLogo={false}
      />

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchAccounts}
            tintColor={colors.light}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <CardContainer variant="transparent" style={styles.totalCard}>
            <Text style={styles.totalLabel}>PATRIMONIO TOTAL</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalPatrimonio)}
            </Text>
            <Text style={styles.totalSub}>
              {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}
            </Text>
          </CardContainer>
        }
        ListEmptyComponent={
          <CardContainer variant="secondary" style={styles.emptyCard}>
            <Text style={styles.emptyText}>No tienes cuentas aún.</Text>
          </CardContainer>
        }
        ListFooterComponent={
          <MaggiButton
            title="+ Nueva Cuenta"
            variant="outline"
            onPress={() => setShowAddAccount(true)}
            style={styles.addButton}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedAccount(item)}
            activeOpacity={0.85}
          >
            <View style={styles.accountCard}>
              <View style={styles.accountCardTop}>
                <Text style={styles.accountCardType}>
                  {item.type?.toUpperCase()}
                </Text>
                <Text style={styles.accountCardCurrency}>
                  {item.currency || 'COP'}
                </Text>
              </View>
              <Text style={styles.accountCardBalance}>
                {formatCurrency(item.balance)}
              </Text>
              <Text style={styles.accountCardName}>{item.name}</Text>
              <View style={styles.accountCardDots}>
                <Text style={styles.accountCardDotsText}>◈ ◈ ◈ ◈</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Add Account Modal */}
      <Modal
        visible={showAddAccount}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddAccount(false)}
      >
        <AddAccount onClose={() => {
          setShowAddAccount(false);
          fetchAccounts();
        }} />
      </Modal>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <Modal
          visible={!!selectedAccount}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setSelectedAccount(null);
            fetchAccounts();
          }}
        >
          <AccountDetail
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
            onDeleted={() => {
              setSelectedAccount(null);
              fetchAccounts();
            }}
            onUpdated={async () => {
              await fetchAccounts();
            }}
            onAccountUpdated={(updatedAccount) => {
              setSelectedAccount(updatedAccount);
              fetchAccounts();
            }}
          />
        </Modal>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  totalCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderColor: colors.borderLight,
    marginBottom: 8,
  },
  totalLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
    fontSize: 10,
  },
  totalAmount: {
    ...typography.styles.h1,
    color: colors.textPrimary,
    fontSize: 30,
  },
  totalSub: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
  accountCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  accountCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  accountCardType: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 2,
    fontSize: 10,
  },
  accountCardCurrency: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  accountCardBalance: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    fontSize: 22,
    marginBottom: 4,
  },
  accountCardName: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
  },
  accountCardDots: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  accountCardDotsText: {
    color: colors.border,
    fontSize: 10,
    letterSpacing: 4,
  },
  addButton: {
    width: '100%',
    marginTop: 8,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
  },

  // Detail styles
  detailOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  detailSheet: {
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
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailAccountType: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 4,
  },
  detailAccountName: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    fontSize: 22,
  },
  closeBtn: {
    ...typography.styles.body,
    color: colors.textSecondary,
    padding: 4,
    fontSize: 14,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  balanceLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
    fontSize: 10,
  },
  balanceAmount: {
    ...typography.styles.h1,
    color: colors.textPrimary,
    fontSize: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  addMoneyButton: {
    flex: 2,
  },
  deleteButton: {
    flex: 1,
  },
  transactionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.textPrimary,
    marginBottom: 12,
    fontSize: 16,
  },
  expenseItem: {
    marginBottom: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseLeft: {
    flex: 1,
  },
  expenseTitle: {
    ...typography.styles.body,
    color: colors.textPrimary,
    fontSize: 13,
  },
  expenseCategory: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
  expenseAmount: {
    ...typography.styles.body,
    color: colors.error,
    fontFamily: typography.heading,
    fontSize: 13,
  },
  incomeAmount: {
    ...typography.styles.body,
    color: colors.success,
    fontFamily: typography.heading,
    fontSize: 13,
  },

  // Update modal styles
  updateOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  updateModal: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  updateTitle: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginBottom: 4,
    fontSize: 20,
  },
  updateSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginBottom: 20,
    fontSize: 12,
  },
  updateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  updateCurrency: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginRight: 8,
    marginBottom: 16,
    fontSize: 20,
  },
  updateInput: {
    flex: 1,
  },
  updateButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  updateCancelBtn: {
    flex: 1,
  },
  updateConfirmBtn: {
    flex: 1,
  },
});

export default AccountsScreen;
