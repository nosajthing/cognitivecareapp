import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { colors, type } from '../../lib/theme';
import { useTranslation } from '../../lib/i18n';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

function TabIcon({
  name,
  focused,
  label,
}: {
  name: IconName;
  focused: boolean;
  label: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: focused ? 'rgba(134,210,229,0.28)' : 'transparent',
        minWidth: 64,
      }}
    >
      <MaterialIcons
        name={name}
        size={24}
        color={focused ? colors.primary : colors.outline}
      />
      <Text
        style={{
          ...type.labelMd,
          color: focused ? colors.primary : colors.outline,
          textTransform: 'uppercase',
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(247,249,251,0.92)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 1,
          borderTopColor: 'rgba(15,106,95,0.1)',
          height: 84,
          paddingTop: 12,
          paddingBottom: 24,
          paddingHorizontal: 8,
          position: 'absolute',
          elevation: 0,
          shadowColor: '#191c1e',
          shadowOffset: { width: 0, height: -12 },
          shadowOpacity: 0.06,
          shadowRadius: 32,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label={t('tabHome')} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shopping-basket" focused={focused} label={t('tabServices')} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} label={t('tabMe')} />
          ),
        }}
      />
      <Tabs.Screen
        name="screening"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="training"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="reports"
        options={{ href: null }}
      />
    </Tabs>
  );
}
