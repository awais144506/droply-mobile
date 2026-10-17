export interface ManagerProfileResponse {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnic: string;
    role: 'OWNER' | 'MANAGER';
    joiningDate: string;
  };
  branch: {
    id: string;
    name: string;
    phone: string;
    address: string;
    logo?: string;
  };
  stats: {
    totalZones: number;
    totalCustomers: number;
    totalManagers: number;
    totalRiders: number;
  };
}