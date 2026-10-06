import { StyleSheet } from 'react-native';

export const customAlertStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // bg-slate-900/40
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24, // px-6
    },
    modalCard: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: 384, // max-w-sm
        borderRadius: 24, // rounded-3xl
        padding: 24, // p-6
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10, // shadow-xl
    },
    titleText: {
        fontSize: 18, // text-lg
        fontWeight: '700', // font-bold
        color: '#0f172a', // slate-900
        textAlign: 'center',
        marginBottom: 8, // mb-2
    },
    messageText: {
        fontSize: 14, // text-sm
        fontWeight: '500', // font-medium
        color: '#64748b', // slate-500
        textAlign: 'center',
        marginBottom: 24, // mb-6
        lineHeight: 22, // leading-relaxed
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12, // gap-3
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14, // py-3.5
        borderRadius: 12, // rounded-xl
        backgroundColor: '#f1f5f9', // slate-100
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
    },
    cancelText: {
        fontSize: 14, // text-sm
        fontWeight: '700', // font-bold
        color: '#475569', // slate-600
    },
    confirmButtonBase: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    confirmPrimary: {
        backgroundColor: '#0284c7', // sky-600
    },
    confirmDestructive: {
        backgroundColor: '#e11d48', // rose-600
    },
    confirmText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    }
});

// Add to src/components/style/sheet.ts

export const searchableSelectStyles = StyleSheet.create({
    container: {
        marginBottom: 16, // mb-4
        position: 'relative',
        zIndex: 50,
    },
    label: {
        fontSize: 11, // text-[11px]
        color: '#94a3b8', // slate-400
        fontWeight: '700', // font-bold
        textTransform: 'uppercase',
        letterSpacing: 1, // tracking-wider
        marginBottom: 6, // mb-1.5
    },
    triggerBase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 1,
        height: 48, // h-12
        paddingHorizontal: 12, // px-3
    },
    triggerClosed: {
        borderRadius: 12, // rounded-xl
        borderColor: '#e2e8f0', // slate-200
    },
    triggerOpen: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: '#cbd5e1', // slate-300
        borderBottomWidth: 0,
    },
    triggerDisabled: {
        opacity: 0.6,
        backgroundColor: '#f1f5f9', // slate-100
    },
    triggerTextBase: {
        fontSize: 14, // text-sm
        fontWeight: '600', // font-semibold
    },
    triggerTextSelected: {
        color: '#0f172a', // slate-900
    },
    triggerTextPlaceholder: {
        color: '#94a3b8', // slate-400
    },
    dropdownContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cbd5e1', // slate-300
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // shadow-sm
    },
    searchContainer: {
        padding: 8, // p-2
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9', // slate-100
        backgroundColor: '#f8fafc', // slate-50
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        borderRadius: 8, // rounded-lg
        paddingHorizontal: 8, // px-2
        height: 40, // h-10
    },
    searchInputText: {
        flex: 1,
        marginLeft: 8, // ml-2
        fontSize: 12, // text-xs
        fontWeight: '500', // font-medium
        color: '#0f172a', // slate-900 (LOCKED IN TO PREVENT DARK MODE INVERSION BUG)
    },
    clearButton: {
        padding: 4, // p-1
    },
    scrollView: {
        maxHeight: 200,
    },
    listItemBase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16, // px-4
        paddingVertical: 12, // py-3
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc', // slate-50
    },
    listItemNormal: {
        backgroundColor: '#ffffff',
    },
    listItemSelected: {
        backgroundColor: 'rgba(240, 249, 255, 0.5)', // sky-50/50
    },
    listItemTextBase: {
        fontSize: 12, // text-xs
    },
    listItemTextNormal: {
        fontWeight: '500', // font-medium
        color: '#334155', // slate-700
    },
    listItemTextSelected: {
        fontWeight: '700', // font-bold
        color: '#0369a1', // sky-700
    },
    emptyContainer: {
        paddingVertical: 24, // py-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 12, // text-xs
        color: '#94a3b8', // slate-400
    }
});