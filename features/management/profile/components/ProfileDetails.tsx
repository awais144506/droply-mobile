import React from 'react';
import { View, Text } from 'react-native';
import { User, Mail, Phone, CreditCard, Calendar, Shield } from 'lucide-react-native';
import { informationStyles as styles } from '@/features/rider/profile/style/profile-styles'; // Or your shared component styles path

interface ProfileDetailsInformationProps {
  profile?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnic: string;
    role: 'OWNER' | 'MANAGER';
    joiningDate?: string;
    createdAt?: string;
  };
}

export const ProfileDetailsInformation = ({ profile }: ProfileDetailsInformationProps) => {
  // Format date nicely if available
  const rawDate = profile?.joiningDate || profile?.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const isOwner = profile?.role === 'OWNER';
  const dateLabel = isOwner ? 'Account Created' : 'Joining Date';

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={styles.badge}>
          <Shield size={12} color="#64748b" strokeWidth={2.2} />
          <Text style={styles.badgeText}>{profile?.role || 'Staff'}</Text>
        </View>
      </View>

      {/* Row 1: Full Name */}
      <View style={styles.rowContainer}>
        <View style={styles.iconWrapper}>
          <User size={18} color="#0284c7" strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowLabel}>Full Name</Text>
          <Text style={styles.rowValue}>{profile?.name || 'N/A'}</Text>
        </View>
      </View>

      {/* Row 2: Email Address */}
      <View style={[styles.rowContainer, styles.rowBorderTop]}>
        <View style={styles.iconWrapper}>
          <Mail size={18} color="#059669" strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowLabel}>Email Address</Text>
          <Text style={styles.rowValue}>{profile?.email || 'N/A'}</Text>
        </View>
      </View>

      {/* Row 3: Phone Number */}
      <View style={[styles.rowContainer, styles.rowBorderTop]}>
        <View style={styles.iconWrapper}>
          <Phone size={18} color="#d97706" strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowLabel}>Phone Number</Text>
          <Text style={styles.rowValue}>{profile?.phone || 'N/A'}</Text>
        </View>
      </View>

      {/* Row 4: CNIC */}
      <View style={[styles.rowContainer, styles.rowBorderTop]}>
        <View style={styles.iconWrapper}>
          <CreditCard size={18} color="#4f46e5" strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowLabel}>CNIC Number</Text>
          <Text style={styles.rowValue}>{profile?.cnic || 'N/A'}</Text>
        </View>
      </View>

      {/* Row 5: Joining Date / Created At */}
      <View style={[styles.rowContainer, styles.rowBorderTop]}>
        <View style={styles.iconWrapper}>
          <Calendar size={18} color="#e11d48" strokeWidth={2.2} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowLabel}>{dateLabel}</Text>
          <Text style={styles.rowValue}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileDetailsInformation;