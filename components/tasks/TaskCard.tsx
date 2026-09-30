import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  CheckCircle2,
  Circle,
  Clock,
  CheckCheck,
  User
} from "lucide-react-native";
// eslint-disable-next-line import/no-unresolved
import { Task } from "@/features/tasks/types/task";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export default function TaskCard({ task, onToggle }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(task.id)}
      className={`p-4 rounded-2xl border mb-3 flex-row items-start gap-3 shadow-sm ${isCompleted
          ? "bg-slate-50 border-slate-200 opacity-70"
          : "bg-white border-slate-200"
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
        {/* 🔥 Removed the generic title so the actual description is the focal point */}
        <Text
          className={`text-base font-bold leading-snug ${isCompleted ? "text-slate-400 line-through" : "text-slate-800"
            }`}
        >
          {task.description}
        </Text>

        {/* Footer Meta & Timestamps */}
        <View className="mt-3 pt-3 border-t border-slate-100 flex-row items-center justify-between">

          {/* 🔥 Restructured Assigner block for better visibility */}
          <View className="flex-row items-center gap-2">
            <View className={`p-1.5 rounded-lg ${isCompleted ? "bg-slate-200" : "bg-sky-50"}`}>
              <User size={14} color={isCompleted ? "#94a3b8" : "#0284c7"} />
            </View>
            <View>
              <Text
                className={`text-xs font-bold ${isCompleted ? "text-slate-400" : "text-slate-700"
                  }`}
                numberOfLines={1}
              >
                {task.assignedByName}
              </Text>

              {/* Extracted the role into a proper visual badge */}
              <View
                className={`self-start px-1.5 py-0.5 rounded-md mt-0.5 ${isCompleted
                    ? "bg-slate-200"
                    : task.assignedByRole === "OWNER"
                      ? "bg-amber-100"
                      : "bg-indigo-100"
                  }`}
              >
                <Text
                  className={`text-[9px] font-black uppercase tracking-wider ${isCompleted
                      ? "text-slate-400"
                      : task.assignedByRole === "OWNER"
                        ? "text-amber-700"
                        : "text-indigo-700"
                    }`}
                >
                  {task.assignedByRole}
                </Text>
              </View>
            </View>
          </View>

          {/* Timestamp Tracker */}
          <View className="flex-row items-center gap-1">
            {isCompleted && task.completedAt ? (
              <>
                <CheckCheck size={14} color="#10b981" />
                <Text className="text-[10px] font-bold text-emerald-600">
                  Done {formatTime(task.completedAt)}
                </Text>
              </>
            ) : (
              <>
                <Clock size={14} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-400">
                  {formatTime(task.createdAt)}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}