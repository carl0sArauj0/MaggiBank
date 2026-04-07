import Constants from 'expo-constants';

const ANALYTICS_BASE_URL = 'http://192.168.1.5:8000';
// Helper function for API calls
const fetchFromAnalytics = async (endpoint, options = {}) => {
  const response = await fetch(`${ANALYTICS_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Analytics API error: ${response.status}`);
  }

  return response.json();
};

// Get spending trends by category
export const getSpendingTrends = async (userId, period = 'monthly') => {
  const data = await fetchFromAnalytics(
    `/analytics/spending-trends?user_id=${userId}&period=${period}`
  );
  return data;
};

// Get wealth projections
export const getWealthProjections = async (userId, months = 12) => {
  const data = await fetchFromAnalytics(
    `/analytics/wealth-projections?user_id=${userId}&months=${months}`
  );
  return data;
};

// Get spending anomalies
export const getAnomalies = async (userId) => {
  const data = await fetchFromAnalytics(
    `/analytics/anomalies?user_id=${userId}`
  );
  return data;
};

// Get Maggi Insights (AI-generated summaries)
export const getMaggiInsights = async (userId) => {
  const data = await fetchFromAnalytics(
    `/analytics/insights?user_id=${userId}`
  );
  return data;
};

// Get category breakdown for donut chart
export const getCategoryBreakdown = async (userId, period = 'monthly') => {
  const data = await fetchFromAnalytics(
    `/analytics/categories?user_id=${userId}&period=${period}`
  );
  return data;
};

// Get wealth growth data for line chart
export const getWealthGrowth = async (userId, months = 6) => {
  const data = await fetchFromAnalytics(
    `/analytics/wealth-growth?user_id=${userId}&months=${months}`
  );
  return data;
};
