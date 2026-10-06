import React from 'react';
import { Text, View, Image } from 'react-native';
import { BranchSettings as BranchType } from '../types/profile';
import { branchSettingsStyles as styles } from '../style/profile-styles'; // Adjust path if needed

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
                        {branch.displayName?.charAt(0) || 'B'}
                    </Text>
                </View>
            )}

            {/* Branch Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.branchNameText} numberOfLines={1}>
                    {branch.displayName || 'Main Branch'}
                </Text>

                {branch.displayPhone && (
                    <Text style={styles.phoneText}>
                        📞 {branch.displayPhone}
                    </Text>
                )}

                {branch.displayAddress && (
                    <Text style={styles.addressText} numberOfLines={2}>
                        📍 {branch.displayAddress}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default BranchSettings;