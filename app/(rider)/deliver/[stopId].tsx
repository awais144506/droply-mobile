import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  Droplet,
  RotateCcw,
  Wallet,
  AlertTriangle,
  Package,
  ShieldCheck,
} from "lucide-react-native";

export default function DeliverStopScreen() {
  const { stopId } = useLocalSearchParams();
  const router = useRouter();

  // Customer Baseline Liabilities
  const [customerInfo] = useState({
    name: "Tariq Mahmood",
    address: "House 42, Block B, Street 4",
    phone: "+92 321 4455667",
    bottlesCurrentlyHeld: 4, // Returnables already in possession
    securityDepositHeld: 4000, // Security deposit with company
    previousDebt: 1200, // Previous Khata / Udhaar
    bottleRate: 200,
  });

  // Current Delivery Counters
  const [bottlesDelivered, setBottlesDelivered] = useState(4);
  const [emptyCollected, setEmptyCollected] = useState(4);

  const currentOrderTotal = bottlesDelivered * customerInfo.bottleRate;
  const totalPayable = currentOrderTotal + customerInfo.previousDebt;

  // Payment Received
  const [cashCollected, setCashCollected] = useState(String(currentOrderTotal));
  const cashAmount = parseFloat(cashCollected) || 0;
  const newOutstanding = totalPayable - cashAmount;

  // New Net Bottles Held Calculation
  const resultingBottlesHeld =
    customerInfo.bottlesCurrentlyHeld + bottlesDelivered - emptyCollected;

  const handleCompleteDelivery = () => {
    Alert.alert(
      "Confirm Delivery",
      `Deliver ${bottlesDelivered} bottles, collect ${emptyCollected} empties, and record Rs ${cashAmount} cash?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Drop",
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center active:bg-slate-200"
        >
          <ArrowLeft size={18} color="#334155" />
        </TouchableOpacity>
        <Text className="text-sm font-bold text-slate-900">Confirm Delivery</Text>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        {/* Customer Overview & Existing Possession Details */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-3">
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Customer Profile
          </Text>
          <Text className="text-base font-bold text-slate-900 mt-0.5">
            {customerInfo.name}
          </Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            {customerInfo.address}
          </Text>

          {/* Customer Assets & Khata Badges */}
          <View className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            {/* Bottles & Security in Customer Custody */}
            <View className="flex-row items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <View className="flex-row items-center gap-2">
                <Package size={15} color="#4f46e5" />
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium">
                    Currently Holding
                  </Text>
                  <Text className="text-xs font-bold text-slate-900">
                    {customerInfo.bottlesCurrentlyHeld} Empty 19L Bottles
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-[10px] text-slate-400 font-medium">Security</Text>
                <Text className="text-xs font-bold text-indigo-600">
                  Rs {customerInfo.securityDepositHeld.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Outstanding Khata / Debt */}
            {customerInfo.previousDebt > 0 && (
              <View className="flex-row items-center justify-between bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={15} color="#d97706" />
                  <Text className="text-xs font-bold text-amber-900">
                    Previous Outstanding (Khata)
                  </Text>
                </View>
                <Text className="text-xs font-bold text-amber-700">
                  Rs {customerInfo.previousDebt.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Counter: Full Bottles Delivered */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 rounded-lg bg-sky-50 items-center justify-center">
                <Droplet size={16} color="#0284c7" />
              </View>
              <Text className="text-xs font-bold text-slate-800">Full Bottles Delivered</Text>
            </View>
            <Text className="text-xs text-slate-400 font-mono">
              Rs {customerInfo.bottleRate}/bottle
            </Text>
          </View>

          <View className="flex-row items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
            <TouchableOpacity
              onPress={() => setBottlesDelivered((prev) => Math.max(0, prev - 1))}
              className="h-10 w-10 bg-white rounded-lg items-center justify-center border border-slate-200 active:bg-slate-100"
            >
              <Minus size={18} color="#0f172a" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-slate-900">{bottlesDelivered}</Text>

            <TouchableOpacity
              onPress={() => setBottlesDelivered((prev) => prev + 1)}
              className="h-10 w-10 bg-white rounded-lg items-center justify-center border border-slate-200 active:bg-slate-100"
            >
              <Plus size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Counter: Empty Bottles Collected */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-3">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 rounded-lg bg-emerald-50 items-center justify-center">
                <RotateCcw size={16} color="#16a34a" />
              </View>
              <Text className="text-xs font-bold text-slate-800">Empty Bottles Collected</Text>
            </View>
            <Text className="text-[11px] text-slate-400">
              New Held: {resultingBottlesHeld}
            </Text>
          </View>

          <View className="flex-row items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
            <TouchableOpacity
              onPress={() => setEmptyCollected((prev) => Math.max(0, prev - 1))}
              className="h-10 w-10 bg-white rounded-lg items-center justify-center border border-slate-200 active:bg-slate-100"
            >
              <Minus size={18} color="#0f172a" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-emerald-700">{emptyCollected}</Text>

            <TouchableOpacity
              onPress={() => setEmptyCollected((prev) => prev + 1)}
              className="h-10 w-10 bg-white rounded-lg items-center justify-center border border-slate-200 active:bg-slate-100"
            >
              <Plus size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment & Khata Summary */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Wallet size={16} color="#d97706" />
            <Text className="text-xs font-bold text-slate-800">Payment Collection</Text>
          </View>

          <View className="space-y-1.5 pb-3 border-b border-slate-100">
            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500">Current Delivery</Text>
              <Text className="text-xs font-semibold text-slate-800">
                Rs {currentOrderTotal}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500">Previous Balance</Text>
              <Text className="text-xs font-semibold text-slate-800">
                Rs {customerInfo.previousDebt}
              </Text>
            </View>
            <View className="flex-row justify-between pt-1">
              <Text className="text-xs font-bold text-slate-900">Total Balance Due</Text>
              <Text className="text-sm font-bold text-slate-900">Rs {totalPayable}</Text>
            </View>
          </View>

          {/* Cash Received Input */}
          <View className="mt-3">
            <Text className="text-xs font-semibold text-slate-700 mb-1">
              Cash Collected (Rs)
            </Text>
            <TextInput
              value={cashCollected}
              onChangeText={setCashCollected}
              keyboardType="numeric"
              placeholder="0"
              className="h-11 bg-slate-50 rounded-xl px-3 border border-slate-300 text-sm font-bold text-slate-900"
            />
          </View>

          {/* Resulting Khata preview */}
          <View className="mt-3 p-2.5 bg-slate-50 rounded-xl flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Remaining Khata Balance:</Text>
            <Text
              className={`text-xs font-bold ${
                newOutstanding > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              Rs {newOutstanding.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View className="p-4 bg-white border-t border-slate-200">
        <TouchableOpacity
          onPress={handleCompleteDelivery}
          className="w-full h-12 bg-sky-600 rounded-xl items-center justify-center active:bg-sky-700 shadow-xs"
        >
          <Text className="text-white text-sm font-bold">Complete & Save Delivery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}