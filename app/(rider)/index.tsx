import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Battery from "expo-battery";
import * as Location from "expo-location";
import {
  Droplet,
  RotateCcw,
  Wallet,
  Calendar,
  Clock,
  Navigation,
  MapPin,
  ChevronUp,
  ChevronDown,
  LocateFixed,
  Battery as BatteryIcon,
  Bike,
  X,
  PackageCheck,
  Route,
} from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- HAVERSINE DISTANCE HELPER ---
function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface DeliveryStop {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  bottlesToDeliver: number;
  expectedEmpty: number;
  cashToCollect: number;
  latitude: number;
  longitude: number;
  status: "PENDING" | "DELIVERED";
}

// Sahiwal Central Delivery Coordinates
const SAHIWAL_INITIAL_REGION = {
  latitude: 30.6682,
  longitude: 73.1114,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const MOCK_SAHIWAL_STOPS: DeliveryStop[] = [
  {
    id: "stop-1",
    orderNumber: "ORD-101",
    customerName: "Tariq Mahmood",
    phone: "+923214455667",
    address: "House 14, Block Y, Farid Town, Sahiwal",
    bottlesToDeliver: 4,
    expectedEmpty: 4,
    cashToCollect: 800,
    latitude: 30.675,
    longitude: 73.118,
    status: "PENDING",
  },
  {
    id: "stop-2",
    orderNumber: "ORD-102",
    customerName: "Al-Madina Sweets",
    phone: "+923007788990",
    address: "Main Bazar, Tariq Bin Ziad Colony, Sahiwal",
    bottlesToDeliver: 10,
    expectedEmpty: 10,
    cashToCollect: 2000,
    latitude: 30.662,
    longitude: 73.102,
    status: "PENDING",
  },
  {
    id: "stop-3",
    orderNumber: "ORD-103",
    customerName: "Dr. Shahida Parveen",
    phone: "+923331122334",
    address: "Near Girls College, Fateh Sher Colony, Sahiwal",
    bottlesToDeliver: 2,
    expectedEmpty: 2,
    cashToCollect: 0,
    latitude: 30.671,
    longitude: 73.099,
    status: "PENDING",
  },
  {
    id: "stop-4",
    orderNumber: "ORD-104",
    customerName: "Muhammad Bilal",
    phone: "+923049988776",
    address: "Shop 4, High Street Market, Sahiwal",
    bottlesToDeliver: 6,
    expectedEmpty: 6,
    cashToCollect: 1200,
    latitude: 30.664,
    longitude: 73.115,
    status: "PENDING",
  },
];

export default function RiderMapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Time & Battery States
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dayName, setDayName] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Live Location State (College Chowk area, Sahiwal)
  const [riderLocation, setRiderLocation] = useState<LatLng>({
    latitude: 30.666,
    longitude: 73.109,
  });

  const [stops] = useState<DeliveryStop[]>(MOCK_SAHIWAL_STOPS);
  const [selectedStopId, setSelectedStopId] = useState<string>("stop-1");
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [isRiding, setIsRiding] = useState<boolean>(false);

  // Road Routing Coordinates State
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [isRouteLoading, setIsRouteLoading] = useState<boolean>(false);

  // Calculate straight-line distance for stop list display
  const stopsWithDistance = useMemo(() => {
    return stops.map((stop) => {
      const distanceMeters = getDistanceInMeters(
        riderLocation.latitude,
        riderLocation.longitude,
        stop.latitude,
        stop.longitude
      );
      return {
        ...stop,
        distanceMeters,
        distanceFormatted: formatDistance(distanceMeters),
      };
    });
  }, [stops, riderLocation]);

  const selectedStop =
    stopsWithDistance.find((s) => s.id === selectedStopId) || stopsWithDistance[0];

  // Fetch Street-Level Road Coordinates from OSRM
  const fetchRoadRoute = async (origin: LatLng, destination: LatLng) => {
    setIsRouteLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
        const coords: LatLng[] = data.routes[0].geometry.coordinates.map(
          ([lon, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lon,
          })
        );
        setRouteCoordinates(coords);
        return coords;
      } else {
        // Fallback to straight connection if service is unreachable
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

  // 1. Time & Battery Listeners
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDayName(now.toLocaleDateString("en-US", { weekday: "long" }));
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 1000);

    const initBattery = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        if (level !== -1) setBatteryLevel(Math.round(level * 100));

        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          setBatteryLevel(Math.round(batteryLevel * 100));
        });
        return () => subscription.remove();
      } catch {
        setBatteryLevel(92);
      }
    };

    initBattery();

    return () => clearInterval(timeInterval);
  }, []);

  // 2. Real-Time GPS Tracking
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => {
          const newLoc = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setRiderLocation(newLoc);

          if (isRiding) {
            mapRef.current?.animateToRegion(
              {
                latitude: newLoc.latitude,
                longitude: newLoc.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              },
              500
            );
          }
        }
      );
    };

    startLocationTracking();

    return () => {
      locationSubscription?.remove();
    };
  }, [isRiding]);

  const handleSelectStop = (stop: DeliveryStop) => {
    if (isRiding) {
      Alert.alert(
        "Ride in Progress",
        "Please finish or cancel your current trip before selecting another stop."
      );
      return;
    }

    setSelectedStopId(stop.id);
    setRouteCoordinates([]);
    mapRef.current?.animateToRegion(
      {
        latitude: stop.latitude,
        longitude: stop.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      600
    );
  };

  const handleStartRide = async () => {
    setIsRiding(true);
    setIsDrawerExpanded(false);

    const destination = {
      latitude: selectedStop.latitude,
      longitude: selectedStop.longitude,
    };

    const coords = await fetchRoadRoute(riderLocation, destination);

    if (coords && coords.length > 0) {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 90, right: 60, bottom: 230, left: 60 },
        animated: true,
      });
    }
  };

  const handleReachedDestination = () => {
    setIsRiding(false);
    setRouteCoordinates([]);
    router.push(`/(rider)/deliver/${selectedStop.id}`);
  };

  const handleCancelRide = () => {
    setIsRiding(false);
    setRouteCoordinates([]);
  };

  const handleRecenter = () => {
    if (isRiding && routeCoordinates.length > 0) {
      mapRef.current?.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 90, right: 60, bottom: 230, left: 60 },
        animated: true,
      });
    } else {
      mapRef.current?.animateToRegion(SAHIWAL_INITIAL_REGION, 600);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Top Header */}
      <View className="px-4 pt-2 pb-3 bg-white border-b border-slate-200/80 z-10">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-1.5">
              <Calendar size={13} color="#0284c7" />
              <Text className="text-xs font-bold text-slate-900">
                {dayName},{" "}
                <Text className="text-slate-500 font-normal">{currentDate}</Text>
              </Text>
            </View>
          </View>

          {/* Time & Battery Group */}
          <View className="flex-row items-center gap-1.5">
            <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
              <Clock size={11} color="#64748b" />
              <Text className="text-[11px] font-mono font-bold text-slate-700">
                {currentTime || "--:--"}
              </Text>
            </View>

            {batteryLevel !== null && (
              <View className="flex-row items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                <BatteryIcon size={12} color="#16a34a" />
                <Text className="text-[11px] font-mono font-bold text-slate-700">
                  {batteryLevel}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Shift Metrics Bar */}
        <View className="flex-row gap-2 mt-3">
          <View className="flex-1 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 flex-row items-center gap-2">
            <View className="h-7 w-7 rounded-lg bg-sky-500 items-center justify-center">
              <Droplet size={14} color="#ffffff" />
            </View>
            <View>
              <Text className="text-[10px] text-sky-700 font-medium">Loaded</Text>
              <Text className="text-sm font-bold text-sky-950">120</Text>
            </View>
          </View>

          <View className="flex-1 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex-row items-center gap-2">
            <View className="h-7 w-7 rounded-lg bg-emerald-500 items-center justify-center">
              <RotateCcw size={14} color="#ffffff" />
            </View>
            <View>
              <Text className="text-[10px] text-emerald-700 font-medium">Empty</Text>
              <Text className="text-sm font-bold text-emerald-950">84</Text>
            </View>
          </View>

          <View className="flex-1 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 flex-row items-center gap-2">
            <View className="h-7 w-7 rounded-lg bg-amber-500 items-center justify-center">
              <Wallet size={14} color="#ffffff" />
            </View>
            <View>
              <Text className="text-[10px] text-amber-700 font-medium">Cash</Text>
              <Text className="text-sm font-bold text-amber-950">Rs 14k</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Map Canvas */}
      <View className="flex-1 relative">
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          initialRegion={SAHIWAL_INITIAL_REGION}
          style={StyleSheet.absoluteFillObject}
          showsCompass={false}
        >
          {/* Real-Time Rider GPS Marker */}
          <Marker coordinate={riderLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View className="items-center">
              <View className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white items-center justify-center shadow-lg">
                <Bike size={16} color="#ffffff" />
              </View>
            </View>
          </Marker>

          {/* Customer Destination Markers with Distance Labels */}
          {stopsWithDistance.map((stop, index) => {
            const isSelected = stop.id === selectedStopId;
            return (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                onPress={() => handleSelectStop(stop)}
              >
                <View className="items-center">
                  <View
                    className={`px-2 py-0.5 rounded-md shadow-md flex-row items-center gap-1 ${
                      isSelected ? "bg-sky-600" : "bg-slate-800"
                    }`}
                  >
                    <Text className="text-[10px] font-bold text-white">
                      #{index + 1} • {stop.distanceFormatted}
                    </Text>
                  </View>
                  <MapPin
                    size={isSelected ? 30 : 22}
                    color={isSelected ? "#0284c7" : "#334155"}
                  />
                </View>
              </Marker>
            );
          })}

          {/* Street Road Polyline Route */}
          {isRiding && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#0284c7"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {/* GPS Re-Center Button */}
        <TouchableOpacity
          onPress={handleRecenter}
          activeOpacity={0.8}
          className="absolute top-3 right-3 h-10 w-10 bg-white rounded-full items-center justify-center shadow-md border border-slate-200/80"
        >
          <LocateFixed size={18} color="#0284c7" />
        </TouchableOpacity>

        {/* Bottom Drawer */}
        <View
          className="absolute left-3 right-3 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
          style={{
            bottom: 12,
            maxHeight: isDrawerExpanded ? SCREEN_HEIGHT * 0.54 : "auto",
          }}
        >
          {/* Drawer Drag Bar */}
          {!isRiding && (
            <TouchableOpacity
              onPress={() => setIsDrawerExpanded((prev) => !prev)}
              activeOpacity={0.7}
              className="items-center py-2 bg-slate-50 border-b border-slate-100"
            >
              <View className="w-10 h-1 bg-slate-300 rounded-full mb-1" />
              <View className="flex-row items-center gap-1">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {isDrawerExpanded
                    ? "Collapse Stops"
                    : `Select Next Stop (${stopsWithDistance.length} on Route)`}
                </Text>
                {isDrawerExpanded ? (
                  <ChevronDown size={13} color="#64748b" />
                ) : (
                  <ChevronUp size={13} color="#64748b" />
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Expanded List */}
          {isDrawerExpanded && !isRiding ? (
            <ScrollView className="max-h-80 p-3" showsVerticalScrollIndicator={false}>
              {stopsWithDistance.map((stop, index) => {
                const isSelected = stop.id === selectedStopId;
                return (
                  <TouchableOpacity
                    key={stop.id}
                    onPress={() => {
                      handleSelectStop(stop);
                      setIsDrawerExpanded(false);
                    }}
                    className={`p-3 rounded-2xl border mb-2 flex-row items-center justify-between ${
                      isSelected
                        ? "bg-sky-50/60 border-sky-500"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <View className="flex-1 mr-2">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-[11px] font-bold text-sky-700 font-mono">
                          #{index + 1}
                        </Text>
                        <Text className="text-xs font-bold text-slate-900">
                          {stop.customerName}
                        </Text>

                        <View className="flex-row items-center gap-0.5 bg-slate-100 px-1.5 py-0.2 rounded">
                          <Route size={10} color="#0284c7" />
                          <Text className="text-[10px] font-bold text-sky-700">
                            {stop.distanceFormatted}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-[11px] text-slate-400 mt-0.5" numberOfLines={1}>
                        {stop.address}
                      </Text>

                      <Text className="text-[10px] font-semibold text-slate-600 mt-1">
                        {stop.bottlesToDeliver} Full • {stop.expectedEmpty} Empty •{" "}
                        <Text className="text-amber-600">
                          {stop.cashToCollect > 0 ? `Rs ${stop.cashToCollect}` : "Prepaid"}
                        </Text>
                      </Text>
                    </View>

                    <View
                      className={`h-7 px-2.5 rounded-lg items-center justify-center ${
                        isSelected ? "bg-sky-600" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          isSelected ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {isSelected ? "Selected" : "Pick Stop"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            /* Targeted Stop: "Start Ride" / "Reached • Drop" */
            <View className="p-4">
              <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <View className="flex-row items-center gap-1.5">
                  <View
                    className={`h-2 w-2 rounded-full ${
                      isRiding ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}
                  />
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isRiding ? "Navigating on Road" : "Targeted Customer"}
                  </Text>
                </View>

                {isRiding ? (
                  <TouchableOpacity
                    onPress={handleCancelRide}
                    className="flex-row items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md"
                  >
                    <X size={11} color="#e11d48" />
                    <Text className="text-[10px] font-bold text-rose-600">Cancel Ride</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Route size={12} color="#0284c7" />
                    <Text className="text-xs font-bold text-sky-600">
                      {selectedStop.distanceFormatted} away
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-bold text-slate-900">
                    {selectedStop.customerName}
                  </Text>
                  <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>
                    {selectedStop.address}
                  </Text>
                  <Text className="text-[11px] font-semibold text-slate-700 mt-1">
                    {selectedStop.bottlesToDeliver} Full Drops • {selectedStop.expectedEmpty} Empties •{" "}
                    <Text className="text-amber-600 font-bold">
                      {selectedStop.cashToCollect > 0
                        ? `Rs ${selectedStop.cashToCollect}`
                        : "Prepaid"}
                    </Text>
                  </Text>
                </View>

                {/* 2-Step Action Button */}
                {isRiding ? (
                  <TouchableOpacity
                    onPress={handleReachedDestination}
                    activeOpacity={0.8}
                    className="h-11 px-4 rounded-xl bg-emerald-600 items-center justify-center flex-row gap-1.5 active:bg-emerald-700 shadow-xs"
                  >
                    <PackageCheck size={16} color="#ffffff" />
                    <Text className="text-xs font-bold text-white">Reached • Drop</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleStartRide}
                    disabled={isRouteLoading}
                    activeOpacity={0.8}
                    className="h-11 px-4 rounded-xl bg-sky-600 items-center justify-center flex-row gap-1.5 active:bg-sky-700 shadow-xs"
                  >
                    {isRouteLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Navigation size={15} color="#ffffff" />
                        <Text className="text-xs font-bold text-white">Start Ride</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}