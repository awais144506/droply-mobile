import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Lock, MapPin } from 'lucide-react-native';
import { assignedZonesStyles as styles } from '../style/profile-styles';

type Props = {
    isZonesLoading: boolean;
    assignedZones: {
        id: string;
        name: string;
        totalCustomers: number;
    }[];
};

export const AssignedZones = ({ isZonesLoading, assignedZones }: Props) => {
    return (
        <View>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>
                        Assigned Zones
                    </Text>
                    <View style={styles.badge}>
                        <Lock size={12} color="#94a3b8" />
                        <Text style={styles.badgeText}>
                            Managed By Branch
                        </Text>
                    </View>
                </View>

                <View>
                    {isZonesLoading ? (
                        <ActivityIndicator size="small" color="#4f46e5" style={styles.loader} />
                    ) : assignedZones.length > 0 ? (
                        assignedZones.map((zone, index) => (
                            <View
                                key={zone.id}
                                style={index > 0 ? styles.zoneItemBordered : null}
                            >
                                <View style={styles.zoneRow}>
                                    <View style={styles.zoneLeft}>
                                        <View style={styles.iconContainer}>
                                            <MapPin size={15} color="#4f46e5" />
                                        </View>
                                        <Text style={styles.zoneName}>
                                            {zone.name}
                                        </Text>
                                    </View>
                                    <Text style={styles.customerCountText}>
                                        Total Customers: <Text style={styles.customerCountHighlight}>{zone.totalCustomers}</Text>
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>
                            No route sectors currently assigned.
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};
