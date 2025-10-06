import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./Todo";

/**
 * 인증된 사용자를 나타내는 User 엔티티
 *
 * PostgreSQL 데이터베이스의 "user" 테이블에 매핑됩니다.
 * 각 User는 일대다 관계를 통해 여러 Todo를 가질 수 있습니다.
 *
 * @entity
 * @note 현재 완전히 구현되지 않음 - 인증 시스템 보류 중
 */
@Entity()
export class User {
  /**
   * 사용자의 고유 식별자
   * 자동 증가 정수
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 사용자의 이메일 주소
   * 모든 사용자에 걸쳐 고유해야 함
   * @unique
   * @required
   */
  @Column("text", { unique: true })
  email: string;

  /**
   * 사용자의 해시된 비밀번호
   * @required
   * @note 저장 전 반드시 해시화되어야 함 (예: bcrypt)
   */
  @Column("text")
  password: string;

  /**
   * Todo 엔티티와의 일대다 관계
   * 한 사용자가 여러 개의 todo를 가질 수 있음
   */
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
