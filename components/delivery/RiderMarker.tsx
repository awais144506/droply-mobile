import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { Bike } from "lucide-react-native";
import { LatLng } from "@/utils/locationUtils";

interface RiderMarkerProps {
  coordinate: LatLng;
}

export default function RiderMarker({ coordinate }: RiderMarkerProps) {
  if (!coordinate) return null;
  
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View className="items-center">
        <View className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white items-center justify-center shadow-lg">
          <Bike size={16} color="#ffffff" />
        </View>
      </View>
    </Marker>
  );
}