export type LogType = "CANCELLED" | "DELIVERED" | "PAYMENT_RECOVERY" | "ASSET_RECOVERY" | "ORDER_CREATED" | "PETROL" | "MAINTENANCE" | "OTHER";

export interface RiderLogs {
    id: string;
    customerName?: string;
    type: LogType;
    amount?: number;
    description: string;
    createdAt: string;
}
