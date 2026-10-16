import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { apiProfile } from "./profile.service";
import { profileKeys } from "./profile-keys";

export function useRiderProfile(id: string) {
    const api = useApiClient();
    return useQuery({
        queryKey: profileKeys.profile(id),
        queryFn: () => apiProfile.getRiderProfile(api),
        enabled: !!id,
    })
}