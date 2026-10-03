import React from 'react';
import { Text, View } from 'react-native';
import { Lock, User, Mail, Phone, CreditCard, CalendarDays } from 'lucide-react-native';
import { Rider } from '../types/profile';

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
        <View className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm mb-4">
            {/* Header section */}
            <View className="flex-row items-center justify-between pb-4 border-b border-slate-100 mb-2">
                <Text className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                    Personal Info
                </Text>
                <View className="flex-row items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    <Lock size={12} color="#94a3b8" />
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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

// 3. Reusable row component for a perfectly consistent, DRY layout
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
        <View className={`flex-row items-center gap-4 py-3 ${!isFirst ? 'border-t border-slate-50' : ''}`}>
            <View className="h-10 w-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-100">
                <Icon size={18} color="#64748b" strokeWidth={2} />
            </View>
            <View className="flex-1 justify-center">
                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    {label}
                </Text>
                <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>
                    {value}
                </Text>
            </View>
        </View>
    );
};