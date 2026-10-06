export const orderKeys = {
  all: ['rider-orders'] as const,
  todayActive: () => [...orderKeys.all, 'today-active'] as const,
};