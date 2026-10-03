import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, Receipt } from "lucide-react-native";
import { format } from "date-fns";
import DateFilter from "@/features/wallet/components/DateFilter";
import WalletSummaryCard from "@/features/wallet/components/WalletSummaryCard";
import WalletHistorySection from "@/features/wallet/components/WalletHistorySection";
import AddExpenseModal from "@/components/wallet/AddExpenseModal";
import { useRiderLogs } from "@/features/wallet/api/use-logs";
import { useRole } from "@/lib/use-role";

export default function WalletScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { branchId } = useRole();

  const { data: logs = [], isLoading, error } = useRiderLogs(branchId, dateString);

  // ADD THIS LINE:
  console.log("TANSTACK ERROR:", error?.message || error);


  // MOCK DATA for now (Later, you will calculate these dynamically from 'logs')
  const isHandedOver = false;
  const netDeposit = 4500;
  const totalCashIn = 5000;
  const totalExpenses = 500;

  const handleAddExpense = (expenseData: any) => {
    setExpenseModalOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* ... Header omitted for brevity ... */}

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <DateFilter
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onOpenPicker={() => { /* Open Picker */ }}
        />

        <WalletSummaryCard
          date={selectedDate}
          netDeposit={netDeposit}
          totalCashIn={totalCashIn}
          totalExpenses={totalExpenses}
        />

        {!isHandedOver && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setExpenseModalOpen(true)}
              className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex-row items-center justify-center gap-2 shadow-sm"
            >
              <Receipt size={16} color="#475569" />
              <Text className="text-xs font-bold text-slate-700">Enter Expense</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. Pass the fetched data down to the component */}
        <WalletHistorySection logs={logs} isLoading={isLoading} />

      </ScrollView>
    </SafeAreaView>
  );
}