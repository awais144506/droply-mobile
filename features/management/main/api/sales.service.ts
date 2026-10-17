import { AxiosInstance } from 'axios';
import { DailySalesSummaryResponse, DailySalesQueryParams } from '../types/sales';

export const salesApi = {
  getDailySalesSummary: async (
    api: AxiosInstance,
    branchId: string,
    params?: DailySalesQueryParams
  ): Promise<DailySalesSummaryResponse> => {
    const response = await api.get<DailySalesSummaryResponse>(
      `/daily/sales/branch/${branchId}`,
      { params }
    );
    return response.data;
  },
};