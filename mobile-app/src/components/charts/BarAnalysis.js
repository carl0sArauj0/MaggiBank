import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryGroup,
} from 'victory-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BarAnalysis = ({
  data = [],
  title = 'Análisis Comparativo',
  compareData = null,
  height = 250,
  showLabels = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const chartData = data.map((item) => ({
    x: item.label,
    y: item.value,
  }));

  const compareChartData = compareData
    ? compareData.map((item) => ({
        x: item.label,
        y: item.value,
      }))
    : null;

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {compareData && (
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.light }]} />
              <Text style={styles.legendText}>Actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.legendText}>Anterior</Text>
            </View>
          </View>
        )}
      </View>

      {/* Chart */}
      <VictoryChart
        width={SCREEN_WIDTH - 48}
        height={height}
        padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
        domainPadding={{ x: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontFamily: typography.body,
              fontSize: 10,
              angle: data.length > 5 ? -45 : 0,
              textAnchor: data.length > 5 ? 'end' : 'middle',
            },
            grid: { stroke: 'transparent' },
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(value) => `$${(value / 1000).toFixed(0)}k`}
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontFamily: typography.body,
              fontSize: 10,
            },
            grid: {
              stroke: colors.border,
              strokeDasharray: '4 4',
              strokeWidth: 0.5,
            },
          }}
        />

        {compareChartData ? (
          <VictoryGroup offset={12}>
            <VictoryBar
              data={chartData}
              cornerRadius={{ top: 4 }}
              style={{
                data: { fill: colors.light },
              }}
            />
            <VictoryBar
              data={compareChartData}
              cornerRadius={{ top: 4 }}
              style={{
                data: { fill: colors.accent },
              }}
            />
          </VictoryGroup>
        ) : (
          <VictoryBar
            data={chartData}
            cornerRadius={{ top: 4 }}
            labels={showLabels
              ? ({ datum }) => `$${(datum.y / 1000).toFixed(1)}k`
              : null
            }
            style={{
              data: {
                fill: ({ datum }) =>
                  datum.y === maxValue
                    ? colors.light
                    : colors.backgroundTertiary,
              },
              labels: {
                fill: colors.textSecondary,
                fontFamily: typography.body,
                fontSize: 9,
              },
            }}
          />
        )}
      </VictoryChart>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        {data.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.summaryValue}>
              ${item.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...typography.styles.h3,
    color: colors.textPrimary,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.styles.caption,
    color: colors.textSecondary,
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
