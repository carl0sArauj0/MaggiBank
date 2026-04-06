import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
} from 'victory-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WealthLine = ({
  data = [],
  title = 'Crecimiento del Patrimonio',
  showArea = true,
  showDots = true,
  height = 250,
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

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const isGrowing = data[data.length - 1]?.value >= data[0]?.value;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.trendBadge}>
          <Text style={[
            styles.trendText,
            { color: isGrowing ? colors.success : colors.error }
          ]}>
            {isGrowing ? '↑' : '↓'} {isGrowing ? 'Creciendo' : 'Bajando'}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <VictoryChart
        width={SCREEN_WIDTH - 48}
        height={height}
        padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
      >
        {/* X Axis */}
        <VictoryAxis
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fill: colors.textSecondary,
              fontFamily: typography.body,
              fontSize: 10,
            },
            grid: { stroke: 'transparent' },
          }}
        />

        {/* Y Axis */}
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

        {/* Area fill */}
        {showArea && (
          <VictoryArea
            data={chartData}
            style={{
              data: {
                fill: isGrowing
                  ? 'rgba(48, 209, 88, 0.08)'
                  : 'rgba(255, 69, 58, 0.08)',
                stroke: 'transparent',
              },
            }}
            interpolation="monotoneX"
          />
        )}

        {/* Line */}
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: isGrowing ? colors.success : colors.error,
              strokeWidth: 2,
            },
          }}
          interpolation="monotoneX"
        />

        {/* Dots */}
        {showDots && (
          <VictoryScatter
            data={chartData}
            size={4}
            style={{
              data: {
                fill: colors.background,
                stroke: isGrowing ? colors.success : colors.error,
                strokeWidth: 2,
              },
            }}
          />
        )}
      </VictoryChart>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MÍNIMO</Text>
          <Text style={styles.statValue}>
            ${minValue.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MÁXIMO</Text>
          <Text style={styles.statValue}>
            ${maxValue.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACTUAL</Text>
          <Text style={[
            styles.statValue,
            { color: isGrowing ? colors.success : colors.error }
          ]}>
            ${data[data.length - 1]?.value.toLocaleString()}
          </Text>
        </View>
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
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendText: {
    ...typography.styles.caption,
    fontFamily: typography.heading,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    ...typography.styles.body,
    color: colors.textPrimary,
    fontFamily: typography.heading,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
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

export default WealthLine;
