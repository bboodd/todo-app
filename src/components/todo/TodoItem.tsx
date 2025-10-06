"use client";

import { useState } from "react";
import { TodoType, UpdateTodoDto } from "@/types/todo.types";

interface TodoItemProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoDto) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-400">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={2}
          placeholder="Description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className="mt-1 flex-shrink-0"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              todo.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            {todo.completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`text-lg font-semibold text-gray-800 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                todo.priority
              )} flex-shrink-0`}
            >
              {getPriorityIcon(todo.priority)} {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p
              className={`text-gray-600 text-sm mb-2 ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>📅 Created: {formatDate(todo.createdAt)}</span>
            {todo.dueDate && (
              <span className="text-orange-600 font-medium">
                ⏰ Due: {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
