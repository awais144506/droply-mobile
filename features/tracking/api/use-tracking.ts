// src/features/tracking/api/use-tracking.ts
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

type StartShiftPayload = {
  branchId: string;
  riderId: string;
  lat: number;
  lng: number;
};

export function useStartShift() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async (payload: StartShiftPayload) => {
      const { data } = await api.post("/tracking/start", payload);
      return data;
    },
    onSuccess: (data) => {
      // You can add query invalidations here later if needed
      console.log("Shift started successfully!", data);
    },
  });
}