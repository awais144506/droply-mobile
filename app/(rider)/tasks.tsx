import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList } from "lucide-react-native";
import TaskCard from "@/components/tasks/TaskCard";
import { useRole } from "@/lib/use-role";
import { useTasks, useUpdateTask } from "@/features/tasks/api/use-tasks";

export default function TasksScreen() {
  const { branchId } = useRole();

  // 1. Fetch data from React Query
  const { data: tasks = [], isLoading, isError, refetch, isRefetching } = useTasks(branchId);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const pendingTasks = tasks.filter((t) => t.status === "INCOMPLETE");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  // 4. Handle Toggle via API Mutation
  const handleToggleTask = (taskId: string) => {
    if (isUpdating) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "INCOMPLETE" ? "COMPLETED" : "INCOMPLETE";
    updateTask({ id: taskId, payload: { status: newStatus } });
  };

  // Loading State
  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="mt-4 text-slate-500 font-medium">Loading tasks...</Text>
      </SafeAreaView>
    );
  }

  // Error State
  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center px-4">
        <Text className="text-rose-500 font-bold text-lg mb-2">Connection Error</Text>
        <Text className="text-slate-500 text-center mb-4">Could not load tasks. Please check your internet connection.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
            <ClipboardList size={25} color="#0284c7" />
          </View>
          <Text className="text-lg font-bold text-slate-900">My Tasks</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#0284c7"]}
            tintColor="#0284c7"
          />
        }
      >
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <View className="mb-4">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              To-Do ({pendingTasks.length})
            </Text>
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {pendingTasks.length === 0 && (
          <View className="items-center justify-center py-8 mb-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Text className="text-sm font-bold text-emerald-700">All caught up!</Text>
            <Text className="text-xs text-emerald-600 mt-1">No pending tasks for today.</Text>
          </View>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <View className="mb-6">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">
              Completed ({completedTasks.length})
            </Text>
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}