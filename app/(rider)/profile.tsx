import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  LogOut,
  Lock,
  User,
  CheckCircle2,
} from "lucide-react-native";
import { useRole } from "@/lib/use-role";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import { useRiderOrderData } from "@/features/orders/api/use-order";

export default function RiderProfileScreen() {
  const { userName, userEmail, phone, role, branchId } = useRole();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // 🔥 Fetching the flattened zone data
  const { data: orderData, isLoading: isZonesLoading, refetch, isRefetching } = useRiderOrderData(branchId);
  const assignedZones = orderData?.assignedZones || [];

  const [isUploading, setIsUploading] = useState(false);

  // State to manage our custom alert
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const showAlert = (config: Omit<CustomAlertProps, "visible">) => {
    setAlertConfig({ ...config, visible: true });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // Pick & Update Avatar in Clerk
  const handleChangeAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showAlert({
          title: "Permission Required",
          message: "Camera roll access is needed to upload a profile photo.",
          onConfirm: closeAlert,
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets[0]?.base64) return;

      setIsUploading(true);
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;

      await user?.setProfileImage({
        file: base64Image,
      });

      showAlert({
        title: "Success",
        message: "Profile photo updated successfully!",
        onConfirm: closeAlert,
      });
    } catch (err: any) {
      showAlert({
        title: "Upload Failed",
        message: err?.message || "Could not update profile photo. Please try again.",
        onConfirm: closeAlert,
        isDestructive: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = () => {
    showAlert({
      title: "Sign Out",
      message: "Are you sure you want to log out of your session?",
      confirmText: "Log Out",
      cancelText: "Cancel",
      isDestructive: true,
      onCancel: closeAlert,
      onConfirm: async () => {
        closeAlert();
        await signOut();
        router.replace("/(auth)/sign-in");
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#0284c7"]}
            tintColor="#0284c7"
          />
        }
      >
        {/* Hero Card / Avatar Section */}
        <View className="bg-white p-6 rounded-3xl border border-slate-200/90 items-center shadow-xs mb-4">
          <View className="relative mb-3">
            <View className="h-24 w-24 rounded-full bg-sky-50 border-2 border-sky-100 overflow-hidden items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={40} color="#0284c7" />
              )}
            </View>

            {/* Change DP Floating Button */}
            <TouchableOpacity
              onPress={handleChangeAvatar}
              disabled={isUploading}
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-sky-600 border-2 border-white items-center justify-center shadow-sm active:bg-sky-700"
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Camera size={14} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold text-slate-900 text-center">
            {userName || "XYZ"}
          </Text>

          <View className="flex-row items-center gap-2 mt-1.5">
            <View className="flex-row items-center gap-1 bg-sky-50 border border-sky-200/60 px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={11} color="#0284c7" />
              <Text className="text-[11px] font-bold text-sky-700 uppercase tracking-wide">
                {role}
              </Text>
            </View>

            <View className="flex-row items-center gap-1 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 size={11} color="#16a34a" />
              <Text className="text-[11px] font-bold text-emerald-700">
                Active on Duty
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.7}
          className="flex-row items-center justify-center gap-2 bg-rose-50 border border-rose-200/80 py-3.5 rounded-2xl active:bg-rose-100 shadow-2xs mb-4"
        >
          <LogOut size={16} color="#e11d48" />
          <Text className="text-xs font-bold text-rose-600">Log Out</Text>
        </TouchableOpacity>

        {/* Read-Only: Identity & Contact Card */}
        <View className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-4 shadow-2xs">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Information
            </Text>
            <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock size={10} color="#64748b" />
              <Text className="text-[10px] font-medium text-slate-500">Read Only</Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2.5">
                <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                  <User size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium">Full Name</Text>
                  <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                    {userName || "Muhammad Awais"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-1.5 border-t border-slate-100">
              <View className="flex-row items-center gap-2.5">
                <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                  <Mail size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium">Email Address</Text>
                  <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                    {userEmail || "awais.rider@droply.pk"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-1.5 border-t border-slate-100">
              <View className="flex-row items-center gap-2.5">
                <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                  <Phone size={15} color="#64748b" />
                </View>
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium">Phone Number</Text>
                  <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                    {phone || "+923214455667"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Read-Only: Operational Assignment Card */}
        <View className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-5 shadow-2xs">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Zones
            </Text>
            <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock size={10} color="#64748b" />
              <Text className="text-[10px] font-medium text-slate-500">Managed by Plant</Text>
            </View>
          </View>

          <View className="space-y-4">
            {isZonesLoading ? (
              <ActivityIndicator size="small" color="#4f46e5" className="py-4" />
            ) : assignedZones.length > 0 ? (
              assignedZones.map((zone, index) => (
                <View
                  key={zone.id}
                  className={index > 0 ? "pt-4 border-t border-slate-100" : ""}
                >
                  <View className="flex-row items-center justify-between py-1.5">
                    <View className="flex-row items-center gap-2.5">
                      <View className="h-8 w-8 rounded-lg bg-indigo-50 items-center justify-center">
                        <MapPin size={15} color="#4f46e5" />
                      </View>
                      <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                        {zone.name}
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                      Total Customers: <Text className="text-amber-600 text-sm">{zone.totalCustomers}</Text>
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-sm text-slate-500 text-center py-4 font-medium">
                No route sectors currently assigned.
              </Text>
            )}
          </View>
        </View>

        {/* App Footer Info */}
        <View className="items-center mb-6">
          <Text className="text-[11px] font-bold text-slate-400">
            Droply Rider App
          </Text>
          <Text className="text-[10px] text-slate-400 mt-0.5">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Render the Custom Alert outside the ScrollView */}
      <CustomAlert {...alertConfig} />

    </SafeAreaView>
  );
}