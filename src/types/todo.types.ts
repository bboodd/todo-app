export interface TodoType {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date | string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: Date | string;
}

export type TodoFilter = {
  completed?: boolean;
  priority?: "low" | "medium" | "high";
};
