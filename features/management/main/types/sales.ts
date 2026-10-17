export interface DailyKpis {
  totalCashInflow: number;
  totalOrdersHandled: number;
  netStockOut: number;
  stockSentOut: number;
  stockReturned: number;
}

export type OrderCategoryType =
  | "WALK_IN"
  | "DELIVERY"
  | "RETURN"
  | "RECOVERY"
  | "QUICK_SALE";

export interface DailyCategoryItem {
  id: string;
  type: OrderCategoryType;
  title: string;
  subtitle: string;
  count: number;
  amount: number;
  isNegative: boolean;
  itemsCount?: number;
}

export interface InventoryAlertItem {
  id: string;
  name: string;
  category: string;
  remaining: number;
  threshold: number;
  status: "OUT_OF_STOCK" | "LOW_STOCK";
}

export interface DailySalesSummaryResponse {
  branchId: string;
  branchName: string;
  selectedDate: string; // YYYY-MM-DD
  dateRange: {
    start: string;
    end: string;
  };
  kpis: DailyKpis;
  categories: DailyCategoryItem[];
  alerts: {
    criticalCount: number;
    items: InventoryAlertItem[];
  };
}

export interface DailySalesQueryParams {
  date?: string; // YYYY-MM-DD
}