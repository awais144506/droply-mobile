import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { NewOrderFormData } from "../../schema/order-schema";

export default function OrderScheduleCard() {
  const { setValue, control } = useFormContext<NewOrderFormData>();

  // Watch global state to highlight the correct active button
  const scheduleMode = useWatch({ control, name: "scheduleMode" });
  const scheduleDate = useWatch({ control, name: "scheduleDate" });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Prevent users from picking "Today" or "Tomorrow" via the custom date picker
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
    <View className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <CalendarDays size={16} color="#64748b" />
          <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Delivery Schedule</Text>
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

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => setMode("TODAY")}
          className={`flex-1 py-3 rounded-xl border items-center justify-center ${scheduleMode === "TODAY" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"
            }`}
        >
          <Text className={`text-xs font-bold ${scheduleMode === "TODAY" ? "text-sky-700" : "text-slate-600"}`}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode("TOMORROW")}
          className={`flex-1 py-3 rounded-xl border items-center justify-center ${scheduleMode === "TOMORROW" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"
            }`}
        >
          <Text className={`text-xs font-bold ${scheduleMode === "TOMORROW" ? "text-sky-700" : "text-slate-600"}`}>
            Tomorrow
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className={`flex-1 py-3 rounded-xl border items-center justify-center ${scheduleMode === "LATER" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"
            }`}
        >
          <Text className={`text-xs font-bold ${scheduleMode === "LATER" ? "text-sky-700" : "text-slate-600"}`}>
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
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}