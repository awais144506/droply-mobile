// src/styles/components.ts
import { StyleSheet } from 'react-native';

export const footerStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
        marginBottom: 32,
        opacity: 0.8,
    },
    logo: { width: 70, height: 48, opacity: 0.6 },
    titleText: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase' },
    versionText: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 4 },
    copyrightText: { fontSize: 10, fontWeight: '500', color: '#94a3b8', marginTop: 10 }
});


export const assignedZonesStyles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 8 },
    headerTitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#f1f5f9' },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
    loader: { paddingVertical: 16 },
    zoneItemBordered: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    zoneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
    zoneLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: { height: 32, width: 32, borderRadius: 8, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
    zoneName: { fontSize: 12, fontWeight: '600', color: '#1e293b', marginTop: 2 },
    customerCountText: { fontSize: 12, fontWeight: '600', color: '#1e293b', marginTop: 2 },
    customerCountHighlight: { color: '#d97706', fontSize: 14 },
    emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 16, fontWeight: '500' }
});

export const informationStyles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24, // rounded-3xl
        borderWidth: 1,
        borderColor: '#f1f5f9', // slate-100
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 11,
        fontWeight: '800', // extrabold
        textTransform: 'uppercase',
        letterSpacing: 1.5, // tracking-widest
        color: '#94a3b8', // slate-400
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
        backgroundColor: '#f8fafc', // slate-50
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700', // bold
        color: '#64748b', // slate-500
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // gap-4
        paddingVertical: 12, // py-3
    },
    rowBorderTop: {
        borderTopWidth: 1,
        borderTopColor: '#f8fafc', // slate-50
    },
    iconWrapper: {
        height: 40, // h-10
        width: 40, // w-10
        borderRadius: 12, // rounded-xl
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2, // mb-0.5
    },
    rowValue: {
        fontSize: 14, // text-sm
        fontWeight: '700',
        color: '#1e293b', // slate-800
    }
});

export const branchSettingsStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16, // rounded-2xl
        borderWidth: 1,
        borderColor: '#f1f5f9', // slate-100
        marginBottom: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    logoImage: {
        width: 64, // w-16
        height: 64, // h-16
        borderRadius: 32, // rounded-full
        backgroundColor: '#f8fafc', // slate-50
        marginRight: 16, // mr-4
        borderWidth: 1,
        borderColor: '#f1f5f9', // slate-100
    },
    fallbackLogoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eff6ff', // blue-50
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#dbeafe', // blue-100
    },
    fallbackLogoText: {
        fontSize: 20, // text-xl
        fontWeight: '800', // font-extrabold
        color: '#3b82f6', // blue-500
        textTransform: 'uppercase',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    branchNameText: {
        fontSize: 18, // text-lg
        fontWeight: '700', // font-bold
        color: '#1e293b', // slate-800
        marginBottom: 4, // mb-1
    },
    phoneText: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#64748b', // slate-500
        marginBottom: 2, // mb-0.5
    },
    addressText: {
        fontSize: 12, // text-xs
        fontWeight: '500', // font-medium
        color: '#94a3b8', // slate-400
        lineHeight: 16, // leading-tight
    }
});

export const profileDetailsStyles = StyleSheet.create({
    container: {
        marginBottom: 16, // mb-4
        marginTop: 8, // mt-2
    },
    mainCard: {
        backgroundColor: '#ffffff',
        borderRadius: 32, // rounded-[32px]
        padding: 24, // p-6
        alignItems: 'center',
        marginBottom: 16, // mb-4
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16, // mb-4
    },
    avatarWrapper: {
        height: 96, // h-24
        width: 96, // w-24
        borderRadius: 48, // rounded-full
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 4,
        borderColor: '#f8fafc',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 32, // h-8
        width: 32, // w-8
        borderRadius: 16, // rounded-full
        backgroundColor: '#0ea5e9', // sky-500
        borderWidth: 2,
        borderColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // shadow-md
    },
    nameText: {
        fontSize: 20, // text-xl
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
        textAlign: 'center',
        letterSpacing: -0.5, // tracking-tight
        marginBottom: 8, // mb-2
    },
    badgesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
        backgroundColor: '#f0f9ff', // sky-50
        paddingHorizontal: 12, // px-3
        paddingVertical: 6, // py-1.5
        borderRadius: 9999, // rounded-full
    },
    roleBadgeText: {
        fontSize: 11, // text-[11px]
        fontWeight: '700', // font-bold
        color: '#0369a1', // sky-700
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#ecfdf5', // emerald-50
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#047857', // emerald-700
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12, // gap-3
        backgroundColor: '#ffffff',
        paddingVertical: 16, // py-4
        borderRadius: 20, // rounded-[20px]
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    logoutText: {
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
        color: '#e11d48', // rose-600
    }
});