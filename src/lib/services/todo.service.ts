import { Repository, FindOptionsWhere } from "typeorm";
import { Todo } from "../db/entities/Todo";
import { AppDataSource, initializeDatabase } from "../db/data-source";

export class TodoService {
  private todoRepository: Repository<Todo>;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    if (!this.initPromise) {
      this.initPromise = initializeDatabase().then(() => {
        this.todoRepository = AppDataSource.getRepository(Todo);
      });
    }
    return this.initPromise;
  }

  private async getRepository(): Promise<Repository<Todo>> {
    await this.initialize();
    return this.todoRepository;
  }

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

  async findById(id: string): Promise<Todo | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { id } });
  }

  async create(data: Partial<Todo>): Promise<Todo> {
    const repo = await this.getRepository();
    const todo = repo.create(data);
    return repo.save(todo);
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    const repo = await this.getRepository();

    const todo = await this.findById(id);
    if (!todo) return null;

    Object.assign(todo, data);
    return repo.save(todo);
  }

  async delete(id: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async toggleComplete(id: string): Promise<Todo | null> {
    const todo = await this.findById(id);
    if (!todo) return null;

    const repo = await this.getRepository();
    todo.completed = !todo.completed;
    return repo.save(todo);
  }
}

export const todoService = new TodoService();
