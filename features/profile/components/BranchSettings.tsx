import React from 'react';
import { Text, View, Image } from 'react-native';
import { BranchSettings as BranchType } from '../types/profile';

type BranchSettingsData = {
    branch: BranchType | undefined;
}

const BranchSettings = ({ branch }: BranchSettingsData) => {
    if (!branch) return null;

    return (
        <View className="flex-row items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 gap-2">
            {/* Logo or Fallback Initial */}
            {branch.logoUrl ? (
                <Image
                    source={{ uri: branch.logoUrl }}
                    className="w-16 h-16 rounded-full bg-slate-50 mr-4 border border-slate-100"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mr-4 border border-blue-100">
                    <Text className="text-xl font-extrabold text-blue-500 uppercase">
                        {branch.displayName?.charAt(0) || 'B'}
                    </Text>
                </View>
            )}

            {/* Branch Details */}
            <View className="flex-1 justify-center">
                <Text className="text-lg font-bold text-slate-800 mb-1" numberOfLines={1}>
                    {branch.displayName || 'Main Branch'}
                </Text>

                {branch.displayPhone && (
                    <Text className="text-sm font-medium text-slate-500 mb-0.5">
                        📞 {branch.displayPhone}
                    </Text>
                )}

                {branch.displayAddress && (
                    <Text className="text-xs font-medium text-slate-400 leading-tight" numberOfLines={2}>
                        📍 {branch.displayAddress}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default BranchSettings;