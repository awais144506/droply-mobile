import { CustomerFormData } from "../schema/customer-schema";
export interface CreateCustomerRequestPayload extends CustomerFormData {
    branchId: string;
    requestedById?: string;
    name: string;
    phone: string;
    address: string;
}