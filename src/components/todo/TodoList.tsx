"use client";

import { TodoType, UpdateTodoDto } from "@/types/todo.types";
import TodoItem from "./TodoItem";

/**
 * TodoList 컴포넌트의 Props
 */
interface TodoListProps {
  /**
   * 표시할 todo 배열
   */
  todos: TodoType[];

  /**
   * todo 완료 상태를 토글하는 콜백
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
 * TodoList 컴포넌트
 *
 * TodoItem 컴포넌트 목록을 렌더링하는 컨테이너 컴포넌트입니다.
 * todos 배열을 매핑하고 모든 작업을 자식 TodoItem에 위임합니다.
 *
 * 기능:
 * - 항목 간 수직 간격 (space-y-3)
 * - 모든 이벤트 핸들러를 TodoItem 자식에 전달
 * - 최적 렌더링을 위해 todo.id를 React key로 사용
 *
 * @component
 * @param {TodoListProps} props - 컴포넌트 props
 * @returns {JSX.Element} 렌더링된 todo 목록
 *
 * @example
 * ```tsx
 * <TodoList
 *   todos={filteredTodos}
 *   onToggle={toggleComplete}
 *   onUpdate={updateTodo}
 *   onDelete={deleteTodo}
 * />
 * ```
 */
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
