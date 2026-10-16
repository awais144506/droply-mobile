export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export interface OrderProduct {
  name: string;
  trackingType: string;
}

export interface OrderLineItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: OrderProduct;
}

export interface CustomerReturnable {
  currentBalance: number;
  product: {
    name: string;
  };
}

export interface OrderCustomer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  customerCredit: number;
  customerAdvance: number;
  returnables: CustomerReturnable[];
}

export interface RiderActiveOrder {
  id: string;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  customer: OrderCustomer;
  lineItems: OrderLineItem[];
  distance?: number; 
}