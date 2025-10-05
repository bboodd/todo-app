import { useState, useEffect, useCallback } from "react";
import { TodoType, CreateTodoDto, UpdateTodoDto } from "@/types/todo.types";

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos
  const fetchTodos = useCallback(
    async (filters?: { completed?: boolean; priority?: string }) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters?.completed !== undefined) {
          params.append("completed", filters.completed.toString());
        }
        if (filters?.priority) {
          params.append("priority", filters.priority);
        }

        const response = await fetch(`/api/todos?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setTodos(data.data);
        } else {
          setError(data.error || "Failed to fetch todos");
        }
      } catch (err) {
        setError("An error occurred while fetching todos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create todo
  const createTodo = async (todoData: CreateTodoDto) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });

      const data = await response.json();

      if (data.success) {
        setTodos((prev) => [data.data, ...prev]);
        return data.data;
      } else {
        throw new Error(data.error || "Failed to create todo");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create todo";
      setError(message);
      throw err;
    }
  };

  // Update todo
  const updateTodo = async (id: string, updates: UpdateTodoDto) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? data.data : todo))
        );
        return data.data;
      } else {
        throw new Error(data.error || "Failed to update todo");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update todo";
      setError(message);
      throw err;
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        throw new Error(data.error || "Failed to delete todo");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete todo";
      setError(message);
      throw err;
    }
  };

  // Toggle complete
  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
};
