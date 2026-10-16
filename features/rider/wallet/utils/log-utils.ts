import {
  CheckCircle2, XCircle, Banknote, Package, Fuel,
  Wrench, FileText, UserCheck, Trash2, ShoppingCart
} from 'lucide-react-native';

export type LogType =
  | "CANCELLED" | "DELETED" | "DELIVERED"
  | "PAYMENT_RECOVERY" | "ASSET_RECOVERY"
  | "ORDER_CREATED" | "CUSTOMER"
  | "PETROL" | "MAINTENANCE" | "OTHER";

export const getLogStyle = (type: LogType) => {
  switch (type) {
    case 'DELIVERED':
      return { icon: CheckCircle2, color: '#059669', bg: '#ecfdf5', border: '#d1fae5' }; // emerald
    case 'CANCELLED':
      return { icon: XCircle, color: '#e11d48', bg: '#fff1f2', border: '#ffe4e6' }; // rose
    case 'DELETED':
      return { icon: Trash2, color: '#e11d48', bg: '#fff1f2', border: '#ffe4e6' }; // rose
    case 'PAYMENT_RECOVERY':
      return { icon: Banknote, color: '#0284c7', bg: '#f0f9ff', border: '#e0f2fe' }; // sky
    case 'ASSET_RECOVERY':
      return { icon: Package, color: '#d97706', bg: '#fffbeb', border: '#fef3c7' }; // amber
    case 'ORDER_CREATED':
      return { icon: ShoppingCart, color: '#059669', bg: '#ecfdf5', border: '#d1fae5' }; // emerald
    case 'CUSTOMER':
      return { icon: UserCheck, color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' }; // teal
    case 'PETROL':
      return { icon: Fuel, color: '#ea580c', bg: '#fff7ed', border: '#fef3c7' }; // orange
    case 'MAINTENANCE':
      return { icon: Wrench, color: '#4f46e5', bg: '#eef2ff', border: '#e0e7ff' }; // indigo
    default:
      return { icon: FileText, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }; // slate
  }
};

export const formatLogTitle = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};