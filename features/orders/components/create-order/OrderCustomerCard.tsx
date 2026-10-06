/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { MapPin, AlertCircle, RefreshCcw } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { NewOrderFormData } from "../../schema/order-schema";
import { customerCardStyles as styles } from "../../style/order-style"; // Adjust path if needed

export default function OrderCustomerCard({ data, isLoading }: { data: any, isLoading: boolean }) {
    const { control, setValue } = useFormContext<NewOrderFormData>();
    const selectedZoneId = useWatch({ control, name: "zoneId" });
    const selectedCustomerId = useWatch({ control, name: "customerId" });
    const zoneOptions = data?.zoneOptions || [];
    const customerOptions = data?.customerOptions || [];
    
    // Filter customers by selected zone
    const availableCustomers = useMemo(() => {
        if (!selectedZoneId) return [];
        return customerOptions.filter((c: any) => c.zoneId === selectedZoneId);
    }, [selectedZoneId, customerOptions]);

    const selectedCustomerData = useMemo(() => {
        if (!selectedCustomerId) return null;
        return data?.allCustomers?.find((c: any) => c.id === selectedCustomerId);
    }, [selectedCustomerId, data?.allCustomers]);

    if (isLoading) {
        return (
            <View style={styles.loadingCard}>
                <ActivityIndicator size="small" color="#0284c7" />
                <Text style={styles.loadingText}>Loading Accounts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.cardBase}>
            <View style={styles.headerRow}>
                <MapPin size={16} color="#30cf4c" />
                <Text style={styles.headerText}>Delivery Destination</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Zone Selection */}
                <Controller
                    control={control}
                    name="zoneId"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <View>
                            <SearchableSelect
                                label="Select Route / Zone"
                                placeholder="Tap to select zone..."
                                options={zoneOptions}
                                selectedValue={value}
                                onSelect={(id) => {
                                    onChange(id);
                                    setValue("customerId", "", { shouldValidate: true }); // Wipe customer if zone changes
                                }}
                            />
                            {error && <Text style={styles.errorText}>{error.message}</Text>}
                        </View>
                    )}
                />

                {/* Customer Selection */}
                <Controller
                    control={control}
                    name="customerId"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <View style={!selectedZoneId ? styles.disabledWrapper : undefined}>
                            <SearchableSelect
                                key={`customer-select-${selectedZoneId || 'empty'}`}
                                label="Select Customer"
                                placeholder={selectedZoneId ? "Search by name..." : "Please select a route first"}
                                options={availableCustomers}
                                selectedValue={value}
                                onSelect={(id) => onChange(id)}
                                disabled={!selectedZoneId}
                            />
                            {error && <Text style={styles.errorText}>{error.message}</Text>}

                            {selectedZoneId && availableCustomers.length === 0 && (
                                <Text style={styles.warningText}>No registered customers in this zone.</Text>
                            )}
                        </View>
                    )}
                />
            </View>

            {/* Customer Financial Ledger UI */}
            {selectedCustomerData?.customerCredit > 0 && (
                <View style={styles.ledgerContainer}>

                    {/* Outstanding Balance Block */}
                    <View style={[
                        styles.ledgerBlockBase,
                        selectedCustomerData.customerCredit > 0 ? styles.ledgerBad : styles.ledgerGood
                    ]}>
                        <View style={styles.ledgerHeaderRow}>
                            <AlertCircle size={12} color={selectedCustomerData.customerCredit > 0 ? "#e11d48" : "#059669"} />
                            <Text style={[
                                styles.ledgerLabelBase,
                                selectedCustomerData.customerCredit > 0 ? styles.ledgerLabelBad : styles.ledgerLabelGood
                            ]}>
                                Outstanding
                            </Text>
                        </View>
                        <Text style={[
                            styles.ledgerValueBase,
                            selectedCustomerData.customerCredit > 0 ? styles.ledgerValueBad : styles.ledgerValueGood
                        ]}>
                            Rs. {selectedCustomerData.customerCredit}
                        </Text>
                    </View>

                    {/* Returnables Block */}
                    {selectedCustomerData.returnablesLength > 0 && (
                        <View style={[styles.ledgerBlockBase, styles.ledgerReturnables]}>
                            <View style={styles.ledgerHeaderRow}>
                                <RefreshCcw size={12} color="#0284c7" />
                                <Text style={[styles.ledgerLabelBase, styles.ledgerLabelReturnables]}>
                                    Items Held
                                </Text>
                            </View>
                            <Text style={[styles.ledgerValueBase, styles.ledgerValueReturnables]}>
                                {selectedCustomerData.returnablesLength} Items
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}