import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useAlertStore } from "@/store/useAlertStore";
import { AlertCircle } from "lucide-react-native";

export default function CustomAlert() {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-slate-900/50 px-6">
        <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          
          {/* Icon Header */}
          <View className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 items-center justify-center mb-4">
            <AlertCircle size={24} color="#0284c7" />
          </View>

          {/* Title & Message */}
          <Text className="text-base font-bold text-slate-900 mb-1">{title}</Text>
          <Text className="text-xs text-slate-500 leading-relaxed mb-6">{message}</Text>

          {/* Buttons Layout */}
          <View className="flex-row gap-3">
            {buttons.map((btn, index) => {
              const isCancel = btn.style === "cancel";
              const isDestructive = btn.style === "destructive";

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    hideAlert();
                    btn.onPress?.();
                  }}
                  className={`flex-1 h-11 rounded-xl items-center justify-center border ${
                    isCancel
                      ? "bg-white border-slate-200"
                      : isDestructive
                      ? "bg-rose-600 border-rose-600"
                      : "bg-sky-600 border-sky-600"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isCancel ? "text-slate-700" : "text-white"
                    }`}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}