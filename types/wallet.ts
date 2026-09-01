export type ExpenseCategory = "FUEL" | "MAINTENANCE" | "MEAL" | "OTHER";
export type LedgerEntryType = "SALE" | "RECOVERY" | "EXPENSE" | "DELIVERY_LOG";

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  title: string;
  subtitle: string;
  amount: number;
  timestamp: string; // Formatted time e.g. "10:15 AM"
  dateKey: string;   // YYYY-MM-DD for accurate date filtering
  category?: ExpenseCategory;
  bottlesDelivered?: number;
  emptyCollected?: number;
}