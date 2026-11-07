import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { riderShiftApi } from './rider-shift.service';
import { orderKeysMain } from './order-keys';
import { orderKeys } from '@/features/rider/orders/api/order-keys';
import Toast from 'react-native-toast-message';

export const shiftKeys = {
    all: ['rider-shift'] as const,
    status: () => [...shiftKeys.all, 'status'] as const,
};

export function useRiderShiftStatus() {
    const api = useApiClient();

    return useAppQuery({
        queryKey: shiftKeys.status(),
        queryFn: async () => riderShiftApi.getShiftStatus(api),
        staleTime: 1000 * 30,
    });
}

export const useStartShift = () => {
    const queryClient = useQueryClient();
    const api = useApiClient();

    return useMutation({
        mutationFn: () => riderShiftApi.startShift(api),
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'You are online and location is broadcasting...',
                position: 'top',
                visibilityTime: 3000,
            });
            queryClient.setQueryData(shiftKeys.status(), data);
            queryClient.invalidateQueries({ queryKey: shiftKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeysMain.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useEndShift = () => {
    const queryClient = useQueryClient();
    const api = useApiClient();

    return useMutation({
        mutationFn: () => riderShiftApi.endShift(api),
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'You are offline now.',
                position: 'top',
                visibilityTime: 3000,
            });
            queryClient.setQueryData(shiftKeys.status(), data);
            queryClient.invalidateQueries({ queryKey: shiftKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeysMain.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};