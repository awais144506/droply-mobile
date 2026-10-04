import { View, Text } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';
import { CheckCircle2, XCircle } from 'lucide-react-native';

export const customToastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View className="w-[70%] bg-emerald-600 rounded-lg p-4 shadow-lg flex-row items-center gap-3">
      <CheckCircle2 size={24} color="#ffffff" />
      <View className="flex-1">
        <Text className="text-white font-extrabold text-sm">{text1}</Text>
        {text2 ? <Text className="text-white text-xs font-medium mt-0.5">{text2}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View className="w-[70%] bg-rose-600 rounded-2xl p-4 shadow-lg flex-row items-center gap-3">
      <XCircle size={24} color="#ffffff" />
      <View className="flex-1">
        <Text className="text-white font-extrabold text-sm">{text1}</Text>
        {text2 ? <Text className="text-white text-xs font-medium mt-0.5">{text2}</Text> : null}
      </View>
    </View>
  )
};