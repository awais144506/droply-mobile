import { StyleSheet } from 'react-native';

export const walletScreenStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // bg-slate-50
    },
    header: {
        paddingHorizontal: 20, // px-5
        paddingVertical: 16, // py-4
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // slate-200
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // gap-3
        zIndex: 10,
    },
    headerIconContainer: {
        height: 40, // h-10
        width: 40, // w-10
        borderRadius: 12, // rounded-xl
        backgroundColor: '#f0f9ff', // sky-50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0f2fe', // sky-100
    },
    headerTitle: {
        fontSize: 18, // text-lg
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
    },
    headerSubtitle: {
        fontSize: 11, // text-[11px]
        fontWeight: '700', // font-bold
        color: '#94a3b8', // slate-400
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16, // px-4
        paddingTop: 16, // pt-4
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12, // gap-3
        marginBottom: 24, // mb-6
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        borderRadius: 12, // rounded-xl
        padding: 12, // p-3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // gap-2
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    actionButtonText: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#334155', // slate-700
    }
});

export const walletSummaryDetailsStyle = StyleSheet.create({
    card: {
        backgroundColor: '#0f172a', // slate-900
        borderRadius: 16, // rounded-xl
        padding: 24, // p-6
        marginBottom: 24, // mb-6
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24, // mb-8
        zIndex: 10,
    },
    datePill: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
        paddingHorizontal: 16, // px-4
        paddingVertical: 8, // py-2
        borderRadius: 8, // rounded-lg
        borderWidth: 1,
        borderColor: '#475569', // slate-600
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
    },
    dateText: {
        color: '#cbd5e1', // slate-300
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        letterSpacing: 0.5, // tracking-wide
    },
    iconCircle: {
        height: 40,
        width: 40,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    cashSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    cashColumn: {
        flex: 1,
    },
    cashColumnRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    sectionLabel: {
        color: '#94a3b8', // slate-400
        fontSize: 10, // text-[10px]
        fontWeight: '800', // font-extrabold
        textTransform: 'uppercase',
        letterSpacing: 1.5, // tracking-widest
        marginBottom: 4, // mb-1
    },
    targetAmountText: {
        color: '#cbd5e1', // slate-300
        fontSize: 20,
        fontWeight: '700',
    },
    actualAmountText: {
        color: '#38bdf8', // sky-400 (Highlight actual collection)
        fontSize: 24, // text-2xl
        fontWeight: '800', // font-bold
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(51, 65, 85, 0.5)', // subtle divider
        marginBottom: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        flex: 1,
    },
    metricIconWrapper: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)', // subtle purple
        padding: 6,
        borderRadius: 8,
    },
    iconDistance: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // subtle emerald
    },
    iconEmpties: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)', // subtle amber
    },
    metricLabel: {
        color: '#64748b', // slate-500
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 2,
    },
    metricValue: {
        color: '#f8fafc', // slate-50
        fontSize: 14,
        fontWeight: '700',
    },
    metricSubValue: {
        color: '#64748b',
        fontSize: 12,
    },
    cancelledText: {
        color: '#ef4444', // red-500
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    }
});

export const historyStyles = StyleSheet.create({
    loadingContainer: {
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginTop: 8,
    },
    loadingText: {
        color: '#94a3b8',
        marginTop: 12,
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    emptyContainer: {
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderStyle: 'dashed',
        marginTop: 8,
    },
    emptyIconWrapper: {
        height: 56,
        width: 56,
        backgroundColor: '#f8fafc',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyTitle: {
        color: '#1e293b',
        fontWeight: '800',
        fontSize: 16,
    },
    emptySub: {
        color: '#94a3b8',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 4,
    },
    container: {
        marginBottom: 32,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
        marginBottom: 12,
        paddingHorizontal: 8,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    listCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemRow: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    iconBubble: {
        height: 44,
        width: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    itemHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemTitle: {
        fontWeight: '800',
        color: '#1e293b',
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    itemTime: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
    },
    itemDesc: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
        lineHeight: 18,
    }
});

export const addFuelExpenseModalStyle = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // bg-slate-900/40
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    keyboardView: {
        width: '100%',
        maxWidth: 384, // max-w-sm
    },
    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24, // rounded-3xl
        padding: 24, // p-6
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10, // shadow-xl
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24, // mb-6
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a', // slate-900
    },
    closeBtn: {
        height: 32,
        width: 32,
        backgroundColor: '#f1f5f9', // slate-100
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 12, // gap-3
        marginBottom: 24, // mb-6
    },
    categoryBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
    },
    categoryInactive: {
        backgroundColor: '#f8fafc', // slate-50
        borderColor: '#e2e8f0', // slate-200
    },
    petrolActive: {
        backgroundColor: '#f0f9ff', // sky-50
        borderColor: '#bae6fd', // sky-200
    },
    maintActive: {
        backgroundColor: '#fffbeb', // amber-50
        borderColor: '#fef3c7', // amber-100
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
    },
    textInactive: {
        color: '#475569', // slate-600
    },
    petrolTextActive: {
        color: '#0369a1', // sky-700
    },
    maintTextActive: {
        color: '#b45309', // amber-700
    },
    inputsContainer: {
        gap: 16, // gap-4
        marginBottom: 24, // mb-6
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputBase: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#0f172a',
        fontWeight: '600',
        fontSize: 16,
    },
    inputNormal: {
        borderColor: '#e2e8f0',
    },
    inputError: {
        borderColor: '#fb7185', // rose-400
    },
    errorText: {
        color: '#f43f5e', // rose-500
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
        marginLeft: 4,
    },
    submitBtn: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    submitBtnValid: {
        backgroundColor: '#0284c7', // sky-600
    },
    submitBtnInvalid: {
        backgroundColor: '#cbd5e1', // slate-300
    },
    submitBtnText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 16,
    }
});