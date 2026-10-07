import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, MapPin, Phone, Package, Banknote, CheckCircle2, CreditCard, Wallet } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

interface SettlementPayload {
    deductedAdvance: number;
    collectedAmount: number;
    paymentMethod: 'CASH' | 'ONLINE';
}

interface RiderOrderSettlementViewProps {
    order: RiderActiveOrder;
    onClose: () => void;
    onComplete: (orderId: string, settlementData: SettlementPayload) => void;
}

export default function RiderOrderSettlementView({ order, onClose, onComplete }: RiderOrderSettlementViewProps) {
    const availableAdvance = order.customer.customerAdvance || 0;
    const previousCredit = order.customer.customerCredit || 0;
    
    // Fallbacks for new fields
    const deliveryCharges = order.deliveryCharges || 0;
    const discountAmount = order.discount || 0;

    // State
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');
    const [useAdvance, setUseAdvance] = useState(false);
    const [advanceInput, setAdvanceInput] = useState(availableAdvance.toString());
    const [collectedInput, setCollectedInput] = useState('');

    // Calculations
    const actualAdvanceToDeduct = useAdvance ? (parseFloat(advanceInput) || 0) : 0;
    
    // Final Due: Order Total + Old Credit - The Advance amount they chose to use
    const cashDue = Math.max(order.totalAmount + previousCredit - actualAdvanceToDeduct, 0);

    const handleComplete = () => {
        onComplete(order.id, {
            deductedAdvance: actualAdvanceToDeduct,
            collectedAmount: parseFloat(collectedInput) || 0,
            paymentMethod,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settle Order</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                    {/* 1. Customer Card */}
                    <View style={styles.card}>
                        <View style={styles.customerHeader}>
                            <View style={styles.avatarIcon}>
                                <User size={20} color="#0284c7" />
                            </View>
                            <View style={styles.customerNameCol}>
                                <Text style={styles.customerLabel}>Customer</Text>
                                <Text style={styles.customerName}>{order.customer.name}</Text>
                            </View>
                        </View>
                        <View style={styles.contactRow}>
                            <Phone size={16} color="#94a3b8" style={styles.iconMargin} />
                            <Text style={styles.contactText}>{order.customer.phone}</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <MapPin size={16} color="#94a3b8" style={styles.addressIcon} />
                            <Text style={styles.addressText}>{order.customer.address}</Text>
                        </View>
                    </View>

                    {/* 2. Items & Pricing Card */}
                    <View style={styles.card}>
                        <View style={styles.itemsHeader}>
                            <Package size={20} color="#475569" style={styles.iconMarginSmall} />
                            <Text style={styles.itemsTitle}>Order Details</Text>
                        </View>

                        {/* Line Items */}
                        {order.lineItems?.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <View style={styles.itemLeft}>
                                    <View style={styles.qtyBadge}>
                                        <Text style={styles.qtyText}>{item.paidQuantity} {item.product.unitOfMeasure}</Text>
                                    </View>
                                    <Text style={styles.itemName}>{item.product.name}</Text>
                                </View>
                                <Text style={styles.itemPrice}>Rs {item.unitPrice * item.paidQuantity}</Text>
                            </View>
                        ))}

                        <View style={styles.lightDivider} />

                        {/* Additional Charges & Discounts */}
                        <View style={styles.itemRow}>
                            <Text style={styles.subText}>Delivery Charges</Text>
                            <Text style={styles.subText}>Rs {deliveryCharges}</Text>
                        </View>
                        {discountAmount > 0 && (
                            <View style={styles.itemRow}>
                                <Text style={styles.discountText}>Discount</Text>
                                <Text style={styles.discountText}>- Rs {discountAmount}</Text>
                            </View>
                        )}
                        <View style={styles.itemRow}>
                            <Text style={styles.summaryLabel}>Order Total</Text>
                            <Text style={styles.summaryLabel}>Rs {order.totalAmount}</Text>
                        </View>
                    </View>

                    {/* 3. Advance & Settlement Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Settlement</Text>
                        
                        {/* Advance Logic (Only shows if customer has advance) */}
                        {availableAdvance > 0 && (
                            <View style={styles.advanceContainer}>
                                <View style={styles.advanceToggleRow}>
                                    <View>
                                        <Text style={styles.advanceTitle}>Use Advance Balance</Text>
                                        <Text style={styles.advanceSub}>Available: Rs {availableAdvance}</Text>
                                    </View>
                                    <Switch
                                        value={useAdvance}
                                        onValueChange={setUseAdvance}
                                        trackColor={{ false: '#cbd5e1', true: '#34d399' }}
                                        thumbColor={useAdvance ? '#10b981' : '#f8fafc'}
                                    />
                                </View>

                                {useAdvance && (
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Advance to Deduct (Rs)</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            keyboardType="numeric"
                                            value={advanceInput}
                                            onChangeText={setAdvanceInput}
                                            placeholder="e.g. 500"
                                        />
                                    </View>
                                )}
                                <View style={styles.lightDivider} />
                            </View>
                        )}

                        {/* Payment Method Tabs */}
                        <Text style={styles.inputLabel}>Payment Method</Text>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tabButton, paymentMethod === 'CASH' && styles.tabActive]}
                                onPress={() => setPaymentMethod('CASH')}
                            >
                                <Banknote size={16} color={paymentMethod === 'CASH' ? '#ffffff' : '#64748b'} />
                                <Text style={[styles.tabText, paymentMethod === 'CASH' && styles.tabTextActive]}>Cash</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, paymentMethod === 'ONLINE' && styles.tabActive]}
                                onPress={() => setPaymentMethod('ONLINE')}
                            >
                                <CreditCard size={16} color={paymentMethod === 'ONLINE' ? '#ffffff' : '#64748b'} />
                                <Text style={[styles.tabText, paymentMethod === 'ONLINE' && styles.tabTextActive]}>Online</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Collection Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Got Payment (Amount Received)</Text>
                            <View style={styles.amountInputContainer}>
                                <View style={styles.currencyBadge}>
                                    <Text style={styles.currencyText}>Rs</Text>
                                </View>
                                <TextInput
                                    style={styles.amountInput}
                                    keyboardType="numeric"
                                    value={collectedInput}
                                    onChangeText={setCollectedInput}
                                    placeholder={cashDue.toString()}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>
                    </View>

                    {/* 4. Final Cash Summary Card */}
                    <View style={styles.cashCard}>
                        {previousCredit > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.creditLabel}>Previous Credit</Text>
                                <Text style={styles.creditLabel}>+ Rs {previousCredit}</Text>
                            </View>
                        )}
                        {useAdvance && actualAdvanceToDeduct > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.advanceLabel}>Advance Deducted</Text>
                                <Text style={styles.advanceLabel}>- Rs {actualAdvanceToDeduct}</Text>
                            </View>
                        )}
                        
                        {(previousCredit > 0 || (useAdvance && actualAdvanceToDeduct > 0)) && (
                            <View style={styles.divider} />
                        )}

                        <View style={styles.totalRow}>
                            <View style={styles.totalLeft}>
                                <Wallet size={24} color="#059669" style={styles.iconMarginSmall} />
                                <Text style={styles.totalLabel}>Final Due</Text>
                            </View>
                            <Text style={styles.totalAmount}>Rs {cashDue}</Text>
                        </View>
                    </View>

                    <View style={{ height: 40 }} /> {/* Bottom Padding for Scroll */}
                </ScrollView>

                {/* Footer Action */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleComplete}
                        style={styles.completeButton}
                    >
                        <CheckCircle2 size={24} color="#ffffff" style={styles.iconMarginSmall} />
                        <Text style={styles.completeText}>Settle & Complete</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#f8fafc',
        zIndex: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 16,
    },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarIcon: {
        width: 40, height: 40,
        backgroundColor: '#e0f2fe',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    customerNameCol: { flex: 1 },
    customerLabel: {
        fontSize: 12, fontWeight: 'bold',
        color: '#0284c7', textTransform: 'uppercase',
        letterSpacing: 0.5, marginBottom: 4,
    },
    customerName: {
        fontSize: 18, fontWeight: 'bold', color: '#0f172a',
    },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    contactText: { color: '#475569', fontWeight: '500' },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
    addressIcon: { marginTop: 4, marginRight: 12 },
    addressText: { color: '#475569', flex: 1, lineHeight: 20 },
    iconMargin: { marginRight: 12 },
    itemsHeader: {
        flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
        paddingBottom: 12, marginBottom: 16,
    },
    itemsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    itemRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12,
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    qtyBadge: {
        backgroundColor: '#f1f5f9', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 6, marginRight: 10,
    },
    qtyText: { fontWeight: 'bold', color: '#1e293b', fontSize: 12 },
    itemName: { color: '#334155', fontWeight: '500' },
    itemPrice: { color: '#64748b', fontWeight: '500' },
    subText: { color: '#64748b', fontSize: 13 },
    discountText: { color: '#e11d48', fontSize: 13, fontWeight: '500' },
    iconMarginSmall: { marginRight: 8 },
    lightDivider: {
        height: 1, backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    advanceContainer: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
    },
    advanceToggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    advanceTitle: { fontWeight: '700', color: '#0f172a' },
    advanceSub: { fontSize: 12, color: '#059669', marginTop: 2, fontWeight: '600' },
    inputGroup: { marginTop: 12 },
    inputLabel: {
        fontSize: 13, fontWeight: '700',
        color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5
    },
    textInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1, borderColor: '#cbd5e1',
        borderRadius: 10, padding: 12,
        fontSize: 16, color: '#0f172a', fontWeight: '600'
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: 10, borderRadius: 8, gap: 6,
    },
    tabActive: { backgroundColor: '#0f172a', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    tabText: { fontWeight: '600', color: '#64748b' },
    tabTextActive: { color: '#ffffff' },
    amountInputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#cbd5e1',
        borderRadius: 12, backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    currencyBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 16, paddingVertical: 16,
        borderRightWidth: 1, borderRightColor: '#cbd5e1',
    },
    currencyText: { fontWeight: '700', color: '#475569' },
    amountInput: {
        flex: 1, paddingHorizontal: 16,
        fontSize: 18, fontWeight: '700', color: '#0f172a',
    },
    cashCard: {
        backgroundColor: '#ecfdf5', padding: 20,
        borderRadius: 24, borderWidth: 1,
        borderColor: '#d1fae5', marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 8,
    },
    summaryLabel: { color: '#065f46', fontWeight: 'bold' },
    creditLabel: { color: '#e11d48', fontWeight: '500' },
    advanceLabel: { color: '#059669', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#a7f3d0', marginVertical: 12 },
    totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    totalLeft: { flexDirection: 'row', alignItems: 'center' },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#064e3b' },
    totalAmount: { fontSize: 24, fontWeight: '900', color: '#047857' },
    footer: {
        padding: 16, backgroundColor: '#ffffff',
        borderTopWidth: 1, borderTopColor: '#f1f5f9',
    },
    completeButton: {
        backgroundColor: '#10b981', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, borderRadius: 16,
    },
    completeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }
});