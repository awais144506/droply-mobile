import { CustomerFormData } from "../schema/customer-schema";
export interface CreateCustomerRequestPayload extends CustomerFormData {
    name: string;
    phone: string;
    address: string;
}