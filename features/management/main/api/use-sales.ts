import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { keepPreviousData } from '@tanstack/react-query';
import { salesApi } from './sales.service';
import { DailySalesQueryParams } from '../types/sales';

export const salesKeys = {
  all: ['daily-sales'] as const,
  summary: (branchId: string, params?: DailySalesQueryParams) =>
    [...salesKeys.all, branchId, params ?? {}] as const,
};

export function useDailySalesSummary(
  branchId?: string | null,
  params?: DailySalesQueryParams
) {
  const api = useApiClient();

  return useAppQuery({
    queryKey: salesKeys.summary(branchId || '', params),
    queryFn: async () => salesApi.getDailySalesSummary(api, branchId!, params),
    enabled: Boolean(branchId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
}