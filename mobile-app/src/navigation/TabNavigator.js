import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

import Dashboard from '../screens/main/Dashboard';
import ExpensesList from '../screens/main/ExpensesList';
import AccountsScreen from '../screens/main/AccountsScreen';
import AnalysisCenter from '../screens/analysis/AnalysisCenter';
import Categories from '../screens/settings/Categories';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, label, focused }) => (
  <View style={styles.tabItem}>
    <Feather
      name={name}
      size={20}
      color={focused ? colors.light : colors.accent}
    />
    <Text
      style={[
        styles.tabLabel,
        { color: focused ? colors.light : colors.accent }
      ]}
      numberOfLines={1}
    >
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
            <TabIcon name="home" label="Inicio" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesList}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="dollar-sign" label="Gastos" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="credit-card" label="Cuentas" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisCenter}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="bar-chart-2" label="Análisis" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" label="Config" focused={focused} />
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
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minWidth: 60,
},
  tabLabel: {
    fontSize: 9,
    fontFamily: typography.body,
    letterSpacing: 0,
  },
});

export default TabNavigator;

