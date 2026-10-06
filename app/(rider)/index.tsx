import React, { useState, useMemo, useEffect } from 'react';
import { View, Alert, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { RefreshCw } from 'lucide-react-native'; // 🔥 Import the refresh icon

import { useTodayActiveOrders, useUpdateOrderStatus } from '@/features/main/api/use-rider-orders';
import { useRiderLocation } from '@/features/main/api/use-rider-location';
import { useOrderMetrics } from '@/features/main/api/use-order-metrics';
import { getDistanceInMeters, formatDistance } from '@/utils/locationUtils';
import { useRiderSocket } from '@/features/main/api/use-rider-socket';
import RiderMetricsHeader from '@/features/main/components/RiderMetricsHeader';
import RiderMapView from '@/features/main/components/RiderMapView';
import RiderOrderListPanel from '@/features/main/components/RiderOrderListPanel';
import { RiderActiveOrder, OrderStatus } from '@/features/main/types/orders';
import RiderOrderSettlementView from '@/features/main/components/RiderOrderSettlementView';

export default function MainScreen() {
  const { user } = useUser();

  // 🔥 Extract refetch and isFetching from your query hook
  const { data: orders = [], refetch, isFetching } = useTodayActiveOrders();

  const metrics = useOrderMetrics(orders);
  const updateOrderStatus = useUpdateOrderStatus();

  const hasActiveOrder = orders.some(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED');
  const [isRiding, setIsRiding] = useState(hasActiveOrder);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.find(o => o.status === 'ON_ROUTE' || o.status === 'ARRIVED')?.id || null
  );

  const [settlementOrder, setSettlementOrder] = useState<RiderActiveOrder | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const { broadcastCoordinates } = useRiderSocket(isRiding, user?.id);
  const { location: riderLocation, setLocation } = useRiderLocation(isRiding);

  useEffect(() => {
    if (isRiding && riderLocation) {
      broadcastCoordinates(riderLocation.latitude, riderLocation.longitude);
    }
  }, [riderLocation?.latitude, riderLocation?.longitude, isRiding]);

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
    if (isRiding) {
      Alert.alert("Ride in Progress", "Please complete or cancel your current delivery first.");
      return;
    }
    setSelectedOrderId(order.id);

    if (order.customer.latitude && order.customer.longitude) {
      fetchRoadRoute(order.customer.latitude, order.customer.longitude);
    }
  };

  const handleRecenter = async () => { };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus.mutate(
      { orderId, status },
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
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-1 relative">

        <RiderMetricsHeader
          cash={metrics.totalCashToCollect}
          items={metrics.totalItemsToDeliver}
          empties={metrics.totalEmptiesToCollect}
        />

        {/* 🔥 Floating Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => refetch()}
            disabled={isFetching}
            style={styles.refreshButton}
          >
            {isFetching ? (
              <ActivityIndicator size="small" color="#0284c7" />
            ) : (
              <RefreshCw size={20} color="#0f172a" />
            )}
          </TouchableOpacity>
        </View>

        <RiderMapView
          riderLocation={riderLocation}
          orders={orders}
          selectedOrderId={selectedOrderId}
          routeCoordinates={routeCoordinates}
          onSelectOrder={handleSelectOrder}
          onRecenter={handleRecenter}
        />

        {orders.length === 0 && (
          <View className="absolute bottom-10 left-4 right-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 items-center z-10">
            <Text className="text-lg font-bold text-slate-800 mb-1">No Active Orders</Text>
            <Text className="text-slate-500 text-center">You have no assigned deliveries.</Text>
          </View>
        )}

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

        {settlementOrder && (
          <RiderOrderSettlementView
            order={settlementOrder}
            onClose={() => setSettlementOrder(null)}
            onComplete={(id) => handleUpdateOrderStatus(id, 'COMPLETED')}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

// 🔥 Native styles to ensure perfect rendering over the map
const styles = StyleSheet.create({
  refreshContainer: {
    position: 'absolute',
    top: 100, // Positions it right below your RiderMetricsHeader
    right: 16,
    zIndex: 30, // Keeps it above the map
  },
  refreshButton: {
    backgroundColor: '#ffffff',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5, // Android shadow
    borderWidth: 1,
    borderColor: '#f1f5f9',
  }
});