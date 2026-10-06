import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, ScrollView, Dimensions, StyleSheet, Alert } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { RiderActiveOrder } from '../types/orders';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OrderWithDistance extends RiderActiveOrder {
  distanceFormatted?: string;
}

interface RiderOrderListPanelProps {
  orders: OrderWithDistance[];
  selectedOrderId: string | null;
  hasActiveRide: boolean;
  onSelectOrder: (order: RiderActiveOrder) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onOpenDetails: (order: RiderActiveOrder) => void;
}

export default function RiderOrderListPanel({
  orders,
  selectedOrderId,
  hasActiveRide,
  onSelectOrder,
  onUpdateStatus,
  onOpenDetails
}: RiderOrderListPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleCancelClick = (orderId: string) => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ongoing ride?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, Cancel", style: "destructive", onPress: () => onUpdateStatus(orderId, 'CANCELLED') }
      ]
    );
  };

  if (orders.length === 0) return null;

  return (
    <View style={styles.panelContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleExpand}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>
          {expanded ? 'Collapse Stops' : 'Expand Stops'}
        </Text>
        {expanded ? <ChevronDown size={16} color="#ffffff" /> : <ChevronUp size={16} color="#ffffff" />}
      </TouchableOpacity>

      {expanded && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {orders.map((item, index) => {
            const isSelected = item.id === selectedOrderId;
            
            const isOnRoute = item.status === 'ON_ROUTE';
            const isArrived = item.status === 'ARRIVED';
            const isThisOrderActive = isOnRoute || isArrived;
            
            const isDisabled = hasActiveRide && !isThisOrderActive;
            const cashDue = Math.max(item.totalAmount + (item.customer.customerCredit || 0) - (item.customer.customerAdvance || 0), 0);

            // Determine card background and border dynamically
            let cardStyle = styles.cardDefault;
            if (isThisOrderActive) cardStyle = styles.cardActive;
            else if (isSelected) cardStyle = styles.cardSelected;
            else if (isDisabled) cardStyle = styles.cardDisabled;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={isDisabled ? 1 : 0.9}
                onPress={() => !isDisabled && onSelectOrder(item)}
                style={[styles.cardBase, cardStyle]}
              >
                <View style={styles.infoCol}>
                  
                  {/* Name & Distance Row */}
                  <View style={styles.headerRow}>
                    <Text style={[styles.nameText, isDisabled && styles.textDisabled]} numberOfLines={1}>
                      <Text style={isSelected || isThisOrderActive ? styles.textSky : styles.textMuted}>
                        {index + 1}.{' '}
                      </Text> 
                      {item.customer.name}
                    </Text>
                    {item.distanceFormatted ? (
                      <Text style={[styles.distanceText, isDisabled ? styles.textDisabled : styles.textSky]}>
                        {item.distanceFormatted}
                      </Text>
                    ) : null}
                  </View>

                  {/* Address */}
                  <Text style={styles.addressText} numberOfLines={1}>
                    {item.customer.address || "No address provided"}
                  </Text>

                  {/* Phone & Cash Row */}
                  <View style={styles.metaRow}>
                    <Text style={[styles.phoneText, isDisabled && styles.textDisabled]}>
                      {item.customer.phone}
                    </Text>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={[styles.cashText, isDisabled && styles.textDisabled]}>
                      Rs {cashDue}
                    </Text>
                  </View>
                </View>

                {/* Actions Column */}
                <View style={styles.actionCol}>
                  {isThisOrderActive && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelClick(item.id)}
                    >
                      <Text style={styles.cancelText}>Cancel Ride</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    disabled={isDisabled && !isSelected}
                    onPress={() => {
                      if (isArrived) onOpenDetails(item);
                      else if (isOnRoute) onUpdateStatus(item.id, 'ARRIVED');
                      else if (isSelected) onUpdateStatus(item.id, 'ON_ROUTE');
                      else onSelectOrder(item);
                    }}
                    style={[
                      styles.mainActionBtn,
                      isArrived ? styles.btnIndigo :
                      isOnRoute ? styles.btnEmerald :
                      isSelected && !isDisabled ? styles.btnSky : styles.btnDefault
                    ]}
                  >
                    <Text style={[
                      styles.mainActionText, 
                      isThisOrderActive || (isSelected && !isDisabled) ? styles.textWhite : styles.textMuted
                    ]}>
                      {isArrived ? 'Settle Order' : isOnRoute ? 'Reached' : isSelected ? 'Start Ride' : 'Pick Stop'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container & Scroll
  panelContainer: {
    position: 'absolute',
    bottom: 8, 
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10, 
    zIndex: 20,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#0f172a', // slate-900
  },
  toggleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1.2,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  scrollView: {
    flexShrink: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 16,
  },

  // Card Structure
  cardBase: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardActive: {
    borderColor: '#0ea5e9', // sky-500
    backgroundColor: '#f0f9ff', // sky-50
  },
  cardSelected: {
    borderColor: '#7dd3fc', // sky-300
    backgroundColor: '#ffffff',
  },
  cardDisabled: {
    borderColor: '#f1f5f9', // slate-100
    backgroundColor: '#f1f5f9',
    opacity: 0.6,
  },
  cardDefault: {
    borderColor: '#e2e8f0', // slate-200
    backgroundColor: '#ffffff',
  },

  // Left Column (Info)
  infoCol: {
    flex: 1,
    paddingRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: '#0f172a', // slate-900
  },
  distanceText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 8,
  },
  addressText: {
    color: '#64748b', // slate-500
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#334155', // slate-700
  },
  bulletPoint: {
    color: '#cbd5e1', // slate-300
    marginHorizontal: 8,
  },
  cashText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#d97706', // amber-600
  },

  // Right Column (Actions)
  actionCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancelButton: {
    marginBottom: 8,
  },
  cancelText: {
    color: '#ef4444', // red-500
    fontWeight: 'bold',
    fontSize: 12,
  },
  mainActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIndigo: {
    backgroundColor: '#4f46e5', // indigo-600
  },
  btnEmerald: {
    backgroundColor: '#10b981', // emerald-500
  },
  btnSky: {
    backgroundColor: '#0284c7', // sky-600
  },
  btnDefault: {
    backgroundColor: '#e2e8f0', // slate-200
    borderWidth: 1,
    borderColor: '#cbd5e1', // slate-300
  },
  mainActionText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Shared Utility Text Colors
  textSky: {
    color: '#0284c7',
  },
  textMuted: {
    color: '#64748b',
  },
  textWhite: {
    color: '#ffffff',
  },
  textDisabled: {
    color: '#94a3b8',
  }
});