import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🔥 Use Native Storage
import { useState } from "react";

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
            networkMode: 'offlineFirst', // Perfect for field riders
            staleTime: 1000 * 60 * 2, 
            gcTime: 1000 * 60 * 60 * 24, // Keeps data for 24 hours offline
            retry: 2,
          },
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