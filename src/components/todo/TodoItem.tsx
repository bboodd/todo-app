"use client";

import { useState } from "react";
import { TodoType, UpdateTodoDto } from "@/types/todo.types";

/**
 * TodoItem 컴포넌트의 Props
 */
interface TodoItemProps {
  /**
   * 표시할 Todo 데이터
   */
  todo: TodoType;

  /**
   * 완료 상태를 토글하는 콜백
   */
  onToggle: (id: string) => void;

  /**
   * todo 데이터를 업데이트하는 콜백
   */
  onUpdate: (id: string, updates: UpdateTodoDto) => Promise<any>;

  /**
   * todo를 삭제하는 콜백
   */
  onDelete: (id: string) => Promise<void>;
}

/**
 * TodoItem 컴포넌트
 *
 * 다음을 포함한 단일 todo 항목을 표시합니다:
 * - 시각적 피드백이 있는 완료 체크박스
 * - 인라인 편집 모드 (보기/편집 전환)
 * - 색상 코딩된 우선순위 배지
 * - 마감일 표시
 * - 편집 및 삭제 작업 버튼
 *
 * 기능:
 * - 인라인 편집: 편집 클릭 시 편집 모드 진입
 * - 취소 시 원래 값 복원
 * - 우선순위 기반 색상 코딩 (빨강/노랑/초록)
 * - 완료된 todo는 투명도 감소 및 취소선으로 표시
 * - 한국어 로케일 날짜 포맷팅
 *
 * @component
 * @param {TodoItemProps} props - 컴포넌트 props
 * @returns {JSX.Element} 렌더링된 todo 항목
 *
 * @example
 * ```tsx
 * <TodoItem
 *   todo={todoData}
 *   onToggle={(id) => toggleComplete(id)}
 *   onUpdate={(id, updates) => updateTodo(id, updates)}
 *   onDelete={(id) => deleteTodo(id)}
 * />
 * ```
 */
export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  /**
   * 편집 모드 상태 - 인라인 편집 모드일 때 true
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * 편집을 위한 임시 제목 상태
   */
  const [editTitle, setEditTitle] = useState(todo.title);

  /**
   * 편집을 위한 임시 설명 상태
   */
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );

  /**
   * 편집된 todo 데이터를 저장합니다
   *
   * 저장 전에 제목이 비어있지 않은지 검증합니다.
   * 성공적으로 저장되면 편집 모드를 종료합니다.
   */
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

  /**
   * 편집을 취소하고 원래 값을 복원합니다
   *
   * 편집 필드를 현재 todo 데이터로 재설정하고 편집 모드를 종료합니다.
   */
  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  /**
   * 우선순위 배지 스타일링을 위한 Tailwind CSS 클래스를 반환합니다
   *
   * @param {string} priority - 우선순위 레벨 (낮음/보통/높음)
   * @returns {string} Tailwind CSS 클래스 문자열
   */
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

  /**
   * 우선순위 레벨에 대한 이모지 아이콘을 반환합니다
   *
   * @param {string} priority - 우선순위 레벨 (낮음/보통/높음)
   * @returns {string} 이모지 문자
   */
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

  /**
   * 날짜를 한국어 로케일 문자열로 포맷합니다
   *
   * @param {Date | string} date - 포맷할 날짜
   * @returns {string} 포맷된 날짜 문자열 (예: "2024년 12월 31일")
   */
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
