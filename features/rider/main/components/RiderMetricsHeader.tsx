import React from 'react';
import { View, Text } from 'react-native';
import { Banknote, Package, Recycle } from 'lucide-react-native';

interface RiderMetricsHeaderProps {
  cash: number;
  items: number;
  empties: number;
}

export default function RiderMetricsHeader({ cash, items, empties }: RiderMetricsHeaderProps) {
  return (
    <View className="flex-row justify-between items-center bg-white p-4 mx-4 mt-2 rounded-2xl shadow-sm border border-slate-100 z-10 w-full">
      
      <View className="items-center">
        <Banknote size={20} color="#16a34a" />
        <Text className="text-xs text-slate-500 mt-1 font-medium">Collect</Text>
        <Text className="text-sm font-bold text-slate-900">Rs {cash}</Text>
      </View>

      <View className="h-8 w-[1px] bg-slate-200" />

      <View className="items-center">
        <Package size={20} color="#0284c7" />
        <Text className="text-xs text-slate-500 mt-1 font-medium">Deliveries</Text>
        <Text className="text-sm font-bold text-slate-900">{items} Items</Text>
      </View>

      <View className="h-8 w-[1px] bg-slate-200" />

      <View className="items-center">
        <Recycle size={20} color="#ea580c" />
        <Text className="text-xs text-slate-500 mt-1 font-medium">Returns</Text>
        <Text className="text-sm font-bold text-slate-900">{empties} Bottles</Text>
      </View>

    </View>
  );
}