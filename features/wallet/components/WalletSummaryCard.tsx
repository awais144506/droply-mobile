// src/components/wallet/WalletSummaryCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { format } from 'date-fns';

interface SummaryCardProps {
  date: Date;
  netDeposit: number;
  totalCashIn: number;
  totalExpenses: number;
}

export default function WalletSummaryCard({ date, netDeposit, totalCashIn, totalExpenses }: SummaryCardProps) {
  return (
    <View className="bg-sky-600 rounded-3xl p-5 mb-4 shadow-xl border border-sky-500/30">
      <View className="flex-row items-center justify-between bg-sky-700/50 px-3 py-1.5 rounded-xl mb-4 border border-sky-500/40">
        <View className="flex-row items-center gap-1.5">
          <Calendar size={13} color="#bae6fd" />
          <Text className="text-[11px] font-bold text-sky-100">{format(date, 'MMM dd, yyyy')}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock size={13} color="#bae6fd" />
          <Text className="text-[11px] font-bold text-sky-100 font-mono">
            {format(new Date(), 'hh:mm a')}
          </Text>
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
  );
}