import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CHART_COLORS = [
  '#F5F5F7', '#8E8E93', '#C0C0C0', '#3A3A3C',
  '#FFD700', '#636366', '#AEAEB2',
];

const SpendingPie = ({
  data = [],
  title = 'Gastos por Categoría',
  showLegend = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={chartData}
        width={SCREEN_WIDTH - 48}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(245, 245, 247, ${opacity})`,
          backgroundColor: colors.backgroundSecondary,
          backgroundGradientFrom: colors.backgroundSecondary,
          backgroundGradientTo: colors.backgroundSecondary,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={showLegend}
      />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalAmount}>
          ${total.toLocaleString('es-CO')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: {
    ...typography.styles.h3,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  totalLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  totalAmount: {
    ...typography.styles.body,
    color: colors.textPrimary,
    fontFamily: typography.heading,
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
});

export default SpendingPie;
