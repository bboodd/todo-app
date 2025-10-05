import { Repository, FindOptionsWhere } from "typeorm";
import { Todo } from "../db/entities/Todo";
import { AppDataSource, initializeDatabase } from "../db/data-source";

export class TodoService {
  private todoRepository: Repository<Todo>;

  constructor() {
    this.todoRepository = AppDataSource.getRepository(Todo);
  }

  async ensureInitialized() {
    await initializeDatabase();
  }

  async findAll(filters?: {
    completed?: boolean;
    priority?: string;
  }): Promise<Todo[]> {
    await this.ensureInitialized();

    const where: FindOptionsWhere<Todo> = {};
    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }
    if (filters?.priority) {
      where.priority = filters.priority as "low" | "medium" | "high";
    }

    return this.todoRepository.find({
      where,
      order: { createdAt: "DESC" },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    await this.ensureInitialized();
    return this.todoRepository.findOneBy({ id });
  }

  async create(data: Partial<Todo>): Promise<Todo> {
    await this.ensureInitialized();
    const todo = this.todoRepository.create(data);
    return this.todoRepository.save(todo);
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    await this.ensureInitialized();

    const todo = await this.findById(id);
    if (!todo) {
      return null;
    }

    Object.assign(todo, data);
    return this.todoRepository.save(todo);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();

    const result = await this.todoRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async toggleComplete(id: string): Promise<Todo | null> {
    await this.ensureInitialized();

    const todo = await this.findById(id);
    if (!todo) {
      return null;
    }

    todo.completed = !todo.completed;
    return this.todoRepository.save(todo);
  }
}

export const todoService = new TodoService();
