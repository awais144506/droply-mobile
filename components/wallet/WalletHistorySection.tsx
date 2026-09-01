import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays, History } from "lucide-react-native";
import { LedgerEntry } from "@/types/wallet";
import LedgerItem from "@/components/wallet/LedgerItem";

type HistoryFilter = "TODAY" | "YESTERDAY" | "CUSTOM";

interface WalletHistorySectionProps {
  allEntries: LedgerEntry[];
}

export default function WalletHistorySection({ allEntries }: WalletHistorySectionProps) {
  const [filter, setFilter] = useState<HistoryFilter>("TODAY");
  const [customDate, setCustomDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Helper to format date as YYYY-MM-DD
  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const todayKey = formatDateKey(new Date());
  
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterdayObj);

  const customKey = formatDateKey(customDate);

  const activeDateKey = 
    filter === "TODAY" ? todayKey : 
    filter === "YESTERDAY" ? yesterdayKey : 
    customKey;

  const filteredEntries = allEntries.filter((entry) => entry.dateKey === activeDateKey);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (date) {
      setCustomDate(date);
      setFilter("CUSTOM");
    }
  };

  return (
    <View className="mt-2">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-1.5">
          <History size={14} color="#64748b" />
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ledger & Delivery Logs
          </Text>
        </View>

        {Platform.OS === "ios" && showPicker && (
          <DateTimePicker
            value={customDate}
            mode="date"
            display="compact"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={() => { setFilter("TODAY"); setShowPicker(false); }}
          className={`flex-1 py-2 rounded-xl border items-center justify-center ${
            filter === "TODAY" ? "bg-sky-50 border-sky-300" : "bg-white border-slate-200"
          }`}
        >
          <Text className={`text-xs font-bold ${filter === "TODAY" ? "text-sky-700" : "text-slate-600"}`}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { setFilter("YESTERDAY"); setShowPicker(false); }}
          className={`flex-1 py-2 rounded-xl border items-center justify-center ${
            filter === "YESTERDAY" ? "bg-sky-50 border-sky-300" : "bg-white border-slate-200"
          }`}
        >
          <Text className={`text-xs font-bold ${filter === "YESTERDAY" ? "text-sky-700" : "text-slate-600"}`}>
            Yesterday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { setFilter("CUSTOM"); setShowPicker(true); }}
          className={`flex-1 py-2 rounded-xl border items-center justify-center flex-row gap-1 ${
            filter === "CUSTOM" ? "bg-sky-50 border-sky-300" : "bg-white border-slate-200"
          }`}
        >
          <CalendarDays size={12} color={filter === "CUSTOM" ? "#0284c7" : "#64748b"} />
          <Text className={`text-xs font-bold ${filter === "CUSTOM" ? "text-sky-700" : "text-slate-600"}`}>
            {filter === "CUSTOM" ? customDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Pick Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={customDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {filteredEntries.length > 0 ? (
        filteredEntries.map((entry) => <LedgerItem key={entry.id} entry={entry} />)
      ) : (
        <View className="py-8 items-center justify-center bg-white rounded-2xl border border-slate-200">
          <Text className="text-xs text-slate-400">No logs or transactions found for this date.</Text>
        </View>
      )}
    </View>
  );
}