import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

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
        tabBarStyle: false,// Hide the tab bar for this screen

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          //tabBarStyle: {display: 'none', }, // Hides the tab bar on this screen     
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          tabBarStyle: {display: 'none',  // Hides the tab bar on this screen
          },
        }}
      />
      <Tabs.Screen
      name="LiftDown"
      options={{
        title: 'Lift Down',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        tabBarStyle: {display: 'none',  // Hides the tab bar on this screen
        },
      }}
    />
    <Tabs.Screen
      name="GoingDown"
      options={{
        title: 'Going Down',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        tabBarStyle: {display: 'none',  // Hides the tab bar on this screen
        },
      }}
    />
    <Tabs.Screen
      name="GoingUp"
      options={{
        title: 'Going Up',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        tabBarStyle: {display: 'none',  // Hides the tab bar on this screen
        },
      }}
    />
    <Tabs.Screen
      name="LiftUp"
      options={{
        title: 'Lift Up',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        tabBarStyle: {display: 'none',  // Hides the tab bar on this screen
        },
      }}
    />

    </Tabs>
  );
}
