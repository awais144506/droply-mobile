import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { AxiosInstance } from "axios";

// --- TYPES ---

export interface CreateCustomerRequestPayload {
  branchId: string;
  name: string;
  phone: string;
  address: string;
}

export interface DropdownOption {
  id: string;
  label: string;
}

// Representing the backend BranchProduct model
export interface BranchProduct {
  id: string;
  name: string;
  salePrice: number;
  currentStock: number;
  category: string;
  trackingType: string;
  productCode: string;
  isActive: boolean;
  unitOfMeasure: string;
}

// Simplified Zone/Customer types based on your backend return
export interface AssignedCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  customerCredit: number;
  returnablesLength: number;
}

export interface AssignedZone {
  id: string;
  name: string;
  totalCustomers: number;
  ledgerAmount: number;
  itemsReturnable: number;
  customers: AssignedCustomer[];
}

export interface RawOrderDataResponse {
  zones: AssignedZone[];
  branchProducts: BranchProduct[];
}

export type FlatAssignedCustomer = AssignedCustomer & {
  zoneId: string;
  zoneName: string;
};

export interface TransformedOrderData {
  assignedZones: {
    id: string;
    name: string;
    totalCustomers: number;
  }[];
  zones: AssignedZone[];
  zoneOptions: DropdownOption[];
  allCustomers: FlatAssignedCustomer[];
  customerOptions: (DropdownOption & {
    phone: string;
    zoneId: string;
    zoneName: string;
    customerCredit: number;
    returnablesLength: number;
  })[];
  totalCustomersCount: number;
  branchProducts: BranchProduct[];
  productOptions: (DropdownOption & {
    price: number;
    stock: number;
    category: string;
  })[];
}

// --- API SERVICE ---

export const ordersService = {
  requestNewCustomer: async (
    api: AxiosInstance,
    payload: CreateCustomerRequestPayload
  ) => {
    const response = await api.post("/customer/request", payload);
    return response.data;
  },

  getRiderData: async (api: AxiosInstance, branchId: string): Promise<RawOrderDataResponse> => {
    const response = await api.get(`/orders/rider/${branchId}`);
    return response.data;
  },
};

// --- HOOK ---

export const useRiderOrderData = (branchId: string | undefined) => {
  const api = useApiClient();

  return useQuery<RawOrderDataResponse, Error, TransformedOrderData>({
    queryKey: ["rider-order-data", branchId],
    enabled: !!branchId,
    queryFn: () => ordersService.getRiderData(api, branchId!),
    staleTime: 1000 * 60 * 5,
    select: (data): TransformedOrderData => {
      const { zones, branchProducts } = data;

      // 1. Zone mapping
      const assignedZones = zones.map((z) => ({
        id: z.id,
        name: z.name,
        totalCustomers: z.customers?.length || 0,
      }));

      const zoneOptions = zones.map((z) => ({
        id: z.id,
        label: z.name,
      }));
      const allCustomers: FlatAssignedCustomer[] = zones.flatMap((zone) =>
        (zone.customers || []).map((customer) => ({
          ...customer,
          zoneId: zone.id,
          zoneName: zone.name,
        }))
      );

      const customerOptions = allCustomers.map((cust) => ({
        id: cust.id,
        label: `${cust.name} - (${cust.phone})`,
        phone: cust.phone,
        zoneId: cust.zoneId,
        zoneName: cust.zoneName,
        customerCredit: cust.customerCredit,
        returnablesLength: cust.returnablesLength,
      }));

      // 4. Total customer count
      const totalCustomersCount = zones.reduce(
        (sum, zone) => sum + (zone.totalCustomers || zone.customers?.length || 0),
        0
      );

      const productOptions = branchProducts.filter(p => p.category !== "RAW_MATERIAL").map((product) => ({
        id: product.id,
        label: `${product.name} - (${product.category})`,
        price: product.salePrice,
        stock: product.currentStock,
        category: product.category,
        unit: product.unitOfMeasure,
      }));

      return {
        zones,
        assignedZones,
        zoneOptions,
        allCustomers,
        customerOptions,
        totalCustomersCount,
        branchProducts,
        productOptions,
      };
    },
  });
};