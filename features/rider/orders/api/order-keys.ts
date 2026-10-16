export const orderKeys = {
    data: (branchId: string) => ['rider-order-data', branchId] as const,
    lists: () => ['rider-orders-list'] as const, 
    list: (dateString: string) => [...orderKeys.lists(), dateString] as const
}