import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Layers,
  Truck,
  Package,
  Store,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react-native";
import { useRole } from "@/lib/use-role";
import { useDailySalesSummary } from "@/features/management/main/api/use-sales";
import { dailySalesStyles as styles } from "@/features/management/main/style/daily-sales-styles";
import { DateFilterBar, DateFilterType } from "@/components/ui/DateFilterBar";

export default function ManagementHomeScreen() {
  const { branchId } = useRole();

  // Date filter state
  const [activeFilter, setActiveFilter] = useState<DateFilterType>("today");
  const [customDate, setCustomDate] = useState<Date>(new Date());

  // Helper to format date to YYYY-MM-DD string for backend
  const getDateString = () => {
    if (activeFilter === "today") {
      return new Date().toISOString().split("T")[0];
    }
    if (activeFilter === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    // Custom date selected
    return customDate.toISOString().split("T")[0];
  };

  const { data, isLoading, refetch, isRefetching } = useDailySalesSummary(
    branchId,
    {
      date: getDateString(),
    }
  );

  const handleFilterChange = (filter: DateFilterType, date?: Date) => {
    setActiveFilter(filter);
    if (filter === "custom" && date) {
      setCustomDate(date);
    }
  };

  const renderCategoryIcon = (type: string, color: string) => {
    switch (type) {
      case "WALK_IN":
        return <Store size={18} color={color} strokeWidth={2.3} />;
      case "DELIVERY":
        return <Truck size={18} color={color} strokeWidth={2.3} />;
      case "RETURN":
        return <RefreshCw size={18} color={color} strokeWidth={2.3} />;
      case "RECOVERY":
        return <ShieldCheck size={18} color={color} strokeWidth={2.3} />;
      case "QUICK_SALE":
      default:
        return <ShoppingBag size={18} color={color} strokeWidth={2.3} />;
    }
  };

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>Loading daily operations...</Text>
      </View>
    );
  }

  const kpis = data?.kpis || {
    totalCashInflow: 0,
    totalOrdersHandled: 0,
    netStockOut: 0,
    stockSentOut: 0,
    stockReturned: 0,
  };

  const categories = data?.categories || [];
  const alerts = data?.alerts || { criticalCount: 0, items: [] };

  return (
    <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#0284c7"
            />
          }
        >
          {/* 1. Page Header */}
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Daily Sales Summary</Text>
          </View>

          {/* 2. Interactive Date Filter Bar */}
          <DateFilterBar
            activeFilter={activeFilter}
            customDate={customDate}
            onFilterChange={handleFilterChange}
            hideTomorrow={true}
          />

          {/* 3. Top 3 KPI Summary Cards */}
          <View style={styles.kpiStack}>
            {/* KPI 1: Total Cash Inflow */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiLeft}>
                <Text style={styles.kpiLabel}>TOTAL CASH INFLOW</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={[styles.kpiValueMain, styles.textEmerald]}>
                    Rs. {kpis.totalCashInflow.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.kpiSubRow}>
                  <TrendingUp size={13} color="#059669" strokeWidth={2.5} />
                  <Text style={[styles.kpiSubText, styles.textEmerald]}>
                    Collected across all channels
                  </Text>
                </View>
              </View>

              <View style={[styles.kpiIconBox, styles.bgEmeraldSoft]}>
                <DollarSign size={22} color="#059669" strokeWidth={2.5} />
              </View>
            </View>

            {/* KPI 2: Total Orders Handled */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiLeft}>
                <Text style={styles.kpiLabel}>TOTAL ORDERS HANDLED</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={[styles.kpiValueMain, styles.textSky]}>
                    {kpis.totalOrdersHandled}
                  </Text>
                  <Text style={styles.kpiValueUnit}>ops</Text>
                </View>
                <View style={styles.kpiSubRow}>
                  <Layers size={13} color="#0284c7" strokeWidth={2.5} />
                  <Text style={[styles.kpiSubText, styles.textSky]}>
                    Walk-ins, Deliveries & Returns
                  </Text>
                </View>
              </View>

              <View style={[styles.kpiIconBox, styles.bgSkySoft]}>
                <ShoppingBag size={22} color="#0284c7" strokeWidth={2.4} />
              </View>
            </View>

            {/* KPI 3: Net Stock Out (Volume) */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiLeft}>
                <Text style={styles.kpiLabel}>NET STOCK OUT (VOLUME)</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={[styles.kpiValueMain, styles.textIndigo]}>
                    {kpis.netStockOut}
                  </Text>
                  <Text style={styles.kpiValueUnit}>units</Text>
                </View>
                <View style={styles.kpiSubRow}>
                  <Package size={13} color="#4f46e5" strokeWidth={2.5} />
                  <Text style={[styles.kpiSubText, styles.textIndigo]}>
                    {kpis.stockSentOut} sent out vs {kpis.stockReturned} returned
                  </Text>
                </View>
              </View>

              <View style={[styles.kpiIconBox, styles.bgIndigoSoft]}>
                <Truck size={22} color="#4f46e5" strokeWidth={2.4} />
              </View>
            </View>
          </View>

          {/* 4. Order Category Breakdown Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <Layers size={18} color="#4f46e5" strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Order Category</Text>
              </View>
            </View>

            <View style={styles.categoryList}>
              {categories.map((cat) => {
                const isReturn = cat.type === "RETURN";
                const iconBg = isReturn
                  ? "#ffe4e6"
                  : cat.type === "WALK_IN"
                    ? "#dcfce7"
                    : cat.type === "DELIVERY"
                      ? "#e0f2fe"
                      : cat.type === "RECOVERY"
                        ? "#e0e7ff"
                        : "#fef3c7";

                const iconColor = isReturn
                  ? "#e11d48"
                  : cat.type === "WALK_IN"
                    ? "#059669"
                    : cat.type === "DELIVERY"
                      ? "#0284c7"
                      : cat.type === "RECOVERY"
                        ? "#4f46e5"
                        : "#d97706";

                const amountColor = isReturn ? "#e11d48" : "#0f172a";

                return (
                  <View key={cat.id} style={styles.categoryItemCard}>
                    <View style={styles.categoryItemLeft}>
                      <View
                        style={[
                          styles.categoryIconBox,
                          { backgroundColor: iconBg },
                        ]}
                      >
                        {renderCategoryIcon(cat.type, iconColor)}
                      </View>

                      <View style={styles.categoryTextGroup}>
                        <Text style={styles.categoryTitle}>{cat.title}</Text>
                        <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.categoryAmountText,
                        { color: amountColor },
                      ]}
                    >
                      {cat.isNegative ? "-Rs. " : "Rs. "}
                      {cat.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 5. Stock-Out & Low Inventory Alerts Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <AlertTriangle size={18} color="#e11d48" strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>
                  Low Stock Alerts
                </Text>
              </View>

              <View style={styles.criticalCountBadge}>
                <Text style={styles.criticalCountBadgeText}>
                  {alerts.criticalCount} Items
                </Text>
              </View>
            </View>

            {alerts.items.length === 0 ? (
              <View style={styles.emptyAlertCard}>
                <Text style={styles.emptyAlertText}>
                  All branch inventory levels are healthy! 🎉
                </Text>
              </View>
            ) : (
              <View style={styles.alertList}>
                {alerts.items.map((item) => {
                  const isOutOfStock = item.status === "OUT_OF_STOCK";

                  return (
                    <View key={item.id} style={styles.alertItemCard}>
                      <View style={styles.alertItemLeft}>
                        <Text style={styles.alertItemTitle}>{item.name}</Text>
                        <Text style={styles.alertItemCategory}>
                          {item.category}
                        </Text>
                      </View>

                      <View style={styles.alertItemRight}>
                        {isOutOfStock ? (
                          <View style={styles.outOfStockPill}>
                            <Text style={styles.outOfStockPillText}>
                              OUT OF STOCK
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.lowStockPill}>
                            <Text style={styles.lowStockPillText}>
                              {item.remaining} left
                            </Text>
                          </View>
                        )}

                        <Text style={styles.thresholdText}>
                          Threshold: {item.threshold}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}