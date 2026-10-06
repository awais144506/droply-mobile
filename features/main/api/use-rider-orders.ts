import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './order-keys';
import { ordersApi } from './orders.service';

export function useTodayActiveOrders() {
    const api = useApiClient();

    return useAppQuery({
        queryKey: orderKeys.todayActive(),
        queryFn: async () => ordersApi.getTodayActiveOrders(api),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 20,
    });
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const api = useApiClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED' }) =>
            ordersApi.updateOrderStatus(api, orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
};