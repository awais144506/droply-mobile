// src/styles/daily-sales-styles.ts
import { StyleSheet } from "react-native";

export const dailySalesStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc", // slate-50
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },

  // --- Header Card ---
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a", // slate-900
    letterSpacing: -0.3,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b", // slate-500
    lineHeight: 17,
    fontWeight: "500",
  },
  dateSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  dateSelectorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },

  // --- Top 3 KPI Cards ---
  kpiStack: {
    gap: 12,
    marginBottom: 18,
  },
  kpiCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiLeft: {
    flex: 1,
    paddingRight: 12,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  kpiValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 8,
  },
  kpiValueMain: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  kpiValueUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  kpiSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  kpiSubText: {
    fontSize: 11,
    fontWeight: "700",
  },
  kpiIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  // KPI Color Variants
  textEmerald: { color: "#059669" }, // emerald-600
  bgEmeraldSoft: { backgroundColor: "#d1fae5" }, // emerald-100
  textSky: { color: "#0284c7" }, // sky-600
  bgSkySoft: { backgroundColor: "#e0f2fe" }, // sky-100
  textIndigo: { color: "#4f46e5" }, // indigo-600
  bgIndigoSoft: { backgroundColor: "#e0e7ff" }, // indigo-100

  // --- Section Container Card ---
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },

  // --- Order Category Breakdown Items ---
  categoryList: {
    gap: 10,
  },
  categoryItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  categoryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  categoryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTextGroup: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
  },
  categoryAmountText: {
    fontSize: 13,
    fontWeight: "800",
  },

  // --- Stock-Out & Low Inventory Alerts ---
  criticalCountBadge: {
    backgroundColor: "#fff1f2", // rose-50
    borderWidth: 1,
    borderColor: "#fecdd3", // rose-200
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  criticalCountBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#e11d48", // rose-600
  },
  alertDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 14,
    fontWeight: "500",
  },
  alertList: {
    gap: 10,
  },
  alertItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff1f2", // light rose tint
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ffe4e6", // rose-100
  },
  alertItemLeft: {
    flex: 1,
    paddingRight: 10,
  },
  alertItemTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 3,
  },
  alertItemCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  alertItemRight: {
    alignItems: "flex-end",
  },
  outOfStockPill: {
    backgroundColor: "#e11d48", // rose-600
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    marginBottom: 4,
  },
  outOfStockPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lowStockPill: {
    backgroundColor: "#fef3c7", // amber-100
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    marginBottom: 4,
  },
  lowStockPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400e", // amber-800
  },
  thresholdText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
  },
  emptyAlertCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  emptyAlertText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
});