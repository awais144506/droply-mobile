import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeysMain } from './order-keys';
import { ordersApi } from './orders.service';
import { orderKeys } from '@/features/orders/api/order-keys';

export function useTodayActiveOrders() {
    const api = useApiClient();

    return useAppQuery({
        queryKey: orderKeysMain.todayActive(),
        queryFn: async () => ordersApi.getTodayActiveOrders(api),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 20,
    });
}

interface UpdateStatusVariables {
  orderId: string;
  status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  settlementData?: {
    deductedAdvance: number;
    collectedAmount: number;
    paymentMethod: 'CASH' | 'ONLINE';
  };
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const api = useApiClient();

    return useMutation({
        mutationFn: ({ orderId, status, settlementData }: UpdateStatusVariables) =>
            ordersApi.updateOrderStatus(api, orderId, status, settlementData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeysMain.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};