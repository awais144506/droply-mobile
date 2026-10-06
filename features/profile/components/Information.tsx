import React from 'react';
import { Text, View } from 'react-native';
import { Lock, User, Mail, Phone, CreditCard, CalendarDays } from 'lucide-react-native';
import { Rider } from '../types/profile';
import { informationStyles as styles } from '../style/profile-styles'; // Adjust path if needed

type RiderData = {
    profile: Rider | undefined;
}

export const Information = ({ profile }: RiderData) => {
    const {
        name = "Not Provided",
        email = "No Email Address",
        phone = "No Phone Number",
        cnic = "No CNIC Provided",
        joiningDate
    } = profile || {};

    const formattedDate = joiningDate
        ? new Date(joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : "Unknown Date";

    return (
        <View style={styles.card}>
            {/* Header section */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>
                    Personal Info
                </Text>
                <View style={styles.badge}>
                    <Lock size={12} color="#94a3b8" />
                    <Text style={styles.badgeText}>
                        Read Only
                    </Text>
                </View>
            </View>

            {/* Data Rows */}
            <View>
                <InfoRow icon={User} label="Full Name" value={name} isFirst />
                <InfoRow icon={Mail} label="Email Address" value={email} />
                <InfoRow icon={Phone} label="Phone Number" value={phone} />
                <InfoRow icon={CreditCard} label="CNIC Number" value={cnic} />
                <InfoRow icon={CalendarDays} label="Joining Date" value={formattedDate} />
            </View>
        </View>
    );
};

// Reusable row component for a perfectly consistent, DRY layout
const InfoRow = ({
    icon: Icon,
    label,
    value,
    isFirst = false
}: {
    icon: any,
    label: string,
    value: string,
    isFirst?: boolean
}) => {
    return (
        <View style={[styles.rowContainer, !isFirst && styles.rowBorderTop]}>
            <View style={styles.iconWrapper}>
                <Icon size={18} color="#64748b" strokeWidth={2} />
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.rowLabel}>
                    {label}
                </Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                    {value}
                </Text>
            </View>
        </View>
    );
};