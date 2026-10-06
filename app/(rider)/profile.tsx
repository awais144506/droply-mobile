import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRole } from "@/lib/use-role";
import { ProfileDetails } from "@/features/profile/components/ProfileDetails";
import { Information } from "@/features/profile/components/Information";
import { AssignedZones } from "@/features/profile/components/AssignedZones";
import { Footer } from "@/features/profile/components/Footer";
import BranchSettings from "@/features/profile/components/BranchSettings";
import { useRiderProfile } from "@/features/profile/api/use-profile";
import Loading from "../loading";

export default function RiderProfileScreen() {
    const { userId } = useRole();
    const { data, isLoading, refetch, isRefetching } = useRiderProfile(userId || "");
    const profile = data?.rider;
    const branch = data?.branch
    const assignedZones = data?.zones || [];

    if (isLoading) return <Loading text="Loading Profile..." />

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#0284c7"]} />
                }
            >
                <ProfileDetails />
                <BranchSettings branch={branch} />
                <Information profile={profile} />
                <AssignedZones isZonesLoading={isLoading} assignedZones={assignedZones} />
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // bg-slate-50
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20, // px-5
        paddingTop: 48, // pt-12
    },
    scrollContent: {
        paddingBottom: 40,
    }
});