import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, MapPin } from "lucide-react-native";

interface DeliveryLogItem {
  id: string;
  time: string;
  date: string;
  customerName: string;
  address: string;
  bottlesDelivered: number;
  emptyCollected: number;
  cashCollected: number;
  khataRemaining: number;
}

const MOCK_DELIVERY_LOGS: DeliveryLogItem[] = [
  {
    id: "log-1",
    date: "Aug 29",
    time: "10:45 AM",
    customerName: "Tariq Mahmood",
    address: "House 42, Block B, Street 4",
    bottlesDelivered: 4,
    emptyCollected: 4,
    cashCollected: 800,
    khataRemaining: 1200,
  },
  {
    id: "log-2",
    date: "Aug 29",
    time: "09:30 AM",
    customerName: "Al-Madina Bakers",
    address: "Shop 12-14, Commercial Market",
    bottlesDelivered: 10,
    emptyCollected: 10,
    cashCollected: 2000,
    khataRemaining: 0,
  },
  {
    id: "log-3",
    date: "Aug 28",
    time: "04:15 PM",
    customerName: "Dr. Shahida Parveen",
    address: "House 18, Block A, Main Blvd",
    bottlesDelivered: 2,
    emptyCollected: 2,
    cashCollected: 400,
    khataRemaining: 0,
  },
  {
    id: "log-4",
    date: "Aug 28",
    time: "02:20 PM",
    customerName: "Muhammad Bilal",
    address: "House 112, Block C, Street 9",
    bottlesDelivered: 6,
    emptyCollected: 5,
    cashCollected: 1200,
    khataRemaining: 3200,
  },
  {
    id: "log-5",
    date: "Aug 28",
    time: "11:10 AM",
    customerName: "Farhan Zafar",
    address: "House 5, Block E, Near Water Tank",
    bottlesDelivered: 1,
    emptyCollected: 1,
    cashCollected: 200,
    khataRemaining: 0,
  },
];

export default function RiderHistoryScreen() {
  const [logs] = useState<DeliveryLogItem[]>(MOCK_DELIVERY_LOGS);

  const totalDelivered = logs.reduce((sum, l) => sum + l.bottlesDelivered, 0);
  const totalCollectedCash = logs.reduce((sum, l) => sum + l.cashCollected, 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-2">
      {/* Header */}
      <View className="mb-3">
        <Text className="text-lg font-bold text-slate-900">Delivery Logs</Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          {logs.length} logged runs • {totalDelivered} bottles dropped • Rs {totalCollectedCash.toLocaleString()} total cash
        </Text>
      </View>

      {/* Log Feed */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-2 shadow-2xs">
            {/* Top Row: Customer Name + Date & Time */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                <CheckCircle2 size={14} color="#16a34a" />
                <Text className="text-xs font-bold text-slate-900 truncate">
                  {item.customerName}
                </Text>
              </View>

              <Text className="text-[10px] font-mono text-slate-400 font-medium">
                {item.date} • {item.time}
              </Text>
            </View>

            {/* Address Row */}
            <View className="flex-row items-center gap-1 mt-1">
              <MapPin size={11} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400" numberOfLines={1}>
                {item.address}
              </Text>
            </View>

            {/* Single-Sentence Delivery Summary */}
            <Text className="text-xs text-slate-600 mt-2 leading-4 pt-2 border-t border-slate-100">
              Delivered <Text className="font-bold text-sky-600">{item.bottlesDelivered} Full</Text>
              , returned <Text className="font-bold text-emerald-600">{item.emptyCollected} Empties</Text>
              , collected <Text className="font-bold text-amber-600">Rs {item.cashCollected}</Text>
              {item.khataRemaining > 0 ? (
                <Text className="text-slate-500"> (Khata: Rs {item.khataRemaining})</Text>
              ) : (
                <Text className="text-emerald-600"> (Clear)</Text>
              )}
              .
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}