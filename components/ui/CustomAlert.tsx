import React from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from "react-native";

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean; // Turns the confirm button red for Sign Out / Delete actions
}

export function CustomAlert({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
}: CustomAlertProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 bg-slate-900/40 justify-center items-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl">
              
              <Text className="text-lg font-bold text-slate-900 text-center mb-2">
                {title}
              </Text>
              
              <Text className="text-sm font-medium text-slate-500 text-center mb-6 leading-relaxed">
                {message}
              </Text>

              <View className="flex-row gap-3">
                {/* Render Cancel button only if onCancel is provided */}
                {onCancel && (
                  <TouchableOpacity
                    onPress={onCancel}
                    activeOpacity={0.7}
                    className="flex-1 py-3.5 rounded-xl bg-slate-100 items-center justify-center border border-slate-200"
                  >
                    <Text className="text-sm font-bold text-slate-600">
                      {cancelText || "Cancel"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.7}
                  className={`flex-1 py-3.5 rounded-xl items-center justify-center shadow-sm ${
                    isDestructive ? "bg-rose-600" : "bg-sky-600"
                  }`}
                >
                  <Text className="text-sm font-bold text-white">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}