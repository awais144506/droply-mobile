import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerSchema, CustomerFormData } from "@/features/orders/schema/customer-schema";
import { ArrowLeft, User, UserPlus, Phone, Building2, Send } from "lucide-react-native";
import PhoneInput from "react-native-phone-number-input";
import { useRequestNewCustomer } from "@/features/orders/api/use-customer";
import { useRole } from "@/lib/use-role";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import Loading from "@/app/loading";
import { addCustomerStyles as styles } from "@/features/orders/style/order-style"; // Adjust path if needed

export default function AddNewCustomerScreen() {
  const router = useRouter();
  const { userId, branchId } = useRole();

  const { mutate: createRequest, isPending } = useRequestNewCustomer(branchId);

  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });
  const [resetKey, setResetKey] = useState(0);

  const showAlert = (config: Omit<CustomAlertProps, "visible">) => {
    setAlertConfig({ ...config, visible: true });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  // Form Submit Handler using CustomAlert
  const onSubmit = (data: CustomerFormData) => {
    const payload = {
      ...data,
      requestedById: userId || "",
      branchId,
    };

    showAlert({
      title: "Send to Management",
      message: `Send "${data.name}" customer details to manager?`,
      confirmText: "Submit Request",
      cancelText: "Cancel",
      onCancel: closeAlert,
      onConfirm: () => {
        closeAlert();
        createRequest(payload);
        reset();
        setResetKey(prev => prev + 1);
      },
    });
  };

  if (isPending) return <Loading text="Sending Request..." />
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(rider)/orders')} style={styles.backButton}>
            <ArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconWrapper}>
              <UserPlus size={20} color="#0f172a" />
            </View>
            <View>
              <Text style={styles.headerTitleText}>Add New Customer</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          <View style={styles.infoBanner}>
            <Text style={styles.infoTitle}>Manager Approval Required</Text>
            <Text style={styles.infoText}>
              Riders cannot directly add accounts. Submitting this form will ping the plant manager with the customer details to register them into the system.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formCardTitle}>Customer Details</Text>

            <View style={styles.inputsContainer}>

              {/* Name Field */}
              <View>
                <View style={[
                  styles.inputWrapperBase, 
                  errors.name ? styles.inputWrapperError : styles.inputWrapperNormal
                ]}>
                  <User size={16} color={errors.name ? "#f43f5e" : "#64748b"} />
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Customer Name or Shop Name..."
                        placeholderTextColor="#94a3b8"
                        style={styles.textInput}
                      />
                    )}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>

              {/* Phone Field */}
              <View>
                <View style={[
                  styles.inputWrapperBase, 
                  errors.phone ? styles.inputWrapperError : styles.inputWrapperNormal
                ]}>
                  <Phone size={16} color={errors.phone ? "#f43f5e" : "#64748b"} />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        key={`phone-input-${resetKey}`}
                        defaultValue={value}
                        defaultCode="PK"
                        layout="first"
                        onChangeFormattedText={(text) => {
                          onChange(text);
                        }}
                        placeholder="e.g 03216907425"
                        // FIX: Explicitly passing textInputProps to force placeholder color
                        textInputProps={{ placeholderTextColor: '#94a3b8' }}
                        containerStyle={{ flex: 1, backgroundColor: 'transparent', height: 48 }}
                        textContainerStyle={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 0 }}
                        textInputStyle={{ fontSize: 14, fontWeight: "600", color: "#0f172a", height: 48, padding: 0, margin: 0 }}
                        codeTextStyle={{ fontSize: 14, fontWeight: "600", color: "#0f172a", marginLeft: -15 }}
                        flagButtonStyle={{ width: 45, marginLeft: -5 }}
                        withShadow={false}
                      />
                    )}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>

              {/* Address Field */}
              <View>
                <View style={[
                  styles.inputWrapperBase, 
                  errors.address ? styles.inputWrapperError : styles.inputWrapperNormal
                ]}>
                  <Building2 size={16} color={errors.address ? "#f43f5e" : "#64748b"} />
                  <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Shop # / Area / Address"
                        placeholderTextColor="#94a3b8"
                        style={styles.textInput}
                      />
                    )}
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
              </View>

            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.submitBtnBase,
              (isPending || !isValid) ? styles.submitBtnInvalid : styles.submitBtnValid
            ]}
          >
            <Send size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Send Request to Manager</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      <CustomAlert {...alertConfig} />
    </SafeAreaView>
  );
}