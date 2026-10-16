import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "./tasks.service";
import { tasksKeys } from "./tasks-keys";
import { useApiClient } from "@/lib/api-client"; // Import your auth hook
import { UpdateTaskPayload } from "../types/task";
import Toast from "react-native-toast-message";

// Fetch all tasks
export const useTasks = (branchId: string) => {
    const api = useApiClient();

    return useQuery({
        queryKey: tasksKeys.lists(branchId),
        queryFn: () => tasksService.getAll(api, branchId),
        enabled: !!branchId,
    });
};

// Update a task
export const useUpdateTask = () => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { id: string; payload: UpdateTaskPayload }) =>
            tasksService.update(api, variables),

        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Task Updated',
                text2: 'You updated your tasks successfully.',
                position: 'top',
                visibilityTime: 3000,
            });
            queryClient.invalidateQueries({
                queryKey: tasksKeys.all
            });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
                position: 'top',
                visibilityTime: 3000,
            });
        }
    });
};




