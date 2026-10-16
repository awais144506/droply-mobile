export interface DropdownOption {
    id: string;
    label: string;
}

export interface BranchProduct {
    id: string;
    name: string;
    salePrice: number;
    currentStock: number;
    category: string;
    trackingType: string;
    productCode: string;
    isActive: boolean;
    unitOfMeasure: string;
}

export interface AssignedCustomer {
    id: string;
    customerCode: string;
    name: string;
    phone: string;
    address: string;
    status: string;
    category: string;
    customerCredit: number;
    returnablesLength: number;
}

export interface AssignedZone {
    id: string;
    name: string;
    branchId: string;
    ledgerAmount: number;
    itemsReturnable: number;
    customers: AssignedCustomer[];
}

export interface OrderDataResponse {
    zones: AssignedZone[];
    branchProducts: BranchProduct[];
}

export type FlatAssignedCustomer = AssignedCustomer & {
    zoneId: string;
    zoneName: string;
};

export interface TransformedOrderData {
    zones: AssignedZone[];
    zoneOptions: DropdownOption[];
    allCustomers: FlatAssignedCustomer[];
    customerOptions: (DropdownOption & {
        phone: string;
        zoneId: string;
        zoneName: string;
        customerCredit: number;
        returnablesLength: number;
    })[];
    branchProducts: BranchProduct[];
    productOptions: (DropdownOption & {
        price: number;
        stock: number;
        category: string;
        unit: string;
    })[];
}