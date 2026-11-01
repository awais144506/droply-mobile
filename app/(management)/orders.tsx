import React, { useMemo, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageCircle, Briefcase } from 'lucide-react-native';
import { useOrderRequests } from '@/features/management/orders/api/use-orders';
import { CustomerOrderRequest,RequestStatus } from '@/features/management/orders/types/requests';
import { OrderListStyle as styles } from '@/features/management/orders/style/orders.styles';

// Status Badge Color Helper
const getStatusColors = (status: RequestStatus) => {
  switch (status) {
    case 'PENDING': return { bg: '#fffbeb', border: '#fde68a', text: '#d97706' };
    case 'ACCEPTED':
    case 'ASSIGNED': return { bg: '#eef2ff', border: '#c7d2fe', text: '#4f46e5' };
    case 'ON_ROUTE':
    case 'ARRIVED': return { bg: '#f0f9ff', border: '#bae6fd', text: '#0284c7' };
    case 'COMPLETED': return { bg: '#ecfdf5', border: '#a7f3d0', text: '#059669' };
    case 'CANCELLED': return { bg: '#fff1f2', border: '#fecdd3', text: '#e11d48' };
    default: return { bg: '#f8fafc', border: '#e2e8f0', text: '#475569' };
  }
};

const formatTime = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Orders = () => {
  const { data: orders = [], isLoading, refetch, isRefetching } = useOrderRequests();
  const [waModal, setWaModal] = useState<{ visible: boolean; phone: string; orderId: string }>({
    visible: false,
    phone: '',
    orderId: '',
  });

  const stats = useMemo(() => {
    let pendingCount = 0;
    let totalValue = 0;
    for (const order of orders) {
      if (order.status === 'PENDING') pendingCount++;
      if (order.status !== 'CANCELLED') totalValue += Number(order.total || 0);
    }
    return { totalCount: orders.length, pendingCount, totalValue };
  }, [orders]);

  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  // Triggers the Bottom Sheet instead of the ugly Alert
  const openWhatsAppSheet = (phone?: string, orderId?: string) => {
    if (!phone) return;
    setWaModal({ visible: true, phone, orderId: orderId || '' });
  };

  // Executes the actual linking
  const executeWhatsApp = (isBusiness: boolean) => {
    const { phone, orderId } = waModal;
    setWaModal({ visible: false, phone: '', orderId: '' }); // Close modal instantly

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const message = `Hi, we received your order request (#${orderId}).`;
    const scheme = isBusiness ? 'whatsapp-business://' : 'whatsapp://';
    
    Linking.openURL(`${scheme}send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`)
      .catch(() => {
        Linking.openURL(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`);
      });
  };

  if (isLoading && !orders.length) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#0284c7']} tintColor="#0284c7" />
        }
      >
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>Today&apos;s Requests</Text>
            <Text style={styles.headerSubtitle}>Live customer order portal requests</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Today</Text>
          </View>
        </View>

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

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Order Requests Today</Text>
            <Text style={styles.emptySubtitle}>New customer requests placed today will appear here automatically.</Text>
          </View>
        ) : (
          <View style={styles.cardList}>
            {orders.map((order: CustomerOrderRequest) => {
              const badgeColor = getStatusColors(order.status);

              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.cardTopRow}>
                    <View>
                      <Text style={styles.orderCode}>#{order.orderId}</Text>
                      <Text style={styles.timeText}>{formatTime(order.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badgeColor.bg, borderColor: badgeColor.border }]}>
                      <Text style={[styles.statusText, { color: badgeColor.text }]}>{order.status.replace('_', ' ')}</Text>
                    </View>
                  </View>

                  <View style={styles.customerBox}>
                    <View style={styles.customerHeader}>
                      <Text style={styles.customerName} numberOfLines={1}>{order.customer?.name || 'Customer'}</Text>
                      {order.customer?.zone?.name && (
                        <View style={styles.zonePill}>
                          <Text style={styles.zonePillText}>{order.customer.zone.name}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.customerSubText}>
                      {order.customer?.phone}
                      {order.customer?.address ? ` • ${order.customer.address}` : ''}
                    </Text>

                    {order.customer?.phone && (
                      <View style={styles.contactActions}>
                        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnCall]} onPress={() => handleCall(order.customer?.phone)}>
                          <Phone size={14} color="#0284c7" />
                          <Text style={styles.actionBtnTextCall}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWa]} onPress={() => openWhatsAppSheet(order.customer?.phone, order.orderId)}>
                          <MessageCircle size={14} color="#16a34a" />
                          <Text style={styles.actionBtnTextWa}>WhatsApp</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <View style={styles.itemsContainer}>
                    {order.items?.map((item) => (
                      <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.itemMeta}>
                          <Text style={styles.itemQtyBadge}>x{item.quantity}</Text>
                          <Text style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {order.notes && (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesText}>Note: {order.notes}</Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={styles.totalLabel}>Total Bill</Text>
                    <Text style={styles.totalAmount}>Rs {Number(order.total || 0).toLocaleString()}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* 🔥 CUSTOM BOTTOM SHEET SLIDER */}
      <Modal
        visible={waModal.visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setWaModal({ ...waModal, visible: false })}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setWaModal({ ...waModal, visible: false })}
        >
          <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose WhatsApp App</Text>

            <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnBusiness]} onPress={() => executeWhatsApp(true)}>
              <Briefcase size={22} color="#16a34a" />
              <Text style={[styles.sheetBtnText, styles.sheetBtnTextBusiness]}>WhatsApp Business</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetBtn} onPress={() => executeWhatsApp(false)}>
              <MessageCircle size={22} color="#334155" />
              <Text style={styles.sheetBtnText}>Standard WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setWaModal({ ...waModal, visible: false })}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default Orders;