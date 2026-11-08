import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Linking, ActivityIndicator } from 'react-native';
import { Navigation, Phone, MapPin, CheckCircle2, Play } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';
import { orderListStyle as styles } from '../style/settlemnt';

interface Props {
  orders: RiderActiveOrder[];
  selectedOrderId: string | null;
  hasActiveRide: boolean;
  onSelectOrder: (order: RiderActiveOrder) => void;
  onUpdateStatus: (orderId: string, status: 'ON_ROUTE' | 'ARRIVED') => Promise<void> | void;
  onOpenDetails: (order: RiderActiveOrder) => void;
  isPending:boolean
}

export default function RiderOrderListPanel({
  orders,
  selectedOrderId,
  hasActiveRide,
  onSelectOrder,
  onUpdateStatus,
  onOpenDetails,
  isPending
}: Props) {
  // Track which specific order ID is currently updating status
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleNavigate = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleStatusChange = async (orderId: string, status: 'ON_ROUTE' | 'ARRIVED') => {
    try {
      setUpdatingOrderId(orderId);
      await onUpdateStatus(orderId, status);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Check if there is already an active ride in progress anywhere in the list
  const activeRideExists = orders.some(
    (o) => o.status === 'ON_ROUTE' || o.status === 'ARRIVED'
  );

  const renderItem = ({ item }: { item: RiderActiveOrder }) => {
    const isSelected = item.id === selectedOrderId;
    const isAssigned = item.status === 'ASSIGNED' || item.status === 'PENDING';
    const isOnRoute = item.status === 'ON_ROUTE';
    const isArrived = item.status === 'ARRIVED';
    const isUpdating = isPending;

    // If another order is already active, lock/disable this item if it's not the active one
    const isThisOrderActive = isOnRoute || isArrived;
    const shouldDisableAction = (activeRideExists && !isThisOrderActive) || isUpdating;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSelectOrder(item)}
        style={[
          styles.orderCard,
          isSelected && styles.selectedCard,
          activeRideExists && !isThisOrderActive && styles.disabledCardOpacity,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.codeRow}>
            <Text style={styles.orderCode}>#{item.orderCode}</Text>
            <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.customerSection}>
          <Text style={styles.customerName}>{item.customer.name}</Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color="#64748b" />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.customer.address || 'No address provided'}
            </Text>
            {item.distanceFormatted && (
              <Text style={styles.distanceText}>{item.distanceFormatted}</Text>
            )}
          </View>
        </View>

        <View style={styles.financialRow}>
          <Text style={styles.amountLabel}>Total: <Text style={styles.amountValue}>Rs. {item.totalAmount}</Text></Text>
          <Text style={styles.paymentBadge}>{item.paymentMethod}</Text>
        </View>

        {/* Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleCall(item.customer.phone)}
            disabled={isUpdating}
          >
            <Phone size={18} color="#0284c7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, (!item.customer.latitude || !item.customer.longitude || isUpdating) && styles.disabledButton]}
            onPress={() => handleNavigate(item.customer.latitude, item.customer.longitude)}
            disabled={!item.customer.latitude || !item.customer.longitude || isUpdating}
          >
            <Navigation size={18} color="#10b981" />
          </TouchableOpacity>

          {isAssigned && (
            <TouchableOpacity
              style={[
                styles.primaryActionButton,
                shouldDisableAction && styles.disabledButton,
              ]}
              onPress={() => {
                if (!shouldDisableAction) {
                  handleStatusChange(item.id, 'ON_ROUTE');
                }
              }}
              disabled={shouldDisableAction}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Play size={14} color="#ffffff" fill="#ffffff" />
                  <Text style={styles.primaryActionText}>Start Route</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {isOnRoute && (
            <TouchableOpacity
              style={[styles.primaryActionButton, isUpdating && styles.disabledButton]}
              onPress={() => handleStatusChange(item.id, 'ARRIVED')}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.primaryActionText}>Mark Arrived</Text>
              )}
            </TouchableOpacity>
          )}

          {isArrived && (
            <TouchableOpacity
              style={styles.settleActionButton}
              onPress={() => onOpenDetails(item)}
              disabled={isUpdating}
            >
              <CheckCircle2 size={16} color="#ffffff" />
              <Text style={styles.settleActionText}>Settle Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'ASSIGNED':
    case 'PENDING': return { backgroundColor: '#e0f2fe' };
    case 'ON_ROUTE': return { backgroundColor: '#fef3c7' };
    case 'ARRIVED': return { backgroundColor: '#d1fae5' };
    default: return { backgroundColor: '#f1f5f9' };
  }
}