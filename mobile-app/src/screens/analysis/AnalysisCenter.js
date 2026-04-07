import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';
import CardContainer from '../../components/ui/CardContainer';
import SpendingPie from '../../components/charts/SpendingPie';
import WealthLine from '../../components/charts/WealthLine';
import BarAnalysis from '../../components/charts/BarAnalysis';
import { useAuth } from '../../context/AuthContext';
import {
  getSpendingTrends,
  getWealthGrowth,
  getCategoryBreakdown,
  getMaggiInsights,
  getAnomalies,
} from '../../api/analyticsApi';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const PERIODS = ['Semanal', 'Mensual', 'Anual'];

const InsightCard = ({ insight }) => (
  <CardContainer variant="secondary" style={styles.insightCard}>
    <View style={styles.insightRow}>
      <Text style={styles.insightIcon}>{insight.icon || '◈'}</Text>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDescription}>
          {insight.description}
        </Text>
      </View>
    </View>
  </CardContainer>
);

const AnomalyCard = ({ anomaly }) => (
  <CardContainer variant="secondary" style={styles.anomalyCard}>
    <View style={styles.anomalyRow}>
      <View style={styles.anomalyLeft}>
        <Text style={styles.anomalyCategory}>{anomaly.category}</Text>
        <Text style={styles.anomalyDescription}>
          {anomaly.description}
        </Text>
      </View>
      <View style={styles.anomalyBadge}>
        <Text style={styles.anomalyAmount}>
          +${anomaly.excess?.toLocaleString('es-CO')}
        </Text>
      </View>
    </View>
  </CardContainer>
);

const AnalysisCenter = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('Mensual');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [spendingData, setSpendingData] = useState([]);
  const [wealthData, setWealthData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  const periodMap = {
    Semanal: 'weekly',
    Mensual: 'monthly',
    Anual: 'yearly',
  };

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const period = periodMap[selectedPeriod];

      const [
        spendingRes,
        wealthRes,
        categoryRes,
        insightsRes,
        anomaliesRes,
      ] = await Promise.allSettled([
        getSpendingTrends(user?.id, period),
        getWealthGrowth(user?.id),
        getCategoryBreakdown(user?.id, period),
        getMaggiInsights(user?.id),
        getAnomalies(user?.id),
      ]);

      if (spendingRes.status === 'fulfilled')
        setBarData(spendingRes.value?.data || []);
      if (wealthRes.status === 'fulfilled')
        setWealthData(wealthRes.value?.data || []);
      if (categoryRes.status === 'fulfilled')
        setSpendingData(categoryRes.value?.data || []);
      if (insightsRes.status === 'fulfilled')
        setInsights(insightsRes.value?.data || []);
      if (anomaliesRes.status === 'fulfilled')
        setAnomalies(anomaliesRes.value?.data || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const onRefresh = () => fetchAnalytics(true);

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Centro de Análisis" showGreeting={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.light} size="large" />
          <Text style={styles.loadingText}>
            Analizando tu patrimonio...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.light}
          />
        }
      >
        <Header title="Centro de Análisis" showGreeting={false} />

        {/* Period selector */}
        <View style={styles.periodSelector}>
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodChip,
                selectedPeriod === period && styles.periodChipActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error state */}
        {error && (
          <CardContainer variant="secondary" style={styles.errorCard}>
            <Text style={styles.errorText}>
              ⚠ No se pudo conectar al servidor de análisis.
            </Text>
            <Text style={styles.errorSubtext}>
              Verifica que el backend esté corriendo.
            </Text>
          </CardContainer>
        )}

        {/* Wealth Line Chart */}
        <CardContainer variant="secondary" style={styles.chartCard}>
          <WealthLine
            data={wealthData}
            title="Crecimiento del Patrimonio"
          />
        </CardContainer>

        {/* Spending Donut Chart */}
        <CardContainer variant="secondary" style={styles.chartCard}>
          <SpendingPie
            data={spendingData}
            title="Gastos por Categoría"
          />
        </CardContainer>

        {/* Bar Analysis */}
        <CardContainer variant="secondary" style={styles.chartCard}>
          <BarAnalysis
            data={barData}
            title="Análisis por Período"
          />
        </CardContainer>

        {/* Anomalies */}
        {anomalies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠ Alertas de Gasto</Text>
            {anomalies.map((anomaly, index) => (
              <AnomalyCard key={index} anomaly={anomaly} />
            ))}
          </View>
        )}

        {/* Maggi Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>◈ Maggi Insights</Text>
          <Text style={styles.sectionSubtitle}>
            Recomendaciones personalizadas
          </Text>
          {insights.length === 0 ? (
            <CardContainer variant="secondary" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Los insights aparecerán cuando tengas más datos.
              </Text>
            </CardContainer>
          ) : (
            insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  periodChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  periodChipActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  periodText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.dark,
    fontFamily: typography.heading,
  },
  chartCard: {
    marginBottom: 16,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  insightCard: {
    marginBottom: 8,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    ...typography.styles.body,
    color: colors.textPrimary,
    fontFamily: typography.heading,
    marginBottom: 4,
  },
  insightDescription: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  anomalyCard: {
    marginBottom: 8,
  },
  anomalyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anomalyLeft: {
    flex: 1,
  },
  anomalyCategory: {
    ...typography.styles.body,
    color: colors.textPrimary,
    fontFamily: typography.heading,
    marginBottom: 4,
  },
  anomalyDescription: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  anomalyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderWidth: 1,
    borderColor: colors.error,
  },
  anomalyAmount: {
    ...typography.styles.bodySmall,
    color: colors.error,
    fontFamily: typography.heading,
  },
  errorCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  errorText: {
    ...typography.styles.body,
    color: colors.warning,
    marginBottom: 8,
  },
  errorSubtext: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 32,
  },
});

export default AnalysisCenter;
