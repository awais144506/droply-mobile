import { AxiosInstance } from "axios";
import { RiderLogs ,ApiResponse} from "../types/logs";

export const logsApi = {
    getAllLogs: async (api: AxiosInstance, filterDate?: string): Promise<ApiResponse> => {
        const response = await api.get(`/rider/logs`, {
            params: { filterDate }
        })
        return response.data;
    },
    createExpense: async (api: AxiosInstance,data: any): Promise<RiderLogs> => {
        const response = await api.post(`/rider/logs/expense`, data);
        return response.data;
    }
}