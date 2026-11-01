import React, { useMemo } from "react";
import { Tabs } from "expo-router";
import { Receipt, User, Truck } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";
import { useOrderRequests } from "@/features/management/orders/api/use-orders";

export default function ManagementLayout() {
  const { data: orders = [] } = useOrderRequests();

  // Count how many order requests are currently PENDING
  const pendingCount = useMemo(() => {
    return orders.filter((order) => order.status === "PENDING").length;
  }, [orders]);

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
          title: "Daily Sales",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconActiveBackground,
              ]}
            >
              <Receipt size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconActiveBackground,
              ]}
            >
              <Truck size={20} color={color} />

              {/* Red Pending Orders Badge */}
              {pendingCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconActiveBackground,
              ]}
            >
              <User size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    width: 56,
    borderRadius: 12,
    position: "relative",
  },
  iconActiveBackground: {
    backgroundColor: "#bae6fd",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: 4,
    backgroundColor: "#e11d48", // Rose-600 red
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
    textAlign: "center",
  },
});