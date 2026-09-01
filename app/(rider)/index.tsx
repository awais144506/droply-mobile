import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { MapPin, LocateFixed, Bike } from "lucide-react-native";

import { LatLng, DeliveryStop, getDistanceInMeters, formatDistance } from "@/utils/locationUtils";
import HeaderMetrics from "@/components/delivery/HeaderMetrics";
import StopDrawer from "@/components/delivery/StopDrawer";

const SAHIWAL_INITIAL_REGION = {
  latitude: 30.6682,
  longitude: 73.1114,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const MOCK_SAHIWAL_STOPS: DeliveryStop[] = [
  { id: "stop-1", orderNumber: "ORD-101", customerName: "Tariq Mahmood", phone: "+923214455667", address: "House 14, Block Y, Farid Town, Sahiwal", bottlesToDeliver: 4, expectedEmpty: 4, cashToCollect: 800, latitude: 30.675, longitude: 73.118, status: "PENDING", category: "RECOVERY" },
  { id: "stop-2", orderNumber: "ORD-102", customerName: "Al-Madina Sweets", phone: "+923007788990", address: "Main Bazar, Tariq Bin Ziad Colony, Sahiwal", bottlesToDeliver: 10, expectedEmpty: 10, cashToCollect: 2000, latitude: 30.662, longitude: 73.102, status: "PENDING",category: "DELIVERY" },
];

export default function RiderMapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [riderLocation, setRiderLocation] = useState<LatLng>({ latitude: 30.666, longitude: 73.109 });
  const [stops] = useState<DeliveryStop[]>(MOCK_SAHIWAL_STOPS);
  const [selectedStopId, setSelectedStopId] = useState<string>("stop-1");
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [isRiding, setIsRiding] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);

  const stopsWithDistance = useMemo(() => {
    return stops.map((stop) => {
      const distanceMeters = getDistanceInMeters(riderLocation.latitude, riderLocation.longitude, stop.latitude, stop.longitude);
      return { ...stop, distanceMeters, distanceFormatted: formatDistance(distanceMeters) };
    });
  }, [stops, riderLocation]);

  const selectedStop = stopsWithDistance.find((s) => s.id === selectedStopId) || stopsWithDistance[0];

  const fetchRoadRoute = async (origin: LatLng, destination: LatLng) => {
    setIsRouteLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
        const coords: LatLng[] = data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon }));
        setRouteCoordinates(coords);
        return coords;
      } else {
        const fallback = [origin, destination];
        setRouteCoordinates(fallback);
        return fallback;
      }
    } catch {
      const fallback = [origin, destination];
      setRouteCoordinates(fallback);
      return fallback;
    } finally {
      setIsRouteLoading(false);
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          const newLoc = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setRiderLocation(newLoc);

          if (isRiding) {
            mapRef.current?.animateToRegion({ latitude: newLoc.latitude, longitude: newLoc.longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }, 500);
          }
        }
      );
    };

    startLocationTracking();
    return () => { locationSubscription?.remove(); };
  }, [isRiding]);

  const handleSelectStop = (stop: DeliveryStop) => {
    if (isRiding) {
      Alert.alert("Ride in Progress", "Please finish or cancel your current trip before selecting another stop.");
      return;
    }
    setSelectedStopId(stop.id);
    setRouteCoordinates([]);
    mapRef.current?.animateToRegion({ latitude: stop.latitude, longitude: stop.longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 600);
  };

  const handleStartRide = async () => {
    setIsRiding(true);
    setIsDrawerExpanded(false);
    const destination = { latitude: selectedStop.latitude, longitude: selectedStop.longitude };
    const coords = await fetchRoadRoute(riderLocation, destination);

    if (coords && coords.length > 0) {
      mapRef.current?.fitToCoordinates(coords, { edgePadding: { top: 90, right: 60, bottom: 230, left: 60 }, animated: true });
    }
  };

  const handleReachedDestination = () => {
    setIsRiding(false);
    setRouteCoordinates([]);
    router.push(`/(rider)/deliver/${selectedStop.id}`); // Make sure route is completely correct
  };

  const handleCancelRide = () => {
    setIsRiding(false);
    setRouteCoordinates([]);
  };

  const handleRecenter = () => {
    if (isRiding && routeCoordinates.length > 0) {
      mapRef.current?.fitToCoordinates(routeCoordinates, { edgePadding: { top: 90, right: 60, bottom: 230, left: 60 }, animated: true });
    } else {
      mapRef.current?.animateToRegion(SAHIWAL_INITIAL_REGION, 600);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <HeaderMetrics />

      <View className="flex-1 relative z-0">
        <MapView ref={mapRef} provider={PROVIDER_DEFAULT} initialRegion={SAHIWAL_INITIAL_REGION} style={StyleSheet.absoluteFillObject} showsCompass={false}>
          <Marker coordinate={riderLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View className="items-center">
              <View className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white items-center justify-center shadow-lg">
                <Bike size={16} color="#ffffff" />
              </View>
            </View>
          </Marker>

          {stopsWithDistance.map((stop, index) => {
            const isSelected = stop.id === selectedStopId;
            return (
              <Marker key={stop.id} coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} onPress={() => handleSelectStop(stop)}>
                <View className="items-center">
                  <View className={`px-2 py-0.5 rounded-md shadow-md flex-row items-center gap-1 ${isSelected ? "bg-sky-600" : "bg-slate-800"}`}>
                    <Text className="text-[10px] font-bold text-white">#{index + 1} • {stop.distanceFormatted}</Text>
                  </View>
                  <MapPin size={isSelected ? 30 : 22} color={isSelected ? "#0284c7" : "#334155"} />
                </View>
              </Marker>
            );
          })}

          {isRiding && routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="#0284c7" strokeWidth={5} lineCap="round" lineJoin="round" />
          )}
        </MapView>

        {/* Recenter Map Button */}
        <TouchableOpacity onPress={handleRecenter} activeOpacity={0.8} className="absolute top-3 right-3 h-10 w-10 bg-white rounded-full items-center justify-center shadow-md border border-slate-200/80 z-50">
          <LocateFixed size={18} color="#0284c7" />
        </TouchableOpacity>

        <StopDrawer
          isDrawerExpanded={isDrawerExpanded}
          setIsDrawerExpanded={setIsDrawerExpanded}
          isRiding={isRiding}
          stopsWithDistance={stopsWithDistance}
          selectedStopId={selectedStopId}
          selectedStop={selectedStop}
          handleSelectStop={handleSelectStop}
          handleStartRide={handleStartRide}
          handleCancelRide={handleCancelRide}
          handleReachedDestination={handleReachedDestination}
          isRouteLoading={isRouteLoading}
        />
      </View>
    </SafeAreaView>
  );
}