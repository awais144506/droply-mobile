
export interface RiderProfile {
    rider: Rider;
    zones: AssignedZones[];
    branch: BranchSettings;
}

export interface Rider {
    id: string;
    name: string;
    phone: string;
    email: string;
    cnic: string;
    joiningDate: string;
}

export interface AssignedZones {
    id: string;
    name: string;
    totalCustomers: number;
}

export interface BranchSettings {
    displayName: string,
    displayPhone: string,
    displayAddress: string,
    logoUrl: string,
}