"use client";

import { Todo } from "@/lib/db/entities/Todo";

/**
 * TodoFilter 컴포넌트의 Props
 */
interface TodoFilterProps {
  /**
   * 현재 활성화된 필터 (all/active/completed)
   */
  currentFilter: "all" | "active" | "completed";

  /**
   * 현재 선택된 우선순위 필터 (모두 표시는 빈 문자열)
   */
  priorityFilter: string;

  /**
   * 상태 필터 변경 시 콜백
   */
  onFilterChange: (filter: "all" | "active" | "completed") => void;

  /**
   * 우선순위 필터 변경 시 콜백
   */
  onPriorityChange: (priority: string) => void;
}

/**
 * TodoFilter 컴포넌트
 *
 * 두 가지 필터 유형으로 todo 필터링 UI를 제공합니다:
 * 1. 상태 필터 - 전체 / 활성 / 완료 (버튼 그룹)
 * 2. 우선순위 필터 - 전체 / 낮음 / 보통 / 높음 (드롭다운)
 *
 * 기능:
 * - 활성 필터의 시각적 표시 (파란색 배경)
 * - 반응형 레이아웃 (모바일에서는 세로, 데스크톱에서는 가로)
 * - 우선순위 레벨을 위한 이모지 아이콘
 *
 * @component
 * @param {TodoFilterProps} props - 컴포넌트 props
 * @returns {JSX.Element} 렌더링된 필터 컨트롤
 *
 * @example
 * ```tsx
 * <TodoFilter
 *   currentFilter={filter}
 *   priorityFilter={priorityFilter}
 *   onFilterChange={setFilter}
 *   onPriorityChange={setPriorityFilter}
 * />
 * ```
 */
export default function TodoFilter({
  currentFilter,
  priorityFilter,
  onFilterChange,
  onPriorityChange,
}: TodoFilterProps) {
  /**
   * 사용 가능한 상태 필터 옵션
   */
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
