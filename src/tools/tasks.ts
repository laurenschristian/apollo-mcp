import { z } from "zod";
import { apolloPost } from "../client.js";

export const searchTasksSchema = z.object({
  q_keywords: z.string().optional().describe("Search keywords"),
  sort_by_field: z.string().optional(),
  sort_ascending: z.boolean().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(25),
});

export async function searchTasks(args: z.infer<typeof searchTasksSchema>) {
  return apolloPost("/tasks/search", args);
}

export const createTaskSchema = z.object({
  type: z.string().optional().describe("Task type (e.g. 'action_item', 'call', 'email')"),
  priority: z.string().optional().describe("Priority (e.g. 'high', 'medium', 'low')"),
  due_at: z.string().optional().describe("Due date (ISO 8601)"),
  note: z.string().optional().describe("Task note/description"),
  contact_ids: z.array(z.string()).optional().describe("Associated contact IDs"),
  account_ids: z.array(z.string()).optional().describe("Associated account IDs"),
  user_id: z.string().optional().describe("Assigned user ID"),
});

export async function createTask(args: z.infer<typeof createTaskSchema>) {
  return apolloPost("/tasks", args);
}

export const bulkCreateTasksSchema = z.object({
  tasks: z.array(z.object({
    type: z.string().optional(),
    priority: z.string().optional(),
    due_at: z.string().optional(),
    note: z.string().optional(),
    contact_ids: z.array(z.string()).optional(),
    user_id: z.string().optional(),
  })).describe("Array of tasks to create"),
});

export async function bulkCreateTasks(args: z.infer<typeof bulkCreateTasksSchema>) {
  return apolloPost("/tasks/bulk_create", { tasks: args.tasks });
}
