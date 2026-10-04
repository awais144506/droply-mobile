import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client"; // Adjust path if necessary
import { customerService } from "./customer.service";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { logKeys } from "@/features/wallet/api/log-keys";
import { CreateCustomerRequestPayload } from "../types/customer";

export const useRequestNewCustomer = (branchId: string) => {
    const api = useApiClient();
    const router = useRouter();
    const query = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCustomerRequestPayload) =>
            customerService.requestNewCustomer(api, payload),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Customer Details Sent',
                text2: 'Request has been sent to the Owner and Manager.',
                position: 'top',
                visibilityTime: 3000,
            });
            router.replace('/(rider)/orders');
            query.invalidateQueries({ queryKey: logKeys.list(branchId) })
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Phone no already existed.',
                position: 'top',
                visibilityTime: 3000,
            });
        },
    });
};