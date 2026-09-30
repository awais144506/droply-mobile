import {
  ScrollView, RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRole } from "@/lib/use-role";
import { useRiderOrderData } from "@/features/orders/api/use-order";
import { ProfileDetails } from "@/features/profile/components/ProfileDetails";
import { Information } from "@/features/profile/components/Information";
import { AssignedZones } from "@/features/profile/components/AssignedZones";
import { Footer } from "@/features/profile/components/Footer";

export default function RiderProfileScreen() {
  const { branchId } = useRole();
  const { data: orderData, isLoading: isZonesLoading, refetch, isRefetching } = useRiderOrderData(branchId);
  const assignedZones = orderData?.assignedZones || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#0284c7"]} />
        }
      >
        <ProfileDetails />
        <Information />
        <AssignedZones isZonesLoading={isZonesLoading} assignedZones={assignedZones} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}