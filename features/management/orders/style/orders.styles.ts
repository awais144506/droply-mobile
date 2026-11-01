import { StyleSheet } from 'react-native';

export const OrderListStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // Slate-50 background
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 16,
    },

    // Header Section
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.4,
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 2,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#bae6fd',
        gap: 6,
    },
    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#0284c7',
    },
    liveBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0369a1',
    },

    // Summary Strip
    summaryGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        marginTop: 4,
    },

    // Order Request Card
    cardList: {
        gap: 12,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderCode: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0f172a',
    },
    timeText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#94a3b8',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Customer Section inside Card
    customerBox: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    customerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        flex: 1,
    },
    zonePill: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    zonePillText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0284c7',
    },
    customerSubText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 4,
    },

    // Items List inside Card
    itemsContainer: {
        gap: 6,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        flex: 1,
        marginRight: 8,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemQtyBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: '800',
        color: '#0f172a',
    },
    itemPrice: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        minWidth: 65,
        textAlign: 'right',
    },

    // Notes Box
    notesBox: {
        backgroundColor: '#fffbeb',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    notesText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#b45309',
    },

    // Card Footer (Total)
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0284c7',
    },

    // Empty State
    emptyContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 48,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        textAlign: 'center',
    },

    // Add these inside your styles object, right below customerSubText
    contactActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    actionBtnCall: {
        backgroundColor: '#f0f9ff',
        borderColor: '#bae6fd',
    },
    actionBtnWa: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    actionBtnTextCall: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0284c7',
    },
    actionBtnTextWa: {
        fontSize: 11,
        fontWeight: '700',
        color: '#16a34a',
    },

    // --- BOTTOM SHEET SLIDER STYLES ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // Dimmed slate background
    },
    bottomSheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40, // Extra padding for safe area at the bottom
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#cbd5e1',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 16,
        textAlign: 'center',
    },
    sheetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 12,
    },
    sheetBtnBusiness: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    sheetBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    sheetBtnTextBusiness: {
        color: '#16a34a',
    },
    sheetCancelBtn: {
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    sheetCancelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#64748b',
    },
});