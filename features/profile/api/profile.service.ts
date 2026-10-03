import { AxiosInstance } from "axios";
import { RiderProfile } from "../types/profile";

export const apiProfile = {
    getRiderProfile: async (api: AxiosInstance): Promise<RiderProfile> => {
        const response = await api.get(`/rider/profile`);
        return response.data;
    }
}