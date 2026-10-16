import { AxiosInstance } from 'axios';
import { RiderActiveOrder } from '../types/orders';

export const ordersApi = {
  getTodayActiveOrders: async (api: AxiosInstance): Promise<RiderActiveOrder[]> => {
    const response = await api.get('/rider/orders/today');
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
    console.log(settlementData)
    await api.patch(`/rider/orders/${orderId}/status`, { status, settlementData });
  },
};