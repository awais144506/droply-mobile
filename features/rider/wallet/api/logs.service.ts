import { AxiosInstance } from "axios";
import { RiderLogs } from "../types/logs";
import { ExpenseFormData } from "../components/AddExpenseModal";

export const logsApi = {
    getAllLogs: async (api: AxiosInstance, branchId: string, filterDate?: string): Promise<RiderLogs[]> => {
        const response = await api.get(`/rider/${branchId}/logs`, {
            params: { filterDate }
        })
        return response.data;
    },
    createExpense: async (api: AxiosInstance, branchId: string, data: ExpenseFormData): Promise<RiderLogs> => {
        const response = await api.post(`/rider/${branchId}/logs/expense`, data);
        return response.data;
    }
}