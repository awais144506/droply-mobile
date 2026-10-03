/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/purity */
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ShoppingCart, CheckCircle2, ArrowLeft } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRiderOrderData } from "@/features/orders/api/use-order";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import { newOrderSchema, NewOrderFormData } from "@/features/orders/schema/order-schema";
import OrderCustomerCard from "@/features/orders/components/OrderCustomerCard";
import OrderProductCart from "@/features/orders/components/OrderProductCart";
import OrderFinancialsCard from "@/features/orders/components/OrderFinancialsCard";
import OrderScheduleCard from "@/features/orders/components/OrderScheduleCard";
import { useOfflineOrderStore, LocalOrder } from "@/store/seOfflineOrderStore";
import { useRole } from "@/lib/use-role";


export default function NewOrderScreen() {
    const router = useRouter();
    const { branchId } = useRole();
    const { addOrderToQueue } = useOfflineOrderStore();

    const { data, isLoading, refetch, isRefetching } = useRiderOrderData(branchId);

    const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
        visible: false, title: "", message: "", onConfirm: () => { },
    });

    const [idempotencyKey] = useState(() => `mob-${Date.now()}-${Math.random().toString(36).substring(7)}`);


    const methods = useForm<NewOrderFormData>({
        resolver: yupResolver(newOrderSchema),
        mode: "onChange",
        defaultValues: {
            zoneId: "",
            customerId: "",
            items: [],
            discountAmount: 0,
            deliveryCharges: 0,
            scheduleMode: "TODAY",
            scheduleDate: new Date(),
        },
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = (formData: NewOrderFormData) => {
        console.log("🔥 UI GENERATED KEY:", idempotencyKey);
        // 1. Calculate the totals
        const totalItems = formData.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const finalTotal = subtotal + (formData.deliveryCharges || 0) - (formData.discountAmount || 0);

        // 2. Find names for the UI
        const customer = data?.allCustomers?.find((c: any) => c.id === formData.customerId);
        const zone = data?.zones?.find((z: any) => z.id === formData.zoneId);
        const backendPayload = {
            branchId: branchId, // Pulled from Clerk metadata at the top of your screen
            saleType: 'DELIVERY', // Riders default to delivery
            customerId: formData.customerId,
            idempotencyKey: idempotencyKey,
            scheduledDate: formData.scheduleDate ? new Date(formData.scheduleDate).toISOString() : undefined,
            discount: formData.discountAmount || 0,
            deliveryCharges: formData.deliveryCharges || 0,
            paymentMethod: 'CASH', // Assuming cash for now, you can add a picker to the UI later
            amountPaid: finalTotal, // Assuming full payment upon delivery
            items: formData.items.map(item => ({
                productId: item.productId,
                paidQty: item.quantity,
                emptiesIn: 0, // Defaults. You can add empties tracking to the Cart UI later!
                hasOffer: false,
                offerQty: 0,
                chargedDeposit: 0,
                isDepositCharged: false
            }))
        };

        // 4. Construct the LocalOrder object
        const newOfflineOrder: LocalOrder = {
            id: idempotencyKey,
            customerName: customer?.name || "Unknown Customer",
            zoneName: zone?.name || "Unknown Zone",
            totalAmount: finalTotal,
            itemsCount: totalItems,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            status: 'pending',
            rawPayload: backendPayload, // 🔥 Now perfectly matches your backend DTO
        };

        // 5. Save to MMKV queue
        addOrderToQueue(newOfflineOrder);

        // 6. Reset and Redirect
        methods.reset();
        router.replace('/(rider)/orders');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center gap-14 z-10">
                    <TouchableOpacity onPress={() => router.replace('/(rider)/orders')} className="h-9 w-9 bg-slate-800 rounded-xl items-center justify-center">
                        <ArrowLeft size={18} color="#ffff" />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-3">
                        <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
                            <ShoppingCart size={20} color="#0284c7" />
                        </View>
                        <View>
                            <Text className="text-lg font-extrabold text-slate-900">Create New Order</Text>
                        </View>
                    </View>
                </View>

                <FormProvider {...methods}>
                    <ScrollView
                        className="flex-1 px-4 pt-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching}
                                onRefresh={refetch}
                                colors={["#0284c7"]}
                                tintColor="#0284c7"
                            />
                        }
                    >
                        <OrderCustomerCard data={data} isLoading={isLoading} />
                        <OrderProductCart data={data} />
                        <OrderFinancialsCard data={data} />
                        <OrderScheduleCard />

                    </ScrollView>
                    <View className="p-4 bg-white border-t border-slate-200">
                        <TouchableOpacity
                            disabled={isSubmitting || !methods.formState.isValid}
                            onPress={handleSubmit(onSubmit)}
                            className={`w-full h-12 rounded-xl items-center justify-center flex-row gap-2 shadow-sm ${(isSubmitting || !methods.formState.isValid) ? "bg-gray-400" : "bg-sky-600 active:bg-sky-700"
                                }`}
                        >
                            <CheckCircle2 size={20} color="#ffffff" strokeWidth={2.5} />
                            <Text className="text-white text-base font-bold">Generate Order</Text>
                        </TouchableOpacity>
                    </View>
                </FormProvider>

                <CustomAlert {...alertConfig} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}