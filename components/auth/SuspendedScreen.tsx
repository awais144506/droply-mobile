// src/components/auth/SuspendedScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { ShieldAlert, LogOut, Building2, UserX, MapPin, Mail, MessageCircle } from 'lucide-react-native';
import { useRole } from '@/lib/use-role';
import { useRiderProfile } from '@/features/profile/api/use-profile';

export default function SuspendedScreen() {
    const { signOut } = useAuth();
    const { branchId, userName, role, userId } = useRole();
    const { data, isLoading } = useRiderProfile(userId || "");

    const branch = data?.branch;

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleWhatsApp = () => {
        Linking.openURL('https://wa.me/923000000000');
    };
    const handleEmail = () => {
        Linking.openURL('mailto:help@dedroply.pk');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 justify-center px-6">
            <View className="items-center mb-8 mt-10">
                <View className="h-24 w-24 bg-rose-100 rounded-full items-center justify-center mb-6 shadow-sm">
                    <UserX size={48} color="#e11d48" strokeWidth={1.5} />
                </View>
                <Text className="text-3xl font-extrabold text-slate-900 text-center mb-2">
                    Access Suspended
                </Text>
                <Text className="text-base text-slate-500 text-center px-4 leading-relaxed">
                    Hi {userName.split(' ')[0]}, your {role.toLowerCase()} account has been temporarily suspended.
                </Text>
            </View>

            <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
                <View className="flex-row items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                    <View className="h-10 w-10 bg-slate-100 rounded-xl items-center justify-center">
                        <ShieldAlert size={20} color="#64748b" />
                    </View>
                    <View>
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</Text>
                        <Text className="text-base font-bold text-rose-600">Suspended</Text>
                    </View>
                </View>

                {/* Show branch info if applicable */}
                {branchId && (
                    <View className="flex-row items-start gap-3 mb-4 border-b border-slate-100 pb-4">
                        <View className="h-10 w-10 bg-slate-100 rounded-xl items-center justify-center">
                            <Building2 size={20} color="#64748b" />
                        </View>
                        <View className="flex-1 justify-center min-h-[40px]">
                            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Branch</Text>

                            {isLoading ? (
                                <View className="flex-row items-center mt-1">
                                    <ActivityIndicator size="small" color="#94a3b8" />
                                    <Text className="ml-2 text-sm text-slate-500">Loading details...</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
                                        {branch?.displayName || branchId}
                                    </Text>
                                    {branch?.displayAddress && (
                                        <View className="flex-row items-center mt-1.5 gap-1.5">
                                            <MapPin size={12} color="#94a3b8" />
                                            <Text className="text-xs text-slate-500 flex-1" numberOfLines={2}>
                                                {branch.displayAddress}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <Text className="text-sm font-medium text-slate-800 mb-3">Need Help?</Text>
                <Text className="text-xs text-slate-500 leading-relaxed mb-4">
                    If you believe this is a mistake, or if your subscription payment is pending, please contact your branch manager or reach out to Droply Admin directly.
                </Text>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleWhatsApp}
                        className="flex-1 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl py-3 flex-row items-center justify-center gap-2"
                    >
                        <MessageCircle size={18} color="#16a34a" />
                        <Text className="text-[#16a34a] font-bold text-sm">WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleEmail}
                        className="flex-1 bg-sky-50 border border-sky-100 rounded-xl py-3 flex-row items-center justify-center gap-2"
                    >
                        <Mail size={18} color="#0284c7" />
                        <Text className="text-sky-700 font-bold text-sm">Email Us</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mt-auto mb-6">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleLogout}
                    className="w-full h-14 bg-slate-900 rounded-xl items-center justify-center flex-row gap-2 shadow-md"
                >
                    <LogOut size={20} color="#ffffff" />
                    <Text className="text-white text-base font-bold">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}