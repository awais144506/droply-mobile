import { useState } from 'react';
import { TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import { Camera, Bike, CheckCircle2, LogOut, User } from 'lucide-react-native';
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import { useRole } from '@/lib/use-role';
import { useRouter } from 'expo-router';

export const ProfileDetails = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { userName, role, userProfilePicture } = useRole();
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

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

    const handleChangeAvatar = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

            await user?.setProfileImage({ file: base64Image });

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
            title: "Log Out",
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
        <View className="mb-4 mt-2">
            {/* Main Info Card */}
            <View className="bg-white rounded-[32px] p-6 items-center shadow-sm mb-4">

                {/* Standard Avatar Layout (No Absolute Floating) */}
                <View className="relative mb-4">
                    <View className="h-24 w-24 rounded-full bg-slate-50 border-4 border-slate-50 overflow-hidden items-center justify-center">
                        {userProfilePicture || user?.hasImage ? (
                            <Image
                                source={{ uri: userProfilePicture || user?.imageUrl }}
                                style={{ width: 96, height: 96 }}
                                resizeMode="cover"
                            />
                        ) : (
                            <User size={40} color="#94a3b8" />
                        )}
                    </View>

                    {/* Camera Button */}
                    <TouchableOpacity
                        onPress={handleChangeAvatar}
                        disabled={isUploading}
                        activeOpacity={0.8}
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-sky-500 border-2 border-white items-center justify-center shadow-md active:bg-sky-600"
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Camera size={14} color="#ffffff" strokeWidth={2.5} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <Text className="text-xl font-extrabold text-slate-900 text-center tracking-tight mb-2">
                    {userName || "XYZ"}
                </Text>

                {/* Badges */}
                <View className="flex-row items-center justify-center gap-2">
                    <View className="flex-row items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-full">
                        <Bike size={12} color="#0284c7" strokeWidth={2.5} />
                        <Text className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                            {role}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={12} color="#16a34a" strokeWidth={2.5} />
                        <Text className="text-[11px] font-bold text-emerald-700">
                            Active on Duty
                        </Text>
                    </View>
                </View>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.7}
                className="flex-row items-center justify-center gap-3 bg-white py-4 rounded-[20px] active:bg-rose-50 shadow-sm"
            >
                <LogOut size={18} color="#e11d48" strokeWidth={2.5} />
                <Text className="text-sm font-bold text-rose-600">Log Out</Text>
            </TouchableOpacity>

            <CustomAlert {...alertConfig} />
        </View>
    );
};
