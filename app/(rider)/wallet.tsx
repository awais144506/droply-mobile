import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, Receipt, Calendar, Clock } from "lucide-react-native";
import { LedgerEntry, ExpenseCategory } from "@/types/wallet";
import AddExpenseModal from "@/components/wallet/AddExpenseModal";
import WalletHistorySection from "@/components/wallet/WalletHistorySection";

const getTodayKey = () => new Date().toISOString().split("T")[0];

const INITIAL_ENTRIES: LedgerEntry[] = [
  { 
    id: "1", 
    type: "DELIVERY_LOG", 
    title: "Tariq Mahmood", 
    subtitle: "Delivered 4 bottles, Collected 3 empties", 
    amount: 0, 
    timestamp: "10:15 AM", 
    dateKey: getTodayKey(),
    bottlesDelivered: 4,
    emptyCollected: 3 
  },
  { 
    id: "2", 
    type: "SALE", 
    title: "Tariq Mahmood", 
    subtitle: "Payment Received", 
    amount: 800, 
    timestamp: "10:16 AM", 
    dateKey: getTodayKey() 
  },
  { 
    id: "3", 
    type: "RECOVERY", 
    title: "Al-Madina Sweets", 
    subtitle: "Khata Cleared", 
    amount: 2000, 
    timestamp: "11:30 AM", 
    dateKey: getTodayKey() 
  },
];

export default function WalletScreen() {
  const [entries, setEntries] = useState<LedgerEntry[]>(INITIAL_ENTRIES);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isHandedOver, setIsHandedOver] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const totalCashIn = entries
    .filter((e) => e.type === "SALE" || e.type === "RECOVERY")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = entries
    .filter((e) => e.type === "EXPENSE")
    .reduce((sum, e) => sum + e.amount, 0);

  const netDeposit = totalCashIn - totalExpenses;

  const handleAddExpense = (amount: number, category: ExpenseCategory, description: string) => {
    if (isHandedOver) {
      Alert.alert("Shift Closed", "Cannot log expenses after handing over cash to the manager.");
      return;
    }
    const newExpense: LedgerEntry = {
      id: Math.random().toString(),
      type: "EXPENSE",
      title: category,
      subtitle: description,
      amount,
      category,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      dateKey: getTodayKey(),
    };
    setEntries([newExpense, ...entries]);
  };

  const handleHandover = () => {
    Alert.alert(
      "Confirm Shift Handover",
      `Are you sure you want to hand over Rs ${netDeposit.toLocaleString()} to the plant manager? This will lock today's ledger progress.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Handover",
          onPress: () => {
            setIsHandedOver(true);
            const handoverEntry: LedgerEntry = {
              id: Math.random().toString(),
              type: "RECOVERY",
              title: "Shift Handover to Manager",
              subtitle: `Cleared balance of Rs ${netDeposit.toLocaleString()}`,
              amount: netDeposit,
              timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              dateKey: getTodayKey(),
            };
            setEntries([handoverEntry, ...entries]);
            Alert.alert("Success", "Shift successfully closed and handed over to management.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-4 py-3 bg-white border-b border-slate-200 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
            <Wallet size={25} color="#0284c7" />
          </View>
        </View>
        
        {isHandedOver && (
          <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            <Text className="text-[10px] font-bold text-emerald-700">Shift Handed Over</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-sky-600 rounded-3xl p-5 mb-4 shadow-xl border border-sky-500/30">
          <View className="flex-row items-center justify-between bg-sky-700/50 px-3 py-1.5 rounded-xl mb-4 border border-sky-500/40">
            <View className="flex-row items-center gap-1.5">
              <Calendar size={13} color="#bae6fd" />
              <Text className="text-[11px] font-bold text-sky-100">{formattedDate}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Clock size={13} color="#bae6fd" />
              <Text className="text-[11px] font-bold text-sky-100 font-mono">{formattedTime}</Text>
            </View>
          </View>

          <Text className="text-sky-100 text-xs font-semibold uppercase tracking-wider mb-1">
            Net Cash to Deposit
          </Text>
          <Text className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Rs {netDeposit.toLocaleString()}
          </Text>

          <View className="flex-row justify-between border-t border-sky-500/50 pt-4">
            <View>
              <Text className="text-sky-200 text-[10px] uppercase font-bold tracking-wide">Total Collected</Text>
              <Text className="text-white text-base font-bold mt-0.5">Rs {totalCashIn.toLocaleString()}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sky-200 text-[10px] uppercase font-bold tracking-wide text-right">Petty Expenses</Text>
              <Text className="text-rose-200 text-base font-bold mt-0.5 text-right">- Rs {totalExpenses.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {!isHandedOver && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setExpenseModalOpen(true)}
              className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex-row items-center justify-center gap-2 shadow-sm"
            >
              <Receipt size={16} color="#475569" />
              <Text className="text-xs font-bold text-slate-700">Enter Today Expense</Text>
            </TouchableOpacity>


          </View>
        )}

        <WalletHistorySection allEntries={entries} />
      </ScrollView>

      <AddExpenseModal
        visible={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </SafeAreaView>
  );
}