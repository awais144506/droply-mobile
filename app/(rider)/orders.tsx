import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  WifiOff,
  CheckCircle2,
  Trash2,
  Package,
  Clock,
  MapPin,
  ShoppingCart,
  UserPlus,
  ArrowRight,
  Bike,
  CalendarDays,
  Inbox
} from "lucide-react-native";
import { useOfflineOrderStore } from "@/store/seOfflineOrderStore";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function OrdersScreen() {
  const router = useRouter();
  const { offlineQueue, syncedOrders, removeOrderFromQueue } = useOfflineOrderStore();

  const [activeFilter, setActiveFilter] = useState<'today' | 'yesterday' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeList, setActiveList] = useState<'synced' | 'pending'>('synced');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCustomDate(selectedDate);
      setActiveFilter('custom');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center justify-between z-10">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
            <Bike size={20} color="#0284c7" />
          </View>
          <View>
            <Text className="text-lg font-extrabold text-slate-900">Operation Hub</Text>
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manage & Review</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* 🎛️ THE 4 BIG ACTION CARDS */}
        <View className="flex-row flex-wrap justify-between mb-6">

          {/* Card 1: New Order */}
          <TouchableOpacity
            onPress={() => router.push("/sale/new-order")}
            className="w-[48%] bg-sky-600 p-4 rounded-2xl mb-3 shadow-sm active:bg-sky-700"
          >
            <View className="h-10 w-10 bg-white/20 rounded-xl items-center justify-center mb-3">
              <ShoppingCart size={20} color="#ffffff" />
            </View>
            <Text className="text-white font-bold mb-1">New Order</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] text-sky-100 font-medium">Point of Sale</Text>
              <ArrowRight size={10} color="#bae6fd" />
            </View>
          </TouchableOpacity>

          {/* Card 2: Create Customer */}
          <TouchableOpacity
            onPress={() => router.push("/sale/new-customer")}
            className="w-[48%] bg-slate-800 p-4 rounded-2xl mb-3 shadow-sm active:bg-slate-900"
          >
            <View className="h-10 w-10 bg-white/10 rounded-xl items-center justify-center mb-3">
              <UserPlus size={20} color="#ffffff" />
            </View>
            <Text className="text-white font-bold mb-1">Add Customer</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] text-slate-300 font-medium">Register New</Text>
              <ArrowRight size={10} color="#cbd5e1" />
            </View>
          </TouchableOpacity>

          {/* 🔥 Card 3: Offline Queue (Now Clickable) */}
          <TouchableOpacity
            onPress={() => setActiveList('pending')}
            activeOpacity={0.8}
            className={`w-[48%] p-4 rounded-2xl shadow-sm ${activeList === 'pending' ? 'bg-amber-100 border-2 border-amber-400' : 'bg-amber-50 border border-amber-200'}`}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="h-10 w-10 bg-amber-100 rounded-xl items-center justify-center">
                <WifiOff size={20} color="#d97706" />
              </View>
              {/* Badge Number */}
              <View className="h-7 w-7 bg-amber-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-black">{offlineQueue.length}</Text>
              </View>
            </View>
            <Text className="text-amber-900 font-bold mb-0.5">Pending Sync</Text>
            <Text className="text-[10px] text-amber-700 font-medium">Waiting for network</Text>
          </TouchableOpacity>

          {/* 🔥 Card 4: Synced Orders (Now Clickable) */}
          <TouchableOpacity
            onPress={() => setActiveList('synced')}
            activeOpacity={0.8}
            className={`w-[48%] p-4 rounded-2xl shadow-sm ${activeList === 'synced' ? 'bg-emerald-100 border-2 border-emerald-400' : 'bg-emerald-50 border border-emerald-200'}`}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="h-10 w-10 bg-emerald-100 rounded-xl items-center justify-center">
                <CheckCircle2 size={20} color="#059669" />
              </View>
              {/* Badge Number */}
              <View className="h-7 w-7 bg-emerald-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-black">{syncedOrders.length}</Text>
              </View>
            </View>
            <Text className="text-emerald-900 font-bold mb-0.5">Synced Orders</Text>
            <Text className="text-[10px] text-emerald-700 font-medium">Completed today</Text>
          </TouchableOpacity>

        </View>

        {/* DATE FILTER BAR */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
          >
            <TouchableOpacity
              onPress={() => setActiveFilter('today')}
              className={`px-4 py-2 rounded-full border ${activeFilter === 'today' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
            >
              <Text className={`text-sm font-bold ${activeFilter === 'today' ? 'text-white' : 'text-slate-600'}`}>
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('yesterday')}
              className={`px-4 py-2 rounded-full border ${activeFilter === 'yesterday' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
            >
              <Text className={`text-sm font-bold ${activeFilter === 'yesterday' ? 'text-white' : 'text-slate-600'}`}>
                Yesterday
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('tomorrow')}
              className={`px-4 py-2 rounded-full border ${activeFilter === 'tomorrow' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
            >
              <Text className={`text-sm font-bold ${activeFilter === 'tomorrow' ? 'text-white' : 'text-slate-600'}`}>
                Tomorrow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className={`px-4 py-2 rounded-full border flex-row items-center gap-2 ${activeFilter === 'custom' ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
            >
              <CalendarDays size={14} color={activeFilter === 'custom' ? '#ffffff' : '#475569'} />
              <Text className={`text-sm font-bold ${activeFilter === 'custom' ? 'text-white' : 'text-slate-600'}`}>
                {activeFilter === 'custom' ? customDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Pick Date'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Native Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={customDate}
              mode="date"
              display="default"
              onChange={handleDateChange} // Fixed onValueChange to onChange for standard picker compatibility
            />
          )}
        </View>

        <View className="h-[1px] w-full bg-slate-200 mb-6" />

        {/* 🟡 OFFLINE QUEUE LIST (Only shows if activeList is 'pending') */}
        {activeList === 'pending' && (
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3 px-1">
              <WifiOff size={16} color="#d97706" />
              <Text className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">Waiting Network ({offlineQueue.length})</Text>
            </View>

            {offlineQueue.length === 0 ? (
              <View className="bg-amber-50/50 p-6 rounded-[20px] border border-amber-200 border-dashed items-center justify-center">
                <Inbox size={32} color="#fcd34d" />
                <Text className="text-amber-800 font-bold mt-3">No pending orders</Text>
                <Text className="text-amber-600 text-xs text-center mt-1">All orders are safely synced to the server.</Text>
              </View>
            ) : (
              offlineQueue.map((order) => (
                <View key={order.id} className="bg-amber-50 p-4 rounded-[20px] border border-amber-200 shadow-sm mb-3">
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-sm font-bold text-slate-900">{order.customerName}</Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <MapPin size={10} color="#92400e" />
                        <Text className="text-[10px] font-semibold text-amber-800">{order.zoneName}</Text>
                      </View>
                    </View>
                    <Text className="text-lg font-black text-amber-900">Rs. {order.totalAmount}</Text>
                  </View>

                  <View className="h-[1px] w-full bg-amber-200/50 my-2" />

                  <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Package size={12} color="#b45309" />
                        <Text className="text-xs font-bold text-amber-700">{order.itemsCount} Items</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Clock size={12} color="#b45309" />
                        <Text className="text-xs font-bold text-amber-700">{order.time}</Text>
                      </View>
                    </View>

                    <TouchableOpacity className="flex-row items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-amber-200 active:bg-amber-100"
                      onPress={() => removeOrderFromQueue(order.id)}
                    >
                      <Trash2 size={14} color="#e11d48" />
                      <Text className="text-xs font-bold text-rose-600">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 🟢 SYNCED ORDERS LIST (Only shows if activeList is 'synced') */}
        {activeList === 'synced' && (
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3 px-1">
              <CheckCircle2 size={16} color="#059669" />
              <Text className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Today&apos;s Orders ({syncedOrders.length})</Text>
            </View>

            {syncedOrders.length === 0 ? (
              <View className="bg-slate-50 p-6 rounded-[20px] border border-slate-200 border-dashed items-center justify-center">
                <Inbox size={32} color="#cbd5e1" />
                <Text className="text-slate-600 font-bold mt-3">No orders found</Text>
                <Text className="text-slate-400 text-xs text-center mt-1">You have not completed any orders for this date yet.</Text>
              </View>
            ) : (
              syncedOrders.map((order) => (
                <View key={order.id} className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm mb-3">
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-sm font-bold text-slate-900">{order.customerName}</Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <MapPin size={10} color="#64748b" />
                        <Text className="text-[10px] font-semibold text-slate-500">{order.zoneName}</Text>
                      </View>
                    </View>
                    <Text className="text-lg font-black text-slate-900">Rs. {order.totalAmount}</Text>
                  </View>

                  <View className="h-[1px] w-full bg-slate-100 my-2" />

                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center gap-1">
                      <Package size={12} color="#64748b" />
                      <Text className="text-xs font-bold text-slate-500">{order.itemsCount} Items</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <CheckCircle2 size={12} color="#059669" />
                      <Text className="text-xs font-bold text-emerald-600">{order.time}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}