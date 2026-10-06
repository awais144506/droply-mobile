import { StyleSheet } from "react-native";

export const mainTasksPageStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconContainer: {
    height: 36,
    width: 36,
    borderRadius: 12,
    backgroundColor: '#f0f9ff', // sky-50
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe', // sky-100
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', // slate-900
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  completedSectionContainer: {
    marginBottom: 24, // mb-6
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569', // slate-600
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  completedTitleMargin: {
    marginTop: 8,
  },
  pendingCount: {
    color: '#d97706', // amber-600
  },
  completedCount: {
    color: '#059669', // emerald-600
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginBottom: 16,
    backgroundColor: '#ecfdf5', // emerald-50
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: '#d1fae5', // emerald-100
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857', // emerald-700
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#059669', // emerald-600
    marginTop: 4,
  }
});

export const taskCardStyle = StyleSheet.create({
  cardBase: {
    padding: 16, // p-4
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    marginBottom: 12, // mb-3
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12, // gap-3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // shadow-sm
  },
  cardIncomplete: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0', // border-slate-200
  },
  cardCompleted: {
    backgroundColor: '#f8fafc', // bg-slate-50
    borderColor: '#e2e8f0',
    opacity: 0.7,
  },
  iconWrapper: {
    paddingTop: 2, // pt-0.5
  },
  contentWrapper: {
    flex: 1,
  },
  descriptionBase: {
    fontSize: 16, // text-base
    fontWeight: '700', // font-bold
    lineHeight: 22, // leading-snug
  },
  descriptionIncomplete: {
    color: '#1e293b', // text-slate-800
  },
  descriptionCompleted: {
    color: '#94a3b8', // text-slate-400
    textDecorationLine: 'line-through',
  },
  footer: {
    marginTop: 12, // mt-3
    paddingTop: 12, // pt-3
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9', // border-slate-100
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assignerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  assignerIconWrapperBase: {
    padding: 6, // p-1.5
    borderRadius: 8, // rounded-lg
  },
  assignerIconIncomplete: {
    backgroundColor: '#f0f9ff', // bg-sky-50
  },
  assignerIconCompleted: {
    backgroundColor: '#e2e8f0', // bg-slate-200
  },
  assignerTextBase: {
    fontSize: 12, // text-xs
    fontWeight: '700',
  },
  assignerTextIncomplete: {
    color: '#334155', // text-slate-700
  },
  assignerTextCompleted: {
    color: '#94a3b8', // text-slate-400
  },
  roleBadgeWrapper: {
    alignSelf: 'flex-start',
    padding: 2, // p-0.5
    borderRadius: 6, // rounded-md
    marginTop: 2, // mt-0.5
  },
  roleTextBase: {
    fontSize: 9, // text-[9px]
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-wider
  },
  roleTextCompleted: {
    color: '#94a3b8', // text-slate-400
  },
  roleTextOwner: {
    color: '#d97706', // text-amber-600
  },
  roleTextOther: {
    color: '#4f46e5', // text-indigo-600
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
  timeTextDone: {
    fontSize: 10, // text-[10px]
    fontWeight: '700',
    color: '#059669', // text-emerald-600
  },
  timeTextPending: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8', // text-slate-400
  }
});