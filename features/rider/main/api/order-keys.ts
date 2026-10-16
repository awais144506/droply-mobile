export const orderKeysMain = {
  all: ['rider-orders'] as const,
  todayActive: () => [...orderKeysMain.all, 'today-active'] as const,
};