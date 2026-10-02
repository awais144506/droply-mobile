/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '@clerk/clerk-expo';
import { useOfflineOrderStore } from '@/store/seOfflineOrderStore'; // Check filename spelling!

export const useOrderSync = () => {
    const { offlineQueue, markOrderAsSynced } = useOfflineOrderStore();
    const queryClient = useQueryClient();
    const { getToken } = useAuth();
    
    // 🔥 FIX 1: Use a Ref instead of State. This stops React from re-rendering
    // and triggering an infinite loop when a sync fails!
    const isSyncing = useRef(false);

    // 1. The TanStack Mutation
    const createOrderMutation = useMutation({
        mutationFn: async (orderPayload: any) => {
            const token = await getToken();

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    errorDetails = await response.text();
                }

                console.error("\n❌ NESTJS REJECTED THE ORDER:");
                console.error(`Status Code: ${response.status}`);
                console.error("Payload Sent:", JSON.stringify(orderPayload, null, 2));
                console.error("Backend Error:", JSON.stringify(errorDetails, null, 2));
                console.error("----------------------------------\n");

                throw new Error(
                    errorDetails?.message ||
                    errorDetails?.error ||
                    `Backend returned ${response.status}`
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riderOrderData'] });
        },
    });

    // 2. The Background Queue Processor
    const processQueue = useCallback(async () => {
        if (isSyncing.current || offlineQueue.length === 0) return;

        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) return;

        isSyncing.current = true; // Lock the queue

        try {
            for (const offlineOrder of offlineQueue) {
                const currentState = await NetInfo.fetch();
                if (!currentState.isConnected) break;

                try {
                    await createOrderMutation.mutateAsync(offlineOrder.rawPayload);
                    markOrderAsSynced(offlineOrder.id);
                } catch (error) {
                    console.error(`Failed to sync order ${offlineOrder.id}`, error);
                    break; // 🔥 Break the loop on error so it doesn't spam!
                }
            }
        } finally {
            isSyncing.current = false; // Unlock the queue
        }
    }, [offlineQueue, markOrderAsSynced, createOrderMutation]);

    // 3. The Listeners
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected && offlineQueue.length > 0) {
                processQueue();
            }
        });

        if (offlineQueue.length > 0 && !isSyncing.current) {
            processQueue();
        }

        return () => unsubscribe();
        
        // 🔥 FIX 2: We ONLY want this effect to fire when the queue length changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offlineQueue.length]);

    return { isSyncing: isSyncing.current, processQueue };
};