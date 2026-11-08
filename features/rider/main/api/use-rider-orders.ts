import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeysMain } from './order-keys';
import { ordersApi } from './orders.service';
import { orderKeys } from '@/features/rider/orders/api/order-keys';
import Toast from 'react-native-toast-message';

export function useTodayActiveOrders() {
    const api = useApiClient();

    return useAppQuery({
        queryKey: orderKeysMain.todayActive(),
        queryFn: async () => ordersApi.getTodayActiveOrders(api),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60 * 1,
    });
}

interface UpdateStatusVariables {
    orderId: string;
    status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
    settlementData?: {
        deductedAdvance: number;
        collectedAmount: number;
        paymentMethod: 'CASH' | 'BANK';
    };
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const api = useApiClient();

    return useMutation({
        mutationFn: ({ orderId, status, settlementData }: UpdateStatusVariables) =>
            ordersApi.updateOrderStatus(api, orderId, status, settlementData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: orderKeysMain.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

            // 🔥 Success Toast Notification
            Toast.show({
                type: 'success',
                text1: 'Order Updated',
                text2: `Status successfully changed to ${variables.status.replace('_', ' ')}`,
                position: 'top',
            });
        },
        onError: (error: any) => {
            // Extract error message from API response if available
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update order status. Please try again.';

            // 🔥 Error Toast Notification
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: errorMessage,
                position: 'top',
            });
        },
    });
};