import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { ChevronUp, ChevronDown, Route, X, PackageCheck, Navigation } from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface StopDrawerProps {
  isDrawerExpanded: boolean;
  setIsDrawerExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  isRiding: boolean;
  stopsWithDistance: any[];
  selectedStopId: string;
  selectedStop: any;
  handleSelectStop: (stop: any) => void;
  handleStartRide: () => void;
  handleCancelRide: () => void;
  handleReachedDestination: () => void;
  isRouteLoading: boolean;
}

export default function StopDrawer({
  isDrawerExpanded,
  setIsDrawerExpanded,
  isRiding,
  stopsWithDistance,
  selectedStopId,
  selectedStop,
  handleSelectStop,
  handleStartRide,
  handleCancelRide,
  handleReachedDestination,
  isRouteLoading,
}: StopDrawerProps) {
  return (
    <View
      className="absolute left-3 right-3 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      style={{ bottom: 12, maxHeight: isDrawerExpanded ? SCREEN_HEIGHT * 0.54 : "auto" }}
    >
      {!isRiding && (
        <TouchableOpacity
          onPress={() => setIsDrawerExpanded((prev) => !prev)}
          activeOpacity={0.7}
          className="items-center py-2 bg-slate-50 border-b border-slate-100"
        >
          <View className="w-10 h-1 bg-slate-300 rounded-full mb-1" />
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isDrawerExpanded ? "Collapse Stops" : `Select Next Stop (${stopsWithDistance.length} on Route)`}
            </Text>
            {isDrawerExpanded ? <ChevronDown size={13} color="#64748b" /> : <ChevronUp size={13} color="#64748b" />}
          </View>
        </TouchableOpacity>
      )}

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
                className={`p-3 rounded-2xl border mb-2 flex-row items-center justify-between ${isSelected ? "bg-sky-50/60 border-sky-500" : "bg-white border-slate-200"
                  }`}
              >
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-[11px] font-bold text-sky-700 font-mono">#{index + 1}</Text>
                    <Text className="text-xs font-bold text-slate-900">{stop.customerName} ({stop.category})</Text>
                    <View className="flex-row items-center gap-0.5 bg-slate-100 px-1.5 py-0.2 rounded">
                      <Route size={10} color="#0284c7" />
                      <Text className="text-[10px] font-bold text-sky-700">{stop.distanceFormatted}</Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-slate-400 mt-0.5" numberOfLines={1}>{stop.address}</Text>
                  <Text className="text-[10px] font-semibold text-slate-600 mt-1">
                    {stop.bottlesToDeliver} Full • {stop.expectedEmpty} Empty •{" "}
                    <Text className="text-amber-600">
                      {stop.cashToCollect > 0 ? `Rs ${stop.cashToCollect}` : "Prepaid"}
                    </Text>

                  </Text>
                  
                </View>
                <View className={`h-7 px-2.5 rounded-lg items-center justify-center ${isSelected ? "bg-sky-600" : "bg-slate-100"}`}>
                  <Text className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-slate-600"}`}>
                    {isSelected ? "Selected" : "Pick Stop"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View className="p-4">
          <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <View className="flex-row items-center gap-1.5">
              <View className={`h-2 w-2 rounded-full ${isRiding ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isRiding ? "Navigating on Road" : "Targeted Customer"}
              </Text>
            </View>
            {isRiding ? (
              <TouchableOpacity onPress={handleCancelRide} className="flex-row items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md">
                <X size={11} color="#e11d48" />
                <Text className="text-[10px] font-bold text-rose-600">Cancel Ride</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center gap-1">
                <Route size={12} color="#0284c7" />
                <Text className="text-xs font-bold text-sky-600">{selectedStop.distanceFormatted} away</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-sm font-bold text-slate-900">{selectedStop.customerName} ({selectedStop.category})</Text>
              <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>{selectedStop.address}</Text>
              <Text className="text-[11px] font-semibold text-slate-700 mt-1">
                {selectedStop.bottlesToDeliver} Full Drops • {selectedStop.expectedEmpty} Empties •{" "}
                <Text className="text-amber-600 font-bold">
                  {selectedStop.cashToCollect > 0 ? `Rs ${selectedStop.cashToCollect}` : "Prepaid"}
                </Text>
              </Text>
            </View>
            {isRiding ? (
              <TouchableOpacity onPress={handleReachedDestination} activeOpacity={0.8} className="h-11 px-4 rounded-xl bg-emerald-600 items-center justify-center flex-row gap-1.5 active:bg-emerald-700 shadow-xs">
                <PackageCheck size={16} color="#ffffff" />
                <Text className="text-xs font-bold text-white">Reached • Drop</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleStartRide} disabled={isRouteLoading} activeOpacity={0.8} className="h-11 px-4 rounded-xl bg-sky-600 items-center justify-center flex-row gap-1.5 active:bg-sky-700 shadow-xs">
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
  );
}