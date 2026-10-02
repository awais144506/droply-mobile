import { Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Loading = ({ text }: { text: string }) => {
    return (
        <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
            <ActivityIndicator size="large" color="#0284c7" />
            <Text className="mt-4 text-slate-500 font-medium">{text}...</Text>
        </SafeAreaView>
    );
}

export default Loading;