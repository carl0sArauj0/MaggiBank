import { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

const CustomSplash = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={require('./assets/icon.png')}
        style={[styles.splashLogo, { opacity }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.splashText, { opacity }]}>
        MaggiBank
      </Animated.Text>
    </View>
  );
};




export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAppReady(true);
      }
    };
    prepare();
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return <CustomSplash />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  splashLogo: {
    width: 360,
    height: 360,
  },
  splashText: {
  fontSize: 32,
  color: colors.textPrimary,
  letterSpacing: 4,
  fontWeight: 'bold',
},
});

