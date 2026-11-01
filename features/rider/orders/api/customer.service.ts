import { AxiosInstance } from "axios";
import { CreateCustomerRequestPayload } from "../types/customer";

export const customerService = {
    requestNewCustomer: async (
        api: AxiosInstance,
        payload: CreateCustomerRequestPayload
    ) => {
        const response = await api.post("/rider/mobile/request", payload);
        return response.data;
    },
};
