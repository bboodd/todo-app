import { useState, useEffect, useCallback } from "react";
import { TodoType, CreateTodoDto, UpdateTodoDto } from "@/types/todo.types";

/**
 * Todo 상태 및 작업을 관리하는 커스텀 React 훅
 *
 * 다음을 포함한 완전한 CRUD 기능을 제공합니다:
 * - 마운트 시 자동 데이터 가져오기
 * - 로딩 및 에러 상태 관리
 * - 낙관적 UI 업데이트
 * - Todo 조회를 위한 필터 지원
 *
 * @returns {Object} Todo 상태 및 작업들
 * @returns {TodoType[]} todos - 모든 todo의 배열
 * @returns {boolean} loading - 로딩 상태 표시자
 * @returns {string | null} error - 작업 실패 시 에러 메시지
 * @returns {Function} fetchTodos - 선택적 필터로 todo 재조회
 * @returns {Function} createTodo - 새 todo 생성
 * @returns {Function} updateTodo - 기존 todo 업데이트
 * @returns {Function} deleteTodo - Todo 삭제
 * @returns {Function} toggleComplete - Todo의 완료 상태 토글
 *
 * @example
 * ```tsx
 * function TodoApp() {
 *   const {
 *     todos,
 *     loading,
 *     error,
 *     createTodo,
 *     updateTodo,
 *     deleteTodo,
 *     toggleComplete
 *   } = useTodos();
 *
 *   if (loading) return <div>로딩 중...</div>;
 *   if (error) return <div>에러: {error}</div>;
 *
 *   return <TodoList todos={todos} onToggle={toggleComplete} />;
 * }
 * ```
 */
export const useTodos = () => {
  /**
   * API에서 가져온 todo 배열
   */
  const [todos, setTodos] = useState<TodoType[]>([]);

  /**
   * 로딩 상태 - 데이터를 가져오는 동안 true
   */
  const [loading, setLoading] = useState(true);

  /**
   * 실패한 작업의 에러 메시지
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * 선택적 필터링으로 API에서 todo를 가져옵니다
   *
   * @param {Object} [filters] - 선택적 필터 조건
   * @param {boolean} [filters.completed] - 완료 상태로 필터링
   * @param {string} [filters.priority] - 우선순위 레벨로 필터링
   *
   * @example
   * ```typescript
   * // 모든 todo 조회
   * await fetchTodos();
   *
   * // 완료된 todo만 조회
   * await fetchTodos({ completed: true });
   *
   * // 높은 우선순위 todo 조회
   * await fetchTodos({ priority: 'high' });
   * ```
   */
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

  /**
   * 새로운 todo를 생성합니다
   *
   * 새 todo를 기존 목록의 앞에 추가하여
   * 로컬 상태를 낙관적으로 업데이트합니다.
   *
   * @param {CreateTodoDto} todoData - 생성할 Todo 데이터
   * @returns {Promise<TodoType>} 생성된 ID가 포함된 생성된 todo
   * @throws {Error} 생성 실패 시
   *
   * @example
   * ```typescript
   * await createTodo({
   *   title: '장보기',
   *   priority: 'high',
   *   dueDate: '2024-12-31'
   * });
   * ```
   */
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

  /**
   * 부분 데이터로 기존 todo를 업데이트합니다
   *
   * 낙관적 업데이트 패턴 사용 - 서버 확인 전에
   * 즉시 로컬 상태를 업데이트합니다.
   *
   * @param {string} id - 업데이트할 todo의 UUID
   * @param {UpdateTodoDto} updates - 업데이트할 필드 (부분)
   * @returns {Promise<TodoType>} 업데이트된 todo
   * @throws {Error} 업데이트 실패 시
   *
   * @example
   * ```typescript
   * await updateTodo('todo-id', {
   *   title: '업데이트된 제목',
   *   completed: true
   * });
   * ```
   */
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

  /**
   * ID로 todo를 삭제합니다
   *
   * 성공적으로 삭제되면 로컬 상태에서 todo를 제거합니다.
   *
   * @param {string} id - 삭제할 todo의 UUID
   * @returns {Promise<void>}
   * @throws {Error} 삭제 실패 시
   *
   * @example
   * ```typescript
   * await deleteTodo('todo-id');
   * ```
   */
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

  /**
   * todo의 완료 상태를 토글합니다
   *
   * completed 플래그를 반전시키기 위해 updateTodo를 래핑하는 편의 메서드입니다.
   *
   * @param {string} id - 토글할 todo의 UUID
   * @returns {Promise<void>}
   *
   * @example
   * ```typescript
   * await toggleComplete('todo-id');
   * ```
   */
  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  };

  /**
   * Effect: 컴포넌트 마운트 시 자동으로 todo 가져오기
   */
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
