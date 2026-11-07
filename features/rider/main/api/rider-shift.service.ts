import { AxiosInstance } from 'axios';

export interface RiderShiftPresence {
  riderId: string;
  status: 'ONLINE' | 'OFFLINE' | 'COMPLETED';
  isOnline: boolean;
  lastActive: string | null;
}

const API = '/rider/shift';

export const riderShiftApi = {
  getShiftStatus: async (api: AxiosInstance): Promise<RiderShiftPresence> => {
    const response = await api.get(API);
    return response.data;
  },

  startShift: async (api: AxiosInstance): Promise<RiderShiftPresence> => {
    const response = await api.post(`${API}/start`);
    return response.data;
  },

  endShift: async (api: AxiosInstance): Promise<RiderShiftPresence> => {
    const response = await api.post(`${API}/end`);
    return response.data;
  },
};