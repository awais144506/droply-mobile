import { Stack } from "expo-router";

export default function ManagementLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerShadowVisible: false,
        headerTintColor: "#0f172a",
        headerTitleStyle: { fontWeight: "700", fontSize: 16 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Plant Executive Desk",
        }}
      />
      <Stack.Screen
        name="fleet"
        options={{
          title: "Live Fleet Tracking",
        }}
      />
      <Stack.Screen
        name="batches"
        options={{
          title: "Bottling Production Logs",
        }}
      />
    </Stack>
  );
}