import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, usePathname } from "expo-router";
import { Map, ClipboardList, Wallet, User, Bike } from "lucide-react-native";

export default function RiderLayout() {
  const pathname = usePathname();
  const isOrdersActive = pathname.includes('/orders') || pathname.includes('/sale');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0284c7",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 90,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Route",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <Map size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <Wallet size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => {
            const active = focused || isOrdersActive;
            const iconColor = active ? "#0284c7" : color;
            return (
              <View style={[styles.iconContainer, active && styles.iconActiveBackground]}>
                <Bike size={20} color={iconColor} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <ClipboardList size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <User size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen name="deliver/[stopId]" options={{ href: null }} />
      <Tabs.Screen name="sale/new-customer" options={{ href: null }} />
      <Tabs.Screen name="sale/new-order" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconActiveBackground: {
    backgroundColor: '#bae6fd',
  }
});