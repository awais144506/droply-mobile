import React from 'react';
import { View, Text } from 'react-native';
import { Wallet, CalendarDays, Package, XCircle } from 'lucide-react-native';
import { format } from 'date-fns';
import { walletSummaryDetailsStyle as styles } from '../style/log-style';
import { ShiftLogs } from '../types/logs';

interface SummaryCardProps {
  date: Date;
  shiftLogs?: ShiftLogs;
}

export default function WalletSummaryCard({ date, shiftLogs }: SummaryCardProps) {
  // Safe fallbacks so the app never breaks or shows NaN/undefined
  const totalOrders = shiftLogs?.totalOrders ?? 0;
  const completedOrders = shiftLogs?.completedOrders ?? 0;
  const cancelledOrders = shiftLogs?.cancelledOrders ?? 0;
  const amountPaid = shiftLogs?.amountPaid ?? 0;

  return (
    <View style={styles.card}>

      {/* Top Row: Date Pill & Icon */}
      <View style={styles.headerRow}>
        <View style={styles.datePill}>
          <CalendarDays size={14} color="#94a3b8" />
          <Text style={styles.dateText}>
            {date ? format(date, 'MMMM dd, yyyy') : 'Today'}
          </Text>
        </View>

        <View style={styles.iconCircle}>
          <Wallet size={18} color="#38bdf8" />
        </View>
      </View>

      {/* Main Focus: Cash Collection & Order Overview */}
      <View style={styles.cashSection}>
        <View style={styles.cashColumn}>
          <Text style={styles.sectionLabel}>Total Assigned</Text>
          <Text style={styles.targetAmountText}>
            {totalOrders} Orders
          </Text>
        </View>

        <View style={styles.cashColumnRight}>
          <Text style={styles.sectionLabel}>Amount Collected</Text>
          <Text style={styles.actualAmountText}>
            Rs {amountPaid.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Grid: Deliveries & Conditional Returns */}
      <View style={styles.metricsGrid}>

        {/* Deliveries: Completed / Total Assigned */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapper}>
            <Package size={14} color="#a78bfa" />
          </View>
          <View>
            <Text style={styles.metricLabel}>Deliveries</Text>
            <Text style={styles.metricValue}>
              {completedOrders} <Text style={styles.metricSubValue}>/ {totalOrders}</Text>
            </Text>
          </View>
        </View>

        {/* Cancelled Deliveries (Shown separately only if > 0) */}
        {cancelledOrders > 0 && (
          <View style={styles.metricItem}>
            <View style={[styles.metricIconWrapper, { backgroundColor: '#fff1f2' }]}>
              <XCircle size={14} color="#e11d48" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Cancelled</Text>
              <Text style={[styles.metricValue, { color: '#e11d48' }]}>
                {cancelledOrders} Orders
              </Text>
            </View>
          </View>
        )}

      </View>

    </View>
  );
}