import { useState } from 'react';
import { TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import { Camera, Bike, Briefcase, Crown, CheckCircle2, LogOut, User } from 'lucide-react-native';
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import { useRole } from '@/lib/use-role';
import { useRouter } from 'expo-router';
import { profileDetailsStyles as styles } from '../style/profile-styles'; // Adjust path if needed

// Helper configuration function for dynamic role styling & icons
const getRoleBadgeConfig = (roleStr: string) => {
    const normalized = roleStr?.toLowerCase() || "";

    if (normalized.includes("manager")) {
        return {
            icon: <Briefcase size={12} color="#4338ca" strokeWidth={2.5} />, // indigo-700
            badgeStyle: styles.roleBadgeManager,
            textStyle: styles.roleBadgeTextManager,
        };
    }

    if (normalized.includes("owner") || normalized.includes("admin")) {
        return {
            icon: <Crown size={12} color="#b45309" strokeWidth={2.5} />, // amber-700
            badgeStyle: styles.roleBadgeOwner,
            textStyle: styles.roleBadgeTextOwner,
        };
    }

    // Default fallback (Rider / Staff)
    return {
        icon: <Bike size={12} color="#0369a1" strokeWidth={2.5} />, // sky-700
        badgeStyle: null,
        textStyle: null,
    };
};

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

    const roleConfig = getRoleBadgeConfig(role);

    return (
        <View style={styles.container}>
            {/* Main Info Card */}
            <View style={styles.mainCard}>

                {/* Standard Avatar Layout (No Absolute Floating) */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        {userProfilePicture || user?.hasImage ? (
                            <Image
                                source={{ uri: userProfilePicture || user?.imageUrl }}
                                style={styles.avatarImage}
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
                        style={styles.cameraButton}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Camera size={14} color="#ffffff" strokeWidth={2.5} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <Text style={styles.nameText}>
                    {userName || "XYZ"}
                </Text>

                {/* Badges */}
                <View style={styles.badgesContainer}>
                    <View style={[styles.roleBadge, roleConfig.badgeStyle]}>
                        {roleConfig.icon}
                        <Text style={[styles.roleBadgeText, roleConfig.textStyle]}>
                            {role}
                        </Text>
                    </View>

                    <View style={styles.statusBadge}>
                        <CheckCircle2 size={12} color="#16a34a" strokeWidth={2.5} />
                        <Text style={styles.statusBadgeText}>
                            Online
                        </Text>
                    </View>
                </View>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity
                onPress={handleSignOut}
                activeOpacity={0.7}
                style={styles.logoutButton}
            >
                <LogOut size={18} color="#e11d48" strokeWidth={2.5} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <CustomAlert {...alertConfig} />
        </View>
    );
};