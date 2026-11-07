/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/refs */
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, Power } from 'lucide-react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import { useTodayActiveOrders, useUpdateOrderStatus } from '@/features/rider/main/api/use-rider-orders';
import { useRiderLocation } from '@/features/rider/main/api/use-rider-location';
import { getDistanceInMeters, formatDistance } from '@/utils/locationUtils';
import { useRiderSocket } from '@/features/rider/main/api/use-rider-socket';
import RiderMapView from '@/features/rider/main/components/RiderMapView';
import RiderOrderListPanel from '@/features/rider/main/components/RiderOrderListPanel';
import RiderOrderSettlementView from '@/features/rider/main/components/RiderOrderSettlementView';
import { RiderActiveOrder } from '@/features/rider/main/types/orders';
import { useRole } from '@/lib/use-role';
import { useRiderProfile } from '../../features/rider/profile/api/use-profile';
import { useRiderShiftStatus, useEndShift, useStartShift } from '@/features/rider/main/api/use-riderShift';
import { CustomAlert } from '@/components/ui/CustomAlert';
import { useRiderBackgroundTracker } from '@/features/rider/main/api/use-rider-background-tracker';

export default function MainScreen() {
  const { userId, branchId, userTier } = useRole();
  const { data: orders = [], refetch, isFetching } = useTodayActiveOrders();
  const { data: branchData } = useRiderProfile(userId || "");
  const updateOrderStatus = useUpdateOrderStatus();

  // Shift Status Hooks
  const { data: shiftStatus, isLoading: isShiftLoading } = useRiderShiftStatus();
  const startShiftMutation = useStartShift();
  const endShiftMutation = useEndShift();

  const isOnline = shiftStatus?.isOnline ?? false;
  const lastActiveText = shiftStatus?.lastActive
    ? formatDistanceToNowStrict(new Date(shiftStatus.lastActive), { addSuffix: true })
    : 'Offline';

  // Modal State for Shift Toggle Confirmation
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // Ping Animation for Online Status Pill
  const pingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOnline) {
      const animation = Animated.loop(
        Animated.timing(pingAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    } else {
      pingAnim.setValue(0);
    }
  }, [isOnline, pingAnim]);

  const branchDetails = branchData?.branch?.branch;
  const branchLat = branchDetails?.latitude;
  const branchLng = branchDetails?.longitude;
  const branchLogoUrl = branchData?.branch?.logoUrl;

  const hasActiveOrder = orders.some(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED');
  const [isRiding, setIsRiding] = useState(hasActiveOrder);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.find(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED')?.id || null
  );
  const [settlementOrder, setSettlementOrder] = useState<RiderActiveOrder | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  // Socket connects as soon as rider is ONLINE
  const { broadcastCoordinates } = useRiderSocket(isOnline, userId, branchId, userTier);

  // GPS tracks continuously as long as rider is ONLINE
  const { location: riderLocation } = useRiderLocation(isOnline);

  useEffect(() => {
    if (isOnline && riderLocation && userId) {
      broadcastCoordinates(riderLocation.latitude, riderLocation.longitude);
    }
  }, [riderLocation?.latitude, riderLocation?.longitude, isOnline, userId, broadcastCoordinates]);

  useRiderBackgroundTracker(isOnline, userId);
  // Handle Shift Toggle Confirmation Action
  const handleConfirmShiftToggle = () => {
    setIsAlertVisible(false);
    if (isOnline) {
      if (orders.length > 0) {
        return;
      }
      endShiftMutation.mutate(undefined, {
        onSuccess: () => {
          setIsRiding(false);
          setSelectedOrderId(null);
          setRouteCoordinates([]);
        },
      });
    } else {
      startShiftMutation.mutate(undefined, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handlePowerPress = () => {
    if (isOnline && orders.length > 0) {
      return; // Blocked if active orders exist
    }
    setIsAlertVisible(true);
  };

  const ordersWithDistance = useMemo(() => {
    return orders.map((order) => {
      if (!riderLocation || !order.customer.latitude || !order.customer.longitude) {
        return { ...order, distanceFormatted: '-- km', distanceRaw: Infinity };
      }
      const distanceMeters = getDistanceInMeters(
        riderLocation.latitude,
        riderLocation.longitude,
        order.customer.latitude,
        order.customer.longitude
      );
      return {
        ...order,
        distanceFormatted: formatDistance(distanceMeters),
        distanceRaw: distanceMeters
      };
    }).sort((a, b) => a.distanceRaw - b.distanceRaw);
  }, [orders, riderLocation]);

  const fetchRoadRoute = async (destLat: number, destLng: number) => {
    if (!riderLocation) return;
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${riderLocation.longitude},${riderLocation.latitude};${destLng},${destLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
        setRouteCoordinates(data.routes[0].geometry.coordinates);
      } else {
        setRouteCoordinates([[riderLocation.longitude, riderLocation.latitude], [destLng, destLat]]);
      }
    } catch (error) {
      console.warn("OSRM Route Error:", error);
    }
  };

  const handleSelectOrder = (order: RiderActiveOrder) => {
    if (!isOnline) return;
    if (isRiding) return;
    setSelectedOrderId(order.id);

    if (order.customer.latitude && order.customer.longitude) {
      fetchRoadRoute(order.customer.latitude, order.customer.longitude);
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED',
    settlementData?: {
      deductedAdvance: number;
      collectedAmount: number;
      paymentMethod: 'CASH' | 'BANK';
    }
  ) => {
    updateOrderStatus.mutate(
      { orderId, status, settlementData },
      {
        onSuccess: () => {
          if (status === 'ON_ROUTE') {
            setIsRiding(true);
          } else if (status === 'CANCELLED' || status === 'COMPLETED') {
            setIsRiding(false);
            setSelectedOrderId(null);
            setRouteCoordinates([]);
            setSettlementOrder(null);
            refetch();
          }
        },
      }
    );
  };

  const isShiftToggleDisabled = isShiftLoading || startShiftMutation.isPending || endShiftMutation.isPending || (isOnline && orders.length > 0);

  const pingScale = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] });
  const pingOpacity = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>

        {/* Top Left Controls: Power Button + Status Pill & Refresh */}
        <View style={styles.topLeftControls}>
          <View style={styles.powerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePowerPress}
              disabled={isShiftToggleDisabled}
              style={[
                styles.controlButton,
                {
                  backgroundColor: isOnline ? '#10b981' : '#ef4444',
                  opacity: isShiftToggleDisabled ? 0.6 : 1
                }
              ]}
            >
              {isShiftLoading || startShiftMutation.isPending || endShiftMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Power size={20} color="#ffffff" />
              )}
            </TouchableOpacity>

            {/* Status & Last Active Pill Box */}
            <View style={styles.statusPill}>
              {isOnline ? (
                <View style={styles.onlineContainer}>
                  <View style={styles.pingWrapper}>
                    <Animated.View style={[styles.pingRing, { transform: [{ scale: pingScale }], opacity: pingOpacity }]} />
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.statusTextOnline}>Online</Text>
                </View>
              ) : (
                <Text style={styles.statusTextOffline} numberOfLines={1}>
                  Offline • {lastActiveText}
                </Text>
              )}
            </View>
          </View>

          {isOnline && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => refetch()}
              disabled={isFetching}
              style={[styles.controlButton, { backgroundColor: '#000000' }]}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <RefreshCw size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          )}
        </View>

        <RiderMapView
          riderLocation={riderLocation}
          orders={orders}
          selectedOrderId={selectedOrderId}
          routeCoordinates={routeCoordinates}
          onSelectOrder={handleSelectOrder}
          branchLat={branchLat}
          branchLng={branchLng}
          branchLogoUrl={branchLogoUrl}
          onRecenter={() => { }}
        />

        {!isOnline && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardTitle}>You are Offline</Text>
            <Text style={styles.emptyCardText}>Tap the power button (red icon) to go online and receive orders.</Text>
          </View>
        )}

        {isOnline && orders.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardTitle}>No Active Orders</Text>
            <Text style={styles.emptyCardText}>You have no assigned deliveries right now.</Text>
          </View>
        )}

        {isOnline && ordersWithDistance.length > 0 && !settlementOrder && (
          <RiderOrderListPanel
            orders={ordersWithDistance}
            selectedOrderId={selectedOrderId}
            hasActiveRide={hasActiveOrder}
            onSelectOrder={handleSelectOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onOpenDetails={(order) => setSettlementOrder(order)}
          />
        )}

        {settlementOrder && (
          <RiderOrderSettlementView
            order={settlementOrder}
            onClose={() => setSettlementOrder(null)}
            onComplete={(id, data) => handleUpdateOrderStatus(id, 'COMPLETED', data)}
          />
        )}

        {/* Custom Confirmation Modal to Prevent Accidental Toggles */}
        <CustomAlert
          visible={isAlertVisible}
          title={isOnline ? "Go Offline?" : "Go Online?"}
          message={
            isOnline
              ? (orders.length > 0
                ? "You cannot go offline while you have active orders."
                : "Are you sure you want to go offline and stop broadcasting location?")
              : "Are you sure you want to go online and start your shift?"
          }
          confirmText={isOnline ? "Yes, Go Offline" : "Yes, Go Online"}
          cancelText="Cancel"
          isDestructive={isOnline}
          onConfirm={handleConfirmShiftToggle}
          onCancel={() => setIsAlertVisible(false)}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  topLeftControls: {
    position: 'absolute',
    top: 16,
    left: 20,
    flexDirection: 'column',
    gap: 12,
    zIndex: 30,
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statusPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 160,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pingWrapper: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusTextOnline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  statusTextOffline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyCard: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    zIndex: 10,
  },
  emptyCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  emptyCardText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});