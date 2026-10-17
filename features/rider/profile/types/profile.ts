
export interface RiderProfile {
    rider: Rider;
    zones: AssignedZones[];
    branch: BranchDetails;
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

export interface BranchDetails {
    name: string,
    phone: string,
    address: string,
    logoUrl: string,
}