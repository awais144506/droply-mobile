// src/features/rider/orders/style/add-customer-style.ts
import { StyleSheet, Platform } from 'react-native';

export const addCustomerStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // slate-50
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // slate-200
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        zIndex: 10,
    },
    backButton: {
        height: 38,
        width: 38,
        backgroundColor: '#1e293b', // slate-800
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerIconWrapper: {
        height: 40,
        width: 40,
        borderRadius: 12,
        backgroundColor: '#f0f9ff', // sky-50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0f2fe', // sky-100
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a', // slate-900
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    infoBanner: {
        marginBottom: 16,
        backgroundColor: '#f0f9ff', // sky-50
        borderWidth: 1,
        borderColor: '#bae6fd', // sky-200
        padding: 16,
        borderRadius: 20, // rounded-2xl
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0c4a6e', // sky-900
        marginBottom: 4,
    },
    infoText: {
        fontSize: 11.5,
        color: '#0369a1', // sky-700
        lineHeight: 18,
        fontWeight: '500',
    },
    formCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 24, // rounded-[24px]
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    formCardTitle: {
        fontSize: 11,
        color: '#94a3b8', // slate-400
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    inputsContainer: {
        gap: 16,
    },
    inputWrapperBase: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc', // slate-50
        borderWidth: 1.5,
        borderRadius: 14, // rounded-xl+
        paddingHorizontal: 14,
        height: 52,
        overflow: 'hidden',
    },
    inputWrapperNormal: {
        borderColor: '#e2e8f0', // slate-200
    },
    inputWrapperError: {
        borderColor: '#fb7185', // rose-400
        backgroundColor: 'rgba(255, 241, 242, 0.4)',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a', // slate-900
    },
    errorText: {
        fontSize: 10.5,
        color: '#f43f5e', // rose-500
        fontWeight: '700',
        marginTop: 5,
        marginLeft: 4,
    },
    footer: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0', // slate-200
    },
    submitBtnBase: {
        width: '100%',
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    submitBtnValid: {
        backgroundColor: '#0284c7', // sky-600
    },
    submitBtnInvalid: {
        backgroundColor: '#cbd5e1', // slate-300
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    }
});