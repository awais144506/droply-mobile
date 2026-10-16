import { AxiosInstance } from "axios";
import { OrderDataResponse } from "../types/order";

export const ordersService = {
    getOrderData: async (api: AxiosInstance, branchId: string): Promise<OrderDataResponse> => {
        const response = await api.get(`/rider/${branchId}`);
        return response.data;
    },
    createNewOrder: async (api: AxiosInstance, payload: any) => {
        const response = await api.post(`/orders`, payload);
        return response.data;
    },
    getOrdersList: async (api: AxiosInstance, dateString: string): Promise<any> => {
        const response = await api.get(`/rider/orders?date=${dateString}`);
        return response.data;
    },
    deleteOrder: async (api: AxiosInstance, orderId: string): Promise<any> => {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    },
};