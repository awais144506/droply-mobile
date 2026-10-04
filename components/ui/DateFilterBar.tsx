// src/components/ui/DateFilterBar.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export type DateFilterType = 'today' | 'tomorrow' | 'custom';

interface DateFilterBarProps {
  activeFilter: DateFilterType;
  customDate: Date;
  onFilterChange: (filter: DateFilterType, date?: Date) => void;
}

export function DateFilterBar({ activeFilter, customDate, onFilterChange }: DateFilterBarProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onFilterChange('custom', selectedDate);
    }
  };

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
      >
        <TouchableOpacity
          onPress={() => onFilterChange('today')}
          className={`px-6 py-2 rounded-full border ${activeFilter === 'today' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
        >
          <Text className={`text-sm font-bold ${activeFilter === 'today' ? 'text-white' : 'text-slate-600'}`}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange('tomorrow')}
          className={`px-6 py-2 rounded-full border ${activeFilter === 'tomorrow' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
        >
          <Text className={`text-sm font-bold ${activeFilter === 'tomorrow' ? 'text-white' : 'text-slate-600'}`}>Tomorrow</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className={`px-6 py-2 rounded-full border flex-row items-center gap-2 ${activeFilter === 'custom' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
        >
          <CalendarDays size={14} color={activeFilter === 'custom' ? '#ffffff' : '#475569'} />
          <Text className={`text-sm font-bold ${activeFilter === 'custom' ? 'text-white' : 'text-slate-600'}`}>
            {activeFilter === 'custom' ? customDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Pick Date'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={customDate}
          mode="date"
          display="default"
          onValueChange={handleDateChange}
        />
      )}
    </View>
  );
}