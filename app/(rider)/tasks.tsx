import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList } from "lucide-react-native";
import { Task } from "@/types/tasks";
import TaskCard from "@/components/tasks/TaskCard";

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Change Bike Engine Oil",
    description: "Mileage hit 2000km. Stop by Honda center on High Street to get 10w-40 oil changed.",
    priority: "HIGH",
    status: "PENDING",
    category: "MAINTENANCE",
    assignedAt: "Today, 08:30 AM",
  },
  {
    id: "t2",
    title: "Pick up new filter caps",
    description: "Purchase 500 new blue bottle caps from the wholesale market.",
    priority: "NORMAL",
    status: "PENDING",
    category: "SUPPLY",
    assignedAt: "Today, 09:15 AM",
  },
  {
    id: "t3",
    title: "Collect cash from Al-Madina Sweets",
    description: "Collect pending balance of Rs. 4,500 from last week's deliveries.",
    priority: "NORMAL",
    status: "COMPLETED",
    category: "FINANCE",
    assignedAt: "Yesterday, 11:00 AM",
    completedAt: "Today, 10:30 AM",
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const handleToggleTask = (taskId: string) => {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const willBeCompleted = task.status === "PENDING";
          return {
            ...task,
            status: willBeCompleted ? "COMPLETED" : "PENDING",
            completedAt: willBeCompleted ? `Today, ${currentTime}` : undefined,
          };
        }
        return task;
      })
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
            <ClipboardList size={25} color="#0284c7" />
          </View>
      
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
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

        {pendingTasks.length === 0 && (
          <View className="items-center justify-center py-8 mb-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Text className="text-sm font-bold text-emerald-700">All caught up!</Text>
            <Text className="text-xs text-emerald-600 mt-1">No pending tasks for today.</Text>
          </View>
        )}

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