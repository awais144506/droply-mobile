export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export interface OrderProduct {
  name: string;
  trackingType: string;
  unitOfMeasure?: string;
  securityDeposit?: number;
}

export interface OrderLineItem {
  id: string;
  paidQuantity: number; // Matches backend select
  unitPrice: number;
  product: OrderProduct;
}

export interface CustomerReturnable {
  productId: string;
  currentBalance: number;
  product: {
    name: string;
    securityDeposit: number;
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
  securityDeposit: number;
  returnables: CustomerReturnable[];
}

export interface AssetExchange {
  id: string;
  orderId: string;
  productId: string;
  outboundQuantity: number;
  inboundQuantity: number;
  depositCharged: number;
  product: {
    name: string;
    securityDeposit: number;
  };
}

export interface RiderActiveOrder {
  id: string;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  scheduledDate: string | null;
  deliveryCharges: number;
  discount: number;
  customer: OrderCustomer;
  lineItems: OrderLineItem[];
  assetExchanges?: AssetExchange[];
  distanceFormatted?: string;
  distanceRaw?: number;
}