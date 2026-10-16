import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { format, parseISO } from 'date-fns';
import { CircleDashed } from 'lucide-react-native';
import { LogType, getLogStyle, formatLogTitle } from '../utils/log-utils';
import { historyStyles as styles } from '../style/log-style';

export interface RiderLogs {
  id: string;
  type: LogType;
  customerName?: string | null;
  description: string;
  createdAt: string;
}

interface Props {
  logs: RiderLogs[];
  isLoading: boolean;
}

export default function WalletHistorySection({ logs, isLoading }: Props) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0284c7" />
        <Text style={styles.loadingText}>Fetching Timeline...</Text>
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <CircleDashed size={28} color="#cbd5e1" />
        </View>
        <Text style={styles.emptyTitle}>No Activity Yet</Text>
        <Text style={styles.emptySub}>Nothing logged for this date.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Activity Timeline
      </Text>

      <View style={styles.listCard}>
        {logs?.map((log, index) => {
          const style = getLogStyle(log.type);
          const Icon = style.icon;
          const isLast = index === logs.length - 1;

          return (
            <View
              key={log.id}
              style={[
                styles.itemRow, 
                !isLast && styles.itemBorder
              ]}
            >
              {/* Icon Bubble (Dynamic colors loaded from util) */}
              <View 
                style={[
                  styles.iconBubble, 
                  { backgroundColor: style.bg, borderColor: style.border }
                ]}
              >
                <Icon size={20} color={style.color} />
              </View>

              {/* Content */}
              <View style={styles.itemContent}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {log.customerName || formatLogTitle(log.type)}
                  </Text>
                  <Text style={styles.itemTime}>
                    {format(parseISO(log.createdAt), 'hh:mm a')}
                  </Text>
                </View>

                <Text style={styles.itemDesc}>
                  {log.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}