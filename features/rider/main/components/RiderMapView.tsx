/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/refs */
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Animated, Easing } from 'react-native';
import { Map, Camera, Marker, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { Package, LocateFixed, Navigation2, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { RiderActiveOrder } from '../types/orders';
import { mapStyles as styles } from '../style/main-style';

interface RiderMapViewProps {
    riderLocation: { latitude: number; longitude: number; heading?: number } | null;
    orders: RiderActiveOrder[];
    selectedOrderId: string | null;
    routeCoordinates: [number, number][];
    onSelectOrder: (order: RiderActiveOrder) => void;
    onRecenter: () => void;
    branchLat?: number;
    branchLng?: number;
    branchLogoUrl?: string;
}

const DEFAULT_CENTER: [number, number] = [74.1114, 31.6682];

export default function RiderMapView({
    riderLocation,
    orders,
    selectedOrderId,
    routeCoordinates,
    onSelectOrder,
    onRecenter,
    branchLat,
    branchLng,
    branchLogoUrl,
}: RiderMapViewProps) {
    const cameraRef = useRef<any>(null);
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const [fallbackRoute, setFallbackRoute] = useState<[number, number][]>([]);
    // 🔥 Live device sensor heading (Compass + Gyroscope fusion)
    const [deviceHeading, setDeviceHeading] = useState<number>(0);

    const isNavigating = !!selectedOrderId;
    const hasBranchCoords = typeof branchLat === 'number' && typeof branchLng === 'number';
    const fallbackCenter: [number, number] = hasBranchCoords
        ? [branchLng as number, branchLat as number]
        : DEFAULT_CENTER;

    // 🔥 Strictly find if there is an order currently ON_ROUTE
    const onRouteOrder = orders.find((o) => o.status === 'ON_ROUTE');

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatchingHeading = async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') return;

                subscription = await Location.watchHeadingAsync((headingData) => {
                    const currentHeading =
                        headingData.trueHeading >= 0
                            ? headingData.trueHeading
                            : headingData.magHeading;

                    if (typeof currentHeading === 'number' && !isNaN(currentHeading)) {
                        setDeviceHeading(currentHeading);
                    }
                });
            } catch (err) {
                console.log('Failed to watch device heading:', err);
            }
        };

        startWatchingHeading();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    // 🔥 FETCH ROAD-SNAPPED ROUTE ONLY IF AN ORDER IS ON_ROUTE
    useEffect(() => {
        if (!onRouteOrder) {
            setFallbackRoute([]);
            return;
        }

        if (routeCoordinates && routeCoordinates.length > 0) {
            setFallbackRoute([]);
            return;
        }

        if (
            riderLocation &&
            onRouteOrder.customer.longitude &&
            onRouteOrder.customer.latitude
        ) {
            const fetchRoadRoute = async () => {
                try {
                    const startLng = riderLocation.longitude;
                    const startLat = riderLocation.latitude;
                    const endLng = onRouteOrder.customer.longitude;
                    const endLat = onRouteOrder.customer.latitude;

                    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
                    const res = await fetch(url);
                    const data = await res.json();

                    if (data.routes && data.routes.length > 0) {
                        // MapLibre uses [lng, lat] format natively
                        const coords = data.routes[0].geometry.coordinates as [number, number][];
                        setFallbackRoute(coords);
                    }
                } catch (err) {
                    console.log('Failed to fetch fallback road route:', err);
                }
            };

            fetchRoadRoute();
        }
    }, [routeCoordinates, riderLocation, onRouteOrder]);

    // 🔥 If no order is ON_ROUTE, force activeRouteCoords to empty array so all polylines disappear
    const activeRouteCoords = onRouteOrder
        ? routeCoordinates.length > 0
            ? routeCoordinates
            : fallbackRoute
        : [];

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim]);

    const calculateBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;
        const dLon = toRad(destLng - startLng);
        const y = Math.sin(dLon) * Math.cos(toRad(destLat));
        const x = Math.cos(toRad(startLat)) * Math.sin(toRad(destLat)) - Math.sin(toRad(startLat)) * Math.cos(toRad(destLat)) * Math.cos(dLon);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
    };

    // 🔥 STRAIGHT, FLAT MAP CAMERA CONTROLLER (No Tilt/Pitch)
    useEffect(() => {
        if (!cameraRef.current) return;
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setCamera;
        if (!camMethod) return;

        if (riderLocation) {
            let mapHeading = riderLocation.heading || 0;
            if (isNavigating && activeRouteCoords.length > 0) {
                const [nextLng, nextLat] = activeRouteCoords[0];
                mapHeading = calculateBearing(riderLocation.latitude, riderLocation.longitude, nextLat, nextLng);
            }
            camMethod.call(cameraRef.current, {
                centerCoordinate: [riderLocation.longitude, riderLocation.latitude],
                zoomLevel: isNavigating ? 17.5 : 14,
                pitch: 0, // Locked straight/flat
                heading: 0, // Keep north up or use mapHeading if preferred
                padding: { paddingBottom: isNavigating ? 350 : 0 },
                animationDuration: 1000,
            });
        } else if (hasBranchCoords) {
            camMethod.call(cameraRef.current, {
                centerCoordinate: [branchLng as number, branchLat as number],
                zoomLevel: 13,
                pitch: 0,
                heading: 0,
                padding: { paddingBottom: 0 },
                animationDuration: 1000,
            });
        }
    }, [isNavigating, riderLocation, hasBranchCoords, branchLat, branchLng, activeRouteCoords]);

    const handleRecenterPress = () => {
        onRecenter();
        if (!cameraRef.current) return;
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setCamera;
        if (!camMethod) return;

        const targetCenter: [number, number] = riderLocation
            ? [riderLocation.longitude, riderLocation.latitude]
            : fallbackCenter;

        camMethod.call(cameraRef.current, {
            center: targetCenter,
            zoom: isNavigating ? 17 : 14,
            pitch: 0, // Stay flat on recenter
            bearing: 0,
            duration: 500,
        });
    };

    const pulseScale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.4],
    });

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.65, 0],
    });

    // 🔥 Use live sensor rotation (`deviceHeading`), fallback to GPS heading if sensor is 0
    const riderHeading = deviceHeading || riderLocation?.heading || 0;

    return (
        <View style={styles.container}>
            <Map style={StyleSheet.absoluteFill} mapStyle="https://tiles.openfreemap.org/styles/liberty">
                <Camera
                    ref={cameraRef}
                    initialViewState={{
                        center: fallbackCenter,
                        zoom: 14,
                        pitch: 0,
                        bearing: 0,
                    }}
                />

                {hasBranchCoords && (
                    <Marker id="branch" lngLat={[branchLng as number, branchLat as number]}>
                        <View style={styles.branchMarkerWrapper}>
                            <Animated.View
                                style={[
                                    styles.branchPingRing,
                                    {
                                        transform: [{ scale: pulseScale }],
                                        opacity: pulseOpacity,
                                    },
                                ]}
                            />
                            <View style={styles.branchMarker}>
                                {branchLogoUrl ? (
                                    <Image
                                        source={{ uri: branchLogoUrl }}
                                        style={styles.branchLogoImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Navigation size={18} color="#ffffff" />
                                )}
                            </View>
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
                            <View style={styles.orderMarkerContainer}>
                                <View
                                    style={[
                                        styles.orderBadge,
                                        isSelected ? styles.orderBadgeSelected : styles.orderBadgeDefault,
                                    ]}
                                >
                                    <Text style={styles.orderBadgeText}>{index + 1}</Text>
                                </View>

                                {/* 🔥 Professional Package / Box Marker Icon */}
                                <View style={[styles.packageMarkerCircle, isSelected && styles.packageMarkerSelected]}>
                                    <Package size={isSelected ? 18 : 14} color="#ffffff" />
                                </View>
                            </View>
                        </Marker>
                    );
                })}

                {/* 🔥 GOOGLE MAPS STYLE DIRECTIONAL ARROW MARKER */}
                {riderLocation && (
                    <Marker id="rider" lngLat={[riderLocation.longitude, riderLocation.latitude]}>
                        <View style={styles.riderMarkerWrapper}>
                            <View
                                style={[
                                    styles.riderArrowContainer,
                                    { transform: [{ rotate: `${riderHeading}deg` }] },
                                ]}
                            >
                                <Navigation2 size={20} color="#ffffff" fill="#0284c7" />
                            </View>
                        </View>
                    </Marker>
                )}

                {activeRouteCoords.length > 0 && (
                    <GeoJSONSource
                        id="routeSource"
                        data={{
                            type: "Feature",
                            properties: {},
                            geometry: { type: "LineString", coordinates: activeRouteCoords },
                        }}
                    >
                        <Layer
                            id="routeLayer"
                            type="line"
                            style={{ lineColor: "#0284c7", lineWidth: 4, lineCap: "round" }}
                        />
                    </GeoJSONSource>
                )}
            </Map>

            <TouchableOpacity
                style={styles.recenterButton}
                activeOpacity={0.8}
                onPress={handleRecenterPress}
            >
                <LocateFixed size={22} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
}