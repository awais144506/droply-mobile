// src/components/wallet/DateFilter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { format, isToday, isYesterday, subDays } from 'date-fns';

interface DateFilterProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onOpenPicker: () => void;
}

export default function DateFilter({ selectedDate, onDateSelect, onOpenPicker }: DateFilterProps) {
  const today = new Date();
  const yesterday = subDays(today, 1);

  const isCustomDate = !isToday(selectedDate) && !isYesterday(selectedDate);

  return (
    <View className="mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onDateSelect(today)}
          className={`px-4 py-2 rounded-full border ${
            isToday(selectedDate) ? 'bg-sky-600 border-sky-700' : 'bg-white border-slate-200'
          }`}
        >
          <Text className={`text-xs font-bold ${isToday(selectedDate) ? 'text-white' : 'text-slate-600'}`}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDateSelect(yesterday)}
          className={`px-4 py-2 rounded-full border ${
            isYesterday(selectedDate) ? 'bg-sky-600 border-sky-700' : 'bg-white border-slate-200'
          }`}
        >
          <Text className={`text-xs font-bold ${isYesterday(selectedDate) ? 'text-white' : 'text-slate-600'}`}>
            Yesterday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenPicker}
          className={`px-4 py-2 rounded-full border flex-row items-center gap-1.5 ${
            isCustomDate ? 'bg-sky-600 border-sky-700' : 'bg-white border-slate-200'
          }`}
        >
          <CalendarIcon size={14} color={isCustomDate ? '#ffffff' : '#475569'} />
          <Text className={`text-xs font-bold ${isCustomDate ? 'text-white' : 'text-slate-600'}`}>
            {isCustomDate ? format(selectedDate, 'MMM dd, yyyy') : 'Pick Date'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}