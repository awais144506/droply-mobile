import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { X, Fuel, Wrench } from "lucide-react-native";
import { ExpenseCategory } from "@/types/wallet";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense: (amount: number, category: ExpenseCategory, description: string) => void;
}

export default function AddExpenseModal({ visible, onClose, onAddExpense }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("FUEL");

  const handleSave = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    onAddExpense(val, category, description || category);
    setAmount("");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-slate-900/40">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View className="bg-white rounded-t-3xl p-5 border-t border-slate-200">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-lg font-bold text-slate-900">Log Daily Expense</Text>
              <TouchableOpacity onPress={onClose} className="h-8 w-8 bg-slate-100 rounded-full items-center justify-center">
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                onPress={() => setCategory("FUEL")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border ${category === "FUEL" ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"}`}
              >
                <Fuel size={14} color={category === "FUEL" ? "#e11d48" : "#64748b"} />
                <Text className={`text-xs font-bold ${category === "FUEL" ? "text-rose-700" : "text-slate-500"}`}>Petrol</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCategory("MAINTENANCE")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border ${category === "MAINTENANCE" ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}
              >
                <Wrench size={14} color={category === "MAINTENANCE" ? "#d97706" : "#64748b"} />
                <Text className={`text-xs font-bold ${category === "MAINTENANCE" ? "text-amber-700" : "text-slate-500"}`}>Maintenance</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <Text className="text-xs font-bold text-slate-700 mb-1">Amount (Rs)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-base font-bold text-slate-900"
            />

            {/* Description Input */}
            <Text className="text-xs font-bold text-slate-700 mb-1">Description (Optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. 2 liters petrol or puncture repair"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-sm text-slate-900"
            />

            <TouchableOpacity
              onPress={handleSave}
              className="w-full bg-slate-900 py-3.5 rounded-xl items-center shadow-md active:bg-slate-800"
            >
              <Text className="text-white font-bold text-sm">Save Expense</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}