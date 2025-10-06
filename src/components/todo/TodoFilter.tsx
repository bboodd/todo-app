"use client";

import { Todo } from "@/lib/db/entities/Todo";

interface TodoFilterProps {
  currentFilter: "all" | "active" | "completed";
  priorityFilter: string;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onPriorityChange: (priority: string) => void;
}

export default function TodoFilter({
  currentFilter,
  priorityFilter,
  onFilterChange,
  onPriorityChange,
}: TodoFilterProps) {
  const filters: Array<{
    value: "all" | "active" | "completed";
    label: string;
  }> = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Status Filter */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
