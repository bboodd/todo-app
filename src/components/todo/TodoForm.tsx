"use client";

import { useState, FormEvent } from "react";
import { CreateTodoDto } from "@/types/todo.types";

/**
 * TodoForm 컴포넌트의 Props
 */
interface TodoFormProps {
  /**
   * todo 생성을 처리하는 콜백 함수
   * 유효한 데이터로 폼이 제출될 때 호출됨
   */
  onSubmit: (todo: CreateTodoDto) => Promise<any>;
}

/**
 * TodoForm 컴포넌트
 *
 * 다음 필드로 새 todo 항목을 생성하는 폼:
 * - 제목 (필수)
 * - 설명 (선택)
 * - 우선순위 레벨 (낮음/보통/높음)
 * - 마감일 (선택)
 *
 * 기능:
 * - 성공적으로 제출 후 폼 자동 초기화
 * - 제출 중 입력 비활성화
 * - 제목이 비어있지 않은지 검증
 * - 우선순위/날짜 필드를 위한 그리드 반응형 레이아웃
 *
 * @component
 * @param {TodoFormProps} props - 컴포넌트 props
 * @returns {JSX.Element} 렌더링된 폼 컴포넌트
 *
 * @example
 * ```tsx
 * <TodoForm onSubmit={async (data) => {
 *   await createTodo(data);
 * }} />
 * ```
 */
export default function TodoForm({ onSubmit }: TodoFormProps) {
  /**
   * 제목 입력 상태
   */
  const [title, setTitle] = useState("");

  /**
   * 설명 입력 상태
   */
  const [description, setDescription] = useState("");

  /**
   * 우선순위 레벨 상태 (기본값 "medium")
   */
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  /**
   * 마감일 입력 상태 (ISO 날짜 문자열)
   */
  const [dueDate, setDueDate] = useState("");

  /**
   * 제출 상태 - 폼 제출 중일 때 true
   */
  const [submitting, setSubmitting] = useState(false);

  /**
   * 폼 제출을 처리합니다
   *
   * 제목을 검증하고, onSubmit 콜백을 호출하며, 성공 시 폼을 초기화합니다.
   * 제목이 비어있거나 이미 제출 중이면 제출을 방지합니다.
   *
   * @param {FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={submitting}
        />
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description (optional)"
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          disabled={submitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={submitting}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={submitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Adding..." : "+ Add Task"}
      </button>
    </form>
  );
}
