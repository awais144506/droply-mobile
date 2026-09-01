import { Tabs } from "expo-router";
import { Map, ClipboardList, Wallet, User,BikeIcon } from "lucide-react-native";
import { View } from "react-native";

export default function RiderLayout() {
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
          height: 80,
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
            <View className={`items-center justify-center h-8 w-14 rounded-full ${focused ? "bg-sky-200" : ""}`}>
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
            <View className={`items-center justify-center h-8 w-14 rounded-full ${focused ? "bg-sky-200" : ""}`}>
              <Wallet size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-8 w-14 rounded-full ${focused ? "bg-sky-200" : ""}`}>
              <BikeIcon size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-8 w-14 rounded-full ${focused ? "bg-sky-200" : ""}`}>
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
            <View className={`items-center justify-center h-8 w-14 rounded-full ${focused ? "bg-sky-200" : ""}`}>
              <User size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen name="deliver/[stopId]" options={{ href: null }} />
      <Tabs.Screen name="sale/new-customer" options={{ href: null }} />
    </Tabs>
  );
}