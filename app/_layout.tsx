import "./global.css";
import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { tokenCache } from "@/utils/tokenCache";
import Toast from 'react-native-toast-message';


const queryClient = new QueryClient();
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <QueryClientProvider client={queryClient}>
          <ClerkLoaded>
            <StatusBar style="dark" />
            <Slot />
            <Toast />
          </ClerkLoaded>
        </QueryClientProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}