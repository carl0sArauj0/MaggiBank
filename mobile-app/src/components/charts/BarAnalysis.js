import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BarAnalysis = ({
  data = [],
  title = 'Análisis Comparativo',
  height = 220,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.value),
    }],
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 48}
        height={height}
        chartConfig={{
          backgroundColor: colors.backgroundSecondary,
          backgroundGradientFrom: colors.backgroundSecondary,
          backgroundGradientTo: colors.backgroundSecondary,
          decimalPlaces: 0,
          color: (opacity = 1) =>
            `rgba(245, 245, 247, ${opacity})`,
          labelColor: (opacity = 1) =>
            `rgba(142, 142, 147, ${opacity})`,
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: colors.border,
            strokeWidth: 0.5,
          },
          barPercentage: 0.6,
        }}
        style={styles.chart}
        withInnerLines={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        formatYLabel={(value) =>
          `$${(parseInt(value) / 1000).toFixed(0)}k`
        }
      />

      <View style={styles.summaryRow}>
        {data.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.summaryValue}>
              ${item.value.toLocaleString('es-CO')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: {
    ...typography.styles.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 8,
    marginLeft: -16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  summaryValue: {
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

export default BarAnalysis;
