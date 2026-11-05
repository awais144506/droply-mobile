import { AxiosInstance } from 'axios';
import { RiderActiveOrder } from '../types/orders';

const API='/rider/orders'
export const ordersApi = {
  getTodayActiveOrders: async (api: AxiosInstance): Promise<RiderActiveOrder[]> => {
    const response = await api.get(`${API}/today`);
    return response.data;
  },

  updateOrderStatus: async (
    api: AxiosInstance,
    orderId: string,
    status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED',
    settlementData?: {
      deductedAdvance: number;
      collectedAmount: number;
      paymentMethod: 'CASH' | 'ONLINE';
    }
  ): Promise<void> => {
    await api.patch(`${API}/${orderId}/status`, { status, settlementData });
  },
};