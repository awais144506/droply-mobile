import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { NewOrderFormData } from "../../schema/order-schema";
import { scheduleCardStyles as styles } from "../../style/order-style"; // Adjust path if needed

export default function OrderScheduleCard() {
  const { setValue, control } = useFormContext<NewOrderFormData>();

  // Watch global state to highlight the correct active button
  const scheduleMode = useWatch({ control, name: "scheduleMode" });
  const scheduleDate = useWatch({ control, name: "scheduleDate" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dayAfterTomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false); // Android requires manual closing of the modal
    }

    if (selectedDate) {
      setValue("scheduleDate", selectedDate, { shouldValidate: true });
      setValue("scheduleMode", "LATER", { shouldValidate: true });
    }
  };

  const setMode = (mode: "TODAY" | "TOMORROW") => {
    const date = new Date();
    if (mode === "TOMORROW") {
      date.setDate(date.getDate() + 1);
    }
    setValue("scheduleMode", mode, { shouldValidate: true });
    setValue("scheduleDate", date, { shouldValidate: true });
    setShowDatePicker(false);
  };

  return (
    <View style={styles.cardBase}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <CalendarDays size={16} color="#64748b" />
          <Text style={styles.titleText}>Delivery Schedule</Text>
        </View>

        {/* iOS Date Picker Inline Option */}
        {Platform.OS === "ios" && showDatePicker && (
          <DateTimePicker
            value={scheduleMode === "LATER" ? scheduleDate : dayAfterTomorrow}
            mode="date"
            display="compact"
            minimumDate={dayAfterTomorrow}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => setMode("TODAY")}
          style={[
            styles.buttonBase,
            scheduleMode === "TODAY" ? styles.buttonActive : styles.buttonInactive
          ]}
        >
          <Text style={[
            styles.buttonTextBase,
            scheduleMode === "TODAY" ? styles.buttonTextActive : styles.buttonTextInactive
          ]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode("TOMORROW")}
          style={[
            styles.buttonBase,
            scheduleMode === "TOMORROW" ? styles.buttonActive : styles.buttonInactive
          ]}
        >
          <Text style={[
            styles.buttonTextBase,
            scheduleMode === "TOMORROW" ? styles.buttonTextActive : styles.buttonTextInactive
          ]}>
            Tomorrow
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.buttonBase,
            scheduleMode === "LATER" ? styles.buttonActive : styles.buttonInactive
          ]}
        >
          <Text style={[
            styles.buttonTextBase,
            scheduleMode === "LATER" ? styles.buttonTextActive : styles.buttonTextInactive
          ]}>
            {scheduleMode === "LATER"
              ? scheduleDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Pick Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Android Modal Date Picker */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={scheduleMode === "LATER" ? scheduleDate : dayAfterTomorrow}
          mode="date"
          display="default"
          minimumDate={dayAfterTomorrow}
          onValueChange={handleDateChange}
        />
      )}
    </View>
  );
}