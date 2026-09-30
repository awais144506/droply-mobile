import { Text, View } from 'react-native'
import { Lock, User, Mail, Phone } from 'lucide-react-native'
import { useRole } from '@/lib/use-role'



export const Information = () => {
    const { userName, userEmail, phone } = useRole();
    return (
        <View>
            <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-2xs">
                <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Personal Information
                    </Text>
                    <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Lock size={10} color="#64748b" />
                        <Text className="text-[10px] font-medium text-slate-500">Read Only</Text>
                    </View>
                </View>

                <View className="space-y-3">
                    <View className="flex-row items-center justify-between py-1.5">
                        <View className="flex-row items-center gap-4">
                            <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                                <User size={15} color="#64748b" />
                            </View>
                            <View>
                                <Text className="text-[10px] text-slate-400 font-medium">Full Name</Text>
                                <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                                    {userName || "Muhammad Awais"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1.5 border-t border-slate-100">
                        <View className="flex-row items-center gap-4">
                            <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                                <Mail size={15} color="#64748b" />
                            </View>
                            <View>
                                <Text className="text-[10px] text-slate-400 font-medium">Email Address</Text>
                                <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                                    {userEmail || "awais.rider@droply.pk"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between py-1.5 border-t border-slate-100">
                        <View className="flex-row items-center gap-4">
                            <View className="h-8 w-8 rounded-lg bg-slate-100 items-center justify-center">
                                <Phone size={15} color="#64748b" />
                            </View>
                            <View>
                                <Text className="text-[10px] text-slate-400 font-medium">Phone Number</Text>
                                <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                                    {String(phone || "+923214455667")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}


