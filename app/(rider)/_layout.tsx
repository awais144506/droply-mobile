import { useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Tabs, usePathname } from "expo-router";
import { Map, ClipboardList, Wallet, User, Bike } from "lucide-react-native";
import { useOrderRequests } from "@/features/management/orders/api/use-orders";
import { useTodayActiveOrders } from "@/features/rider/main/api/use-rider-orders";
import { useTasks } from "@/features/rider/tasks/api/use-tasks";

export default function RiderLayout() {
  const { data: orders = [] } = useOrderRequests();
  // Fetch active route orders/stops
  const { data: activeOrders = [] } = useTodayActiveOrders();
  // Fetch tasks data
  const { data: tasks = [] } = useTasks();

  // 1. Pending count for Orders tab (from your existing code)
  const pendingOrderRequestsCount = useMemo(() => {
    return orders.filter((order) => order.status === "PENDING").length;
  }, [orders]);

  // 2. Pending count for Route tab (e.g., active or pending route stops/orders)
  const pendingRouteCount = useMemo(() => {
    if (Array.isArray(activeOrders)) {
      return activeOrders.filter((item: any) => item.status === "PENDING" || item.status === "ASSIGNED" || item.status === "IN_PROGRESS").length;
    }
    return 0;
  }, [activeOrders]);

  // 3. Pending count for Tasks tab
  const pendingTasksCount = useMemo(() => {
    if (Array.isArray(tasks)) {
      return tasks.filter((task: any) => task.status === "INCOMPLETE").length;
    }
    return 0;
  }, [tasks]);

  const pathname = usePathname();
  const isOrdersActive = pathname.includes('/orders') || pathname.includes('/sale');
  const isRouteActive = pathname === '/' || pathname.includes('/index');

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
      {/* Route Tab with Red Badge Condition */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Route",
          tabBarIcon: ({ color, focused }) => {
            const active = focused || isRouteActive;
            return (
              <View
                style={[
                  styles.iconContainer,
                  active && styles.iconActiveBackground,
                ]}
              >
                {/* Red Pending Route Badge */}
                <Map size={20} color={color} />
                {pendingRouteCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {pendingRouteCount > 99 ? "99+" : pendingRouteCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
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

      {/* Orders Tab */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarActiveTintColor: isOrdersActive ? "#0284c7" : undefined,
          tabBarIcon: ({ color, focused }) => {
            const active = focused || isOrdersActive;
            return (
              <View
                style={[
                  styles.iconContainer,
                  active && styles.iconActiveBackground,
                ]}
              >
                <Bike size={20} color={active ? "#0284c7" : color} />

                {/* Red Pending Orders Badge */}
                {pendingOrderRequestsCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {pendingOrderRequestsCount > 99 ? "99+" : pendingOrderRequestsCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />

      {/* Tasks Tab with Red Badge */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <ClipboardList size={20} color={color} />

              {/* Red Pending Tasks Badge */}
              {pendingTasksCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {pendingTasksCount > 99 ? "99+" : pendingTasksCount}
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
            <View style={[styles.iconContainer, focused && styles.iconActiveBackground]}>
              <User size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen name="sale/new-customer" options={{ href: null }} />
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