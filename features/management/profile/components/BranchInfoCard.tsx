import React from 'react';
import { View, Text, Image } from 'react-native';
import { Building2, Phone, MapPin } from 'lucide-react-native';
import { branchSettingsStyles as styles } from '@/features/rider/profile/style/profile-styles';

interface BranchInfoCardProps {
    branch?: {
        name: string;
        phone: string;
        address: string;
        logoUrl?: string | null;
    };
}

export const BranchInfoCard = ({ branch }: BranchInfoCardProps) => {
    return (
        <View style={styles.card}>
            {branch?.logoUrl ? (
                <Image source={{ uri: branch.logoUrl }} style={styles.logoImage} resizeMode="cover" />
            ) : (
                <View style={styles.fallbackLogoContainer}>
                    <Building2 size={13} color="#3b82f6" strokeWidth={2.2} />
                </View>
            )}

            <View style={styles.detailsContainer}>
                 <View style={styles.infoRow}>
                    <Building2 size={13} color="#64748b" strokeWidth={2.2} />
                    <Text style={styles.branchNameText}>
                        {branch?.name || 'N/A'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Phone size={13} color="#64748b" strokeWidth={2.2} />
                    <Text style={styles.phoneText}>
                        {branch?.phone || 'N/A'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MapPin size={13} color="#94a3b8" strokeWidth={2.2} />
                    <Text style={styles.addressText} numberOfLines={2}>
                        {branch?.address || 'N/A'}
                    </Text>
                </View>
            </View>
        </View>
    );
};