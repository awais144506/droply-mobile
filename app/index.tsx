import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/(auth)/sign-in");
      return;
    }

    const metadata = (user?.publicMetadata || (user as any)?.metadata || {}) as {
      role?: "OWNER" | "MANAGER" | "RIDER";
    };


    const role = metadata.role;

    if (role === "RIDER") {
      router.replace("/(rider)");
    } else if (role === "OWNER" || role === "MANAGER") {
      router.replace("/(management)");
    } else {
      router.replace("/unauthorized");
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <ActivityIndicator size="large" color="#0284c7" />
    </View>
  );
}