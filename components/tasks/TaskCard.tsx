import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { 
  Wrench, 
  PackagePlus, 
  Banknote, 
  ClipboardList, 
  CheckCircle2, 
  Circle,
  Clock,
  CheckCheck
} from "lucide-react-native";
import { Task } from "@/types/tasks";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";

  const getCategoryConfig = () => {
    switch (task.category) {
      case "MAINTENANCE":
        return { Icon: Wrench, bg: "bg-amber-100", color: "#d97706" };
      case "SUPPLY":
        return { Icon: PackagePlus, bg: "bg-sky-100", color: "#0284c7" };
      case "FINANCE":
        return { Icon: Banknote, bg: "bg-emerald-100", color: "#16a34a" };
      default:
        return { Icon: ClipboardList, bg: "bg-slate-100", color: "#475569" };
    }
  };

  const { Icon, bg, color } = getCategoryConfig();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(task.id)}
      className={`p-3.5 rounded-2xl border mb-3 flex-row items-start gap-3 ${
        isCompleted
          ? "bg-slate-50 border-slate-200 opacity-80"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <View className="pt-0.5">
        {isCompleted ? (
          <CheckCircle2 size={24} color="#10b981" />
        ) : (
          <Circle size={24} color="#cbd5e1" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className={`text-sm font-bold flex-1 pr-2 ${
              isCompleted ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {task.title}
          </Text>
          {task.priority === "HIGH" && !isCompleted && (
            <View className="bg-rose-100 px-2 py-0.5 rounded-md">
              <Text className="text-[9px] font-bold text-rose-700">URGENT</Text>
            </View>
          )}
        </View>

        <Text
          className={`text-xs mt-1 leading-relaxed ${
            isCompleted ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {task.description}
        </Text>

        {/* Footer Meta & Timestamps */}
        <View className="mt-3 pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className={`p-1 rounded-md ${isCompleted ? "bg-slate-200" : bg}`}>
              <Icon size={12} color={isCompleted ? "#94a3b8" : color} />
            </View>
            <Text
              className={`text-[10px] font-semibold tracking-wide uppercase ${
                isCompleted ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {task.category}
            </Text>
          </View>

          {/* Timestamp Tracker */}
          <View className="flex-row items-center gap-1">
            {isCompleted && task.completedAt ? (
              <>
                <CheckCheck size={12} color="#10b981" />
                <Text className="text-[10px] font-medium text-emerald-600">
                  Done {task.completedAt}
                </Text>
              </>
            ) : (
              <>
                <Clock size={12} color="#94a3b8" />
                <Text className="text-[10px] font-medium text-slate-400">
                  Assigned {task.assignedAt}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}