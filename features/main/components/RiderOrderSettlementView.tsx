import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { X, User, MapPin, Phone, Package, Banknote, CheckCircle2 } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

interface RiderOrderSettlementViewProps {
  order: RiderActiveOrder;
  onClose: () => void;
  onComplete: (orderId: string) => void;
}

export default function RiderOrderSettlementView({ order, onClose, onComplete }: RiderOrderSettlementViewProps) {
  // Calculate final cash due based on ledgers
  const cashDue = Math.max(
    order.totalAmount + (order.customer.customerCredit || 0) - (order.customer.customerAdvance || 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settle Order</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* 1. Customer Card */}
        <View style={styles.card}>
          <View style={styles.customerHeader}>
            <View style={styles.avatarIcon}>
              <User size={20} color="#0284c7" />
            </View>
            <View style={styles.customerNameCol}>
              <Text style={styles.customerLabel}>Customer</Text>
              <Text style={styles.customerName}>{order.customer.name}</Text>
            </View>
          </View>
          
          <View style={styles.contactRow}>
            <Phone size={16} color="#94a3b8" style={styles.iconMargin} />
            <Text style={styles.contactText}>{order.customer.phone}</Text>
          </View>
          
          <View style={styles.addressRow}>
            <MapPin size={16} color="#94a3b8" style={styles.addressIcon} />
            <Text style={styles.addressText}>{order.customer.address}</Text>
          </View>
        </View>

        {/* 2. Items Card */}
        <View style={styles.card}>
          <View style={styles.itemsHeader}>
            <Package size={20} color="#475569" style={styles.iconMarginSmall} />
            <Text style={styles.itemsTitle}>Delivery Items</Text>
          </View>

          {order.lineItems?.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.itemRow, 
                index === order.lineItems!.length - 1 ? { marginBottom: 0 } : null
              ]}
            >
              <View style={styles.itemLeft}>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>{item.quantity}x</Text>
                </View>
                <Text style={styles.itemName}>{item.product.name}</Text>
              </View>
              <Text style={styles.itemPrice}>Rs {item.unitPrice * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* 3. Cash Summary Card */}
        <View style={styles.cashCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Total</Text>
            <Text style={styles.summaryLabel}>Rs {order.totalAmount}</Text>
          </View>
          
          {(order.customer.customerCredit || 0) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.creditLabel}>Previous Balance (Credit)</Text>
              <Text style={styles.creditLabel}>+ Rs {order.customer.customerCredit}</Text>
            </View>
          )}

          {(order.customer.customerAdvance || 0) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.advanceLabel}>Advance Paid</Text>
              <Text style={styles.advanceLabel}>- Rs {order.customer.customerAdvance}</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <View style={styles.totalLeft}>
              <Banknote size={24} color="#059669" style={styles.iconMarginSmall} />
              <Text style={styles.totalLabel}>Cash to Collect</Text>
            </View>
            <Text style={styles.totalAmount}>Rs {cashDue}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => onComplete(order.id)}
          style={styles.completeButton}
        >
          <CheckCircle2 size={24} color="#ffffff" style={styles.iconMarginSmall} />
          <Text style={styles.completeText}>Complete Delivery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main Layout
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc', // slate-50
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a', // slate-900
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f1f5f9', // slate-100
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },

  // Generic Card Styles
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9', // slate-100
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Customer Card
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e0f2fe', // sky-100
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerNameCol: {
    flex: 1,
  },
  customerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0284c7', // sky-600
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    color: '#475569', // slate-600
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  addressText: {
    color: '#475569', // slate-600
    flex: 1,
    lineHeight: 20,
  },
  iconMargin: {
    marginRight: 12,
  },

  // Items Card
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9', // slate-100
    paddingBottom: 12,
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBadge: {
    backgroundColor: '#f1f5f9', // slate-100
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  qtyText: {
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
  },
  itemName: {
    color: '#334155', // slate-700
    fontWeight: '500',
  },
  itemPrice: {
    color: '#64748b', // slate-500
    fontWeight: '500',
  },
  iconMarginSmall: {
    marginRight: 8,
  },

  // Cash Summary Card
  cashCard: {
    backgroundColor: '#ecfdf5', // emerald-50
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d1fae5', // emerald-100
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#065f46', // emerald-800
    fontWeight: '500',
  },
  creditLabel: {
    color: '#e11d48', // rose-600
    fontWeight: '500',
  },
  advanceLabel: {
    color: '#059669', // emerald-600
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#a7f3d0', // emerald-200
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#064e3b', // emerald-900
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#047857', // emerald-700
  },

  // Footer Action
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9', // slate-100
  },
  completeButton: {
    backgroundColor: '#10b981', // emerald-500
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#a7f3d0', // emerald-200
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  completeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  }
});