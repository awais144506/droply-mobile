/* eslint-disable @typescript-eslint/no-unused-vars */
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
import OrderCustomerCard from "@/features/orders/components/create-order/OrderCustomerCard";
import OrderProductCart from "@/features/orders/components/create-order/OrderProductCart";
import OrderFinancialsCard from "@/features/orders/components/create-order/OrderFinancialsCard";
import OrderScheduleCard from "@/features/orders/components/create-order/OrderScheduleCard";
import { useRole } from "@/lib/use-role";
import { useCreateOrder } from "@/features/orders/api/use-mutate-order";
import { newOrderScreenStyles as styles } from "@/features/orders/style/order-style";
import Loading from "@/app/loading";

export default function NewOrderScreen() {
    const router = useRouter();
    const { branchId } = useRole();

    const { data, isLoading, refetch, isRefetching } = useRiderOrderData(branchId);
    const { mutate: createOrder, isPending } = useCreateOrder(branchId);

    const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
        visible: false, title: "", message: "", onConfirm: () => { },
    });

    const showAlert = (config: Omit<CustomAlertProps, "visible">) => {
        setAlertConfig({ ...config, visible: true });
    };

    const closeAlert = () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
    };

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
        showAlert({
            title: "Confirm Order Generation",
            message: "Are you sure you want to generate and dispatch this order?",
            confirmText: "Generate",
            cancelText: "Cancel",
            onCancel: closeAlert,
            onConfirm: () => {
                closeAlert();

                const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const finalTotal = subtotal + (formData.deliveryCharges || 0) - (formData.discountAmount || 0);

                const backendPayload = {
                    branchId: branchId,
                    saleType: 'DELIVERY',
                    customerId: formData.customerId,
                    scheduledDate: formData.scheduleDate ? new Date(formData.scheduleDate).toISOString() : undefined,
                    discount: formData.discountAmount || 0,
                    deliveryCharges: formData.deliveryCharges || 0,
                    paymentMethod: 'CASH',
                    amountPaid: finalTotal,
                    items: formData.items.map(item => ({
                        productId: item.productId,
                        paidQty: item.quantity,
                        emptiesIn: 0,
                        hasOffer: false,
                        offerQty: 0,
                        chargedDeposit: 0,
                        isDepositCharged: false
                    }))
                };

                createOrder(backendPayload, {
                    onSuccess: () => {
                        methods.reset();
                        router.replace('/(rider)/orders');
                    }
                });
            }
        });
    };

    if (isPending) return <Loading text="Creating Order..." />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "android" ? "padding" : undefined}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/(rider)/orders')} style={styles.backButton}>
                        <ArrowLeft size={18} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <View style={styles.headerIconWrapper}>
                            <ShoppingCart size={20} color="#0284c7" />
                        </View>
                        <View>
                            <Text style={styles.headerTitleText}>Create New Order</Text>
                        </View>
                    </View>
                </View>

                <FormProvider {...methods}>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
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
                        <OrderScheduleCard />
                        <OrderCustomerCard data={data} isLoading={isLoading} />
                        <OrderProductCart data={data} />
                        <OrderFinancialsCard data={data} />

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            disabled={isSubmitting || !methods.formState.isValid || isPending}
                            onPress={handleSubmit(onSubmit)}
                            style={[
                                styles.submitBtnBase,
                                (isSubmitting || !methods.formState.isValid || isPending) ? styles.submitBtnInvalid : styles.submitBtnValid
                            ]}
                        >
                            <CheckCircle2 size={20} color="#ffffff" strokeWidth={2.5} />
                            <Text style={styles.submitBtnText}>Generate Order</Text>
                        </TouchableOpacity>
                    </View>
                </FormProvider>

                <CustomAlert {...alertConfig} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}