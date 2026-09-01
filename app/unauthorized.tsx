import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ShieldAlert, LogOut, RefreshCw } from "lucide-react-native";

export default function UnauthorizedScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleRetry = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      {/* Icon */}
      <View className="h-16 w-16 rounded-2xl bg-rose-50 items-center justify-center border border-rose-100 mb-4">
        <ShieldAlert size={32} color="#e11d48" />
      </View>

      {/* Heading & Details */}
      <Text className="text-xl font-bold text-slate-900 text-center">
        Access Denied
      </Text>
      <Text className="text-xs text-slate-500 text-center mt-2 px-4 leading-5">
        Your account ({user?.primaryEmailAddress?.emailAddress}) does not have an assigned branch role. Please contact your plant administrator.
      </Text>

      {/* Actions */}
      <View className="w-full mt-8 gap-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleRetry}
          className="h-12 bg-sky-600 rounded-xl flex-row items-center justify-center gap-2 shadow-xs"
        >
          <RefreshCw size={16} color="#ffffff" />
          <Text className="text-white font-bold text-sm">Check Status Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSignOut}
          className="h-12 bg-slate-100 rounded-xl flex-row items-center justify-center gap-2 border border-slate-200"
        >
          <LogOut size={16} color="#64748b" />
          <Text className="text-slate-700 font-semibold text-sm">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}