import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const CHART_COLORS = [
  '#F5F5F7',
  '#8E8E93',
  '#C0C0C0',
  '#3A3A3C',
  '#FFD700',
  '#636366',
  '#AEAEB2',
];

const SpendingPie = ({
  data = [],
  title = 'Gastos por Categoría',
  showLegend = true,
  size = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    x: item.category,
    y: item.amount,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <VictoryPie
          data={chartData}
          width={size}
          height={size}
          innerRadius={size * 0.28}
          padAngle={2}
          style={{
            data: {
              fill: ({ datum }) => datum.fill,
              stroke: colors.background,
              strokeWidth: 2,
            },
          }}
          labels={() => null}
        />

        {/* Center label */}
        <View style={styles.centerLabel}>
          <Text style={styles.centerAmount}>
            ${total.toLocaleString()}
          </Text>
          <Text style={styles.centerSubtitle}>Total</Text>
        </View>
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor:
                      CHART_COLORS[index % CHART_COLORS.length],
                  },
                ]}
              />
              <Text style={styles.legendLabel}>{item.category}</Text>
              <Text style={styles.legendAmount}>
                ${item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    ...typography.styles.h3,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAmount: {
    ...typography.styles.h2,
    color: colors.textPrimary,
  },
  centerSubtitle: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legend: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  legendLabel: {
    ...typography.styles.body,
    flex: 1,
    color: colors.textPrimary,
  },
  legendAmount: {
    ...typography.styles.body,
    color: colors.textSecondary,
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
