import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { Pin, LocateFixed, Bike } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

interface RiderMapViewProps {
    riderLocation: { latitude: number; longitude: number } | null;
    orders: RiderActiveOrder[];
    selectedOrderId: string | null;
    routeCoordinates: [number, number][];
    onSelectOrder: (order: RiderActiveOrder) => void;
    onRecenter: () => void;
}

const SAHIWAL_CENTER: [number, number] = [73.1114, 30.6682];

export default function RiderMapView({
    riderLocation,
    orders,
    selectedOrderId,
    routeCoordinates,
    onSelectOrder,
    onRecenter,
}: RiderMapViewProps) {
    const cameraRef = useRef<any>(null);

    // Auto-center when route changes
    useEffect(() => {
        if (routeCoordinates.length > 0 && cameraRef.current && riderLocation) {
            const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
            if (camMethod) {
                camMethod.call(cameraRef.current, {
                    center: [riderLocation.longitude, riderLocation.latitude],
                    zoom: 13,
                    duration: 1000
                });
            }
        }
    }, [routeCoordinates, riderLocation]);

    return (
        <View className="flex-1 relative">
            <Map style={StyleSheet.absoluteFill} mapStyle="https://tiles.openfreemap.org/styles/liberty">
                <Camera
                    ref={cameraRef}
                    initialViewState={{
                        center: SAHIWAL_CENTER,
                        zoom: 13
                    }}
                />
                {riderLocation && (
                    <Marker id="rider" lngLat={[riderLocation.longitude, riderLocation.latitude]}>
                        <View className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white items-center justify-center shadow-lg">
                            <Bike size={16} color="#ffffff" />
                        </View>
                    </Marker>
                )}
                {orders.map((order, index) => {
                    if (!order.customer.longitude || !order.customer.latitude) return null;
                    const isSelected = order.id === selectedOrderId;
                    return (
                        <Marker
                            key={order.id}
                            id={order.id}
                            lngLat={[order.customer.longitude, order.customer.latitude]}
                            onPress={() => onSelectOrder(order)}
                        >
                            <View className="items-center">
                                <View className={`px-2 py-0.5 rounded-md shadow-md mb-1 ${isSelected ? "bg-sky-600" : "bg-slate-800"}`}>
                                    <Text className="text-[10px] font-bold text-white">#{index + 1}</Text>
                                </View>
                                <Pin size={isSelected ? 30 : 22} color={isSelected ? "#0284c7" : "#1e293b"} />
                            </View>
                        </Marker>
                    );
                })}
                {routeCoordinates.length > 0 && (
                    <GeoJSONSource
                        id="routeSource"
                        data={{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: routeCoordinates } }}
                    >
                        <Layer id="routeLayer" type="line" style={{ lineColor: "#0284c7", lineWidth: 4, lineCap: "round" }} />
                    </GeoJSONSource>
                )}
            </Map>

            <TouchableOpacity
                onPress={onRecenter}
                className="absolute right-4 bottom-32 bg-white p-3 rounded-full shadow-xl border border-slate-100"
            >
                <LocateFixed size={22} color="#475569" />
            </TouchableOpacity>
        </View>
    );
}