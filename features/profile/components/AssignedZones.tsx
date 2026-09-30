import { View, Text, ActivityIndicator } from 'react-native'
import { Lock, MapPin } from 'lucide-react-native'

type Props = {
    isZonesLoading: boolean;
    assignedZones: {
        id: string;
        name: string;
        totalCustomers: number;
    }[];
}

export const AssignedZones = ({ isZonesLoading, assignedZones }: Props) => {
    return (
        <View>
            <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-2xs">
                <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Assigned Zones
                    </Text>
                    <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Lock size={10} color="#64748b" />
                        <Text className="text-[10px] font-medium text-slate-500">Managed by Plant</Text>
                    </View>
                </View>

                <View className="space-y-4">
                    {isZonesLoading ? (
                        <ActivityIndicator size="small" color="#4f46e5" className="py-4" />
                    ) : assignedZones.length > 0 ? (
                        assignedZones.map((zone, index) => (
                            <View
                                key={zone.id}
                                className={index > 0 ? "pt-4 border-t border-slate-100" : ""}
                            >
                                <View className="flex-row items-center justify-between py-1.5">
                                    <View className="flex-row items-center gap-3">
                                        <View className="h-8 w-8 rounded-lg bg-indigo-50 items-center justify-center">
                                            <MapPin size={15} color="#4f46e5" />
                                        </View>
                                        <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                                            {zone.name}
                                        </Text>
                                    </View>
                                    <Text className="text-xs font-semibold text-slate-800 mt-0.5">
                                        Total Customers: <Text className="text-amber-600 text-sm">{zone.totalCustomers}</Text>
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-sm text-slate-500 text-center py-4 font-medium">
                            No route sectors currently assigned.
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}