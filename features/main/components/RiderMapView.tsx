import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { Pin, LocateFixed, Bike } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

interface RiderMapViewProps {
    riderLocation: { latitude: number; longitude: number; heading?: number } | null;
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

    // Boolean to check if we are in active navigation mode
    const isNavigating = !!selectedOrderId;

    const calculateBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;
        const dLon = toRad(destLng - startLng);
        const y = Math.sin(dLon) * Math.cos(toRad(destLat));
        const x = Math.cos(toRad(startLat)) * Math.sin(toRad(destLat)) - Math.sin(toRad(startLat)) * Math.cos(toRad(destLat)) * Math.cos(dLon);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
    };

    useEffect(() => {
        if (cameraRef.current && riderLocation) {
            const camMethod = cameraRef.current.flyTo || cameraRef.current.setCamera;

            if (camMethod) {
                if (isNavigating) {
                    // 1. Figure out which way to look
                    let mapHeading = riderLocation.heading || 0;

                    // If we have a route, force the camera to look down the route!
                    if (routeCoordinates.length > 0) {
                        const [nextLng, nextLat] = routeCoordinates[0];
                        mapHeading = calculateBearing(riderLocation.latitude, riderLocation.longitude, nextLat, nextLng);
                    }
                    // Navigation Mode: Zoom tight, tilt 60deg, rotate to heading, push camera BEHIND rider
                    camMethod.call(cameraRef.current, {
                        centerCoordinate: [riderLocation.longitude, riderLocation.latitude],
                        zoomLevel: 17.5,
                        pitch: 60,
                        heading: mapHeading, // 🔥 Rotates the map so the blue line goes UP
                        padding: { paddingBottom: 350 },// 🔥 Pushes the rider to the bottom of the screen!
                        animationDuration: 1000
                    });
                } else {
                    // Normal Mode: Zoom out, flat view, pointing North
                    camMethod.call(cameraRef.current, {
                        centerCoordinate: [riderLocation.longitude, riderLocation.latitude],
                        zoomLevel: 13,
                        pitch: 0,
                        heading: 0,
                        padding: { paddingBottom: 0 }, // Reset padding
                        animationDuration: 1000
                    });
                }
            }
        }
    }, [isNavigating, riderLocation]);

    return (
        <View className="flex-1 relative">
            <Map style={StyleSheet.absoluteFill} mapStyle="https://tiles.openfreemap.org/styles/liberty">

                {/* Clean, strict TypeScript implementation */}
                <Camera
                    ref={cameraRef}
                    initialViewState={{
                        center: SAHIWAL_CENTER,
                        zoom: 13,
                        pitch: 0,
                        bearing: 0
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
                onPress={() => {
                    onRecenter();
                    if (cameraRef.current && riderLocation) {
                        const camMethod = cameraRef.current.flyTo || cameraRef.current.setCamera;
                        if (camMethod) {
                            camMethod.call(cameraRef.current, {
                                center: [riderLocation.longitude, riderLocation.latitude],
                                zoom: isNavigating ? 17 : 13,
                                pitch: isNavigating ? 60 : 0,
                                bearing: isNavigating ? (riderLocation.heading || 0) : 0,
                                duration: 500
                            });
                        }
                    }
                }}
                className="absolute bottom-25 bg-slate-800 p-3 rounded-full shadow-xl"
            >
                <LocateFixed size={22} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
}