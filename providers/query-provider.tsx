import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { AxiosError } from "axios";

// 1. Wrap Expo's AsyncStorage in the TanStack adapter
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: 'offlineFirst',
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 60 * 24,
            retry: (failureCount, error) => {
              if (error instanceof AxiosError) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
          mutations: {
            networkMode: 'offlineFirst',
            retry: false,
          }
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}