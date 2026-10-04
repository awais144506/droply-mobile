
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logKeys } from '@/features/wallet/api/log-keys';
import { useApiClient } from '@/lib/api-client';
import { orderKeys } from './order-keys';
import { ordersService } from './orders.service';
import Toast from 'react-native-toast-message';

export const useCreateOrder = (branchId: string) => {
    const api = useApiClient();
    const query = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => ordersService.createNewOrder(api, payload),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Order Created',
                text2: 'Order has been created successfully',
                position: 'top',
                visibilityTime: 3000,
            });
            query.invalidateQueries({ queryKey: logKeys.list(branchId) })
            query.invalidateQueries({ queryKey: orderKeys.lists() })
            query.invalidateQueries({ queryKey: orderKeys.data(branchId) })
        },
        onError: (err: any) => {
            Toast.show({
                type: 'error',
                text1: 'Order Failed',
                text2: err.message,
                position: 'top',
                visibilityTime: 3000,
            });
            query.invalidateQueries({ queryKey: orderKeys.data(branchId) })
        },
    })
};

// Export this alongside your other hooks in use-order.ts
export const useDeleteOrder = (branchId: string) => {
    const api = useApiClient();
    const query = useQueryClient();

    return useMutation({
        mutationFn: (orderId: string) => ordersService.deleteOrder(api, orderId),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Order Deleted',
                text2: 'Order and stock were successfully reversed.',
                position: 'top',
                visibilityTime: 3000,
            });

            query.invalidateQueries({ queryKey: orderKeys.lists() });
            query.invalidateQueries({ queryKey: logKeys.list(branchId) })
            query.invalidateQueries({ queryKey: orderKeys.data(branchId) })
        },
        onError: (err: any) => {
            Toast.show({
                type: 'error',
                text1: 'Deletion Failed',
                text2: err.message || 'Could not delete the order.',
                position: 'top',
                visibilityTime: 3000,
            });
        },
    });
};