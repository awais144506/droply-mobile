import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { logKeys } from "./log-keys";
import { logsApi } from "./logs.service";

export function useRiderLogs(branchId: string, filterDate?: string) {
    const api = useApiClient();

    return useQuery({
        queryKey: logKeys.list(branchId),
        queryFn: async () => logsApi.getAllLogs(api, branchId, filterDate),
        enabled: !!branchId,
    });
}

