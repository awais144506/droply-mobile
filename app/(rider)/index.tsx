import React, { useState, useMemo, useEffect } from 'react';
import { View, Alert, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { RefreshCw } from 'lucide-react-native';
import { useTodayActiveOrders, useUpdateOrderStatus } from '@/features/main/api/use-rider-orders';
import { useRiderLocation } from '@/features/main/api/use-rider-location';
import { getDistanceInMeters, formatDistance } from '@/utils/locationUtils';
import { useRiderSocket } from '@/features/main/api/use-rider-socket';
import RiderMapView from '@/features/main/components/RiderMapView';
import RiderOrderListPanel from '@/features/main/components/RiderOrderListPanel';
import RiderOrderSettlementView from '@/features/main/components/RiderOrderSettlementView';
import { RiderActiveOrder } from '@/features/main/types/orders';

export default function MainScreen() {
  const { user } = useUser();
  const { data: orders = [], refetch, isFetching } = useTodayActiveOrders();
  const updateOrderStatus = useUpdateOrderStatus();


  // State Management
  const hasActiveOrder = orders.some(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED');
  const [isRiding, setIsRiding] = useState(hasActiveOrder);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.find(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED')?.id || null
  );
  const [settlementOrder, setSettlementOrder] = useState<RiderActiveOrder | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Location & Sockets
  const { broadcastCoordinates } = useRiderSocket(isRiding, user?.id);
  const { location: riderLocation } = useRiderLocation(isRiding);

  useEffect(() => {
    if (isRiding && riderLocation) {
      broadcastCoordinates(riderLocation.latitude, riderLocation.longitude);
    }
  }, [riderLocation?.latitude, riderLocation?.longitude, isRiding, riderLocation, broadcastCoordinates]);

  // Derived Data
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

  // Handlers
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
    if (isRiding) {
      Alert.alert("Ride in Progress", "Please complete or cancel your current delivery first.");
      return;
    }
    setSelectedOrderId(order.id);

    if (order.customer.latitude && order.customer.longitude) {
      fetchRoadRoute(order.customer.latitude, order.customer.longitude);
    }
  };

// 🔥 1. Add settlementData as the 3rd parameter here
  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'ON_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED',
    settlementData?: {
      deductedAdvance: number;
      collectedAmount: number;
      paymentMethod: 'CASH' | 'ONLINE';
    }
  ) => {
    updateOrderStatus.mutate(
      // 🔥 2. Pass it into the mutate payload here!
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
          }
        },
        onError: (err: any) => {
          Alert.alert("Error", err?.response?.data?.message || "Could not update status.");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>

        {/* Floating Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => refetch()}
            disabled={isFetching}
            style={styles.refreshButton}
          >
            {isFetching ? (
              <ActivityIndicator size="small" color="#ffff" />
            ) : (
              <RefreshCw size={20} color="#ffff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Map View */}
        <RiderMapView
          riderLocation={riderLocation}
          orders={orders}
          selectedOrderId={selectedOrderId}
          routeCoordinates={routeCoordinates}
          onSelectOrder={handleSelectOrder}
          onRecenter={() => { }}
        />

        {/* Empty State */}
        {orders.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardTitle}>No Active Orders</Text>
            <Text style={styles.emptyCardText}>You have no assigned deliveries.</Text>
          </View>
        )}

        {/* Active Route/List Panel */}
        {ordersWithDistance.length > 0 && !settlementOrder && (
          <RiderOrderListPanel
            orders={ordersWithDistance}
            selectedOrderId={selectedOrderId}
            hasActiveRide={hasActiveOrder}
            onSelectOrder={handleSelectOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onOpenDetails={(order) => setSettlementOrder(order)}
          />
        )}

        {/* Settlement Overlay */}
        {settlementOrder && (
          <RiderOrderSettlementView
            order={settlementOrder}
            onClose={() => setSettlementOrder(null)}
            onComplete={(id, data) => handleUpdateOrderStatus(id, 'COMPLETED', data)}
          />
        )}

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
  refreshContainer: {
    position: 'absolute',
    top: 16, // Adjusted to sit cleanly at the top right of the map
    left: 20,
    zIndex: 30,
  },
  refreshButton: {
    backgroundColor: '#1e293b',
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