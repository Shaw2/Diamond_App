import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="diamond"
        options={{
          title: 'Diamond',
          tabBarIcon: ({ color }) => (
            <ExpoImage
              source={require('@/assets/images/diamond.png')}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="opal"
        options={{
          title: 'Opal',
          tabBarIcon: ({ color }) => (
            <ExpoImage
              source={require('@/assets/images/opal.png')}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stone"
        options={{
          title: 'Stone',
          tabBarIcon: ({ color }) => (
            <ExpoImage
              source={require('@/assets/images/stone.png')}
              style={{ width: 28, height: 28 }}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
