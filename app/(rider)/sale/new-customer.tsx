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
import * as yup from "yup";
import { ArrowLeft, User, Phone, Building2, Send } from "lucide-react-native";
import PhoneInput from "react-native-phone-number-input";
import { useRequestNewCustomer } from "@/features/orders/api/use-customer";
import { useRole } from "@/lib/use-role";
// 🔥 Import the new CustomAlert
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";

// 1. Define the Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Customer name is required"),
  phone: yup
    .string()
    // Validation for international E.164 format (e.g., +923001234567)
    .matches(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function AddNewCustomerScreen() {
  const router = useRouter();
  const { userId, branchId } = useRole();

  // Connect the mutation hook
  const { mutate: createRequest } = useRequestNewCustomer();

  // 🔥 State to manage our custom alert
  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const showAlert = (config: Omit<CustomAlertProps, "visible">) => {
    setAlertConfig({ ...config, visible: true });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // 2. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  // 3. Form Submit Handler using CustomAlert
  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      requestedById: userId,
      branchId,
    };

    showAlert({
      title: "Send to Management",
      message: `Send  "${data.name}" customer details to manager?`,
      confirmText: "Submit Request",
      cancelText: "Cancel",
      onCancel: closeAlert,
      onConfirm: () => {
        closeAlert();
        // Fire mutation
        createRequest(payload);
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">

        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <TouchableOpacity onPress={() => router.back()} className="h-9 w-9 bg-slate-100 rounded-xl items-center justify-center">
            <ArrowLeft size={18} color="#334155" />
          </TouchableOpacity>
          <Text className="text-sm font-bold text-slate-900">Request New Customer</Text>
          <View className="w-9" />
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

          <View className="mb-4 bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
            <Text className="text-xs font-bold text-sky-900 mb-0.5">Manager Approval Required</Text>
            <Text className="text-[11px] text-sky-700 leading-relaxed">
              Riders cannot directly add accounts. Submitting this form will ping the plant manager with the customer details to register them into the system.
            </Text>
          </View>

          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm">
            <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Customer Details</Text>

            <View className="gap-4">

              {/* Name Field */}
              <View>
                <View className={`flex-row items-center bg-slate-50 border rounded-xl px-3 h-12 ${errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}>
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
                        className="flex-1 ml-2 text-sm font-semibold text-slate-900"
                      />
                    )}
                  />
                </View>
                {errors.name && <Text className="text-[10px] text-rose-500 font-medium mt-1 ml-1">{errors.name.message}</Text>}
              </View>

              {/* Phone Field */}
              <View>
                <View className={`flex-row items-center bg-slate-50 border rounded-xl px-3 h-12 overflow-hidden ${errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}>
                  <Phone size={16} color={errors.phone ? "#f43f5e" : "#64748b"} />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        defaultValue={value}
                        defaultCode="PK"
                        layout="first"
                        onChangeFormattedText={(text) => {
                          onChange(text);
                        }}
                        placeholder="Phone Number"
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
                {errors.phone && <Text className="text-[10px] text-rose-500 font-medium mt-1 ml-1">{errors.phone.message}</Text>}
              </View>

              {/* Address Field */}
              <View>
                <View className={`flex-row items-center bg-slate-50 border rounded-xl px-3 h-12 ${errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}>
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
                        className="flex-1 ml-2 text-sm font-semibold text-slate-900"
                      />
                    )}
                  />
                </View>
                {errors.address && <Text className="text-[10px] text-rose-500 font-medium mt-1 ml-1">{errors.address.message}</Text>}
              </View>

            </View>
          </View>
        </ScrollView>

        <View className="p-4 bg-white border-t border-slate-200">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="w-full h-12 bg-sky-600 rounded-xl items-center justify-center flex-row gap-2 active:bg-sky-700 shadow-sm"
          >
            <Send size={16} color="#ffffff" />
            <Text className="text-white text-sm font-bold">Send Request to Manager</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* 🔥 Render the Custom Alert outside the KeyboardAvoidingView */}
      <CustomAlert {...alertConfig} />
    </SafeAreaView>
  );
}