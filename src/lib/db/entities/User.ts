import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./Todo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { unique: true })
  email: string;

  @Column("text")
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
