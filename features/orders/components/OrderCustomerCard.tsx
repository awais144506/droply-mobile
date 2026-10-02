/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { MapPin, AlertCircle, RefreshCcw } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { NewOrderFormData } from "../schema/order-schema";

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
            <View className="bg-white p-6 rounded-[24px] border border-slate-200 mb-4 shadow-sm items-center justify-center">
                <ActivityIndicator size="small" color="#0284c7" />
                <Text className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Loading Accounts...</Text>
            </View>
        );
    }

    return (
        <View className="bg-white p-5 rounded-[24px] border border-slate-200 mb-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
                <MapPin size={16} color="#30cf4c" />
                <Text className="text-[11px] text-slate-800 font-bold uppercase tracking-wider">Delivery Destination</Text>
            </View>

            <View className="gap-3">
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
                            {error && <Text className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{error.message}</Text>}
                        </View>
                    )}
                />

                {/* Customer Selection */}
                <Controller
                    control={control}
                    name="customerId"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <View className={!selectedZoneId ? "opacity-50" : ""}>
                            <SearchableSelect
                                key={`customer-select-${selectedZoneId || 'empty'}`}
                                label="Select Customer"
                                placeholder={selectedZoneId ? "Search by name..." : "Please select a route first"}
                                options={availableCustomers}
                                selectedValue={value}
                                onSelect={(id) => onChange(id)}
                                disabled={!selectedZoneId}
                            />
                            {error && <Text className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{error.message}</Text>}

                            {selectedZoneId && availableCustomers.length === 0 && (
                                <Text className="text-[10px] font-bold text-amber-500 mt-1 ml-1">No registered customers in this zone.</Text>
                            )}
                        </View>
                    )}
                />
            </View>

            {/* Customer Financial Ledger UI */}
            {selectedCustomerData?.customerCredit > 0 && (
                <View className="mt-5 pt-4 border-t border-slate-100 flex-row gap-3">

                    {/* Outstanding Balance Block */}
                    <View className={`flex-1 p-3 rounded-2xl border ${selectedCustomerData?.customerCredit > 0 ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"}`}>
                        <View className="flex-row items-center gap-1.5 mb-1">
                            <AlertCircle size={12} color={selectedCustomerData?.customerCredit > 0 ? "#e11d48" : "#059669"} />
                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${selectedCustomerData?.customerCredit > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                                Outstanding
                            </Text>
                        </View>
                        <Text className={`text-base font-extrabold ${selectedCustomerData.customerCredit > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                            Rs. {selectedCustomerData?.customerCredit}
                        </Text>
                    </View>

                    {/* Returnables Block */}
                    {selectedCustomerData.returnablesLength > 0 && (
                        <View className="flex-1 p-3 rounded-2xl bg-sky-50 border border-sky-200">
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <RefreshCcw size={12} color="#0284c7" />
                                <Text className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                                    Items Held
                                </Text>
                            </View>
                            <Text className="text-base font-extrabold text-sky-800">
                                {selectedCustomerData.returnablesLength} Items
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}