import { AxiosInstance } from "axios";
import { RiderLogs } from "../types/logs";

export const logsApi = {
    getAllLogs: async (api: AxiosInstance, branchId: string, filterDate?: string): Promise<RiderLogs[]> => {
        const response = await api.get(`/rider/mobile/${branchId}/logs`, {
            params: { filterDate }
        })
        return response.data;
    },
    createExpense: async (api: AxiosInstance, branchId: string, data: any): Promise<RiderLogs> => {
        const response = await api.post(`/rider/mobile/${branchId}/logs/expense`, data);
        return response.data;
    }
}