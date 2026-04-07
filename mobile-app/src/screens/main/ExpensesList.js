import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';
import CardContainer from '../../components/ui/CardContainer';
import MaggiButton from '../../components/ui/MaggiButton';
import useExpenses from '../../hooks/useExpenses';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import AddTransaction from './AddTransaction';

const CATEGORY_ICONS = {
  Comida: '🍔',
  Transporte: '🚗',
  Arriendo: '🏠',
  Salud: '💊',
  Entretenimiento: '🎬',
  Ropa: '👕',
  Educación: '📚',
  Otros: '◈',
};

const ExpenseItem = ({ expense, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => {
        Alert.alert(
          'Eliminar gasto',
          '¿Estás seguro?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Eliminar',
              style: 'destructive',
              onPress: () => onDelete(expense.id),
            },
          ]
        );
      }}
    >
      <Text style={styles.deleteActionText}>Eliminar</Text>
    </TouchableOpacity>
  );

  const date = new Date(expense.date || expense.created_at);
  const formattedDate = date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <CardContainer variant="secondary" style={styles.expenseItem}>
        <View style={styles.expenseRow}>
          <View style={styles.expenseIcon}>
            <Text style={styles.expenseIconText}>
              {CATEGORY_ICONS[expense.category] || '◈'}
            </Text>
          </View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{expense.title}</Text>
            <Text style={styles.expenseCategory}>
              {expense.category} · {formattedDate}
            </Text>
          </View>
          <Text style={styles.expenseAmount}>
            -${expense.amount?.toLocaleString('es-CO')}
          </Text>
        </View>
      </CardContainer>
    </Swipeable>
  );
};

const ExpensesList = () => {
  const { expenses, loading, totalExpenses, removeExpense } = useExpenses();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...Object.keys(CATEGORY_ICONS)];

  const filteredExpenses = selectedCategory === 'Todos'
    ? expenses
    : expenses.filter((e) => e.category === selectedCategory);

  const handleDelete = async (id) => {
    try {
      await removeExpense(id);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper>
        <Header title="Mis Gastos" showGreeting={false} />

        {/* Total */}
        <CardContainer variant="transparent" style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL GASTOS</Text>
          <Text style={styles.totalAmount}>
            ${totalExpenses?.toLocaleString('es-CO', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </CardContainer>

        {/* Category filter */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedCategory === item && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive,
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Expenses list */}
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>◎</Text>
              <Text style={styles.emptyText}>Sin gastos aquí.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onDelete={handleDelete}
            />
          )}
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Add Transaction Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <AddTransaction
            onClose={() => setShowAddModal(false)}
          />
        </Modal>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  totalCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    borderColor: colors.borderLight,
  },
  totalLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  totalAmount: {
    ...typography.styles.h1,
    color: colors.textPrimary,
  },
  filterContainer: {
    marginBottom: 16,
    marginHorizontal: -20,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  filterChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  filterChipText: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  listContent: {
    paddingBottom: 100,
    gap: 8,
  },
  expenseItem: {
    marginBottom: 0,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseIconText: {
    fontSize: 18,
  },
  expenseInfo: {
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
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 0,
  },
  deleteActionText: {
    ...typography.styles.bodySmall,
    color: colors.light,
    fontFamily: typography.heading,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: colors.dark,
    lineHeight: 32,
  },
});

export default ExpensesList;
