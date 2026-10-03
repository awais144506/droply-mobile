import { AxiosInstance } from "axios";
import { RiderLogs } from "../types/logs";

export const logsApi = {
    getAllLogs: async (api: AxiosInstance, branchId: string, filterDate?: string): Promise<RiderLogs[]> => {
        const response = await api.get(`/rider/${branchId}/logs`, {
            params: { filterDate }
        })
        return response.data;
    }
}