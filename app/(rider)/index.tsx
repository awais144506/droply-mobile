import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// 🔥 All MapLibre v11 named imports
import {
  Map,
  Camera,
  Marker,
  GeoJSONSource,
  Layer
} from "@maplibre/maplibre-react-native";

import * as Location from "expo-location";
import { MapPin, LocateFixed, Bike } from "lucide-react-native";
import { LatLng, DeliveryStop, getDistanceInMeters, formatDistance } from "@/utils/locationUtils";
import HeaderMetrics from "@/components/delivery/HeaderMetrics";
import { useStartShift } from "@/features/tracking/api/use-tracking";
import { useUser } from "@clerk/clerk-expo";

const SAHIWAL_CENTER: [number, number] = [73.1114, 30.6682]; // Fallback coordinates

const MOCK_SAHIWAL_STOPS: DeliveryStop[] = [
  { id: "stop-1", orderNumber: "ORD-101", customerName: "Tariq Mahmood", phone: "+923214455667", address: "House 14, Block Y, Farid Town, Sahiwal", bottlesToDeliver: 4, expectedEmpty: 4, cashToCollect: 800, latitude: 30.675, longitude: 73.118, status: "PENDING", category: "RECOVERY" },
  { id: "stop-2", orderNumber: "ORD-102", customerName: "Al-Madina Sweets", phone: "+923007788990", address: "Main Bazar, Tariq Bin Ziad Colony, Sahiwal", bottlesToDeliver: 10, expectedEmpty: 10, cashToCollect: 2000, latitude: 30.662, longitude: 73.102, status: "PENDING", category: "DELIVERY" },
];

export default function RiderMapScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const { user } = useUser();
  const { mutateAsync: startShift } = useStartShift();

  const [riderLocation, setRiderLocation] = useState<LatLng>({ latitude: SAHIWAL_CENTER[1], longitude: SAHIWAL_CENTER[0] });
  const [stops] = useState<DeliveryStop[]>(MOCK_SAHIWAL_STOPS);
  const [selectedStopId, setSelectedStopId] = useState<string>("stop-1");
  const [isRiding, setIsRiding] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const stopsWithDistance = useMemo(() => {
    return stops.map((stop) => {
      const distanceMeters = getDistanceInMeters(riderLocation.latitude, riderLocation.longitude, stop.latitude, stop.longitude);
      return { ...stop, distanceMeters, distanceFormatted: formatDistance(distanceMeters) };
    });
  }, [stops, riderLocation]);

  const selectedStop = stopsWithDistance.find((s) => s.id === selectedStopId) || stopsWithDistance[0];

  const routeGeoJSON = useMemo(() => {
    if (routeCoordinates.length === 0) return null;
    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: routeCoordinates,
      },
    };
  }, [routeCoordinates]);

  const fetchRoadRoute = async (origin: LatLng, destination: LatLng) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
        const coords: [number, number][] = data.routes[0].geometry.coordinates;
        setRouteCoordinates(coords);
        return coords;
      }
      const fallback: [number, number][] = [[origin.longitude, origin.latitude], [destination.longitude, destination.latitude]];
      setRouteCoordinates(fallback);
      return fallback;
    } catch {
      const fallback: [number, number][] = [[origin.longitude, origin.latitude], [destination.longitude, destination.latitude]];
      setRouteCoordinates(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location tracking to see your position on the map.");
        return;
      }

      // 🔥 Fetch the real location immediately on mount
      const initialLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const initialCoords = { latitude: initialLocation.coords.latitude, longitude: initialLocation.coords.longitude };
      setRiderLocation(initialCoords);

      // Jump to the rider's real location right away
      if (cameraRef.current) {
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
        if (camMethod) {
          camMethod.call(cameraRef.current, {
            center: [initialCoords.longitude, initialCoords.latitude],
            zoom: 14,
            duration: 1500
          });
        }
      }

      // Then subscribe to continuous updates
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          const newLoc = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setRiderLocation(newLoc);

          if (isRiding && cameraRef.current) {
            const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
            if (camMethod) {
              camMethod.call(cameraRef.current, {
                center: [newLoc.longitude, newLoc.latitude],
                zoom: 15,
                duration: 500
              });
            }
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

    if (cameraRef.current) {
      const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
      if (camMethod) {
        camMethod.call(cameraRef.current, {
          center: [stop.longitude, stop.latitude],
          zoom: 15,
          duration: 600
        });
      }
    }
  };

  const handleStartRide = async () => {
    const branchId = user?.publicMetadata?.branchId as string;
    const riderId = user?.id;

    if (!branchId || !riderId) {
      Alert.alert("Error", "Missing rider or branch information.");
      return;
    }

    try {
      await startShift({ branchId, riderId, lat: riderLocation.latitude, lng: riderLocation.longitude });
      setIsRiding(true);

      const destination = { latitude: selectedStop.latitude, longitude: selectedStop.longitude };
      const coords = await fetchRoadRoute(riderLocation, destination);

      if (coords && coords.length > 0 && cameraRef.current) {
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
        if (camMethod) {
          camMethod.call(cameraRef.current, {
            center: [riderLocation.longitude, riderLocation.latitude],
            zoom: 13,
            duration: 1000
          });
        }
      }
    } catch (error: any) {
      Alert.alert("Failed to start route", error?.message || "Could not connect to the server.");
    }
  };

  const handleRecenter = async () => {
    try {
      // Force a fresh, highly accurate location pull when the button is clicked
      const latestLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const currentCoords = { latitude: latestLoc.coords.latitude, longitude: latestLoc.coords.longitude };
      setRiderLocation(currentCoords);

      if (cameraRef.current) {
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
        if (camMethod) {
          camMethod.call(cameraRef.current, {
            center: [currentCoords.longitude, currentCoords.latitude],
            zoom: 15,
            duration: 800
          });
        }
      }
    } catch (error) {
      // Fallback if the fresh pull fails
      if (cameraRef.current) {
        const camMethod = cameraRef.current.flyTo || cameraRef.current.setStop;
        if (camMethod) {
          camMethod.call(cameraRef.current, {
            center: [riderLocation.longitude, riderLocation.latitude],
            zoom: 15,
            duration: 800
          });
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <HeaderMetrics />

      <View className="flex-1 relative z-0">
        <Map
          style={StyleSheet.absoluteFill}
          mapStyle="https://tiles.openfreemap.org/styles/tiles"
        >
          <Camera
            ref={cameraRef}
            defaultState={{
              center: SAHIWAL_CENTER,
              zoom: 13,
            }}
          />

          <Marker id="rider-marker" lngLat={[riderLocation.longitude, riderLocation.latitude]}>
            <View className="items-center">
              <View className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white items-center justify-center shadow-lg">
                <Bike size={16} color="#ffffff" />
              </View>
            </View>
          </Marker>

          {stopsWithDistance.map((stop, index) => {
            const isSelected = stop.id === selectedStopId;
            return (
              <Marker
                key={stop.id}
                id={stop.id}
                lngLat={[stop.longitude, stop.latitude]}
                onPress={() => handleSelectStop(stop)}
              >
                <View className="items-center">
                  <View className={`px-2 py-0.5 rounded-md shadow-md flex-row items-center gap-1 ${isSelected ? "bg-sky-600" : "bg-slate-800"}`}>
                    <Text className="text-[10px] font-bold text-white">#{index + 1} • {stop.distanceFormatted}</Text>
                  </View>
                  <MapPin size={isSelected ? 30 : 22} color={isSelected ? "#0284c7" : "#1e293b"} />
                </View>
              </Marker>
            );
          })}

          {routeGeoJSON && (
            <GeoJSONSource id="routeSource" data={routeGeoJSON}>
              <Layer
                id="routeLayer"
                type="line"
                style={{
                  lineColor: "#0284c7",
                  lineWidth: 4,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </GeoJSONSource>
          )}
        </Map>

        <TouchableOpacity
          onPress={handleRecenter}
          className="absolute right-4 bottom-10 bg-white p-3 rounded-full shadow-xl active:bg-slate-100 z-10 border border-slate-100"
        >
          <LocateFixed size={22} color="#475569" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}