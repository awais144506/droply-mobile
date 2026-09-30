import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client"; // Adjust path if necessary
import { ordersService, CreateCustomerRequestPayload } from "./orders.service";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export const useRequestNewCustomer = () => {
    const api = useApiClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: CreateCustomerRequestPayload) =>
            ordersService.requestNewCustomer(api, payload),
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'Customer Details Sent',
                text2: 'Request has been sent to the Owner and Manager.',
                position: 'top',
                visibilityTime: 3000,
            });
            router.replace('/(rider)/orders');
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