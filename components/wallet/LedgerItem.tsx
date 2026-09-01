import React from "react";
import { View, Text } from "react-native";
import { Droplet, RotateCcw, Fuel, Wrench, Coffee, Receipt, CheckCircle, ArrowUpRight } from "lucide-react-native";
import { LedgerEntry } from "@/types/wallet";

export default function LedgerItem({ entry }: { entry: LedgerEntry }) {
  const isExpense = entry.type === "EXPENSE";
  const isDelivery = entry.type === "DELIVERY_LOG";

  const getIconConfig = () => {
    if (entry.type === "SALE") return { Icon: Droplet, bg: "bg-sky-100", color: "#0284c7" };
    if (entry.type === "RECOVERY") return { Icon: RotateCcw, bg: "bg-emerald-100", color: "#16a34a" };
    if (isDelivery) return { Icon: CheckCircle, bg: "bg-indigo-100", color: "#4f46e5" };
    
    switch (entry.category) {
      case "FUEL": return { Icon: Fuel, bg: "bg-rose-100", color: "#e11d48" };
      case "MAINTENANCE": return { Icon: Wrench, bg: "bg-amber-100", color: "#d97706" };
      case "MEAL": return { Icon: Coffee, bg: "bg-orange-100", color: "#ea580c" };
      default: return { Icon: Receipt, bg: "bg-slate-100", color: "#475569" };
    }
  };

  const { Icon, bg, color } = getIconConfig();

  return (
    <View className="flex-row items-center justify-between p-3 mb-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
      <View className="flex-row items-center gap-3 flex-1 pr-2">
        <View className={`h-10 w-10 rounded-xl items-center justify-center ${bg}`}>
          <Icon size={18} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{entry.title}</Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {entry.subtitle}
          </Text>
            <Text className="text-xs text-slate-500" numberOfLines={1}>
            {entry.timestamp}
          </Text>
        </View>
      </View>

      <View className="items-end">
        {isDelivery ? (
          <View className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            <Text className="text-[11px] font-bold text-indigo-700">Delivered</Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1">
            {isExpense ? (
              <ArrowUpRight size={14} color="#e11d48" />
            ) : (
              <Droplet size={14} color="#16a34a" />
            )}
            <Text className={`text-sm font-bold ${isExpense ? "text-rose-600" : "text-emerald-600"}`}>
              {isExpense ? "-" : "+"} Rs {entry.amount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}