import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { X } from 'lucide-react-native';
import { format } from 'date-fns';

interface CustomDatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CustomDatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}: CustomDatePickerModalProps) {
  const formattedCurrent = format(selectedDate, 'yyyy-MM-dd');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100">
          
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-extrabold text-slate-900">Select Date</Text>
            <TouchableOpacity onPress={onClose} className="p-1.5 rounded-full bg-slate-100">
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Calendar Component (Pure JS - No Native Crashes!) */}
          <Calendar
            current={formattedCurrent}
            onDayPress={(day) => {
              const newDate = new Date(day.timestamp);
              onSelectDate(newDate);
              onClose();
            }}
            markedDates={{
              [formattedCurrent]: {
                selected: true,
                selectedColor: '#0f172a', // Slate-900
              },
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#0f172a',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#0284c7',
              dayTextColor: '#2d4150',
              arrowColor: '#0f172a',
              monthTextColor: '#0f172a',
              textDayFontWeight: '600',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
            }}
          />

        </View>
      </View>
    </Modal>
  );
}