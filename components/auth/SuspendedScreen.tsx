// src/components/auth/SuspendedScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, StyleSheet } from 'react-native';
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
        Linking.openURL('https://wa.me/923116631476');
    };
    const handleEmail = () => {
        Linking.openURL('mailto:help@dedroply.pk');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <View style={styles.iconCircle}>
                    <UserX size={48} color="#e11d48" strokeWidth={1.5} />
                </View>
                <Text style={styles.titleText}>
                    Access Suspended
                </Text>
                <Text style={styles.subtitleText}>
                    Hi {userName.split(' ')[0]}, your {role.toLowerCase()} account has been temporarily suspended.
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={styles.cardIconWrapper}>
                        <ShieldAlert size={20} color="#64748b" />
                    </View>
                    <View>
                        <Text style={styles.cardLabel}>Account Status</Text>
                        <Text style={styles.statusText}>Suspended</Text>
                    </View>
                </View>

                {/* Show branch info if applicable */}
                {branchId && (
                    <View style={[styles.cardRow, styles.alignStart]}>
                        <View style={styles.cardIconWrapper}>
                            <Building2 size={20} color="#64748b" />
                        </View>
                        <View style={styles.branchInfoWrapper}>
                            <Text style={styles.cardLabelMargin}>Assigned Branch</Text>

                            {isLoading ? (
                                <View style={styles.loadingRow}>
                                    <ActivityIndicator size="small" color="#94a3b8" />
                                    <Text style={styles.loadingText}>Loading details...</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.branchName} numberOfLines={1}>
                                        {branch?.displayName || branchId}
                                    </Text>
                                    {branch?.displayAddress && (
                                        <View style={styles.addressRow}>
                                            <MapPin size={12} color="#94a3b8" />
                                            <Text style={styles.addressText} numberOfLines={2}>
                                                {branch.displayAddress}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDesc}>
                    If you believe this is a mistake, or if your subscription payment is pending, please contact your branch manager or reach out to Droply Admin directly.
                </Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleWhatsApp}
                        style={styles.whatsappBtn}
                    >
                        <MessageCircle size={18} color="#16a34a" />
                        <Text style={styles.whatsappText}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleEmail}
                        style={styles.emailBtn}
                    >
                        <Mail size={18} color="#0284c7" />
                        <Text style={styles.emailText}>Email Us</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleLogout}
                    style={styles.logoutBtn}
                >
                    <LogOut size={20} color="#ffffff" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // bg-slate-50
        justifyContent: 'center',
        paddingHorizontal: 24, // px-6
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32, // mb-8
        marginTop: 40, // mt-10
    },
    iconCircle: {
        height: 96, // h-24
        width: 96, // w-24
        backgroundColor: '#ffe4e6', // rose-100
        borderRadius: 48, // rounded-full
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24, // mb-6
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    titleText: {
        fontSize: 30, // text-3xl
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
        textAlign: 'center',
        marginBottom: 8, // mb-2
    },
    subtitleText: {
        fontSize: 16, // text-base
        color: '#64748b', // slate-500
        textAlign: 'center',
        paddingHorizontal: 16, // px-4
        lineHeight: 24, // leading-relaxed
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16, // rounded-2xl
        padding: 20, // p-5
        marginBottom: 24, // mb-6
        borderWidth: 1,
        borderColor: '#e2e8f0', // border-slate-200
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // gap-3
        marginBottom: 16, // mb-4
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9', // border-slate-100
        paddingBottom: 16, // pb-4
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    cardIconWrapper: {
        height: 40, // h-10
        width: 40, // w-10
        backgroundColor: '#f1f5f9', // bg-slate-100
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#94a3b8', // slate-400
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    cardLabelMargin: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2, // mb-0.5
    },
    statusText: {
        fontSize: 16, // text-base
        fontWeight: '700',
        color: '#e11d48', // rose-600
    },
    branchInfoWrapper: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 40,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4, // mt-1
    },
    loadingText: {
        marginLeft: 8, // ml-2
        fontSize: 14, // text-sm
        color: '#64748b', // slate-500
    },
    branchName: {
        fontSize: 16, // text-base
        fontWeight: '700',
        color: '#1e293b', // slate-800
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6, // mt-1.5
        gap: 6, // gap-1.5
    },
    addressText: {
        fontSize: 12, // text-xs
        color: '#64748b', // slate-500
        flex: 1,
    },
    helpTitle: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#1e293b', // slate-800
        marginBottom: 12, // mb-3
    },
    helpDesc: {
        fontSize: 12, // text-xs
        color: '#64748b', // slate-500
        lineHeight: 20, // leading-relaxed
        marginBottom: 16, // mb-4
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12, // gap-3
    },
    whatsappBtn: {
        flex: 1,
        backgroundColor: 'rgba(37, 211, 102, 0.1)', // #25D366/10
        borderWidth: 1,
        borderColor: 'rgba(37, 211, 102, 0.2)', // #25D366/20
        borderRadius: 12, // rounded-xl
        paddingVertical: 12, // py-3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
    },
    whatsappText: {
        color: '#16a34a',
        fontWeight: '700',
        fontSize: 14,
    },
    emailBtn: {
        flex: 1,
        backgroundColor: '#f0f9ff', // sky-50
        borderWidth: 1,
        borderColor: '#e0f2fe', // sky-100
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emailText: {
        color: '#0369a1', // sky-700
        fontWeight: '700',
        fontSize: 14,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 24, // mb-6
    },
    logoutBtn: {
        width: '100%',
        height: 56, // h-14
        backgroundColor: '#0f172a', // slate-900
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // shadow-md
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 16, // text-base
        fontWeight: '700', // font-bold
    }
});