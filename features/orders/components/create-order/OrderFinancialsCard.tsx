import React from "react";
import { View, Text, TextInput } from "react-native";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Receipt, Tag, Truck, Banknote } from "lucide-react-native";
import { NewOrderFormData } from "../../schema/order-schema";

export default function OrderFinancialsCard({ data }: { data: any }) {
  const { control } = useFormContext<NewOrderFormData>();

  // Watch the values needed for real-time math
  const items = useWatch({ control, name: "items" }) || [];
  const discountAmount = useWatch({ control, name: "discountAmount" }) || 0;
  const deliveryCharges = useWatch({ control, name: "deliveryCharges" }) || 0;
  const customerId = useWatch({ control, name: "customerId" });

  // Hide the financials completely if the cart is empty to keep the UI clean
  if (items.length === 0) return null;

  // 1. Calculate the subtotal of the cart
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // 2. Calculate the current order's final price
  const currentOrderTotal = Math.max(0, subtotal + Number(deliveryCharges) - Number(discountAmount));

  // 3. Find if the customer owes money from previous orders
  const selectedCustomer = data?.allCustomers?.find((c: any) => c.id === customerId);
  const previousDebt = selectedCustomer?.customerCredit || 0;

  // 4. Calculate the grand total the rider needs to physically collect
  const amountToCollect = currentOrderTotal + (previousDebt > 0 ? previousDebt : 0);

  return (
    <View className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm mb-4">
      <View className="flex-row items-center gap-2 mb-5">
        <Receipt size={16} color="#64748b" />
        <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Financial Summary</Text>
      </View>

      <View className="gap-4">
        
        {/* Subtotal Row */}
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-sm font-semibold text-slate-500">Cart Subtotal</Text>
          <Text className="text-sm font-bold text-slate-900">Rs. {subtotal}</Text>
        </View>

        {/* Delivery Charges Input */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Truck size={14} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-700">Delivery</Text>
          </View>
          <Controller
            control={control}
            name="deliveryCharges"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-lg px-3 h-10 w-28">
                <Text className="text-xs font-bold text-slate-400 mr-1">Rs.</Text>
                <TextInput
                  keyboardType="number-pad"
                  value={value === 0 ? "" : String(value)}
                  onChangeText={(text) => onChange(text ? parseInt(text, 10) : 0)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  className="flex-3 text-sm font-bold text-slate-900 text-right h-full m-2 p-2"
                />
              </View>
            )}
          />
        </View>

        {/* Discount Input */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Tag size={14} color="#64748b" />
            <Text className="text-sm font-semibold text-slate-700">Discount</Text>
          </View>
          <Controller
            control={control}
            name="discountAmount"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-lg px-3 h-10 w-28">
                <Text className="text-xs font-bold text-slate-400 mr-1">- Rs.</Text>
                <TextInput
                  keyboardType="number-pad"
                  value={value === 0 ? "" : String(value)}
                  onChangeText={(text) => onChange(text ? parseInt(text, 10) : 0)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  className="flex-3 text-sm font-bold text-slate-900 text-right h-full m-2 p-2"
                />
              </View>
            )}
          />
        </View>

        <View className="h-[1px] w-full bg-slate-100 my-1" />

        {/* Current Order Total */}
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-sm font-bold text-slate-800">Current Order</Text>
          <Text className="text-sm font-extrabold text-slate-900">Rs. {currentOrderTotal}</Text>
        </View>

        {/* Previous Debt (Only shows if they owe money) */}
        {previousDebt > 0 && (
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-sm font-bold text-rose-600">Previous Outstanding</Text>
            <Text className="text-sm font-extrabold text-rose-600">+ Rs. {previousDebt}</Text>
          </View>
        )}

      </View>

      {/* GRAND TOTAL COLLECTABLE BLOCK */}
      <View className="mt-7 bg-sky-50 p-4 rounded-2xl border border-sky-200 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 bg-sky-100 rounded-lg items-center justify-center">
            <Banknote size={16} color="#0369a1" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Amount to Collect</Text>
            <Text className="text-[10px] text-sky-600/70 font-medium leading-tight">Order + Debt</Text>
          </View>
        </View>
        <Text className="text-2xl font-black text-sky-800">
          Rs. {amountToCollect}
        </Text>
      </View>

    </View>
  );
}