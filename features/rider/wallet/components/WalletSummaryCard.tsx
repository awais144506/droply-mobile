import React from 'react';
import { View, Text } from 'react-native';
import { Wallet, CalendarDays, Package, Box, XCircle } from 'lucide-react-native';
import { format } from 'date-fns';
import { walletSummaryDetailsStyle as styles } from '../style/log-style';

interface SummaryCardProps {
  date: Date;
}

export default function WalletSummaryCard({ date }: SummaryCardProps) {
  // Dummy Data for the Rider Daily Ledger (Replace with real hook data as needed)
  const ledgerData = {
    targetAmount: 8500,
    actualCollected: 5000,
    deliveriesAssigned: 12,
    deliveriesCompleted: 9,
    deliveriesCancelled: 1,
    returnsCount: 4, // Will only show if > 0
  };

  return (
    <View style={styles.card}>

      {/* Top Row: Date Pill & Icon */}
      <View style={styles.headerRow}>
        <View style={styles.datePill}>
          <CalendarDays size={14} color="#94a3b8" />
          <Text style={styles.dateText}>
            {format(date, 'MMMM dd, yyyy')}
          </Text>
        </View>

        <View style={styles.iconCircle}>
          <Wallet size={18} color="#38bdf8" />
        </View>
      </View>

      {/* Main Focus: Cash Collection (Actual vs Target) */}
      <View style={styles.cashSection}>
        <View style={styles.cashColumn}>
          <Text style={styles.sectionLabel}>Target Amount</Text>
          <Text style={styles.targetAmountText}>
            Rs {ledgerData.targetAmount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.cashColumnRight}>
          <Text style={styles.sectionLabel}>Actual Collected</Text>
          <Text style={styles.actualAmountText}>
            Rs {ledgerData.actualCollected.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Grid: Deliveries & Conditional Returns (Distance Removed) */}
      <View style={styles.metricsGrid}>

        {/* Deliveries: Completed/Assigned + Cancelled Separately */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapper}>
            <Package size={14} color="#a78bfa" />
          </View>
          <View>
            <Text style={styles.metricLabel}>Deliveries</Text>
            <Text style={styles.metricValue}>
              {ledgerData.deliveriesCompleted} <Text style={styles.metricSubValue}>/ {ledgerData.deliveriesAssigned}</Text>
            </Text>
          </View>
        </View>

        {/* Cancelled Deliveries (Shown separately if > 0) */}
        {ledgerData.deliveriesCancelled > 0 && (
          <View style={styles.metricItem}>
            <View style={[styles.metricIconWrapper, { backgroundColor: '#fff1f2' }]}>
              <XCircle size={14} color="#e11d48" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Cancelled</Text>
              <Text style={[styles.metricValue, { color: '#e11d48' }]}>
                {ledgerData.deliveriesCancelled} Orders
              </Text>
            </View>
          </View>
        )}

        {/* Returns / Empties (Rendered ONLY if greater than 0) */}
        {ledgerData.returnsCount > 0 && (
          <View style={styles.metricItem}>
            <View style={[styles.metricIconWrapper, styles.iconEmpties]}>
              <Box size={14} color="#fbbf24" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Returns</Text>
              <Text style={styles.metricValue}>{ledgerData.returnsCount} Items</Text>
            </View>
          </View>
        )}

      </View>

    </View>
  );
}