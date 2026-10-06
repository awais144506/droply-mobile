import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, Fuel } from "lucide-react-native";
import { format } from "date-fns";
import WalletSummaryCard from "@/features/wallet/components/WalletSummaryCard";
import WalletHistorySection from "@/features/wallet/components/WalletHistorySection";
import AddExpenseModal from "@/features/wallet/components/AddExpenseModal";
import { useRiderLogs } from "@/features/wallet/api/use-logs";
import { useRole } from "@/lib/use-role";
import Error from "../error";
import Loading from "../loading";
import { DateFilterBar, DateFilterType } from "@/components/ui/DateFilterBar";
import { walletScreenStyles as styles } from "@/features/wallet/style/log-style";

export default function WalletScreen() {
  const { branchId } = useRole();

  const [activeFilter, setActiveFilter] = useState<DateFilterType>('today');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { data: logs = [], isLoading, isError, error, refetch, isRefetching } = useRiderLogs(branchId, dateString);

  const handleFilterChange = (filter: DateFilterType, date?: Date) => {
    setActiveFilter(filter);
    if (filter === 'today') {
      setSelectedDate(new Date());
    } else if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddExpense = () => {
    setExpenseModalOpen(false);
  };

  if (isLoading) return <Loading text="Loading Logs..." />
  if (isError) return <Error text={error.message} />

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Wallet size={20} color="#0284c7" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Wallet & Logs</Text>
          <Text style={styles.headerSubtitle}>Manage your logs</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
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
        />

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpenseModalOpen(true)}
            style={styles.actionButton}
          >
            <Fuel size={16} color="#475569" />
            <Text style={styles.actionButtonText}>Enter Expense</Text>
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