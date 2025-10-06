import { Repository, FindOptionsWhere } from "typeorm";
import { Todo } from "../db/entities/Todo";
import { AppDataSource, initializeDatabase } from "../db/data-source";

/**
 * Todo CRUD 작업을 위한 서비스 클래스
 *
 * 지연 데이터베이스 초기화를 사용한 싱글톤 패턴을 구현합니다.
 * 다음을 포함한 todo 항목 관리 메서드를 제공합니다:
 * - 선택적 필터링을 통한 todo 조회
 * - 새 todo 생성
 * - 기존 todo 업데이트
 * - Todo 삭제
 * - 완료 상태 토글
 *
 * @class
 */
export class TodoService {
  /**
   * Todo 엔티티를 위한 TypeORM 리포지토리
   * 첫 사용 시 지연 초기화됨
   */
  private todoRepository: Repository<Todo>;

  /**
   * 초기화 상태를 추적하는 Promise
   * 중복 초기화 시도를 방지함
   */
  private initPromise: Promise<void> | null = null;

  /**
   * 새로운 TodoService 인스턴스를 생성합니다
   * 자동으로 지연 초기화를 트리거합니다
   */
  constructor() {
    this.initialize();
  }

  /**
   * 데이터베이스 연결 및 리포지토리를 초기화합니다
   *
   * 실제 사용 시점까지 데이터베이스 연결을 지연시키는
   * 지연 초기화 패턴을 사용합니다. 후속 호출은 동일한 Promise를 반환합니다.
   *
   * @returns {Promise<void>} 초기화가 완료되면 해결되는 Promise
   */
  async initialize() {
    if (!this.initPromise) {
      this.initPromise = initializeDatabase().then(() => {
        this.todoRepository = AppDataSource.getRepository(Todo);
      });
    }
    return this.initPromise;
  }

  /**
   * 데이터베이스가 초기화되었는지 확인하고 Todo 리포지토리를 가져옵니다
   *
   * @private
   * @returns {Promise<Repository<Todo>>} 초기화된 Todo 리포지토리
   */
  private async getRepository(): Promise<Repository<Todo>> {
    await this.initialize();
    return this.todoRepository;
  }

  /**
   * 선택적 필터링으로 모든 todo를 조회합니다
   *
   * @param {Object} [filters] - 선택적 필터 조건
   * @param {boolean} [filters.completed] - 완료 상태로 필터링
   * @param {string} [filters.priority] - 우선순위 레벨로 필터링 (낮음/보통/높음)
   * @returns {Promise<Todo[]>} 필터와 일치하는 todo 배열, 생성일 기준 내림차순 정렬 (최신순)
   *
   * @example
   * ```typescript
   * // 모든 todo 조회
   * const allTodos = await todoService.findAll();
   *
   * // 완료된 todo만 조회
   * const completedTodos = await todoService.findAll({ completed: true });
   *
   * // 높은 우선순위 todo 조회
   * const highPriorityTodos = await todoService.findAll({ priority: 'high' });
   * ```
   */
  async findAll(filters?: {
    completed?: boolean;
    priority?: string;
  }): Promise<Todo[]> {
    const repo = await this.getRepository();

    const where: FindOptionsWhere<Todo> = {};
    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }
    if (filters?.priority) {
      where.priority = filters.priority as "low" | "medium" | "high";
    }

    return repo.find({
      where,
      order: { createdAt: "DESC" },
    });
  }

  /**
   * ID로 단일 todo를 찾습니다
   *
   * @param {string} id - 찾을 todo의 UUID
   * @returns {Promise<Todo | null>} 찾은 경우 todo, 그렇지 않으면 null
   *
   * @example
   * ```typescript
   * const todo = await todoService.findById('123e4567-e89b-12d3-a456-426614174000');
   * if (todo) {
   *   console.log(todo.title);
   * }
   * ```
   */
  async findById(id: string): Promise<Todo | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { id } });
  }

  /**
   * 새로운 todo를 생성합니다
   *
   * @param {Partial<Todo>} data - Todo 데이터 (제목 필수, 나머지 필드 선택)
   * @returns {Promise<Todo>} 생성된 ID와 타임스탬프가 포함된 새 todo
   *
   * @example
   * ```typescript
   * const newTodo = await todoService.create({
   *   title: '장보기',
   *   priority: 'high',
   *   dueDate: new Date('2024-12-31')
   * });
   * ```
   */
  async create(data: Partial<Todo>): Promise<Todo> {
    const repo = await this.getRepository();
    const todo = repo.create(data);
    return repo.save(todo);
  }

  /**
   * 기존 todo를 업데이트합니다
   *
   * @param {string} id - 업데이트할 todo의 UUID
   * @param {Partial<Todo>} data - 업데이트할 필드 (부분 업데이트 지원)
   * @returns {Promise<Todo | null>} 찾은 경우 업데이트된 todo, todo가 존재하지 않으면 null
   *
   * @example
   * ```typescript
   * const updated = await todoService.update('todo-id', {
   *   title: '업데이트된 제목',
   *   priority: 'low'
   * });
   * ```
   */
  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    const repo = await this.getRepository();

    const todo = await this.findById(id);
    if (!todo) return null;

    Object.assign(todo, data);
    return repo.save(todo);
  }

  /**
   * ID로 todo를 삭제합니다
   *
   * @param {string} id - 삭제할 todo의 UUID
   * @returns {Promise<boolean>} todo가 삭제되면 true, 찾지 못하면 false
   *
   * @example
   * ```typescript
   * const deleted = await todoService.delete('todo-id');
   * if (deleted) {
   *   console.log('Todo가 성공적으로 삭제되었습니다');
   * }
   * ```
   */
  async delete(id: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * todo의 완료 상태를 토글합니다
   *
   * @param {string} id - 토글할 todo의 UUID
   * @returns {Promise<Todo | null>} 토글된 상태의 업데이트된 todo, 찾지 못하면 null
   *
   * @example
   * ```typescript
   * // 완료 상태 토글
   * const toggled = await todoService.toggleComplete('todo-id');
   * console.log(`Todo가 이제 ${toggled.completed ? '완료됨' : '미완료'} 상태입니다`);
   * ```
   */
  async toggleComplete(id: string): Promise<Todo | null> {
    const todo = await this.findById(id);
    if (!todo) return null;

    const repo = await this.getRepository();
    todo.completed = !todo.completed;
    return repo.save(todo);
  }
}

/**
 * TodoService의 싱글톤 인스턴스
 * 애플리케이션 전체에서 이 내보낸 인스턴스를 사용하세요
 *
 * @example
 * ```typescript
 * import { todoService } from '@/lib/services/todo.service';
 *
 * const todos = await todoService.findAll();
 * ```
 */
export const todoService = new TodoService();
