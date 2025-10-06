"use client";

import { TodoType, UpdateTodoDto } from "@/types/todo.types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: TodoType[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoDto) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
