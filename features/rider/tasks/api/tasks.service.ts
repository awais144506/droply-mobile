import { AxiosInstance } from "axios";
import { Task, UpdateTaskPayload } from "../types/task";

const API = '/tasks/user'
export const tasksService = {
    getAll: async (api: AxiosInstance, branchId: string): Promise<Task[]> => {
        const response = await api.get(`${API}`);
        return response.data;
    },

    update: async (api: AxiosInstance, { id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
        const response = await api.patch(`${API}/${id}`, payload);
        return response.data;
    },
};