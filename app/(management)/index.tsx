import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { 
  Building2, 
  LogOut, 
  Smartphone, 
  Sparkles, 
  Activity, 
  ClipboardCheck, 
  Map 
} from "lucide-react-native";

const { height } = Dimensions.get("window");

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
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* Header / Top Bar */}
        <View className="flex-row items-center justify-between py-4 mb-2">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 rounded-2xl bg-indigo-50 items-center justify-center border border-indigo-100 shadow-sm">
              <Building2 size={22} color="#4f46e5" />
            </View>
            <View>
              <Text className="text-[15px] font-extrabold text-slate-900 tracking-tight">
                {user?.fullName || "Plant Admin"}
              </Text>
              <Text className="text-xs text-indigo-600 font-bold tracking-wide uppercase mt-0.5">
                {roleName} Desk
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            className="h-10 w-10 rounded-xl bg-white border border-slate-200 items-center justify-center shadow-sm active:bg-slate-50"
          >
            <LogOut size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Main "Coming Soon" Content */}
        <View 
          className="flex-1 justify-center items-center mt-4" 
          style={{ minHeight: height * 0.55 }}
        >
          {/* Icon Cluster */}
          <View className="relative mb-8">
            <View className="h-32 w-32 bg-indigo-100 rounded-full items-center justify-center border-8 border-indigo-50">
              <Smartphone size={56} color="#4f46e5" strokeWidth={1.5} />
            </View>
            <View className="absolute -top-2 -right-2 bg-amber-100 h-10 w-10 rounded-full items-center justify-center border-4 border-slate-50 shadow-sm">
              <Sparkles size={18} color="#d97706" />
            </View>
          </View>

          {/* Typography */}
          <Text className="text-2xl font-extrabold text-slate-900 text-center tracking-tight mb-3 px-4">
            The Power of Droply, {"\n"}Right in Your Hands.
          </Text>
          <Text className="text-sm text-slate-500 text-center leading-relaxed px-2 mb-8">
            We are actively bringing the full web dashboard experience to your mobile device. Complete {roleName.toLowerCase()} controls are launching soon.
          </Text>

          {/* Teaser Features Card */}
          <View className="w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
              What to expect
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center gap-4 px-1">
                <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center">
                  <Activity size={20} color="#0284c7" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-800">Live Analytics</Text>
                  <Text className="text-[11px] text-slate-500 mt-0.5">Track daily dispatch & financial metrics.</Text>
                </View>
              </View>

              <View className="h-px bg-slate-100 w-full" />

              <View className="flex-row items-center gap-4 px-1">
                <View className="h-10 w-10 rounded-xl bg-emerald-50 items-center justify-center">
                  <ClipboardCheck size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-800">Remote Approvals</Text>
                  <Text className="text-[11px] text-slate-500 mt-0.5">Manage tasks and settle rider shifts instantly.</Text>
                </View>
              </View>

              <View className="h-px bg-slate-100 w-full" />

              <View className="flex-row items-center gap-4 px-1">
                <View className="h-10 w-10 rounded-xl bg-rose-50 items-center justify-center">
                  <Map size={20} color="#e11d48" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-800">Fleet Operations</Text>
                  <Text className="text-[11px] text-slate-500 mt-0.5">Monitor active routes and rider statuses.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        <View className="mt-8 items-center">
          <Text className="text-xs text-slate-400 font-medium">
            Please use the Droply Web Portal for administrative tasks.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}