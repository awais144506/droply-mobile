import React from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from "react-native";
import { customAlertStyles as styles } from "../style/custom-style";

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
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
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              
              <Text style={styles.titleText}>
                {title}
              </Text>
              
              <Text style={styles.messageText}>
                {message}
              </Text>

              <View style={styles.buttonRow}>
                {/* Render Cancel button only if onCancel is provided */}
                {onCancel && (
                  <TouchableOpacity
                    onPress={onCancel}
                    activeOpacity={0.7}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>
                      {cancelText || "Cancel"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.7}
                  style={[
                    styles.confirmButtonBase,
                    isDestructive ? styles.confirmDestructive : styles.confirmPrimary
                  ]}
                >
                  <Text style={styles.confirmText}>
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