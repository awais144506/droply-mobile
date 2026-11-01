import { AxiosInstance } from 'axios';
import { CustomerOrderRequest } from '../types/requests';

export const orderApi = {
  getAllOrderRequests: async (
    api: AxiosInstance,
    branchId?: string,
  ): Promise<CustomerOrderRequest[]> => {
    const { data } = await api.get<CustomerOrderRequest[]>('/manager/mobile/orders');
    return data;
  },
};