import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';
import CardContainer from '../../components/ui/CardContainer';
import MaggiButton from '../../components/ui/MaggiButton';
import { useAuth } from '../../context/AuthContext';
import useAccounts from '../../hooks/useAccounts';
import useExpenses from '../../hooks/useExpenses';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { formatCurrency } from '../../utils/formatters';
import { useState } from 'react';
import { Modal } from 'react-native';
import AddAccount from './AddAccount';


const MaggiCard = ({ account, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={styles.maggiCard}
  >
    <View style={styles.maggiCardTop}>
      <Text style={styles.maggiCardType}>
        {account.type?.toUpperCase() || 'CUENTA'}
      </Text>
      <Text style={styles.maggiCardCurrency}>
        {account.currency || 'USD'}
      </Text>
    </View>
    <Text style={styles.maggiCardBalance}>
      {formatCurrency(account.balance)}
    </Text>
    <Text style={styles.maggiCardName}>{account.name}</Text>
    <View style={styles.maggiCardDots}>
      <Text style={styles.maggiCardDotsText}>◈ ◈ ◈ ◈</Text>
    </View>
  </TouchableOpacity>
);

const Dashboard = ({ navigation }) => {
  const { user } = useAuth();
  const {
    accounts,
    loading: accountsLoading,
    totalPatrimonio,
    fetchAccounts,
  } = useAccounts();
  const {
    expenses,
    loading: expensesLoading,
    totalExpenses,
    fetchExpenses,
  } = useExpenses();

  const isRefreshing = accountsLoading || expensesLoading;
  const [showAddAccount, setShowAddAccount] = useState(false);

  const onRefresh = () => {
    fetchAccounts();
    fetchExpenses();
  };

  const recentExpenses = expenses.slice(0, 3);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.light}
          />
        }
      >
        {/* Header */}
        <Header
          userName={user?.email?.split('@')[0] || 'User'}
          showLogo={true}
          showGreeting={true}
        />

        {/* Total Patrimonio */}
        <CardContainer variant="transparent" style={styles.patrimonioCard}>
          <Text style={styles.patrimonioLabel}>PATRIMONIO TOTAL</Text>
          <Text style={styles.patrimonioAmount}>
            {formatCurrency(totalPatrimonio)}
          </Text>
          <Text style={styles.patrimonioSub}>
            {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}
          </Text>
        </CardContainer>

        {/* MaggiCards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Mis Cuentas</Text>
  <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
    <Text style={styles.sectionAction}>Ver todas</Text>
  </TouchableOpacity>
</View>

          {accounts.length === 0 ? (
            <CardContainer variant="secondary" style={styles.emptyCard}>
  <Text style={styles.emptyText}>
    No tienes cuentas aún.
  </Text>
  <MaggiButton
    title="Crear cuenta"
    variant="outline"
    size="sm"
    style={styles.emptyButton}
    onPress={() => setShowAddAccount(true)}
  />
</CardContainer>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsScroll}
            >
              {accounts.map((account) => (
                <MaggiCard
                  key={account.id}
                  account={account}
                  onPress={() => {}}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <CardContainer variant="secondary" style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>GASTOS</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(totalExpenses)}
            </Text>
          </CardContainer>
          <CardContainer variant="secondary" style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>AHORROS</Text>
            <Text style={[styles.summaryAmount, { color: colors.success }]}>
              {formatCurrency(totalPatrimonio - totalExpenses)}
            </Text>
          </CardContainer>
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos Gastos</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Expenses')}
            >
              <Text style={styles.sectionAction}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {recentExpenses.length === 0 ? (
            <CardContainer variant="secondary" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No hay gastos recientes.
              </Text>
            </CardContainer>
          ) : (
            recentExpenses.map((expense) => (
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
                  <Text style={styles.expenseAmount}>
                    -{formatCurrency(expense.amount)}
                  </Text>
                </View>
              </CardContainer>
            ))
          )}
        </View>

        {/* Add Expense FAB area */}
        <View style={styles.fabArea}>
  <MaggiButton
    title="+ Agregar Gasto"
    onPress={() => navigation.navigate('Expenses')}
    size="lg"
    style={styles.fabButton}
  />
        </View>
      </ScrollView>

      <Modal
  visible={showAddAccount}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowAddAccount(false)}
>
  <AddAccount onClose={() => {
    setShowAddAccount(false);
    onRefresh();
  }} />
</Modal>

    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  patrimonioCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    borderColor: colors.borderLight,
  },
  patrimonioLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  patrimonioAmount: {
    ...typography.styles.displayTitle,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  patrimonioSub: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.textPrimary,
  },
  sectionAction: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  cardsScroll: {
    paddingRight: 20,
    gap: 16,
  },
  maggiCard: {
    width: 260,
    height: 160,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'space-between',
  },
  maggiCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maggiCardType: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  maggiCardCurrency: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  maggiCardBalance: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  maggiCardName: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  maggiCardDots: {
    alignItems: 'flex-end',
  },
  maggiCardDotsText: {
    color: colors.border,
    fontSize: 12,
    letterSpacing: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  summaryLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryAmount: {
    ...typography.styles.h3,
    color: colors.textPrimary,
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
  },
  expenseCategory: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  expenseAmount: {
    ...typography.styles.body,
    color: colors.error,
    fontFamily: typography.heading,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 140,
  },
  fabArea: {
    paddingBottom: 32,
  },
  fabButton: {
    width: '100%',
  },
});

export default Dashboard;
