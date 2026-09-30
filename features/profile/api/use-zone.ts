import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { zoneService, AssignedZone, AssignedCustomer } from "./zone.service";

// Augmented customer with zone reference
export type FlatAssignedCustomer = AssignedCustomer & {
    zoneId: string;
    zoneName: string;
};

// 🔥 Fixed Dropdown option shape to match SearchableSelect perfectly
export interface DropdownOption {
    id: string;
    label: string;
}

export interface TransformedZoneData {
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
}

export const useAssignedZones = () => {
    const api = useApiClient();

    return useQuery<AssignedZone[], Error, TransformedZoneData>({
        queryKey: ["assigned-zones"],
        queryFn: () => zoneService.getAssignedZones(api),
        staleTime: 1000 * 60 * 5,
        select: (zones): TransformedZoneData => {

            const assignedZones = zones.map((z) => ({
                id: z.id,
                name: z.name,
                totalCustomers: z.customers?.length || 0,
            }));

            // 🔥 Changed 'value' to 'id'
            const zoneOptions = zones.map((z) => ({
                id: z.id,
                label: z.name,
            }));

            // Flatten all customers across all zones into one single array
            const allCustomers: FlatAssignedCustomer[] = zones.flatMap((zone) =>
                (zone.customers || []).map((customer) => ({
                    ...customer,
                    zoneId: zone.id,
                    zoneName: zone.name,
                }))
            );

            // 🔥 Changed 'value' to 'id'
            const customerOptions = allCustomers.map((cust) => ({
                id: cust.id,
                label: `${cust.name} - ${cust.zoneName}`,
                phone: cust.phone,
                zoneId: cust.zoneId,
                zoneName: cust.zoneName,
                customerCredit: cust.customerCredit,
                returnablesLength: cust.returnablesLength,
            }));

            // Total customer count across all assigned zones
            const totalCustomersCount = zones.reduce(
                (sum, zone) => sum + (zone.totalCustomers || zone.customers?.length || 0),
                0
            );

            return {
                zones,
                zoneOptions,
                allCustomers,
                customerOptions,
                totalCustomersCount,
                assignedZones,
            };
        },
    });
};