import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Building2, TrendingUp, Users, LogOut } from "lucide-react-native";

export default function ManagementHomeScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const metadata = (user?.publicMetadata || (user as any)?.metadata || {}) as {
    role?: string;
  };
  const roleName = metadata.role || "MANAGER";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-2">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-xl bg-purple-50 items-center justify-center border border-purple-100">
            <Building2 size={20} color="#7c3aed" />
          </View>
          <View>
            <Text className="text-sm font-bold text-slate-900">
              {user?.fullName || "Plant Admin"}
            </Text>
            <Text className="text-xs text-purple-600 font-semibold">{roleName} Desk</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center"
        >
          <LogOut size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* High Level Plant Metrics */}
      <View className="flex-row gap-2.5 mt-4">
        <View className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200">
          <View className="flex-row items-center gap-1.5 mb-1">
            <TrendingUp size={14} color="#0284c7" />
            <Text className="text-[11px] text-slate-500 font-medium">Dispatched</Text>
          </View>
          <Text className="text-xl font-bold text-slate-900">420</Text>
          <Text className="text-[10px] text-slate-400 mt-0.5">Bottles today</Text>
        </View>

        <View className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Users size={14} color="#16a34a" />
            <Text className="text-[11px] text-slate-500 font-medium">Fleet</Text>
          </View>
          <Text className="text-xl font-bold text-emerald-600">3 / 4</Text>
          <Text className="text-[10px] text-slate-400 mt-0.5">Active trips</Text>
        </View>
      </View>

      {/* Placeholder Feed */}
      <View className="mt-6 flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white/50">
        <Text className="text-sm font-bold text-slate-700">Executive Overview</Text>
        <Text className="text-xs text-slate-400 text-center mt-1">
          Live plant cash deposits, inventory levels, and GPS tracking will render here.
        </Text>
      </View>
    </SafeAreaView>
  );
}