import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Banknote,
  Package,
  Fuel,
  Wrench,
  FileText,
  UserCheck,
  Trash2,
  ShoppingCart,
  CircleDashed
} from 'lucide-react-native';

// Make sure your RiderLogs interface matches these types!
export type LogType = 
  | "CANCELLED" | "DELETED" | "DELIVERED" 
  | "PAYMENT_RECOVERY" | "ASSET_RECOVERY" 
  | "ORDER_CREATED" | "CUSTOMER" 
  | "PETROL" | "MAINTENANCE" | "OTHER";

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
      <View className="py-12 items-center justify-center bg-white rounded-3xl border border-slate-100 mt-2">
        <ActivityIndicator size="small" color="#0284c7" />
        <Text className="text-slate-400 mt-3 font-bold text-xs uppercase tracking-widest">Fetching Timeline...</Text>
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View className="py-12 items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed mt-2">
        <View className="h-14 w-14 bg-slate-50 rounded-full items-center justify-center mb-3">
          <CircleDashed size={28} color="#cbd5e1" />
        </View>
        <Text className="text-slate-800 font-extrabold text-base">No Activity Yet</Text>
        <Text className="text-slate-400 font-medium text-xs mt-1">Nothing logged for this date.</Text>
      </View>
    );
  }

  // Beautifully formats "PAYMENT_RECOVERY" to "Payment Recovery"
  const formatLogTitle = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

const getLogStyle = (type: LogType) => {
    switch (type) {
      case 'DELIVERED': 
        return { icon: CheckCircle2, color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'CANCELLED': 
        return { icon: XCircle, color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'DELETED': 
        return { icon: Trash2, color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'PAYMENT_RECOVERY': 
        return { icon: Banknote, color: '#0284c7', bg: 'bg-sky-50', border: 'border-sky-100' };
      case 'ASSET_RECOVERY': 
        return { icon: Package, color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'ORDER_CREATED': 
        return { icon: ShoppingCart, color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-100' }; // 🔥 Changed to green
      case 'CUSTOMER': 
        return { icon: UserCheck, color: '#0d9488', bg: 'bg-teal-50', border: 'border-teal-100' }; // 🔥 Refreshed customer icon
      case 'PETROL': 
        return { icon: Fuel, color: '#ea580c', bg: 'bg-orange-50', border: 'border-amber-100' };
      case 'MAINTENANCE': 
        return { icon: Wrench, color: '#4f46e5', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      default: 
        return { icon: FileText, color: '#64748b', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  return (
    <View className="mb-8 mt-2">
      <Text className="text-xs font-extrabold text-slate-400 mb-3 px-2 uppercase tracking-widest">
        Activity Timeline
      </Text>

      <View className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        {logs?.map((log, index) => {
          const style = getLogStyle(log.type);
          const Icon = style.icon;
          const isLast = index === logs.length - 1;

          return (
            <View
              key={log.id}
              className={`flex-row p-4 gap-3 items-center ${!isLast ? 'border-b border-slate-50' : ''}`}
            >
              {/* Icon Bubble */}
              <View className={`h-11 w-11 rounded-2xl items-center justify-center border mr-4 ${style.bg} ${style.border}`}>
                <Icon size={20} color={style.color} />
              </View>

              {/* Content */}
              <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-center mb-1 ">
                  <Text className="font-extrabold text-slate-800 text-sm flex-1 mr-2" numberOfLines={1}>
                    {log.customerName || formatLogTitle(log.type)}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-400">
                    {format(parseISO(log.createdAt), 'hh:mm a')}
                  </Text>
                </View>

                <Text className="text-xs font-medium text-slate-500 leading-snug">
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