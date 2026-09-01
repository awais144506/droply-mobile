import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Battery from "expo-battery";
import { Calendar, Clock, Battery as BatteryIcon, Droplet, RotateCcw, Wallet } from "lucide-react-native";

export default function HeaderMetrics() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dayName, setDayName] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDayName(now.toLocaleDateString("en-US", { weekday: "long" }));
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 1000);

    const initBattery = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        if (level !== -1) setBatteryLevel(Math.round(level * 100));
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          setBatteryLevel(Math.round(batteryLevel * 100));
        });
        return () => subscription.remove();
      } catch {
        setBatteryLevel(92);
      }
    };
    initBattery();

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <View className="px-4 pt-2 pb-3 bg-white border-b border-slate-200/80 z-10">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Calendar size={13} color="#0284c7" />
          <Text className="text-xs font-bold text-slate-900">
            {dayName}, <Text className="text-slate-500 font-normal">{currentDate}</Text>
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
            <Clock size={11} color="#64748b" />
            <Text className="text-[11px] font-mono font-bold text-slate-700">
              {currentTime || "--:--"}
            </Text>
          </View>
          {batteryLevel !== null && (
            <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
              <BatteryIcon size={12} color="#16a34a" />
              <Text className="text-[11px] font-mono font-bold text-slate-700">
                {batteryLevel}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row gap-2 mt-3">
        <View className="flex-1 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 flex-row items-center gap-2">
          <View className="h-7 w-7 rounded-lg bg-sky-500 items-center justify-center">
            <Droplet size={14} color="#ffffff" />
          </View>
          <View>
            <Text className="text-[10px] text-sky-700 font-medium">Loaded</Text>
            <Text className="text-sm font-bold text-sky-950">120</Text>
          </View>
        </View>

        <View className="flex-1 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex-row items-center gap-2">
          <View className="h-7 w-7 rounded-lg bg-emerald-500 items-center justify-center">
            <RotateCcw size={14} color="#ffffff" />
          </View>
          <View>
            <Text className="text-[10px] text-emerald-700 font-medium">Empty</Text>
            <Text className="text-sm font-bold text-emerald-950">84</Text>
          </View>
        </View>

        <View className="flex-1 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 flex-row items-center gap-2">
          <View className="h-7 w-7 rounded-lg bg-amber-500 items-center justify-center">
            <Wallet size={14} color="#ffffff" />
          </View>
          <View>
            <Text className="text-[10px] text-amber-700 font-medium">Cash</Text>
            <Text className="text-sm font-bold text-amber-950">Rs 14k</Text>
          </View>
        </View>
      </View>
    </View>
  );
}