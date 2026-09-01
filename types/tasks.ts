export type TaskPriority = "HIGH" | "NORMAL";
export type TaskStatus = "PENDING" | "COMPLETED";
export type TaskCategory = "MAINTENANCE" | "SUPPLY" | "FINANCE" | "OTHER";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  assignedAt: string;     // e.g. "Aug 31, 09:00 AM"
  completedAt?: string;   // e.g. "Sep 01, 02:15 PM"
}