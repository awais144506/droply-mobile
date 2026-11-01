import { AxiosInstance } from 'axios';
import { DailySalesSummaryResponse, DailySalesQueryParams } from '../types/sales';

export const salesApi = {
  getDailySalesSummary: async (
    api: AxiosInstance,
    params?: DailySalesQueryParams
  ): Promise<DailySalesSummaryResponse> => {
    const response = await api.get<DailySalesSummaryResponse>(
      `/daily/sales`,
      { params }
    );
    return response.data;
  },
};