/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { AppState, View } from "react-native";
import { Tabs, usePathname } from "expo-router";
import { Map, ClipboardList, Wallet, User, Bike } from "lucide-react-native";
import { useApiClient } from "@/lib/api-client";
import Toast from "react-native-toast-message";
import { useOrderSync } from "@/features/orders/api/use-order-sync";

export default function RiderLayout() {
  const api = useApiClient();
  const appState = useRef(AppState.currentState);
  const pathname = usePathname();
  useOrderSync();
  const isOrdersActive = pathname.includes('/orders') || pathname.includes('/sale');

  useEffect(() => {
    const updatePresence = async (status: 'ONLINE' | 'OFFLINE', showToast: boolean = false) => {
      try {
        console.log(`Attempting to send ${status} to server...`);
        api.post('/tracking/presence', { status })
          .then(() => console.log(`SUCCESS: Marked ${status}`))
          .catch(err => console.log(`FAILED to mark ${status}:`, err.message));
        if (status === 'ONLINE' && showToast) {
          Toast.show({
            type: 'success',
            text1: 'Online Now',
            text2: 'You are connected to the dispatch system.',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      } catch (error) {
        console.error("Error in updatePresence:", error);
      }
    };

    // 1. Initial load (Show Toast)
    updatePresence('ONLINE', true);

    // 2. App State Changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log(`[AppState] Changed from ${appState.current} to ${nextAppState}`);

      if (appState.current === "active" && (nextAppState === "background" || nextAppState === "inactive")) {
        console.log("🔥 App minimized! Firing OFFLINE request...");
        updatePresence('OFFLINE', false);
      } else if ((appState.current === "background" || appState.current === "inactive") && nextAppState === "active") {
        console.log("🔥 App opened! Firing ONLINE request...");
        updatePresence('ONLINE', true); // Show Toast when they come back
      }

      appState.current = nextAppState;
    });
    const heartbeatInterval = setInterval(() => {
      if (appState.current === "active") {
        console.log("💓 Heartbeat: App is still active, refreshing timestamp...");
        updatePresence('ONLINE', false);
      }
    }, 2 * 60 * 1000);

    // Cleanup
    return () => {
      subscription.remove();
      clearInterval(heartbeatInterval);
    };
  }, []);

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
            <View className={`items-center justify-center h-8 w-14 rounded-lg ${focused ? "bg-sky-200" : ""}`}>
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
            <View className={`items-center justify-center h-8 w-14 rounded-lg ${focused ? "bg-sky-200" : ""}`}>
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
              <View className={`items-center justify-center h-8 w-14 rounded-lg ${active ? "bg-sky-200" : ""}`}>
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
            <View className={`items-center justify-center h-8 w-14 rounded-lg ${focused ? "bg-sky-200" : ""}`}>
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
            <View className={`items-center justify-center h-8 w-14 rounded-lg ${focused ? "bg-sky-200" : ""}`}>
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