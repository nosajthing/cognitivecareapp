import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../lib/theme';
import { useAppState, useHydrated } from '../lib/profileStore';
import { I18nProvider } from '../lib/i18n';

function AuthGate() {
  const hydrated = useHydrated();
  const { profile } = useAppState();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0];
    const inAuth = first === '(auth)';
    const inAssessment = first === 'assessment';

    if (!profile && !inAuth) {
      router.replace('/(auth)/signup');
    } else if (profile && inAuth) {
      // user exists but they're in auth flow — let them finish
      // (we navigate away explicitly after completing flow)
    }
  }, [hydrated, profile, segments]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="assessment" options={{ presentation: 'card' }} />
      <Stack.Screen name="training" options={{ presentation: 'card' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthGate />
      </SafeAreaProvider>
    </I18nProvider>
  );
}
