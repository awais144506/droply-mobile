import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Footer } from '@/features/rider/profile/components/Footer'
import { ProfileDetails } from "@/features/rider/profile/components/ProfileDetails";

type Props = {}

const Profile = (props: Props) => {
  return (
         <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                // refreshControl={
                //     <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#0284c7"]} />
                // }
            >
                <ProfileDetails />
                <Footer />
            </ScrollView>
        </SafeAreaView>
  )
}

export default Profile

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