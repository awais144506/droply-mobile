/* eslint-disable import/no-named-as-default */
// src/app/(rider)/orders/index.tsx
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ShoppingCart, UserPlus, ArrowRight, Bike, Package } from "lucide-react-native";
import { useOrderList } from "@/features/orders/api/use-order";
import { useDeleteOrder } from "@/features/orders/api/use-mutate-order";
import { DateFilterBar, DateFilterType } from "@/components/ui/DateFilterBar";
import OrderCard from "@/features/orders/components/OrderCard";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { useRole } from "@/lib/use-role";

export default function OrdersScreen() {
  const router = useRouter();
  const { branchId } = useRole();
  // Date State
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('today');
  const [customDate, setCustomDate] = useState(new Date());

  // Alert State
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Calculate target date for the backend
  const getTargetDateString = () => {
    if (activeFilter === 'today') return new Date().toISOString();
    if (activeFilter === 'tomorrow') {
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      return tmrw.toISOString();
    }
    return customDate.toISOString();
  };

  const { data: orderList = [], isLoading, refetch, isRefetching } = useOrderList(getTargetDateString());

  const deleteMutation = useDeleteOrder(branchId);

  const handleFilterChange = (filter: DateFilterType, date?: Date) => {
    setActiveFilter(filter);
    if (date) setCustomDate(date);
  };

  // 1. Opens the Custom Alert
  const handleDeleteRequest = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsAlertVisible(true);
  };

  // 2. Confirms and fires the mutation
  const confirmDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete);
    }
    setIsAlertVisible(false);
    setOrderToDelete(null);
  };

  // 3. Cancels and hides the alert
  const cancelDelete = () => {
    setIsAlertVisible(false);
    setOrderToDelete(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 py-4 bg-white border-b border-slate-200 flex-row items-center gap-3 z-10">
        <View className="h-10 w-10 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
          <Bike size={20} color="#0284c7" />
        </View>
        <View>
          <Text className="text-lg font-extrabold text-slate-900">Operation Hub</Text>
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Manage & Review</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#0284c7"]}
            tintColor="#0284c7"
          />
        }
      >
        {/* Action Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <TouchableOpacity onPress={() => router.push("/sale/new-order")} className="w-[48%] bg-sky-600 p-4 rounded-3xl mb-3 shadow-sm">
            <View className="h-10 w-10 bg-white/20 rounded-xl items-center justify-center mb-3">
              <ShoppingCart size={20} color="#ffffff" />
            </View>
            <Text className="text-white font-bold mb-1">New Order</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] text-sky-100 font-medium">Point of Sale</Text>
              <ArrowRight size={10} color="#bae6fd" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/sale/new-customer")} className="w-[48%] bg-slate-800 p-4 rounded-3xl mb-3 shadow-sm">
            <View className="h-10 w-10 bg-white/10 rounded-xl items-center justify-center mb-3">
              <UserPlus size={20} color="#ffffff" />
            </View>
            <Text className="text-white font-bold mb-1">Add Customer</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] text-slate-300 font-medium">Register New</Text>
              <ArrowRight size={10} color="#cbd5e1" />
            </View>
          </TouchableOpacity>
        </View>

        {/* The Reusable Component */}
        <DateFilterBar
          activeFilter={activeFilter}
          customDate={customDate}
          onFilterChange={handleFilterChange}
        />

        <View className="h-[1px] w-full bg-slate-200 mb-6" />

        <Text className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 px-1">
          {activeFilter === 'today' ? "Today's Orders" : "Filtered Orders"} ({orderList.length})
        </Text>

        {isLoading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#0284c7" />
            <Text className="text-slate-400 mt-4 font-medium">Loading orders...</Text>
          </View>
        ) : orderList.length === 0 ? (
          <View className="py-10 items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <Package size={32} color="#cbd5e1" className="mb-3" />
            <Text className="text-slate-500 font-bold">No orders found</Text>
          </View>
        ) : (
          <View className="gap-4">
            {orderList.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onDelete={() => handleDeleteRequest(order.id)} // 🔥 Trigger custom alert
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* 🔥 Your Custom Alert placed outside the ScrollView */}
      <CustomAlert
        visible={isAlertVisible}
        title="Delete Order"
        message="Are you sure you want to delete this pending order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDestructive={true}
      />
    </SafeAreaView>
  );
}