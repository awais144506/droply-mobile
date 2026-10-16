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
    ScrollView,
} from "react-native";
import { X, Fuel, Wrench } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRole } from "@/lib/use-role";
import { useCreateExpenseLog } from "../api/use-mutate-expense-logs";
import { createExpenseSchema, CreateExpenseLog } from "../schema/create-expense-schema";
import { addFuelExpenseModalStyle as styles } from "../style/log-style";

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CreateExpenseLog) => void;
}

export default function AddExpenseModal({ visible, onClose, onSubmit }: AddExpenseModalProps) {
    const { branchId } = useRole();
    const { mutate: createExpense, isPending } = useCreateExpenseLog(branchId);
    
    // Setup React Hook Form
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<CreateExpenseLog>({
        resolver: yupResolver(createExpenseSchema),
        mode: "onChange",
        defaultValues: {
            category: 'PETROL'
        }
    });

    // Watch category to apply active styles to toggles
    const currentCategory = watch('category');

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = (data: CreateExpenseLog) => {
        createExpense(data, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "position"}
                        style={styles.keyboardView}
                    >
                        <View style={styles.modalCard}>

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Log Expense</Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                                    <X size={16} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                                {/* Category Toggles (Controlled by React Hook Form) */}
                                <View style={styles.categoryRow}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setValue('category', 'PETROL', { shouldValidate: true })}
                                        style={[
                                            styles.categoryBtn,
                                            currentCategory === 'PETROL' ? styles.petrolActive : styles.categoryInactive
                                        ]}
                                    >
                                        <Fuel size={16} color={currentCategory === 'PETROL' ? "#0284c7" : "#64748b"} />
                                        <Text style={[
                                            styles.categoryText,
                                            currentCategory === 'PETROL' ? styles.petrolTextActive : styles.textInactive
                                        ]}>
                                            Petrol
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setValue('category', 'MAINTENANCE', { shouldValidate: true })}
                                        style={[
                                            styles.categoryBtn,
                                            currentCategory === 'MAINTENANCE' ? styles.maintActive : styles.categoryInactive
                                        ]}
                                    >
                                        <Wrench size={16} color={currentCategory === 'MAINTENANCE' ? "#b45309" : "#64748b"} />
                                        <Text style={[
                                            styles.categoryText,
                                            currentCategory === 'MAINTENANCE' ? styles.maintTextActive : styles.textInactive
                                        ]}>
                                            Maintenance
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Inputs */}
                                <View style={styles.inputsContainer}>
                                    <View>
                                        <Text style={styles.inputLabel}>Amount (Rs)</Text>
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
                                                    style={[
                                                        styles.inputBase,
                                                        errors.amount ? styles.inputError : styles.inputNormal
                                                    ]}
                                                    placeholderTextColor="#94a3b8"
                                                />
                                            )}
                                        />
                                        {errors.amount && (
                                            <Text style={styles.errorText}>
                                                {errors.amount.message}
                                            </Text>
                                        )}
                                    </View>

                                    <View>
                                        <Text style={styles.inputLabel}>Current Odometer (KM)</Text>
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
                                                    style={[
                                                        styles.inputBase,
                                                        errors.odometerReading ? styles.inputError : styles.inputNormal
                                                    ]}
                                                    placeholderTextColor="#94a3b8"
                                                />
                                            )}
                                        />
                                        {errors.odometerReading && (
                                            <Text style={styles.errorText}>
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
                                    style={[
                                        styles.submitBtn,
                                        isValid ? styles.submitBtnValid : styles.submitBtnInvalid
                                    ]}
                                >
                                    <Text style={styles.submitBtnText}>Save Expense</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
