import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Todo } from "./entities/Todo";

dotenv.config();

/**
 * PostgreSQL 데이터베이스를 위한 TypeORM DataSource 설정
 *
 * 데이터베이스 연결 설정을 관리하는 싱글톤 인스턴스:
 * - 연결 매개변수 (호스트, 포트, 데이터베이스, 인증 정보)
 * - 엔티티 매핑 (User, Todo)
 * - 자동 동기화 (개발 모드에서만)
 * - 쿼리 로깅 (개발 모드에서만)
 *
 * @see {@link https://typeorm.io/data-source TypeORM DataSource 문서}
 */
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  synchronize: process.env.NODE_ENV === "development", // 프로덕션에서는 false
  logging: process.env.NODE_ENV === "development",
  entities: [User, Todo],
  migrations: ["src/lib/db/migrations/**/*.ts"],
  subscribers: [],
});

/**
 * 데이터베이스 초기화 여부를 추적하는 플래그
 * 중복 초기화 시도를 방지합니다
 */
let initialized = false;

/**
 * 싱글톤 패턴으로 데이터베이스 연결을 초기화합니다
 *
 * 이 함수는 다음을 보장합니다:
 * - 데이터베이스 연결이 단 한 번만 설정됨
 * - 후속 호출 시 기존 연결을 반환함
 * - 초기화 오류가 적절히 로깅되고 전파됨
 *
 * @returns {Promise<DataSource>} 초기화된 TypeORM DataSource
 * @throws {Error} 데이터베이스 연결 실패 시
 *
 * @example
 * ```typescript
 * const dataSource = await initializeDatabase();
 * const todoRepository = dataSource.getRepository(Todo);
 * ```
 */
export const initializeDatabase = async () => {
  if (!initialized) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("DB 연결 초기화");
      }
      initialized = true;
    } catch (error) {
      console.error("DB 연결 에러", error);
      throw error;
    }
  }
  return AppDataSource;
};
