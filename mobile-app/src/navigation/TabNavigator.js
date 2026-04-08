import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Screens
import Dashboard from '../screens/main/Dashboard';
import ExpensesList from '../screens/main/ExpensesList';
import AnalysisCenter from '../screens/analysis/AnalysisCenter';
import Categories from '../screens/settings/Categories';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={styles.tabItem}>
    <Text style={[
      styles.tabIcon,
      { opacity: focused ? 1 : 0.4 }
    ]}>
      {icon}
    </Text>
    <Text style={[
      styles.tabLabel,
      { color: focused ? colors.light : colors.accent }
    ]}>
      {label}
    </Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◈" label="Inicio" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesList}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="≡" label="Gastos" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisCenter}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◎" label="Análisis" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⊙" label="Config" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
  backgroundColor: colors.backgroundSecondary,
  borderTopWidth: 1,
  borderTopColor: colors.border,
  height: 60,
  paddingBottom: 6,
  paddingTop: 6,
},
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 20,
    color: colors.light,
  },
  tabLabel: {
  ...typography.styles.caption,
  letterSpacing: 0,
  fontSize: 7,
},
});

export default TabNavigator;
