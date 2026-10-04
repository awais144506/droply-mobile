import React from 'react';
import { View, Text } from 'react-native';
import { Wallet, CalendarDays } from 'lucide-react-native';
import { format } from 'date-fns';

interface SummaryCardProps {
  date: Date;
  totalCashIn: number;
}

export default function WalletSummaryCard({ date, totalCashIn }: SummaryCardProps) {
  return (
    <View className="bg-slate-900 rounded-xl p-6 mb-6 shadow-xl relative overflow-hidden">

      {/* Top Row: Date Pill & Icon */}
      <View className="flex-row justify-between items-center mb-8 z-10">
        <View className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-300 flex-row items-center gap-2">
          <CalendarDays size={14} color="#94a3b8" />
          <Text className="text-slate-300 text-xs font-bold tracking-wide">
            {format(date, 'MMMM dd, yyyy')}
          </Text>
        </View>

        <View className="h-10 w-10 bg-slate-800/80 rounded-full items-center justify-center border border-slate-700/50">
          <Wallet size={18} color="#38bdf8" />
        </View>
      </View>

      {/* Main Focus: Total Received */}
      <View className="z-10">
        <Text className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">
          Total Payment Received
        </Text>

        <View className="flex-row items-baseline">
          <Text className="text-slate-300 text-2xl font-bold mr-1.5">
            Rs: ({totalCashIn.toLocaleString()})
          </Text>
        </View>
      </View>

    </View>
  );
}