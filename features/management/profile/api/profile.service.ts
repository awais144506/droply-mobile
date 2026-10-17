import { AxiosInstance } from 'axios';
import { ManagerProfileResponse } from '../types/profile';

export const managerProfileApi = {
  getProfile: async (api: AxiosInstance): Promise<ManagerProfileResponse> => {
    const response = await api.get('/manager/mobile');
    return response.data;
  },
};