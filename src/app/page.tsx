"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import TodoFilter from "@/components/todo/TodoFilter";

export default function Hone() {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    fetchTodos,
  } = useTodos();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;
    if (priorityFilter && todo.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Todo App</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Task
          </h2>
          <TodoForm onSubmit={createTodo} />
        </div>

        {/* Filter */}
        <TodoFilter
          currentFilter={filter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onPriorityChange={setPriorityFilter}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleComplete}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        )}

        {filteredTodos.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter !== "all"
                ? "Try changing the filter"
                : "Add your first task above!"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
