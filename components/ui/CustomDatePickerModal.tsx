import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Calendar Component (Pure JS - No Native Crashes!) */}
          <Calendar
            current={formattedCurrent}
            onDayPress={(day: any) => {
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // bg-black/60
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16, // px-4
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 384, // max-w-sm
    borderRadius: 24, // rounded-3xl
    padding: 24, // p-6
    borderWidth: 1,
    borderColor: '#f1f5f9', // border-slate-100
    // shadow-2xl equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 20, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  title: {
    fontSize: 16, // text-base
    fontWeight: '800', // font-extrabold
    color: '#0f172a', // slate-900
  },
  closeButton: {
    padding: 6, // p-1.5
    borderRadius: 9999, // rounded-full
    backgroundColor: '#f1f5f9', // slate-100
  }
});