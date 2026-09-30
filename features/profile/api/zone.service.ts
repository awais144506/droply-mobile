import { AxiosInstance } from "axios";

export interface AssignedCustomer {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  category: string;
  customerCredit: number;
  returnablesLength: number;
}

export interface AssignedZone {
  id: string;
  name: string;
  branchId: string;
  totalCustomers: number;
  ledgerAmount: number;
  itemsReturnable: number;
  customers: AssignedCustomer[];
}

export const zoneService = {
  getAssignedZones: async (api: AxiosInstance): Promise<AssignedZone[]> => {
    const response = await api.get("/zone/rider"); 
    console.log(response.data)
    return response.data;
  },
};