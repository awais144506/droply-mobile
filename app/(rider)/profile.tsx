import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
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
  Building2,
  ShieldCheck,
  LogOut,
  Lock,
  User,
  CheckCircle2,
} from "lucide-react-native";

export default function RiderProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);

  // Extract Metadata
  const userRole = (user?.publicMetadata?.role as string) || "RIDER";
  const branchId = (user?.publicMetadata?.branchId as string) || "BR-LAHORE-01";

  // Pick & Update Avatar in Clerk
  const handleChangeAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Camera roll access is needed to upload a profile photo."
        );
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

      Alert.alert("Success", "Profile photo updated successfully!");
    } catch (err: any) {
      Alert.alert(
        "Upload Failed",
        err?.message || "Could not update profile photo. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out of your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
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

          <Text className="text-lg font-bold text-slate-900">
            {user?.fullName || "Majid Ali"}
          </Text>

          <View className="flex-row items-center gap-2 mt-1.5">
            <View className="flex-row items-center gap-1 bg-sky-50 border border-sky-200/60 px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={11} color="#0284c7" />
              <Text className="text-[11px] font-bold text-sky-700 uppercase tracking-wide">
                {userRole}
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
                    {user?.fullName || "Majid Ali"}
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
                    {user?.primaryEmailAddress?.emailAddress || "majid.rider@droply.pk"}
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
                    {user?.primaryPhoneNumber?.phoneNumber || "+92 321 4455667"}
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
              Operational Assignment
            </Text>
            <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock size={10} color="#64748b" />
              <Text className="text-[10px] font-medium text-slate-500">Managed by Plant</Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-1.5">
              <View className="flex-row items-center gap-2.5">
                <View className="h-8 w-8 rounded-lg bg-indigo-50 items-center justify-center">
                  <MapPin size={15} color="#4f46e5" />
                </View>
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium">Primary Route Sector</Text>
                  <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                    Airline Housing Society (Sec A-E)
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Sign Out Action */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.7}
          className="flex-row items-center justify-center gap-2 bg-rose-50 border border-rose-200/80 py-3.5 rounded-2xl active:bg-rose-100 shadow-2xs mb-4"
        >
          <LogOut size={16} color="#e11d48" />
          <Text className="text-xs font-bold text-rose-600">Sign Out of Device</Text>
        </TouchableOpacity>

        {/* App Footer Info */}
        <View className="items-center">
          <Text className="text-[11px] font-bold text-slate-400">
            Droply Fleet Engine
          </Text>
          <Text className="text-[10px] text-slate-400 mt-0.5">
            Version 1.0.4 • Build 2026.1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}