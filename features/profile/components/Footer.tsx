import { Text, View, Image } from 'react-native';

export const Footer = () => {
    return (
        <View className="items-center justify-center py-4 mt-2 mb-8 opacity-80">
            <Image
                source={require('../../../assets/images/logo.png')}
                className="w-12 h-12 mb-3 opacity-60"
                resizeMode="contain"
            />

            <Text className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase">
                 Rider App
            </Text>

            <Text className="text-[10px] font-bold text-slate-400 mt-1">
                Version 1.0.0
            </Text>

            <Text className="text-[10px] font-medium text-slate-400 mt-2.5">
                © 2026 Droply Technologies
            </Text>
        </View>
    )
}