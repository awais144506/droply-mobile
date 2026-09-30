import { AxiosInstance } from "axios";
import { Task, UpdateTaskPayload } from "../types/task";

export const tasksService = {
    getAll: async (api: AxiosInstance, branchId: string): Promise<Task[]> => {
        const response = await api.get(`/tasks/branch/${branchId}`);
        return response.data;
    },

    update: async (api: AxiosInstance, { id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
        const response = await api.patch(`/tasks/${id}`, payload);
        return response.data;
    },
};