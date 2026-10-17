import { useApiClient } from '@/lib/api-client';
import { useAppQuery } from '@/lib/use-app-query';
import { managerProfileApi } from './profile.service';

export const managerProfileKeys = {
  all: ['manager-profile'] as const,
};

export function useManagerProfile() {
  const api = useApiClient();

  return useAppQuery({
    queryKey: managerProfileKeys.all,
    queryFn: async () => managerProfileApi.getProfile(api),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}