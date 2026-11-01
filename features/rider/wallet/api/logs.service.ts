import { AxiosInstance } from "axios";
import { RiderLogs } from "../types/logs";

export const logsApi = {
    getAllLogs: async (api: AxiosInstance, filterDate?: string): Promise<RiderLogs[]> => {
        const response = await api.get(`/rider/mobile/logs`, {
            params: { filterDate }
        })
        return response.data;
    },
    createExpense: async (api: AxiosInstance,data: any): Promise<RiderLogs> => {
        const response = await api.post(`/rider/mobile/logs/expense`, data);
        return response.data;
    }
}