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
import { ordersScreenStyles as styles } from "@/features/orders/style/order-style";
import Loading from "../loading";

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

  const { mutate: deleteMutation, isPending } = useDeleteOrder(branchId);

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
      deleteMutation(orderToDelete);
    }
    setIsAlertVisible(false);
    setOrderToDelete(null);
  };

  // 3. Cancels and hides the alert
  const cancelDelete = () => {
    setIsAlertVisible(false);
    setOrderToDelete(null);
  };

  if (isPending) return <Loading text="Deleting Order..." />


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Bike size={20} color="#0284c7" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Orders Management</Text>
          <Text style={styles.headerSubtitle}>Manage & Review</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => router.push("/sale/new-order")} style={styles.actionCardPrimary}>
            <View style={styles.actionIconPrimary}>
              <ShoppingCart size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionTitle}>New Order</Text>
            <View style={styles.actionSubtitleRow}>
              <Text style={styles.actionSubtitlePrimary}>Point of Sale</Text>
              <ArrowRight size={10} color="#bae6fd" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/sale/new-customer")} style={styles.actionCardSecondary}>
            <View style={styles.actionIconSecondary}>
              <UserPlus size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionTitle}>Add Customer</Text>
            <View style={styles.actionSubtitleRow}>
              <Text style={styles.actionSubtitleSecondary}>Register New</Text>
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

        <View style={styles.divider} />

        <Text style={styles.listHeader}>
          {activeFilter === 'today' ? "Today's Orders" : "Filtered Orders"} ({orderList.length})
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : orderList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={32} color="#cbd5e1" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {orderList.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onDelete={() => handleDeleteRequest(order.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

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