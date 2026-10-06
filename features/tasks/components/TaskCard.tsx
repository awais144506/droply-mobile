import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  CheckCircle2,
  Circle,
  Clock,
  CheckCheck,
  User
} from "lucide-react-native";
import { Task } from "@/features/tasks/types/task";
import { taskCardStyle as styles } from "../style/task-styles";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
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
      style={[
        styles.cardBase,
        isCompleted ? styles.cardCompleted : styles.cardIncomplete
      ]}
    >
      <View style={styles.iconWrapper}>
        {isCompleted ? (
          <CheckCircle2 size={24} color="#10b981" />
        ) : (
          <Circle size={24} color="#cbd5e1" />
        )}
      </View>

      <View style={styles.contentWrapper}>
        <Text
          style={[
            styles.descriptionBase,
            isCompleted ? styles.descriptionCompleted : styles.descriptionIncomplete
          ]}
        >
          {task.description}
        </Text>

        {/* Footer Meta & Timestamps */}
        <View style={styles.footer}>

          {/* Assigner block */}
          <View style={styles.assignerBlock}>
            <View
              style={[
                styles.assignerIconWrapperBase,
                isCompleted ? styles.assignerIconCompleted : styles.assignerIconIncomplete
              ]}
            >
              <User size={14} color={isCompleted ? "#94a3b8" : "#0284c7"} />
            </View>

            <View>
              <Text
                style={[
                  styles.assignerTextBase,
                  isCompleted ? styles.assignerTextCompleted : styles.assignerTextIncomplete
                ]}
                numberOfLines={1}
              >
                By: {task.assignedByName}
              </Text>

              {/* Role Badge */}
              <View style={styles.roleBadgeWrapper}>
                <Text
                  style={[
                    styles.roleTextBase,
                    isCompleted
                      ? styles.roleTextCompleted
                      : task.assignedByRole === "OWNER"
                        ? styles.roleTextOwner
                        : styles.roleTextOther
                  ]}
                >
                  {task.assignedByRole}
                </Text>
              </View>
            </View>
          </View>

          {/* Timestamp Tracker */}
          <View style={styles.timeBlock}>
            {isCompleted && task.completedAt ? (
              <>
                <CheckCheck size={14} color="#10b981" />
                <Text style={styles.timeTextDone}>
                  Done {formatTime(task.completedAt)}
                </Text>
              </>
            ) : (
              <>
                <Clock size={14} color="#94a3b8" />
                <Text style={styles.timeTextPending}>
                  {formatTime(task.createdAt)}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

