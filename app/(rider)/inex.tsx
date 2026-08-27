import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Truck, Droplet, RotateCcw, Wallet, LogOut } from "lucide-react-native";

export default function RiderHomeScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-2">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
            <Truck size={20} color="#0284c7" />
          </View>
          <View>
            <Text className="text-sm font-bold text-slate-900">
              {user?.fullName || "Delivery Rider"}
            </Text>
            <Text className="text-xs text-sky-600 font-semibold">Rider Mode</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center"
        >
          <LogOut size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Quick Shift Summary Cards */}
      <View className="flex-row gap-2.5 mt-4">
        <View className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Droplet size={14} color="#0284c7" />
            <Text className="text-[11px] text-slate-500 font-medium">Loaded</Text>
          </View>
          <Text className="text-lg font-bold text-slate-900">120</Text>
        </View>

        <View className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
          <View className="flex-row items-center gap-1.5 mb-1">
            <RotateCcw size={14} color="#16a34a" />
            <Text className="text-[11px] text-slate-500 font-medium">Empty</Text>
          </View>
          <Text className="text-lg font-bold text-emerald-600">84</Text>
        </View>

        <View className="flex-1 bg-white p-3 rounded-xl border border-slate-200">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Wallet size={14} color="#d97706" />
            <Text className="text-[11px] text-slate-500 font-medium">Cash</Text>
          </View>
          <Text className="text-lg font-bold text-amber-600">Rs 14k</Text>
        </View>
      </View>

      {/* Placeholder Feed */}
      <View className="mt-6 flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white/50">
        <Text className="text-sm font-bold text-slate-700">Trip Stop List</Text>
        <Text className="text-xs text-slate-400 text-center mt-1">
          Assigned delivery stops and route navigation will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}