/* eslint-disable react-hooks/incompatible-library */
import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from "react-native";
import { X, Fuel, Wrench } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRole } from "@/lib/use-role";
import { useCreateExpenseLog } from "../api/use-mutate-expense-logs";

// 1. Define Yup Schema
const expenseSchema = yup.object().shape({
    category: yup
        .string()
        .oneOf(['PETROL', 'MAINTENANCE'])
        .required(),
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than zero")
        .required("Amount is required"),
    odometerReading: yup
        .number()
        .typeError("Odometer must be a number")
        .positive("Odometer must be greater than zero")
        .required("Odometer reading is required"),
});

export type ExpenseFormData = yup.InferType<typeof expenseSchema>;

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
}

export default function AddExpenseModal({ visible, onClose, onSubmit }: AddExpenseModalProps) {
    const { branchId } = useRole();
    const { mutate: createExpense, isPending } = useCreateExpenseLog(branchId);
    // 2. Setup React Hook Form
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema),
        mode: "onChange",
        defaultValues: {
            category: 'PETROL' // Set default category
        }
    });

    // Watch category to apply active styles to toggles
    const currentCategory = watch('category');

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = (data: ExpenseFormData) => {
        createExpense(data, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-slate-900/40 justify-center items-center px-4">

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "position"}
                        className="w-full max-w-sm"
                    >
                        <View className="bg-white rounded-3xl p-6 shadow-xl max-h-[90%] w-full">

                            {/* Header */}
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-lg font-extrabold text-slate-900">Log Expense</Text>
                                <TouchableOpacity onPress={handleClose} className="h-8 w-8 bg-slate-100 rounded-full items-center justify-center">
                                    <X size={16} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                                {/* Category Toggles (Controlled by React Hook Form) */}
                                <View className="flex-row gap-3 mb-6">
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setValue('category', 'PETROL', { shouldValidate: true })}
                                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border ${currentCategory === 'PETROL' ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
                                        <Fuel size={16} color={currentCategory === 'PETROL' ? "#0284c7" : "#64748b"} />
                                        <Text className={`text-sm font-bold ${currentCategory === 'PETROL' ? 'text-sky-700' : 'text-slate-600'}`}>Petrol</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setValue('category', 'MAINTENANCE', { shouldValidate: true })}
                                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border ${currentCategory === 'MAINTENANCE' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
                                        <Wrench size={16} color={currentCategory === 'MAINTENANCE' ? "#b45309" : "#64748b"} />
                                        <Text className={`text-[11px] font-bold ${currentCategory === 'MAINTENANCE' ? 'text-amber-700' : 'text-slate-600'}`}>Maintenance</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Inputs */}
                                <View className="gap-4 mb-6">
                                    <View>
                                        <Text className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Amount (Rs)</Text>
                                        <Controller
                                            control={control}
                                            name="amount"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    value={value ? String(value) : ""}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    keyboardType="numeric"
                                                    placeholder="e.g. 1500"
                                                    className={`bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 font-semibold text-base ${errors.amount ? "border-rose-400" : "border-slate-200"
                                                        }`}
                                                    placeholderTextColor="#94a3b8"
                                                />
                                            )}
                                        />
                                        {errors.amount && (
                                            <Text className="text-rose-500 text-xs mt-1 font-medium ml-1">
                                                {errors.amount.message}
                                            </Text>
                                        )}
                                    </View>

                                    <View>
                                        <Text className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Current Odometer (KM)</Text>
                                        <Controller
                                            control={control}
                                            name="odometerReading"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    value={value ? String(value) : ""}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    keyboardType="numeric"
                                                    placeholder="e.g. 45200"
                                                    className={`bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 font-semibold text-base ${errors.odometerReading ? "border-rose-400" : "border-slate-200"
                                                        }`}
                                                    placeholderTextColor="#94a3b8"
                                                />
                                            )}
                                        />
                                        {errors.odometerReading && (
                                            <Text className="text-rose-500 text-xs mt-1 font-medium ml-1">
                                                {errors.odometerReading.message}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit(handleFormSubmit)}
                                    disabled={!isValid || isPending}
                                    activeOpacity={0.7}
                                    className={`w-full py-3.5 rounded-xl items-center justify-center shadow-sm mb-2 ${isValid ? "bg-sky-600" : "bg-slate-300"
                                        }`}
                                >
                                    <Text className="text-white font-bold text-base">Save Expense</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}