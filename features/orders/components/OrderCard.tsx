// src/features/orders/components/OrderListCard.tsx
import { TouchableOpacity, Text, View } from 'react-native';
import { CircleDashed, CheckCircle2, User, MapPin, Clock, Phone, Trash2 } from 'lucide-react-native';

interface OrderCardProps {
    order: any;
    onDelete: () => void;
}

export const OrderCard = ({ order, onDelete }: OrderCardProps) => {
    const isPending = order.status === 'PENDING';
    const customerName = order.customer?.name || 'Walk-in Customer';
    const customerPhone = order.customer?.phone;
    const customerAddress = order.customer?.address;

    const orderTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <TouchableOpacity activeOpacity={0.7} className="bg-white rounded-3xl border border-slate-300 p-4 shadow-lg relative">
            <View className="flex-row items-center justify-between gap-2 mb-3 border-b border-slate-50 pb-3 pr-10">
                <View>
                    <Text className="text-xs font-bold text-slate-800">Order No: {order.orderCode}</Text>
                </View>
                {isPending && (
                    <TouchableOpacity
                        onPress={onDelete}
                        className=" z-10 h-8 w-8 bg-rose-50 rounded-full items-center justify-center border border-rose-100"
                    >
                        <Trash2 size={14} color="#e11d48" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Customer & Status Info */}
            <View className="mb-4 px-1">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                        <User size={14} color="#64748b" />
                        <Text className="text-sm font-bold text-indigo-700" numberOfLines={1}>{customerName}</Text>
                    </View>

                    <View className={`flex-row items-center gap-1.5 px-2 py-0.5 rounded-lg ${isPending ? 'bg-amber-100 border-amber-200' : 'bg-emerald-100 border-emerald-200'}`}>
                        {isPending ? <CircleDashed size={10} color="#d97706" /> : <CheckCircle2 size={10} color="#059669" />}
                        <Text className={`text-[9px] font-bold uppercase tracking-wider ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {order.status}
                        </Text>
                    </View>
                </View>

                {/* Phone */}
                {customerPhone && (
                    <View className="flex-row items-center gap-2 mb-2">
                        <Phone size={14} color="#94a3b8" />
                        <Text className="text-xs font-medium text-slate-600">{customerPhone}</Text>
                    </View>
                )}

                {/* Address (Only for Delivery) */}
                {order.type === 'DELIVERY' && customerAddress && (
                    <View className="flex-row items-start gap-2">
                        <MapPin size={14} color="#94a3b8" className="mt-0.5" />
                        <Text className="text-xs text-slate-500 flex-1 leading-relaxed" numberOfLines={2}>
                            {customerAddress}
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer: Time & Total */}
            <View className="bg-slate-50 rounded-2xl p-3 flex-row items-center justify-between border border-slate-100">
                <View className="flex-row items-center gap-1.5">
                    <Clock size={14} color="#94a3b8" />
                    <View>
                        <Text className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Time</Text>
                        <Text className="text-xs font-semibold text-slate-700">{orderTime}</Text>
                    </View>
                </View>

                <View className="items-end">
                    <Text className="text-[9px] font-bold uppercase text-slate-400 mb-0.5 tracking-wider">Order Total</Text>
                    <Text className="text-sm font-extrabold text-sky-600">Rs {order.totalAmount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCard;