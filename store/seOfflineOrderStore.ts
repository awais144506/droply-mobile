import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createMMKV} from 'react-native-mmkv';

// 1. Initialize MMKV
const storage = createMMKV({ id: 'droply-pos-storage' });

// 2. Create the Zustand adapter for MMKV
const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => storage.remove(name),
};

export interface LocalOrder {
  id: string;
  customerName: string;
  zoneName: string;
  totalAmount: number;
  itemsCount: number;
  time: string;
  timestamp: number;
  status: 'pending' | 'synced';
  rawPayload: any;
}

interface OfflineOrderState {
  offlineQueue: LocalOrder[];
  syncedOrders: LocalOrder[];
  addOrderToQueue: (order: LocalOrder) => void;
  removeOrderFromQueue: (orderId: string) => void;
  markOrderAsSynced: (orderId: string, updatedData?: Partial<LocalOrder>) => void;
  purgeOldSyncedOrders: () => void;
}

export const useOfflineOrderStore = create<OfflineOrderState>()(
  persist(
    (set) => ({
      offlineQueue: [],
      syncedOrders: [],

      addOrderToQueue: (order) => set((state) => ({
        offlineQueue: [order, ...state.offlineQueue],
      })),

      removeOrderFromQueue: (orderId) => set((state) => ({
        offlineQueue: state.offlineQueue.filter((o) => o.id !== orderId),
      })),

      markOrderAsSynced: (orderId, updatedData) => set((state) => {
        const orderToMove = state.offlineQueue.find((o) => o.id === orderId);
        if (!orderToMove) return state;

        const syncedOrder: LocalOrder = {
          ...orderToMove,
          ...updatedData,
          status: 'synced',
        };

        return {
          offlineQueue: state.offlineQueue.filter((o) => o.id !== orderId),
          syncedOrders: [syncedOrder, ...state.syncedOrders],
        };
      }),

      purgeOldSyncedOrders: () => set((state) => {
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        const now = Date.now();
        return {
          syncedOrders: state.syncedOrders.filter(
            (order) => (now - order.timestamp) < TWENTY_FOUR_HOURS
          ),
        };
      }),
    }),
    {
      name: 'droply-offline-orders',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.purgeOldSyncedOrders();
          }, 100);
        }
      },
    }
  )
);