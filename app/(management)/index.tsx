import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Calendar,
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
import { dailySalesStyles as styles } from "@/features/management/main/style/daily-sales-styles";

// Mock/Initial Data matching your web screenshot (ready to wire to your React Query hook)
const DAILY_SUMMARY_DATA = {
  selectedDate: "16/10/2026",
  totalCashInflow: 45650,
  totalOrdersHandled: 42,
  netStockOut: 75,
  stockSentOut: 240,
  stockReturned: 165,
  categories: [
    {
      id: "walk-in",
      title: "WALK-IN COUNTER",
      subtitle: "18 orders registered",
      amount: 19500,
      isNegative: false,
      iconBg: "#dcfce7", // emerald-100
      iconColor: "#059669", // emerald-600
      amountColor: "#0f172a", // slate-900
      type: "WALK_IN",
    },
    {
      id: "deliveries",
      title: "DELIVERIES",
      subtitle: "15 orders completed",
      amount: 23500,
      isNegative: false,
      iconBg: "#e0f2fe", // sky-100
      iconColor: "#0284c7", // sky-600
      amountColor: "#0f172a",
      type: "DELIVERY",
    },
    {
      id: "returns",
      title: "SALE RETURNS (DEFECTIVE)",
      subtitle: "4 returns processed (6 items)",
      amount: 2500,
      isNegative: true,
      iconBg: "#ffe4e6", // rose-100
      iconColor: "#e11d48", // rose-600
      amountColor: "#e11d48",
      type: "RETURN",
    },
    {
      id: "recovery",
      title: "RECOVERY (LEDGER / ASSETS)",
      subtitle: "5 recovery logs settled",
      amount: 2000,
      isNegative: false,
      iconBg: "#e0e7ff", // indigo-100
      iconColor: "#4f46e5", // indigo-600
      amountColor: "#4f46e5",
      type: "RECOVERY",
    },
    {
      id: "quick-sales",
      title: "QUICK SALES (POS UNREGISTERED)",
      subtitle: "12 walk-up sales",
      amount: 650,
      isNegative: false,
      iconBg: "#fef3c7", // amber-100
      iconColor: "#d97706", // amber-600
      amountColor: "#d97706",
      type: "QUICK_SALE",
    },
  ],
  inventoryAlerts: [
    {
      id: "alert-1",
      name: "19L Mineral Water Bottle",
      category: "FINISHED GOOD",
      remaining: 0,
      threshold: 15,
    },
    {
      id: "alert-2",
      name: "Disposable Cup Sleeves (Pack of 100)",
      category: "PACKAGING",
      remaining: 2,
      threshold: 10,
    },
    {
      id: "alert-3",
      name: "Chilled 500ml Bottles",
      category: "TRADE",
      remaining: 0,
      threshold: 30,
    },
  ],
};

export default function ManagementHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
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

  return (
   <SafeAreaView style={styles.safeArea}>
     <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0284c7"
          />
        }
      >
        {/* 1. Page Header & Date Selector */}
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Daily Operations & Summary</Text>

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.dateSelectorButton}
            >
              <Calendar size={14} color="#64748b" strokeWidth={2.2} />
              <Text style={styles.dateSelectorText}>
                {DAILY_SUMMARY_DATA.selectedDate}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerSubtitle}>
            High-level financial totals, category order counts, and active
            stock-out telemetry for the day.
          </Text>
        </View>

        {/* 2. Top 3 KPI Summary Cards */}
        <View style={styles.kpiStack}>
          {/* KPI 1: Total Cash Inflow */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiLeft}>
              <Text style={styles.kpiLabel}>TOTAL CASH INFLOW</Text>
              <View style={styles.kpiValueRow}>
                <Text style={[styles.kpiValueMain, styles.textEmerald]}>
                  Rs. {DAILY_SUMMARY_DATA.totalCashInflow.toLocaleString()}
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
                  {DAILY_SUMMARY_DATA.totalOrdersHandled}
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
                  {DAILY_SUMMARY_DATA.netStockOut}
                </Text>
                <Text style={styles.kpiValueUnit}>units</Text>
              </View>
              <View style={styles.kpiSubRow}>
                <Package size={13} color="#4f46e5" strokeWidth={2.5} />
                <Text style={[styles.kpiSubText, styles.textIndigo]}>
                  {DAILY_SUMMARY_DATA.stockSentOut} sent out vs{" "}
                  {DAILY_SUMMARY_DATA.stockReturned} returned
                </Text>
              </View>
            </View>

            <View style={[styles.kpiIconBox, styles.bgIndigoSoft]}>
              <Truck size={22} color="#4f46e5" strokeWidth={2.4} />
            </View>
          </View>
        </View>

        {/* 3. Order Category Breakdown Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <Layers size={18} color="#4f46e5" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Order Category Breakdown</Text>
            </View>
          </View>

          <View style={styles.categoryList}>
            {DAILY_SUMMARY_DATA.categories.map((cat) => (
              <View key={cat.id} style={styles.categoryItemCard}>
                <View style={styles.categoryItemLeft}>
                  <View
                    style={[
                      styles.categoryIconBox,
                      { backgroundColor: cat.iconBg },
                    ]}
                  >
                    {renderCategoryIcon(cat.type, cat.iconColor)}
                  </View>

                  <View style={styles.categoryTextGroup}>
                    <Text style={styles.categoryTitle}>{cat.title}</Text>
                    <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.categoryAmountText,
                    { color: cat.amountColor },
                  ]}
                >
                  {cat.isNegative ? "-Rs. " : "Rs. "}
                  {cat.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Stock-Out & Low Inventory Alerts Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <AlertTriangle size={18} color="#e11d48" strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>
                Stock-Out & Low Inventory Alerts
              </Text>
            </View>

            <View style={styles.criticalCountBadge}>
              <Text style={styles.criticalCountBadgeText}>
                {DAILY_SUMMARY_DATA.inventoryAlerts.length} Critical Items
              </Text>
            </View>
          </View>

          <Text style={styles.alertDescription}>
            The following items have reached zero stock or fallen below their
            safety threshold due to today&apos;s dispatch volume:
          </Text>

          <View style={styles.alertList}>
            {DAILY_SUMMARY_DATA.inventoryAlerts.map((item) => {
              const isOutOfStock = item.remaining <= 0;

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
        </View>
      </ScrollView>
    </View>
   </SafeAreaView>
  );
}