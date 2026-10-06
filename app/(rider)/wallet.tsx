import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, Receipt } from "lucide-react-native";
import { format } from "date-fns";

import WalletSummaryCard from "@/features/wallet/components/WalletSummaryCard";
import WalletHistorySection from "@/features/wallet/components/WalletHistorySection";
import AddExpenseModal from "@/features/wallet/components/AddExpenseModal";
import { useRiderLogs } from "@/features/wallet/api/use-logs";
import { useRole } from "@/lib/use-role";
import Error from "../error";
import Loading from "../loading";
import { DateFilterBar, DateFilterType } from "@/components/ui/DateFilterBar";

export default function WalletScreen() {
  const { branchId } = useRole();

  const [activeFilter, setActiveFilter] = useState<DateFilterType>('today');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

  // 2. Format the date for the API
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { data: logs = [], isLoading, isError, error, refetch, isRefetching } = useRiderLogs(branchId, dateString);

  const totalCashIn = 5000;

  const handleFilterChange = (filter: DateFilterType, date?: Date) => {
    setActiveFilter(filter);
    if (filter === 'today') {
      setSelectedDate(new Date());
    } else if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddExpense = (expenseData: { category: string; amount: number; odometerReading: number }) => {
    console.log("Submitting Expense:", expenseData);
    setExpenseModalOpen(false);
  };

  if (isLoading) return <Loading text="Loading Logs..." />
  if (isError) return <Error text={error.message} />

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center gap-3 z-10">
        <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
          <Wallet size={20} color="#0284c7" />
        </View>
        <View>
          <Text className="text-lg font-extrabold text-slate-900">Wallet & Logs</Text>
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manage your logs</Text>
        </View>
      </View>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#0284c7"]}
            tintColor="#0284c7"
          />
        }
      >
        <DateFilterBar
          activeFilter={activeFilter}
          customDate={selectedDate}
          onFilterChange={handleFilterChange}
          hideTomorrow={true}
        />
        <WalletSummaryCard
          date={selectedDate}
          totalCashIn={totalCashIn}
        />
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

        <WalletHistorySection logs={logs} isLoading={isLoading} />

      </ScrollView>

      <AddExpenseModal
        visible={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </SafeAreaView>
  );
}