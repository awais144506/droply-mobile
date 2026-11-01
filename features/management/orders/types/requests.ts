export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'ON_ROUTE'
  | 'ARRIVED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface HistoryOrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
}

export interface CustomerZone {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  customerCode: string;
  zone?: CustomerZone | null;
}

export interface CustomerOrderRequest {
  id: string;
  branchId: string;
  orderId: string;
  status: RequestStatus;
  scheduleDate: string;
  notes: string | null;
  total: number;
  createdAt: string;
  customer: Customer;
  items: HistoryOrderItem[];
}

export interface RequestedItems {
  id: string;
  name: string;
  unitOfMeasure: string;
  priceTiers: {
    salePrice: number;
  }[];
}

export interface CustomerDataResponse {
  products: RequestedItems[];
  history: CustomerOrderRequest[];
}