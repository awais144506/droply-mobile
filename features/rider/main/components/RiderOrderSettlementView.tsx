import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, MapPin, Package, Banknote, CheckCircle2, CreditCard, Wallet, PhoneCall, MessageCircle, RefreshCw, Plus, Minus, AlertTriangle } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

interface AssetExchangePayload {
    productId: string;
    inboundQuantity: number;  // Empties IN (Collected)
    outboundQuantity: number; // Empties OUT (Given/Delivered)
    depositCharged: number;
}

interface SettlementPayload {
    deductedAdvance: number;
    collectedAmount: number;
    paymentMethod: 'CASH' | 'BANK';
    assetExchanges?: AssetExchangePayload[];
}

interface RiderOrderSettlementViewProps {
    order: RiderActiveOrder;
    onClose: () => void;
    onComplete: (orderId: string, settlementData: SettlementPayload) => void;
}

export default function RiderOrderSettlementView({ order, onClose, onComplete }: RiderOrderSettlementViewProps) {
    const availableAdvance = order.customer.customerAdvance || 0;
    const previousCredit = order.customer.customerCredit || 0;

    const deliveryCharges = order.deliveryCharges || 0;
    const discountAmount = order.discount || 0;

    // State
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK'>('CASH');
    const [useAdvance, setUseAdvance] = useState(false);
    const [advanceInput, setAdvanceInput] = useState(availableAdvance.toString());
    const [collectedInput, setCollectedInput] = useState('0');

    // Returnables state mapping: productId -> { inbound (empties collected), outbound (empties given) }
    const [assetExchanges, setAssetExchanges] = useState<{ [productId: string]: { inbound: string; outbound: string } }>(() => {
        const initial: { [productId: string]: { inbound: string; outbound: string } } = {};
        order.customer.returnables?.forEach(ret => {
            initial[ret.productId] = { inbound: '0', outbound: '0' };
        });
        return initial;
    });

    const updateAssetQty = (productId: string, field: 'inbound' | 'outbound', delta: number) => {
        setAssetExchanges(prev => {
            const current = prev[productId] || { inbound: '0', outbound: '0' };
            const currentVal = parseInt(current[field], 10) || 0;
            const newVal = Math.max(0, currentVal + delta);
            return {
                ...prev,
                [productId]: {
                    ...current,
                    [field]: newVal.toString(),
                },
            };
        });
    };

    const handleAssetTextInput = (productId: string, field: 'inbound' | 'outbound', val: string) => {
        setAssetExchanges(prev => {
            const current = prev[productId] || { inbound: '0', outbound: '0' };
            return {
                ...prev,
                [productId]: {
                    ...current,
                    [field]: val,
                },
            };
        });
    };

    // Validation: Check if any inbound (Collected IN) exceeds customer's current balance
    let hasReturnableError = false;
    const formattedAssetExchanges: AssetExchangePayload[] = Object.entries(assetExchanges).map(([productId, data]) => {
        const inboundQty = parseInt(data.inbound, 10) || 0;
        const outboundQty = parseInt(data.outbound, 10) || 0;

        const returnableMeta = order.customer.returnables?.find(r => r.productId === productId);
        const unitDeposit = returnableMeta?.product?.securityDeposit || 0;
        const customerBalance = returnableMeta?.currentBalance || 0;

        // If collected is greater than what customer holds, flag error
        if (inboundQty > customerBalance) {
            hasReturnableError = true;
        }

        const netOutbound = Math.max(0, outboundQty - inboundQty);
        const depositCharged = netOutbound * unitDeposit;

        return {
            productId,
            inboundQuantity: inboundQty,
            outboundQuantity: outboundQty,
            depositCharged,
        };
    });

    // Total security deposit charged across all returnables
    const totalSecurityDepositCharged = formattedAssetExchanges.reduce((sum, item) => sum + item.depositCharged, 0);

    // Advance Calculation
    const maxAllowedAdvance = Math.min(availableAdvance, order.totalAmount + previousCredit);
    const parsedAdvanceInput = parseFloat(advanceInput) || 0;
    const actualAdvanceToDeduct = useAdvance ? Math.min(parsedAdvanceInput, maxAllowedAdvance) : 0;

    // Final Cash Due
    const cashDue = Math.max(order.totalAmount + previousCredit - actualAdvanceToDeduct, 0);

    // Form Validation Checks
    const parsedCollectedAmount = parseFloat(collectedInput);
    const isCollectedValid = !isNaN(parsedCollectedAmount) && parsedCollectedAmount >= 0;
    const isAdvanceValid = !useAdvance || (parsedAdvanceInput >= 0 && parsedAdvanceInput <= maxAllowedAdvance);
    const isFormValid = isCollectedValid && isAdvanceValid && !hasReturnableError;

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`).catch((err) => console.error('Error opening dialer:', err));
    };

    const handleWhatsApp = (phoneNumber: string, customerName: string) => {
        const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
        const message = encodeURIComponent(`Hi ${customerName}, your water delivery rider has arrived outside.`);
        const url = `whatsapp://send?phone=${formattedPhone}&text=${message}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    return Linking.openURL(`https://wa.me/${formattedPhone}?text=${message}`);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('Error opening WhatsApp:', err));
    };

    const handleComplete = () => {
        if (!isFormValid) return;

        onComplete(order.id, {
            deductedAdvance: actualAdvanceToDeduct,
            collectedAmount: parsedCollectedAmount,
            paymentMethod,
            assetExchanges: formattedAssetExchanges,
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
                                <Text style={styles.customerLabel}>Customer • #{order.orderCode}</Text>
                                <Text style={styles.customerName}>{order.customer.name}</Text>
                            </View>
                        </View>

                        <View style={styles.contactActionsRow}>
                            <View style={styles.actionButtonsGroup}>
                                <TouchableOpacity
                                    onPress={() => handleCall(order.customer.phone)}
                                    style={styles.callButton}
                                    activeOpacity={0.7}
                                >
                                    <PhoneCall size={14} color="#0284c7" strokeWidth={2.5} />
                                    <Text style={styles.callButtonText}>Call</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleWhatsApp(order.customer.phone, order.customer.name)}
                                    style={styles.whatsappButton}
                                    activeOpacity={0.7}
                                >
                                    <MessageCircle size={14} color="#16a34a" strokeWidth={2.5} />
                                    <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.addressRow}>
                            <MapPin size={16} color="#94a3b8" style={styles.addressIcon} />
                            <Text style={styles.addressText}>{order.customer.address || 'No address specified'}</Text>
                        </View>
                    </View>

                    {/* 2. Items & Pricing Card */}
                    <View style={styles.card}>
                        <View style={styles.itemsHeader}>
                            <Package size={20} color="#475569" style={styles.iconMarginSmall} />
                            <Text style={styles.itemsTitle}>Order Line Items</Text>
                        </View>

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

                    {/* 3. Container Returns (Empties In [+ Green] & Out [- Red]) */}
                    {order.customer.returnables && order.customer.returnables.length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.itemsHeader}>
                                <RefreshCw size={18} color="#0284c7" style={styles.iconMarginSmall} />
                                <Text style={styles.itemsTitle}>Asset & Container Exchange</Text>
                            </View>
                            <Text style={styles.returnSubText}>Log bottles collected (In) and given out (Out):</Text>

                            {order.customer.returnables.map((ret) => {
                                const currentData = assetExchanges[ret.productId] || { inbound: '0', outbound: '0' };
                                const unitDeposit = ret.product.securityDeposit || 0;
                                const inboundNum = parseInt(currentData.inbound, 10) || 0;
                                const isItemError = inboundNum > ret.currentBalance;

                                return (
                                    <View key={ret.productId} style={[styles.assetCardItem, isItemError && styles.assetCardItemError]}>
                                        <View style={styles.assetTopRow}>
                                            <View>
                                                <Text style={styles.returnableName}>{ret.product.name}</Text>
                                                <Text style={styles.returnableBalance}>Balance at Customer: {ret.currentBalance}</Text>
                                            </View>
                                            {unitDeposit > 0 && (
                                                <View style={styles.depositBadge}>
                                                    <Text style={styles.depositBadgeText}>Deposit: Rs {unitDeposit}/ea</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Empties IN Stepper (Green Theme) */}
                                        <View style={[styles.stepperControlRow, styles.greenStepperRow]}>
                                            <Text style={[styles.stepperLabel, styles.greenLabel]}>Empties Collected (IN):</Text>
                                            <View style={styles.stepperGroup}>
                                                <TouchableOpacity
                                                    style={[styles.stepButton, styles.greenStepButton]}
                                                    onPress={() => updateAssetQty(ret.productId, 'inbound', -1)}
                                                >
                                                    <Minus size={14} color="#065f46" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.returnInput}
                                                    keyboardType="numeric"
                                                    value={currentData.inbound}
                                                    onChangeText={(val) => handleAssetTextInput(ret.productId, 'inbound', val)}
                                                />
                                                <TouchableOpacity
                                                    style={[styles.stepButton, styles.greenStepButton]}
                                                    onPress={() => updateAssetQty(ret.productId, 'inbound', 1)}
                                                >
                                                    <Plus size={14} color="#065f46" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Error Notice if Collected IN exceeds Balance */}
                                        {isItemError && (
                                            <View style={styles.errorBanner}>
                                                <AlertTriangle size={14} color="#dc2626" />
                                                <Text style={styles.errorText}>Cannot collect more than customer balance ({ret.currentBalance})!</Text>
                                            </View>
                                        )}

                                        {/* Empties OUT Stepper (Red Theme) */}
                                        <View style={[styles.stepperControlRow, styles.redStepperRow]}>
                                            <Text style={[styles.stepperLabel, styles.redLabel]}>Empties Given (OUT):</Text>
                                            <View style={styles.stepperGroup}>
                                                <TouchableOpacity
                                                    style={[styles.stepButton, styles.redStepButton]}
                                                    onPress={() => updateAssetQty(ret.productId, 'outbound', -1)}
                                                >
                                                    <Minus size={14} color="#991b1b" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.returnInput}
                                                    keyboardType="numeric"
                                                    value={currentData.outbound}
                                                    onChangeText={(val) => handleAssetTextInput(ret.productId, 'outbound', val)}
                                                />
                                                <TouchableOpacity
                                                    style={[styles.stepButton, styles.redStepButton]}
                                                    onPress={() => updateAssetQty(ret.productId, 'outbound', 1)}
                                                >
                                                    <Plus size={14} color="#991b1b" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* 4. Advance & Settlement Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Payment & Advance</Text>

                        {availableAdvance > 0 && (
                            <View style={styles.advanceContainer}>
                                <View style={styles.advanceToggleRow}>
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <Text style={styles.advanceTitle}>Use Customer Advance</Text>
                                        <Text style={styles.advanceSub}>Available Balance: Rs {availableAdvance}</Text>
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
                                        <Text style={styles.inputLabel}>Advance to Deduct (Max: Rs {maxAllowedAdvance})</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            keyboardType="numeric"
                                            value={advanceInput}
                                            onChangeText={(val) => {
                                                const num = parseFloat(val) || 0;
                                                if (num <= maxAllowedAdvance) {
                                                    setAdvanceInput(val);
                                                } else {
                                                    setAdvanceInput(maxAllowedAdvance.toString());
                                                }
                                            }}
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
                                style={[styles.tabButton, paymentMethod === 'BANK' && styles.tabActive]}
                                onPress={() => setPaymentMethod('BANK')}
                            >
                                <CreditCard size={16} color={paymentMethod === 'BANK' ? '#ffffff' : '#64748b'} />
                                <Text style={[styles.tabText, paymentMethod === 'BANK' && styles.tabTextActive]}>Online</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Collection Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Amount Received (Collected)</Text>
                            <View style={styles.amountInputContainer}>
                                <View style={styles.currencyBadge}>
                                    <Text style={styles.currencyText}>Rs</Text>
                                </View>
                                <TextInput
                                    style={styles.amountInput}
                                    keyboardType="numeric"
                                    value={collectedInput}
                                    onChangeText={setCollectedInput}
                                    placeholder="0"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>
                    </View>

                    {/* 5. Final Cash Summary Card (Shows total security deposit at the end) */}
                    <View style={styles.cashCard}>
                        {order.totalAmount > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.amountTotal}>Current Order Amount</Text>
                                <Text style={styles.amountTotal}>+ Rs {order.totalAmount}</Text>
                            </View>
                        )}
                        {previousCredit > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.creditLabel}>Previous Credit</Text>
                                <Text style={styles.creditLabel}>+ Rs {previousCredit}</Text>
                            </View>
                        )}
                        {totalSecurityDepositCharged > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.depositLabel}>Total Security Deposit</Text>
                                <Text style={styles.depositLabel}>+ Rs {totalSecurityDepositCharged}</Text>
                            </View>
                        )}
                        {useAdvance && actualAdvanceToDeduct > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.advanceLabel}>Advance Deducted</Text>
                                <Text style={styles.advanceLabel}>- Rs {actualAdvanceToDeduct}</Text>
                            </View>
                        )}

                        {(previousCredit > 0 || totalSecurityDepositCharged > 0 || (useAdvance && actualAdvanceToDeduct > 0)) && (
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

                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* Footer Action Button (Disabled if form has errors or returnable error) */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleComplete}
                        disabled={!isFormValid}
                        style={[styles.completeButton, !isFormValid && styles.disabledButton]}
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
        fontSize: 11, fontWeight: '700',
        color: '#0284c7', textTransform: 'uppercase',
        letterSpacing: 0.5, marginBottom: 4,
    },
    customerName: {
        fontSize: 18, fontWeight: 'bold', color: '#0f172a',
    },
    contactActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginBottom: 12,
    },
    actionButtonsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#bae6fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    callButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0284c7',
    },
    whatsappButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    whatsappButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#16a34a',
    },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
    addressIcon: { marginTop: 4, marginRight: 12 },
    addressText: { color: '#475569', flex: 1, lineHeight: 20 },
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
    returnSubText: { fontSize: 12, color: '#64748b', marginBottom: 12 },
    assetCardItem: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 8,
    },
    assetCardItemError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    assetTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    returnableName: { fontWeight: '700', color: '#0f172a', fontSize: 14 },
    returnableBalance: { fontSize: 11, color: '#64748b', marginTop: 2 },
    depositBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    depositBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#d97706',
    },
    stepperControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    greenStepperRow: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
    },
    redStepperRow: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    stepperLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    greenLabel: {
        color: '#065f46',
    },
    redLabel: {
        color: '#991b1b',
    },
    stepperGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stepButton: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greenStepButton: {
        backgroundColor: '#d1fae5',
    },
    redStepButton: {
        backgroundColor: '#fee2e2',
    },
    returnInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        width: 44,
        textAlign: 'center',
        paddingVertical: 4,
        fontWeight: '700',
        fontSize: 14,
        color: '#0f172a',
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 11,
        fontWeight: '700',
        flex: 1,
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
    amountTotal: { color: '#581fe0', fontWeight: '400' },
    creditLabel: { color: '#e11d48', fontWeight: '500' },
    depositLabel: { color: '#d97706', fontWeight: '600' },
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
    disabledButton: {
        backgroundColor: '#cbd5e1',
        opacity: 0.7,
    },
    completeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }
});