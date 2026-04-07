import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WealthLine = ({
  data = [],
  title = 'Crecimiento del Patrimonio',
  height = 220,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos disponibles</Text>
      </View>
    );
  }

  const isGrowing = data[data.length - 1]?.value >= data[0]?.value;
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.value),
      strokeWidth: 2,
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[
          styles.trend,
          { color: isGrowing ? colors.success : colors.error }
        ]}>
          {isGrowing ? '↑ Creciendo' : '↓ Bajando'}
        </Text>
      </View>

      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 48}
        height={height}
        chartConfig={{
          backgroundColor: colors.backgroundSecondary,
          backgroundGradientFrom: colors.backgroundSecondary,
          backgroundGradientTo: colors.backgroundSecondary,
          decimalPlaces: 0,
          color: (opacity = 1) => isGrowing
            ? `rgba(48, 209, 88, ${opacity})`
            : `rgba(255, 69, 58, ${opacity})`,
          labelColor: (opacity = 1) =>
            `rgba(142, 142, 147, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: isGrowing ? colors.success : colors.error,
          },
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: colors.border,
            strokeWidth: 0.5,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        formatYLabel={(value) =>
          `$${(parseInt(value) / 1000).toFixed(0)}k`
        }
      />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MÍNIMO</Text>
          <Text style={styles.statValue}>
            ${minValue.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MÁXIMO</Text>
          <Text style={styles.statValue}>
            ${maxValue.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACTUAL</Text>
          <Text style={[
            styles.statValue,
            { color: isGrowing ? colors.success : colors.error }
          ]}>
            ${data[data.length - 1]?.value.toLocaleString('es-CO')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
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
  trend: {
    ...typography.styles.caption,
    fontFamily: typography.heading,
  },
  chart: {
    borderRadius: 8,
    marginLeft: -16,
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
