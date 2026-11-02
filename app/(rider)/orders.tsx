// src/app/(rider)/orders/index.tsx
import { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ShoppingCart, UserPlus, ArrowRight, Bike, Clock, CheckCircle2, MapPin, Phone, User, Package, Calendar } from "lucide-react-native";

import { ordersScreenStyles as styles, orderCardStyles } from "@/features/rider/orders/style/order-style";
import { useOrderRequests } from "@/features/management/orders/api/use-orders";
import { CustomerOrderRequest } from "@/features/management/orders/types/requests";

export default function OrdersScreen() {
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrderRequests();
  const router = useRouter();

  const stats = useMemo(() => {
    let pendingCount = 0;
    let totalValue = 0;
    for (const order of orders) {
      if (order.status === 'PENDING') pendingCount++;
      if (order.status !== 'CANCELLED') totalValue += Number(order.total || 0);
    }
    return { totalCount: orders.length, pendingCount, totalValue };
  }, [orders]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Bike size={20} color="#0284c7" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Orders Management</Text>
          <Text style={styles.headerSubtitle}>Manage Customer/Orders</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0284c7" />
        }
      >
        {/* Full-Width Action Button ("Add Customer") */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/sale/new-customer")}
            style={styles.actionCardFull}
          >
            <View style={styles.actionIconPrimary}>
              <UserPlus size={22} color="#ffffff" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Add New Customer</Text>
              <Text style={styles.actionSubtitlePrimary}>Register a new customer profile instantly</Text>
            </View>
            <View style={styles.actionArrowWrapper}>
              <ArrowRight size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section Divider */}
        <View style={styles.divider} />

        {/* Summary Grid Strip */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Requests</Text>
            <Text style={styles.summaryValue}>{stats.totalCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: '#d97706' }]}>{stats.pendingCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Est. Value</Text>
            <Text style={[styles.summaryValue, { color: '#0284c7' }]}>Rs {stats.totalValue.toLocaleString()}</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.listHeader}>Incoming Order Requests</Text>

        {/* Orders List / Loading / Empty State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>Fetching order requests...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <ShoppingCart size={32} color="#94a3b8" />
            </View>
            <Text style={styles.emptyText}>No pending order requests found.</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {orders.map((order: CustomerOrderRequest) => {
              const isPending = order.status === "PENDING";
              return (
                <View key={order.id} style={orderCardStyles.cardBase}>

                  {/* Top Order Meta Row */}
                  <View style={orderCardStyles.headerRow}>
                    <View style={orderCardStyles.orderIdBadge}>
                      <Package size={12} color="#0284c7" />
                      <Text style={orderCardStyles.orderNoText}>
                        #{order.orderId || order.id.slice(0, 6)}
                      </Text>
                    </View>

                    <View
                      style={[
                        orderCardStyles.statusBadgeBase,
                        isPending
                          ? orderCardStyles.statusBadgePending
                          : orderCardStyles.statusBadgeDone,
                      ]}
                    >
                      {isPending ? (
                        <Clock size={10} color="#b45309" />
                      ) : (
                        <CheckCircle2 size={10} color="#047857" />
                      )}
                      <Text
                        style={[
                          orderCardStyles.statusTextBase,
                          isPending
                            ? orderCardStyles.statusTextPending
                            : orderCardStyles.statusTextDone,
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Customer Information Block */}
                  <View style={orderCardStyles.infoContainer}>
                    <View style={orderCardStyles.customerRow}>
                      <View style={orderCardStyles.customerNameRow}>
                        <View style={orderCardStyles.avatarMini}>
                          <User size={12} color="#4338ca" />
                        </View>
                        <Text style={orderCardStyles.customerNameText} numberOfLines={1}>
                          {order.customer?.name || "Walk-in Customer"}
                        </Text>
                      </View>
                    </View>

                    {order.customer?.phone && (
                      <View style={orderCardStyles.phoneRow}>
                        <Phone size={12} color="#475569" />
                        <Text style={orderCardStyles.phoneText}>{order.customer.phone}</Text>
                      </View>
                    )}

                    {order.customer?.address && (
                      <View style={orderCardStyles.addressRow}>
                        <MapPin size={12} color="#64748b" style={orderCardStyles.addressIcon} />
                        <Text style={orderCardStyles.addressText} numberOfLines={2}>
                          {order.customer.address}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Items Summary Section */}
                  {order.items && order.items.length > 0 && (
                    <View style={orderCardStyles.itemsContainer}>
                      <Text style={orderCardStyles.itemsHeaderLabel}>Requested Products</Text>
                      {order.items.map((item) => (
                        <View key={item.id} style={orderCardStyles.itemRow}>
                          <Text style={orderCardStyles.itemNameText} numberOfLines={1}>
                            • {item.product?.name || item.name}
                          </Text>
                          <Text style={orderCardStyles.itemQtyText}>
                            x{item.quantity} <Text style={orderCardStyles.itemPriceText}>(Rs {item.price})</Text>
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Notes Section if available */}
                  {order.notes && (
                    <View style={orderCardStyles.notesBox}>
                      <Text style={orderCardStyles.notesLabel}>Notes: </Text>
                      <Text style={orderCardStyles.notesText}>{order.notes}</Text>
                    </View>
                  )}

                  {/* Footer Box with Timestamps and Total */}
                  <View style={orderCardStyles.footerBox}>
                    <View style={orderCardStyles.timeRow}>
                      <View style={orderCardStyles.footerItemWrapper}>
                        <Calendar size={12} color="#94a3b8" />
                        <View>
                          <Text style={orderCardStyles.footerLabel}>Schedule Date</Text>
                          <Text style={orderCardStyles.timeValue}>
                            {order.scheduleDate
                              ? new Date(order.scheduleDate).toLocaleDateString('en-PK', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                              : "Immediate"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={orderCardStyles.totalBox}>
                      <Text style={orderCardStyles.footerLabel}>Total Amount</Text>
                      <Text style={orderCardStyles.totalValue}>
                        Rs {Number(order.total || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}