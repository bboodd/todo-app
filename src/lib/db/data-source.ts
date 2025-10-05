import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Todo } from "./entities/Todo";

dotenv.config();

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

// 데이터베이스 초기화
let initialized = false;
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
