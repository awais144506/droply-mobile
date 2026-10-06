import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { useRole } from '@/lib/use-role'; // Adjust path to where your branchId hook is

export function useAppQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
    const { isLoaded, isSignedIn } = useAuth();
    const { branchId } = useRole(); // Pulling branchId from Clerk metadata

    // 1. Define the baseline global requirement
    const isAuthReady = isLoaded && isSignedIn && !!branchId;

    // 2. Merge it with any specific 'enabled' logic passed from the individual component
    const isEnabled = options.enabled !== undefined
        ? (options.enabled && isAuthReady)
        : isAuthReady;

    return useQuery({
        ...options,
        enabled: isEnabled,
    });
}