// src/features/orders/components/OrderListCard.tsx
import { TouchableOpacity, Text, View } from 'react-native';
import { CircleDashed, CheckCircle2, User, MapPin, Clock, Phone, Trash2 } from 'lucide-react-native';
import { orderCardStyles as styles } from '../style/order-style'; // Adjust path if needed

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
        <TouchableOpacity activeOpacity={0.7} style={styles.cardBase}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.orderNoText}>Order No: {order.orderCode}</Text>
                </View>
                
                {isPending && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={styles.deleteBtn}
                    >
                        <Trash2 size={14} color="#e11d48" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Customer & Status Info */}
            <View style={styles.infoContainer}>
                <View style={styles.customerRow}>
                    <View style={styles.customerNameRow}>
                        <User size={14} color="#64748b" />
                        <Text style={styles.customerNameText} numberOfLines={1}>{customerName}</Text>
                    </View>

                    <View style={[
                        styles.statusBadgeBase, 
                        isPending ? styles.statusBadgePending : styles.statusBadgeDone
                    ]}>
                        {isPending ? <CircleDashed size={10} color="#d97706" /> : <CheckCircle2 size={10} color="#059669" />}
                        <Text style={[
                            styles.statusTextBase,
                            isPending ? styles.statusTextPending : styles.statusTextDone
                        ]}>
                            {order.status}
                        </Text>
                    </View>
                </View>

                {/* Phone */}
                {customerPhone && (
                    <View style={styles.phoneRow}>
                        <Phone size={14} color="#94a3b8" />
                        <Text style={styles.phoneText}>{customerPhone}</Text>
                    </View>
                )}

                {/* Address (Only for Delivery) */}
                {order.type === 'DELIVERY' && customerAddress && (
                    <View style={styles.addressRow}>
                        <MapPin size={14} color="#94a3b8" style={styles.addressIcon} />
                        <Text style={styles.addressText} numberOfLines={2}>
                            {customerAddress}
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer: Time & Total */}
            <View style={styles.footerBox}>
                <View style={styles.timeRow}>
                    <Clock size={14} color="#94a3b8" />
                    <View>
                        <Text style={styles.footerLabel}>Time</Text>
                        <Text style={styles.timeValue}>{orderTime}</Text>
                    </View>
                </View>

                <View style={styles.totalBox}>
                    <Text style={styles.footerLabel}>Order Total</Text>
                    <Text style={styles.totalValue}>Rs {order.totalAmount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCard;