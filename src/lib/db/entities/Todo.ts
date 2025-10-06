import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

/**
 * 할 일 목록의 작업을 나타내는 Todo 엔티티
 *
 * PostgreSQL 데이터베이스의 "todo" 테이블에 매핑됩니다.
 * 각 Todo는 User에 속하며 다음을 포함한 작업 정보를 추적합니다:
 * - 제목 및 설명
 * - 완료 상태
 * - 우선순위 레벨 (낮음, 보통, 높음)
 * - 마감일
 * - 자동 타임스탬프 (생성/수정)
 *
 * @entity
 */
@Entity()
export class Todo {
  /**
   * Todo의 고유 식별자
   * 자동 생성되는 UUID 문자열
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * Todo 작업의 제목/이름
   * 최대 255자
   * @required
   */
  @Column({ type: "varchar", length: 255 })
  title: string;

  /**
   * Todo의 상세 설명
   * 선택 사항인 무제한 길이의 텍스트 필드
   */
  @Column({ type: "text", nullable: true })
  descriptrion?: string;

  /**
   * Todo의 완료 상태
   * @default false
   */
  @Column({ type: "boolean", default: false })
  completed: bloolean;

  /**
   * Todo의 우선순위 레벨
   * @default "medium"
   */
  @Column({ type: "varchar", length: 50, default: "medium" })
  priority: "low" | "medium" | "high";

  /**
   * Todo의 선택적 마감일
   */
  @Column({ type: "timestamp", nullable: true })
  dueDate?: Date;

  /**
   * Todo가 생성된 시간
   * TypeORM에 의해 자동으로 설정됨
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Todo가 마지막으로 수정된 시간
   * TypeORM에 의해 자동으로 업데이트됨
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * User 엔티티와의 다대일 관계
   * 각 todo는 한 명의 사용자에게 속함
   */
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
