export type LogType = "CANCELLED" | "DELETED"
    | "DELIVERED" | "PAYMENT_RECOVERY"
    | "ASSET_RECOVERY" | "ORDER_CREATED" | "CUSTOMER"
    | "PETROL" | "MAINTENANCE" | "OTHER";

export interface RiderLogs {
    id: string;
    customerName?: string;
    type: LogType;
    amount?: number;
    description: string;
    createdAt: string;
}
