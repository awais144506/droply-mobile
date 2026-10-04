import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { CustomDatePickerModal } from './CustomDatePickerModal';

export type DateFilterType = 'today' | 'tomorrow' | 'custom';

interface DateFilterBarProps {
  activeFilter: DateFilterType;
  customDate: Date;
  onFilterChange: (filter: DateFilterType, date?: Date) => void;
  hideTomorrow?: boolean;
}

export function DateFilterBar({
  activeFilter,
  customDate,
  onFilterChange,
  hideTomorrow = false
}: DateFilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16, marginTop: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
      >
        {/* Today Button */}
        <TouchableOpacity
          onPress={() => onFilterChange('today')}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: activeFilter === 'today' ? '#0f172a' : '#e2e8f0',
            backgroundColor: activeFilter === 'today' ? '#0f172a' : '#ffffff',
            ...(activeFilter === 'today' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3.84,
              elevation: 5,
            }),
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: activeFilter === 'today' ? '#ffffff' : '#475569' }}>
            Today
          </Text>
        </TouchableOpacity>

        {/* Tomorrow Button */}
        {!hideTomorrow && (
          <TouchableOpacity
            onPress={() => onFilterChange('tomorrow')}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: activeFilter === 'tomorrow' ? '#0f172a' : '#e2e8f0',
              backgroundColor: activeFilter === 'tomorrow' ? '#0f172a' : '#ffffff',
              ...(activeFilter === 'tomorrow' && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3.84,
                elevation: 5,
              }),
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: activeFilter === 'tomorrow' ? '#ffffff' : '#475569' }}>
              Tomorrow
            </Text>
          </TouchableOpacity>
        )}

        {/* Custom Date Button */}
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: activeFilter === 'custom' ? '#0f172a' : '#e2e8f0',
            backgroundColor: activeFilter === 'custom' ? '#0f172a' : '#ffffff',
            ...(activeFilter === 'custom' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3.84,
              elevation: 5,
            }),
          }}
        >
          <CalendarDays size={14} color={activeFilter === 'custom' ? '#ffffff' : '#475569'} />
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: activeFilter === 'custom' ? '#ffffff' : '#475569' }}>
            {activeFilter === 'custom' ? customDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Pick Date'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Pure JS Modal Calendar */}
      <CustomDatePickerModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={customDate}
        onSelectDate={(date) => onFilterChange('custom', date)}
      />
    </View>
  );
}