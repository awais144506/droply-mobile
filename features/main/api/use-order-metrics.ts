import { useMemo } from 'react';
import { RiderActiveOrder } from '../types/orders';

export function useOrderMetrics(orders: RiderActiveOrder[] = []) {
  return useMemo(() => {
    let totalCashToCollect = 0;
    let totalItemsToDeliver = 0;
    let totalEmptiesToCollect = 0;

    orders.forEach((order) => {
      // 1. Calculate Cash (Order Total + Past Dues - Advances)
      const due = order.totalAmount + (order.customer.customerCredit || 0) - (order.customer.customerAdvance || 0);
      totalCashToCollect += Math.max(due, 0); // Prevent negative cash

      // 2. Calculate Items to Deliver (Sum of quantities)
      order.lineItems.forEach((item) => {
        totalItemsToDeliver += item.quantity;
      });

      // 3. Calculate Empties to Collect (Sum of customer's possessed bottles)
      order.customer.returnables.forEach((ret) => {
        totalEmptiesToCollect += ret.currentBalance;
      });
    });

    return {
      totalCashToCollect,
      totalItemsToDeliver,
      totalEmptiesToCollect,
      activeOrdersCount: orders.length,
    };
  }, [orders]);
}