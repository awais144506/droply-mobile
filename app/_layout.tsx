import "./global.css";
import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { tokenCache } from "@/utils/tokenCache";
import Toast from 'react-native-toast-message';
import { QueryProvider } from "@/providers/query-provider";
import { useRole } from "@/lib/use-role";
import SuspendedScreen from "@/components/auth/SuspendedScreen";
import { customToastConfig } from "@/lib/toast-config";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function GlobalAuthMiddleware({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { userStatus } = useRole();
  if (isSignedIn && userStatus === 'SUSPENDED') {
    return <SuspendedScreen />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <QueryProvider>
          <ClerkLoaded>
            <StatusBar style="dark" />
            <GlobalAuthMiddleware>
              <Slot />
            </GlobalAuthMiddleware>
            <Toast config={customToastConfig} />
          </ClerkLoaded>
        </QueryProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}