import React from "react";
import { ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Footer } from '@/features/rider/profile/components/Footer';
import { ProfileDetails } from "@/features/rider/profile/components/ProfileDetails";
import { BranchInfoCard } from "@/features/management/profile/components/BranchInfoCard";
import { BranchStatsCard } from "@/features/management/profile/components/BranchStatsCard";
import { useManagerProfile } from "@/features/management/profile/api/use-manager-profile";
import ProfileDetailsInformation from "@/features/management/profile/components/ProfileDetails";

type Props = {}

const Profile = (props: Props) => {
  const { data, isLoading, refetch, isRefetching } = useManagerProfile();

  if (isLoading && !data) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#0284c7"]} tintColor="#0284c7" />
        }
      >
        {/* Top: Clerk Avatar & Quick Badges */}
        <ProfileDetails />

        {/* Middle 1: Branch Info Card */}
        <BranchInfoCard branch={data?.branch} />

        {/* Middle 2: Detailed Information (Name, Email, Phone, CNIC, Joining Date) */}
        <ProfileDetailsInformation profile={data?.profile} />

        {/* Middle 3: Branch Statistics Grid */}
        <BranchStatsCard stats={data?.stats} />

        {/* Bottom: Footer */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  }
});