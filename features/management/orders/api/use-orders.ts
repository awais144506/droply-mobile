import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { orderApi } from './order.service';

export const orderRequestKeys = {
  all: ['order-requests'] as const,
  byBranch: (branchId?: string) => [...orderRequestKeys.all, branchId] as const,
};

export function useOrderRequests(branchId?: string) {
  const api = useApiClient();

  return useAppQuery({
    queryKey: orderRequestKeys.byBranch(branchId),
    queryFn: async () => orderApi.getAllOrderRequests(api, branchId),
    staleTime: 1000 * 60 * 1,
  });
}