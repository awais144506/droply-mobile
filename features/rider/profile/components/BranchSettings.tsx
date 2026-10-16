import React from 'react';
import { Text, View, Image } from 'react-native';
import { BranchSettings as BranchType } from '../types/profile';
import { branchSettingsStyles as styles } from '../style/profile-styles';

type BranchSettingsData = {
    branch: BranchType | undefined;
}

const BranchSettings = ({ branch }: BranchSettingsData) => {
    if (!branch) return null;

    return (
        <View style={styles.card}>
            {/* Logo or Fallback Initial */}
            {branch.logoUrl ? (
                <Image
                    source={{ uri: branch.logoUrl }}
                    style={styles.logoImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.fallbackLogoContainer}>
                    <Text style={styles.fallbackLogoText}>
                        {branch.name?.charAt(0) || 'B'}
                    </Text>
                </View>
            )}

            {/* Branch Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.branchNameText} numberOfLines={1}>
                    {branch.name || 'Main Branch'}
                </Text>

                {branch.phone && (
                    <Text style={styles.phoneText}>
                        {branch.phone}
                    </Text>
                )}

                {branch.address && (
                    <Text style={styles.addressText} numberOfLines={2}>
                        {branch.address}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default BranchSettings;