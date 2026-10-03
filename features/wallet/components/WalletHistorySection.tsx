// src/features/wallet/components/WalletHistorySection.tsx
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
  PlusCircle,
  UserPlus
} from 'lucide-react-native';
import { RiderLogs } from '../types/logs';

interface Props {
  logs: RiderLogs[];
  isLoading: boolean;
}

export default function WalletHistorySection({ logs, isLoading }: Props) {
  if (isLoading) {
    return (
      <View className="py-10 items-center justify-center">
        <ActivityIndicator size="small" color="#0284c7" />
        <Text className="text-slate-400 mt-2 font-medium text-xs">Loading logs...</Text>
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View className="py-10 items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed">
        <FileText size={32} color="#cbd5e1" />
        <Text className="text-slate-400 font-medium text-sm mt-3">No activity logged for this date</Text>
      </View>
    );
  }

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'DELIVERED': return { icon: CheckCircle2, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'CANCELLED': return { icon: XCircle, color: '#f43f5e', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'PAYMENT_RECOVERY': return { icon: Banknote, color: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-100' };
      case 'ASSET_RECOVERY': return { icon: Package, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'ORDER_CREATED': return { icon: PlusCircle, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-100' };
      case 'PETROL': return { icon: Fuel, color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-100' };
      case 'MAINTENANCE': return { icon: Wrench, color: '#64748b', bg: 'bg-slate-100', border: 'border-slate-200' };
      case 'CUSTOMER': return { icon: UserPlus, color: '#64748b', bg: 'bg-emerald-100', border: 'border-emerald-200' };
      default: return { icon: FileText, color: '#94a3b8', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  return (
    <View className="mb-8">
      <Text className="text-sm font-bold text-slate-800 mb-3 px-1">Activity Timeline</Text>
      
      <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {logs?.map((log, index) => {
          const style = getLogStyle(log.type);
          const Icon = style.icon;
          const isLast = index === logs.length - 1;

          return (
            <View 
              key={log.id} 
              className={`flex-row p-4 ${!isLast ? 'border-b border-slate-50' : ''}`}
            >
              {/* Icon */}
              <View className={`h-10 w-10 rounded-full items-center justify-center border mr-3 ${style.bg} ${style.border}`}>
                <Icon size={18} color={style.color} />
              </View>

              {/* Content */}
              <View className="flex-1 justify-center">
                <View className="flex-row justify-between items-start mb-0.5">
                  <Text className="font-bold text-slate-800 text-sm flex-1 mr-2" numberOfLines={1}>
                    {log.customerName || log.type.replace('_', ' ')}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {format(parseISO(log.createdAt), 'hh:mm a')}
                  </Text>
                </View>
                
                <Text className="text-xs font-medium text-slate-500 leading-tight">
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