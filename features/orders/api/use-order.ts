import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { ordersService } from "./orders.service";
import { TransformedOrderData, FlatAssignedCustomer } from "../types/order"
import { orderKeys } from "./order-keys";

export const useRiderOrderData = (branchId: string) => {
  const api = useApiClient();

  return useQuery({
    queryKey: orderKeys.data(branchId),
    enabled: !!branchId,
    queryFn: () => ordersService.getOrderData(api, branchId),
    staleTime: 1000 * 60 * 2,
    select: (data): TransformedOrderData => {
      const { zones, branchProducts } = data;

      // 1. Zone Options for Select Picker
      const zoneOptions = zones.map((z) => ({
        id: z.id,
        label: z.name,
      }));

      // 2. Flatten Customers & inject Zone Info
      const allCustomers: FlatAssignedCustomer[] = zones.flatMap((zone) =>
        (zone.customers || []).map((customer) => ({
          ...customer,
          zoneId: zone.id,
          zoneName: zone.name,
        }))
      );

      // 3. Customer Options for Select Picker
      const customerOptions = allCustomers.filter(c => c.status === "ACTIVE").map((cust) => ({
        id: cust.id,
        label: `${cust.name} - (${cust.phone})`,
        phone: cust.phone,
        zoneId: cust.zoneId,
        zoneName: cust.zoneName,
        customerCredit: cust.customerCredit,
        returnablesLength: cust.returnablesLength,
      }));


      const productOptions = branchProducts
        .filter((p) => p.category !== "RAW_MATERIAL")
        .map((product) => ({
          id: product.id,
          label: `${product.name} - (${product.category})`,
          price: product.salePrice,
          stock: product.currentStock,
          category: product.category,
          unit: product.unitOfMeasure,
        }));

      // 5. Return strictly typed Transformed Data
      return {
        zones,
        zoneOptions,
        allCustomers,
        customerOptions,
        branchProducts,
        productOptions,
      };
    },
  });
};

export const useOrderList = (dateString: string) => {
  const api = useApiClient();
  return useQuery({
    queryKey: orderKeys.list(dateString),
    queryFn: () => ordersService.getOrdersList(api, dateString),
    enabled: !!dateString,
  })
}