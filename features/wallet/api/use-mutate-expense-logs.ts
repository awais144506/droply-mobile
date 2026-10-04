import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { logsApi } from "./logs.service";
import { ExpenseFormData } from "../components/AddExpenseModal";
import Toast from "react-native-toast-message";
import { logKeys } from "./log-keys";

export function useCreateExpenseLog(branchId: string) {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ExpenseFormData) => logsApi.createExpense(api, branchId, data),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Expense Logged',
                text2: 'Your wallet transaction has been recorded successfully.',
            });
            queryClient.invalidateQueries({ queryKey: logKeys.list(branchId) });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Log Expense',
                text2: error?.response?.data?.message || 'Something went wrong.',
            });
        },
    });
}