import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layers, Users, ShieldCheck, Bike } from 'lucide-react-native';

interface BranchStatsCardProps {
  stats?: {
    totalZones: number;
    totalCustomers: number;
    totalManagers: number;
    totalRiders: number;
  };
}

export const BranchStatsCard = ({ stats }: BranchStatsCardProps) => {
  const items = [
    { label: 'Total Zones', value: stats?.totalZones ?? 0, icon: <Layers size={18} color="#0284c7" /> },
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: <Users size={18} color="#059669" /> },
    { label: 'Total Managers', value: stats?.totalManagers ?? 0, icon: <ShieldCheck size={18} color="#4f46e5" /> },
    { label: 'Total Riders', value: stats?.totalRiders ?? 0, icon: <Bike size={18} color="#d97706" /> },
  ];

  return (
    <View style={statStyles.container}>
      <Text style={statStyles.sectionTitle}>Branch Overview</Text>
      <View style={statStyles.grid}>
        {items.map((item, index) => (
          <View key={index} style={statStyles.statCard}>
            <View style={statStyles.iconBox}>{item.icon}</View>
            <Text style={statStyles.statValue}>{item.value}</Text>
            <Text style={statStyles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const statStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
});