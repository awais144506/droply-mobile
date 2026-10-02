import { AxiosInstance } from "axios";

export interface CreateCustomerRequestPayload {
  branchId: string;
  name: string;
  phone: string;
  address: string;
}

export const ordersService = {
  requestNewCustomer: async (
    api: AxiosInstance,
    payload: CreateCustomerRequestPayload
  ) => {
    const response = await api.post("/rider/request", payload);
    return response.data;
  },
};
