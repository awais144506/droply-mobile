import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList } from "lucide-react-native";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useRole } from "@/lib/use-role";
import { useTasks, useUpdateTask } from "@/features/tasks/api/use-tasks";
import { mainTasksPageStyle as styles } from "@/features/tasks/style/task-styles";
import Loading from "../loading";
import Error from "../error";

export default function TasksScreen() {
  const { branchId } = useRole();
  const { data: tasks = [], isLoading, isError, refetch, isRefetching } = useTasks(branchId);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const pendingTasks = tasks.filter((t) => t.status === "INCOMPLETE");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const handleToggleTask = (taskId: string) => {
    if (isUpdating) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "INCOMPLETE" ? "COMPLETED" : "INCOMPLETE";
    updateTask({ id: taskId, payload: { status: newStatus } });
  };

  if (isLoading && !isRefetching) return <Loading text="Loading Tasks..." />
  if (isError) return <Error text="tasks" />

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconContainer}>
            <ClipboardList size={25} color="#0284c7" />
          </View>
          <Text style={styles.headerTitle}>My Tasks</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
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
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              To-Do : <Text style={styles.pendingCount}>({pendingTasks.length})</Text>
            </Text>
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {pendingTasks.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>All caught up!</Text>
            <Text style={styles.emptyStateSubtext}>No pending tasks for today.</Text>
          </View>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <View style={styles.completedSectionContainer}>
            <Text style={[styles.sectionTitle, styles.completedTitleMargin]}>
              Completed : <Text style={styles.completedCount}>({completedTasks.length})</Text>
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

