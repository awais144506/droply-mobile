import React from "react";
import { View, Text } from "react-native";
import { Marker } from "react-native-maps";
import { MapPin } from "lucide-react-native";
import { DeliveryStop } from "@/utils/locationUtils";

interface StopMarkerProps {
  stop: DeliveryStop & { distanceFormatted?: string };
  index: number;
  isSelected: boolean;
  onPress: (stop: DeliveryStop) => void;
}

export default function StopMarker({ stop, index, isSelected, onPress }: StopMarkerProps) {
  return (
    <Marker 
      coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} 
      onPress={() => onPress(stop)}
    >
      <View className="items-center">
        <View className={`px-2 py-0.5 rounded-md shadow-md flex-row items-center gap-1 ${isSelected ? "bg-sky-600" : "bg-slate-800"}`}>
          <Text className="text-[10px] font-bold text-white">
            #{index + 1} • {stop.distanceFormatted}
          </Text>
        </View>
        <MapPin size={isSelected ? 30 : 22} color={isSelected ? "#0284c7" : "#1e293b"} />
      </View>
    </Marker>
  );
}