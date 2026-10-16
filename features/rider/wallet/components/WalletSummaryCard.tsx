import React from 'react';
import { View, Text } from 'react-native';
import { Wallet, CalendarDays, Package, MapPin, Box } from 'lucide-react-native';
import { format } from 'date-fns';
import { walletSummaryDetailsStyle as styles } from '../style/log-style';

interface SummaryCardProps {
  date: Date;
  // totalCashIn will eventually come from the backend, using dummy data below for now
}

export default function WalletSummaryCard({ date }: SummaryCardProps) {
  // Dummy Data for the new Rider Daily Ledger
  const ledgerData = {
    targetAmount: 8500,
    actualCollected: 5000,
    deliveriesAssigned: 12,
    deliveriesCompleted: 9,
    deliveriesCancelled: 1,
    distanceCovered: 24.5, // in KM
    emptiesCollected: 5, // Keeping this generic as requested
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

      {/* Grid: Deliveries, Distance, Empties */}
      <View style={styles.metricsGrid}>

        {/* Deliveries */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapper}>
            <Package size={14} color="#a78bfa" />
          </View>
          <View>
            <Text style={styles.metricLabel}>Deliveries</Text>
            <Text style={styles.metricValue}>
              {ledgerData.deliveriesCompleted} <Text style={styles.metricSubValue}>/ {ledgerData.deliveriesAssigned}</Text>
            </Text>
            {ledgerData.deliveriesCancelled > 0 && (
              <Text style={styles.cancelledText}>{ledgerData.deliveriesCancelled} Cancelled</Text>
            )}
          </View>
        </View>

        {/* Distance */}
        <View style={styles.metricItem}>
          <View style={[styles.metricIconWrapper, styles.iconDistance]}>
            <MapPin size={14} color="#34d399" />
          </View>
          <View>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{ledgerData.distanceCovered} km</Text>
          </View>
        </View>

        {/* Empties / Returns */}
        <View style={styles.metricItem}>
          <View style={[styles.metricIconWrapper, styles.iconEmpties]}>
            <Box size={14} color="#fbbf24" />
          </View>
          <View>
            <Text style={styles.metricLabel}>Returns</Text>
            <Text style={styles.metricValue}>{ledgerData.emptiesCollected} Items</Text>
          </View>
        </View>

      </View>

    </View>
  );
}

