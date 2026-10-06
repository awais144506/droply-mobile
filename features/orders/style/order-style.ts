// src/features/orders/style/order-style.ts
import { StyleSheet } from 'react-native';

export const ordersScreenStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // slate-50
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
    scrollContent: {
        paddingBottom: 120,
    },
    actionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24, // mb-6
    },
    actionCardPrimary: {
        width: '48%',
        backgroundColor: '#0284c7', // sky-600
        padding: 16, // p-4
        borderRadius: 24, // rounded-3xl
        marginBottom: 12, // mb-3
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    actionCardSecondary: {
        width: '48%',
        backgroundColor: '#1e293b', // slate-800
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    actionIconPrimary: {
        height: 40,
        width: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // white/20
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionIconSecondary: {
        height: 40,
        width: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // white/10
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        color: '#ffffff',
        fontWeight: '700', // font-bold
        marginBottom: 4, // mb-1
    },
    actionSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // gap-1
    },
    actionSubtitlePrimary: {
        fontSize: 10,
        color: '#e0f2fe', // sky-100
        fontWeight: '500',
    },
    actionSubtitleSecondary: {
        fontSize: 10,
        color: '#cbd5e1', // slate-300
        fontWeight: '500',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#e2e8f0', // slate-200
        marginBottom: 24, // mb-6
    },
    listHeader: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#94a3b8',
        marginBottom: 16,
        paddingHorizontal: 4, // px-1
    },
    loadingContainer: {
        paddingVertical: 40, // py-10
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#94a3b8',
        marginTop: 16, // mt-4
        fontWeight: '500',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 24, // rounded-3xl
        borderWidth: 1,
        borderColor: '#f1f5f9', // slate-100
        borderStyle: 'dashed',
    },
    emptyIcon: {
        marginBottom: 12, // mb-3
    },
    emptyText: {
        color: '#64748b', // slate-500
        fontWeight: '700',
    },
    listContainer: {
        gap: 16, // gap-4
    }
});
export const orderCardStyles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#ffffff',
        borderRadius: 24, // rounded-3xl
        borderWidth: 1,
        borderColor: '#cbd5e1', // border-slate-300
        padding: 16, // p-4
        marginBottom: 16, // Assuming gap-4 from parent list
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // shadow-lg
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8, // gap-2
        marginBottom: 12, // mb-3
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc', // border-slate-50
        paddingBottom: 12, // pb-3
        paddingRight: 40, // pr-10
    },
    orderNoText: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#1e293b', // text-slate-800
    },
    deleteBtn: {
        position: 'absolute', // Taking place of z-10 / right positioning
        right: 0,
        top: 0,
        height: 32, // h-8
        width: 32, // w-8
        backgroundColor: '#fff1f2', // bg-rose-50
        borderRadius: 16, // rounded-full
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffe4e6', // border-rose-100
        zIndex: 10,
    },
    infoContainer: {
        marginBottom: 16, // mb-4
        paddingHorizontal: 4, // px-1
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8, // mb-2
    },
    customerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        flex: 1,
        paddingRight: 8,
    },
    customerNameText: {
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
        color: '#4338ca', // text-indigo-700
    },
    statusBadgeBase: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
        paddingHorizontal: 8, // px-2
        paddingVertical: 2, // py-0.5
        borderRadius: 8, // rounded-lg
        borderWidth: 1,
    },
    statusBadgePending: {
        backgroundColor: '#fef3c7', // bg-amber-100
        borderColor: '#fde68a', // border-amber-200
    },
    statusBadgeDone: {
        backgroundColor: '#d1fae5', // bg-emerald-100
        borderColor: '#a7f3d0', // border-emerald-200
    },
    statusTextBase: {
        fontSize: 9, // text-[9px]
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    statusTextPending: {
        color: '#b45309', // text-amber-700
    },
    statusTextDone: {
        color: '#047857', // text-emerald-700
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        marginBottom: 8, // mb-2
    },
    phoneText: {
        fontSize: 12, // text-xs
        fontWeight: '500', // font-medium
        color: '#475569', // text-slate-600
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8, // gap-2
    },
    addressIcon: {
        marginTop: 2, // mt-0.5
    },
    addressText: {
        fontSize: 12, // text-xs
        color: '#64748b', // text-slate-500
        flex: 1,
        lineHeight: 18, // leading-relaxed
    },
    footerBox: {
        backgroundColor: '#f8fafc', // bg-slate-50
        borderRadius: 16, // rounded-2xl
        padding: 12, // p-3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f1f5f9', // border-slate-100
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
    },
    footerLabel: {
        fontSize: 9, // text-[9px]
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        color: '#94a3b8', // text-slate-400
        letterSpacing: 1, // tracking-wider
        marginBottom: 2, // mb-0.5 (used in Total)
    },
    timeValue: {
        fontSize: 12, // text-xs
        fontWeight: '600', // font-semibold
        color: '#334155', // text-slate-700
    },
    totalBox: {
        alignItems: 'flex-end',
    },
    totalValue: {
        fontSize: 14, // text-sm
        fontWeight: '800', // font-extrabold
        color: '#0284c7', // text-sky-600
    }
});
export const addCustomerStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // slate-50
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20, // px-5
        paddingVertical: 16, // py-4
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // slate-200
        flexDirection: 'row',
        alignItems: 'center',
        gap: 56, // gap-14
        zIndex: 10,
    },
    backButton: {
        height: 36, // h-9
        width: 36, // w-9
        backgroundColor: '#1e293b', // slate-800
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // gap-3
    },
    headerIconWrapper: {
        height: 40, // h-10
        width: 40, // w-10
        borderRadius: 12, // rounded-xl
        backgroundColor: '#f0f9ff', // sky-50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0f2fe', // sky-100
    },
    headerTitleText: {
        fontSize: 18, // text-lg
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16, // px-4
        paddingTop: 16, // pt-4
    },
    infoBanner: {
        marginBottom: 16, // mb-4
        backgroundColor: '#f0f9ff', // sky-50
        borderWidth: 1,
        borderColor: '#bae6fd', // sky-200
        padding: 14, // p-3.5
        borderRadius: 16, // rounded-2xl
    },
    infoTitle: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#0c4a6e', // sky-900
        marginBottom: 2, // mb-0.5
    },
    infoText: {
        fontSize: 11, // text-[11px]
        color: '#0369a1', // sky-700
        lineHeight: 18, // leading-relaxed
    },
    formCard: {
        backgroundColor: '#ffffff',
        padding: 16, // p-4
        borderRadius: 16, // rounded-2xl
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        marginBottom: 24, // mb-6
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    formCardTitle: {
        fontSize: 11, // text-[11px]
        color: '#94a3b8', // slate-400
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
        marginBottom: 12, // mb-3
    },
    inputsContainer: {
        gap: 16, // gap-4
    },
    inputWrapperBase: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 1,
        borderRadius: 12, // rounded-xl
        paddingHorizontal: 12, // px-3
        height: 48, // h-12
        overflow: 'hidden',
    },
    inputWrapperNormal: {
        borderColor: '#e2e8f0', // slate-200
    },
    inputWrapperError: {
        borderColor: '#fb7185', // rose-400
        backgroundColor: 'rgba(255, 241, 242, 0.3)', // rose-50/30
    },
    textInput: {
        flex: 1,
        marginLeft: 8, // ml-2
        fontSize: 14, // text-sm
        fontWeight: '600', // font-semibold
        color: '#0f172a', // slate-900
    },
    errorText: {
        fontSize: 10, // text-[10px]
        color: '#f43f5e', // rose-500
        fontWeight: '500', // font-medium
        marginTop: 4, // mt-1
        marginLeft: 4, // ml-1
    },
    footer: {
        padding: 16, // p-4
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0', // slate-200
    },
    submitBtnBase: {
        width: '100%',
        height: 48, // h-12
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8, // gap-2
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    submitBtnValid: {
        backgroundColor: '#0284c7', // sky-600
    },
    submitBtnInvalid: {
        backgroundColor: '#9ca3af', // gray-400
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
    }
});

// Add to src/features/orders/style/order-style.ts

export const newOrderScreenStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // slate-50
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20, // px-5
        paddingVertical: 16, // py-4
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // slate-200
        flexDirection: 'row',
        alignItems: 'center',
        gap: 56, // gap-14
        zIndex: 10,
    },
    backButton: {
        height: 36, // h-9
        width: 36, // w-9
        backgroundColor: '#1e293b', // slate-800
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // gap-3
    },
    headerIconWrapper: {
        height: 40, // h-10
        width: 40, // w-10
        borderRadius: 12, // rounded-xl
        backgroundColor: '#f0f9ff', // sky-50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0f2fe', // sky-100
    },
    headerTitleText: {
        fontSize: 18, // text-lg
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16, // px-4
        paddingTop: 20, // pt-5
    },
    scrollContent: {
        paddingBottom: 40,
    },
    footer: {
        padding: 16, // p-4
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0', // slate-200
    },
    submitBtnBase: {
        width: '100%',
        height: 48, // h-12
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8, // gap-2
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    submitBtnValid: {
        backgroundColor: '#0284c7', // sky-600
    },
    submitBtnInvalid: {
        backgroundColor: '#9ca3af', // gray-400
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 16, // text-base
        fontWeight: '700', // font-bold
    }
});

// Add to src/features/orders/style/order-style.ts

export const scheduleCardStyles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#ffffff',
        padding: 20, // p-5
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // border-slate-200
        marginBottom: 24, // mb-6
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
        marginBottom: 16, // mb-4
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
    },
    titleText: {
        fontSize: 11, // text-[11px]
        color: '#94a3b8', // text-slate-400
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12, // gap-3
    },
    buttonBase: {
        flex: 1,
        paddingVertical: 12, // py-3
        borderRadius: 12, // rounded-xl
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActive: {
        backgroundColor: '#f0f9ff', // bg-sky-50
        borderColor: '#7dd3fc', // border-sky-300
    },
    buttonInactive: {
        backgroundColor: '#f8fafc', // bg-slate-50
        borderColor: '#e2e8f0', // border-slate-200
    },
    buttonTextBase: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
    },
    buttonTextActive: {
        color: '#0369a1', // text-sky-700
    },
    buttonTextInactive: {
        color: '#475569', // text-slate-600
    }
});

// Add to src/features/orders/style/order-style.ts

export const customerCardStyles = StyleSheet.create({
    loadingCard: {
        backgroundColor: '#ffffff',
        padding: 24, // p-6
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        marginBottom: 16, // mb-4
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    loadingText: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#94a3b8', // slate-400
        marginTop: 12, // mt-3
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    cardBase: {
        backgroundColor: '#ffffff',
        padding: 20, // p-5
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        marginBottom: 16, // mb-4
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        marginBottom: 16, // mb-4
    },
    headerText: {
        fontSize: 11, // text-[11px]
        color: '#1e293b', // slate-800
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    formContainer: {
        gap: 12, // gap-3
    },
    disabledWrapper: {
        opacity: 0.5,
    },
    errorText: {
        fontSize: 10, // text-[10px]
        fontWeight: '700', // font-bold
        color: '#f43f5e', // rose-500
        marginTop: 4, // mt-1
        marginLeft: 4, // ml-1
    },
    warningText: {
        fontSize: 10, // text-[10px]
        fontWeight: '700', // font-bold
        color: '#f59e0b', // amber-500
        marginTop: 4, // mt-1
        marginLeft: 4, // ml-1
    },
    ledgerContainer: {
        marginTop: 20, // mt-5
        paddingTop: 16, // pt-4
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9', // slate-100
        flexDirection: 'row',
        gap: 12, // gap-3
    },
    ledgerBlockBase: {
        flex: 1,
        padding: 12, // p-3
        borderRadius: 16, // rounded-2xl
        borderWidth: 1,
    },
    ledgerBad: {
        backgroundColor: '#fff1f2', // rose-50
        borderColor: '#fecdd3', // rose-200
    },
    ledgerGood: {
        backgroundColor: '#ecfdf5', // emerald-50
        borderColor: '#bbf7d0', // emerald-200
    },
    ledgerReturnables: {
        backgroundColor: '#f0f9ff', // sky-50
        borderColor: '#bae6fd', // sky-200
    },
    ledgerHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
        marginBottom: 4, // mb-1
    },
    ledgerLabelBase: {
        fontSize: 10, // text-[10px]
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    ledgerLabelBad: {
        color: '#e11d48', // rose-600
    },
    ledgerLabelGood: {
        color: '#047857', // emerald-700
    },
    ledgerLabelReturnables: {
        color: '#0369a1', // sky-700
    },
    ledgerValueBase: {
        fontSize: 16, // text-base
        fontWeight: '800', // font-extrabold
    },
    ledgerValueBad: {
        color: '#be123c', // rose-700
    },
    ledgerValueGood: {
        color: '#047857', // emerald-700
    },
    ledgerValueReturnables: {
        color: '#075985', // sky-800
    }
});

// Add to src/features/orders/style/order-style.ts

export const productCartStyles = StyleSheet.create({
    container: {
        marginBottom: 16, // mb-4
    },
    cardBase: {
        backgroundColor: '#ffffff',
        padding: 20, // p-5
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    addProductCard: {
        zIndex: 50,
    },
    cartListCard: {
        marginTop: 16, // mt-4
        zIndex: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        marginBottom: 16, // mb-4
    },
    headerText: {
        fontSize: 11, // text-[11px]
        color: '#1e293b', // slate-800
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    stockInfoBox: {
        marginTop: 12, // mt-3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc', // slate-50
        padding: 12, // p-3
        borderRadius: 12, // rounded-xl
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
    },
    stockLabel: {
        fontSize: 10, // text-[10px]
        fontWeight: '700', // font-bold
        color: '#94a3b8', // slate-400
        textTransform: 'uppercase',
    },
    priceValue: {
        fontSize: 14, // text-sm
        fontWeight: '800', // font-extrabold
        color: '#1e293b', // slate-800
    },
    stockRightBlock: {
        alignItems: 'flex-end',
    },
    stockValueBase: {
        fontSize: 14, // text-sm
        fontWeight: '800', // font-extrabold
    },
    stockGood: {
        color: '#059669', // emerald-600
    },
    stockBad: {
        color: '#e11d48', // rose-600
    },
    inputRow: {
        marginTop: 16, // mt-4
        flexDirection: 'row',
        gap: 12, // gap-3
    },
    qtyInputBlock: {
        flex: 1,
        justifyContent: 'center',
    },
    qtyLabel: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#334155', // slate-700
        marginBottom: 6, // mb-1.5
        marginLeft: 4, // ml-1
    },
    qtyInputBase: {
        height: 48, // h-12
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 1,
        borderRadius: 12, // rounded-xl
        paddingHorizontal: 16, // px-4
        fontSize: 16, // text-base
        fontWeight: '700', // font-bold
        color: '#0f172a', // slate-900 (LOCKED IN)
    },
    qtyInputNormal: {
        borderColor: '#e2e8f0', // slate-200
    },
    qtyInputDisabled: {
        opacity: 0.5,
        borderColor: '#e2e8f0',
    },
    qtyInputError: {
        borderColor: '#fb7185', // rose-400
        backgroundColor: 'rgba(255, 241, 242, 0.5)', // rose-50/50
        color: '#be123c', // rose-700
    },
    addBtnBlock: {
        justifyContent: 'flex-end',
    },
    addBtnBase: {
        height: 48, // h-12
        paddingHorizontal: 24, // px-6
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8, // gap-2
    },
    addBtnActive: {
        backgroundColor: '#0f172a', // slate-900
    },
    addBtnInactive: {
        backgroundColor: '#e2e8f0', // slate-200
    },
    addBtnTextBase: {
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
    },
    addBtnTextActive: {
        color: '#ffffff',
    },
    addBtnTextInactive: {
        color: '#94a3b8', // slate-400
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, // gap-1.5
        marginTop: 12, // mt-3
        backgroundColor: '#fff1f2', // rose-50
        padding: 10, // p-2.5
        borderRadius: 8, // rounded-lg
        borderWidth: 1,
        borderColor: '#ffe4e6', // rose-100
    },
    errorText: {
        fontSize: 12, // text-xs
        fontWeight: '600', // font-semibold
        color: '#e11d48', // rose-600
        flex: 1,
    },
    cartListContainer: {
        gap: 10, // gap-2.5
    },
    cartItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc', // slate-50
        padding: 14, // p-3.5
        borderRadius: 16, // rounded-2xl
        borderWidth: 1,
        borderColor: '#f1f5f9', // slate-100
    },
    cartItemInfo: {
        flex: 1,
        paddingRight: 12, // pr-3
    },
    cartItemName: {
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
        color: '#1e293b', // slate-800
    },
    cartItemSub: {
        fontSize: 12, // text-xs
        fontWeight: '600', // font-semibold
        color: '#64748b', // slate-500
        marginTop: 2, // mt-0.5
    },
    cartItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // gap-4
    },
    cartItemTotal: {
        fontSize: 14, // text-sm
        fontWeight: '800', // font-extrabold
        color: '#0369a1', // sky-700
    },
    deleteBtn: {
        height: 36, // h-9
        width: 36, // w-9
        backgroundColor: '#fff1f2', // rose-50
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffe4e6', // rose-100
    }
});

// Add to src/features/orders/style/order-style.ts

export const financialsCardStyles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#ffffff',
        padding: 20, // p-5
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        marginBottom: 16, // mb-4
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
        marginBottom: 20, // mb-5
    },
    headerText: {
        fontSize: 11, // text-[11px]
        color: '#94a3b8', // slate-400
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    rowsContainer: {
        gap: 16, // gap-4
    },
    standardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4, // px-1
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    labelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
    },
    subtotalLabel: {
        fontSize: 14, // text-sm
        fontWeight: '600', // font-semibold
        color: '#64748b', // slate-500
    },
    subtotalValue: {
        fontSize: 14,
        fontWeight: '700', // font-bold
        color: '#0f172a', // slate-900
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155', // slate-700
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        borderRadius: 8, // rounded-lg
        paddingHorizontal: 12, // px-3
        height: 40, // h-10
        width: 112, // w-28
    },
    inputPrefix: {
        fontSize: 12, // text-xs
        fontWeight: '700', // font-bold
        color: '#94a3b8', // slate-400
        marginRight: 4, // mr-1
    },
    inputField: {
        flex: 1,
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
        color: '#0f172a', // slate-900 (LOCKED IN)
        textAlign: 'right',
        height: '100%',
        paddingVertical: 0, // Reset RN default padding
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#f1f5f9', // slate-100
        marginVertical: 4, // my-1
    },
    currentOrderLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b', // slate-800
    },
    currentOrderValue: {
        fontSize: 14,
        fontWeight: '800', // font-extrabold
        color: '#0f172a', // slate-900
    },
    debtLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#e11d48', // rose-600
    },
    debtValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#e11d48',
    },
    grandTotalBox: {
        marginTop: 28, // mt-7
        backgroundColor: '#f0f9ff', // sky-50
        padding: 16, // p-4
        borderRadius: 16, // rounded-2xl
        borderWidth: 1,
        borderColor: '#bae6fd', // sky-200
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    grandTotalLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // gap-2
    },
    grandTotalIconWrapper: {
        height: 32, // h-8
        width: 32, // w-8
        backgroundColor: '#e0f2fe', // sky-100
        borderRadius: 8, // rounded-lg
        alignItems: 'center',
        justifyContent: 'center',
    },
    grandTotalLabel: {
        fontSize: 10, // text-[10px]
        fontWeight: '700',
        color: '#0284c7', // sky-600
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
    },
    grandTotalSub: {
        fontSize: 10,
        color: 'rgba(2, 132, 199, 0.7)', // sky-600/70
        fontWeight: '500', // font-medium
        lineHeight: 14, // leading-tight
    },
    grandTotalValue: {
        fontSize: 24, // text-2xl
        fontWeight: '900', // font-black
        color: '#075985', // sky-800
    }
});