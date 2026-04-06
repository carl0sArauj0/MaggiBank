import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

const ScreenWrapper = ({ 
  children, 
  style,
  scrollable = false,
  padded = true,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <View style={[
        styles.container,
        padded && styles.padded,
        style,
      ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    paddingHorizontal: 20,
  },
});

export default ScreenWrapper;
