import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  descriptrion?: string;

  @Column({ type: "boolean", default: false })
  completed: bloolean;

  @Column({ type: "varchar", length: 50, default: "medium" })
  priority: "low" | "medium" | "high";

  @Column({ type: "timestamp", nullable: true })
  dueDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
