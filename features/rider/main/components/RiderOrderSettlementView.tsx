/* eslint-disable react-hooks/immutability */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, MapPin, Package, Banknote, CheckCircle2, CreditCard, Wallet, PhoneCall, MessageCircle, RefreshCw, Plus, Minus, AlertTriangle } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';
import { completeOrderStyle as styles } from '../style/settlemnt';

interface AssetExchangePayload {
    productId: string;
    inboundQuantity: number;  
    outboundQuantity: number; 
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
    onComplete: (orderId: string, settlementData: SettlementPayload) => Promise<void> | void;
}

interface UnifiedReturnableItem {
    productId: string;
    name: string;
    securityDeposit: number;
    currentBalance: number;
    orderedQty: number;
}

export default function RiderOrderSettlementView({ order, onClose, onComplete }: RiderOrderSettlementViewProps) {
    const availableAdvance = order.customer.customerAdvance || 0;
    const previousCredit = order.customer.customerCredit || 0;

    const deliveryCharges = order.deliveryCharges || 0;
    const discountAmount = order.discount || 0;

    const orderAssetExchanges = order.assetExchanges || [];

    // Form States
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK'>('CASH');
    const [useAdvance, setUseAdvance] = useState(false);
    const [advanceInput, setAdvanceInput] = useState(availableAdvance.toString());
    const [collectedInput, setCollectedInput] = useState('0');
    
    // NEW: Loading State
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [assetExchanges, setAssetExchanges] = useState<{ [productId: string]: { inbound: string; outbound: string } }>(() => {
        const initial: { [productId: string]: { inbound: string; outbound: string } } = {};
        orderAssetExchanges.forEach((ex) => {
            initial[ex.productId] = {
                inbound: (ex.inboundQuantity ?? 0).toString(),
                outbound: (ex.outboundQuantity ?? 0).toString(),
            };
        });
        return initial;
    });

    const updateAssetQty = (productId: string, field: 'inbound' | 'outbound', delta: number) => {
        setAssetExchanges((prev) => {
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
        setAssetExchanges((prev) => {
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

    let hasReturnableError = false;
    const formattedAssetExchanges: AssetExchangePayload[] = orderAssetExchanges.map((ex) => {
        const data = assetExchanges[ex.productId] || { inbound: '0', outbound: '0' };
        const inboundQty = parseInt(data.inbound, 10) || 0;
        const outboundQty = parseInt(data.outbound, 10) || 0;

        const unitDeposit = ex.product?.securityDeposit || 0;
        const returnableMeta = order.customer.returnables?.find((r) => r.productId === ex.productId);
        const customerBalance = returnableMeta?.currentBalance || 0;

        if (inboundQty > customerBalance + outboundQty) {
            hasReturnableError = true;
        }

        const netOutbound = Math.max(0, outboundQty - inboundQty);
        const depositCharged = netOutbound * unitDeposit;

        return {
            productId: ex.productId,
            inboundQuantity: inboundQty,
            outboundQuantity: outboundQty,
            depositCharged,
        };
    });

    const totalSecurityDepositCharged = formattedAssetExchanges.reduce((sum, item) => sum + item.depositCharged, 0);
    const grossPayable = order.totalAmount + previousCredit + totalSecurityDepositCharged;
    
    const maxAllowedAdvance = Math.min(availableAdvance, grossPayable);
    const parsedAdvanceInput = parseFloat(advanceInput) || 0;
    const actualAdvanceToDeduct = useAdvance ? Math.min(parsedAdvanceInput, maxAllowedAdvance) : 0;

    const cashDue = Math.max(grossPayable - actualAdvanceToDeduct, 0);

    const parsedCollectedAmount = parseFloat(collectedInput);
    // 🔥 NEW: Ensure collected amount does not exceed cashDue
    const isCollectedValid = !isNaN(parsedCollectedAmount) && parsedCollectedAmount >= 0 && parsedCollectedAmount <= cashDue;
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
                if (!supported) return Linking.openURL(`https://wa.me/${formattedPhone}?text=${message}`);
                return Linking.openURL(url);
            })
            .catch((err) => console.error('Error opening WhatsApp:', err));
    };

    const handleComplete = async () => {
        if (!isFormValid || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onComplete(order.id, {
                deductedAdvance: actualAdvanceToDeduct,
                collectedAmount: parsedCollectedAmount,
                paymentMethod,
                assetExchanges: formattedAssetExchanges,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

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
                                <TouchableOpacity onPress={() => handleCall(order.customer.phone)} style={styles.callButton} activeOpacity={0.7}>
                                    <PhoneCall size={14} color="#0284c7" strokeWidth={2.5} />
                                    <Text style={styles.callButtonText}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleWhatsApp(order.customer.phone, order.customer.name)} style={styles.whatsappButton} activeOpacity={0.7}>
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

                    {/* 3. Container Returns */}
                    {orderAssetExchanges.length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.itemsHeader}>
                                <RefreshCw size={18} color="#0284c7" style={styles.iconMarginSmall} />
                                <Text style={styles.itemsTitle}>Asset & Container Exchange</Text>
                            </View>
                            <Text style={styles.returnSubText}>Log bottles collected (In) and given out (Out):</Text>

                            {orderAssetExchanges.map((ex) => {
                                const currentData = assetExchanges[ex.productId] || { inbound: '0', outbound: '0' };
                                const unitDeposit = ex.product?.securityDeposit || 0;
                                const inboundNum = parseInt(currentData.inbound, 10) || 0;
                                const outboundNum = parseInt(currentData.outbound, 10) || 0;

                                const returnableMeta = order.customer.returnables?.find((r) => r.productId === ex.productId);
                                const customerBalance = returnableMeta?.currentBalance || 0;
                                const maxCollectible = customerBalance + outboundNum;
                                const isItemError = inboundNum > maxCollectible;

                                return (
                                    <View key={ex.productId} style={[styles.assetCardItem, isItemError && styles.assetCardItemError]}>
                                        <View style={styles.assetTopRow}>
                                            <View>
                                                <Text style={styles.returnableName}>{ex.product?.name}</Text>
                                                <Text style={styles.returnableBalance}>Held by Customer: {customerBalance}</Text>
                                            </View>
                                            {unitDeposit > 0 && (
                                                <View style={styles.depositBadge}>
                                                    <Text style={styles.depositBadgeText}>Deposit: Rs {unitDeposit}/ea</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* Empties IN Stepper */}
                                        <View style={[styles.stepperControlRow, styles.greenStepperRow]}>
                                            <Text style={[styles.stepperLabel, styles.greenLabel]}>Empties Collected (IN):</Text>
                                            <View style={styles.stepperGroup}>
                                                <TouchableOpacity style={[styles.stepButton, styles.greenStepButton]} onPress={() => updateAssetQty(ex.productId, 'inbound', -1)}>
                                                    <Minus size={14} color="#065f46" />
                                                </TouchableOpacity>
                                                <TextInput style={styles.returnInput} keyboardType="numeric" value={currentData.inbound} onChangeText={(val) => handleAssetTextInput(ex.productId, 'inbound', val)} />
                                                <TouchableOpacity style={[styles.stepButton, styles.greenStepButton]} onPress={() => updateAssetQty(ex.productId, 'inbound', 1)}>
                                                    <Plus size={14} color="#065f46" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {isItemError && (
                                            <View style={styles.errorBanner}>
                                                <AlertTriangle size={14} color="#dc2626" />
                                                <Text style={styles.errorText}>Cannot collect more than {maxCollectible} bottles!</Text>
                                            </View>
                                        )}

                                        {/* Empties OUT Stepper */}
                                        <View style={[styles.stepperControlRow, styles.redStepperRow]}>
                                            <Text style={[styles.stepperLabel, styles.redLabel]}>Empties Given (OUT):</Text>
                                            <View style={styles.stepperGroup}>
                                                <TouchableOpacity style={[styles.stepButton, styles.redStepButton]} onPress={() => updateAssetQty(ex.productId, 'outbound', -1)}>
                                                    <Minus size={14} color="#991b1b" />
                                                </TouchableOpacity>
                                                <TextInput style={styles.returnInput} keyboardType="numeric" value={currentData.outbound} onChangeText={(val) => handleAssetTextInput(ex.productId, 'outbound', val)} />
                                                <TouchableOpacity style={[styles.stepButton, styles.redStepButton]} onPress={() => updateAssetQty(ex.productId, 'outbound', 1)}>
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
                                                if (num <= maxAllowedAdvance) setAdvanceInput(val);
                                                else setAdvanceInput(maxAllowedAdvance.toString());
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
                            <TouchableOpacity style={[styles.tabButton, paymentMethod === 'CASH' && styles.tabActive]} onPress={() => setPaymentMethod('CASH')}>
                                <Banknote size={16} color={paymentMethod === 'CASH' ? '#ffffff' : '#64748b'} />
                                <Text style={[styles.tabText, paymentMethod === 'CASH' && styles.tabTextActive]}>Cash</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tabButton, paymentMethod === 'BANK' && styles.tabActive]} onPress={() => setPaymentMethod('BANK')}>
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
                            {/* 🔥 Show warning if they type an amount greater than cashDue */}
                            {parsedCollectedAmount > cashDue && (
                                <Text style={{ color: '#dc2626', fontSize: 11, marginTop: 6, fontWeight: '600' }}>
                                    Cannot collect more than the final due amount (Rs {cashDue}).
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* 5. Final Cash Summary Card */}
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

                {/* Footer Action Button (Disabled if submitting or invalid) */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleComplete}
                        disabled={!isFormValid || isSubmitting}
                        style={[styles.completeButton, (!isFormValid || isSubmitting) && styles.disabledButton]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#ffffff" style={styles.iconMarginSmall} />
                        ) : (
                            <CheckCircle2 size={24} color="#ffffff" style={styles.iconMarginSmall} />
                        )}
                        <Text style={styles.completeText}>
                            {isSubmitting ? 'Processing...' : 'Settle & Complete'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}