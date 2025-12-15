import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PracticeAnswer } from './practice-answer.entity';

@Entity('practice_sessions')
export class PracticeSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.practiceSessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ['reading', 'listening', 'writing', 'speaking'],
  })
  skill: string;

  @Column({
    type: 'enum',
    enum: ['part', 'task', 'full'],
    comment: 'Chế độ: part/task riêng hoặc full test',
  })
  mode: string;

  @Column({ type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] })
  level: string;

  @Column({ type: 'int', nullable: true, name: 'exercise_id' })
  exerciseId: number;

  @Column({ type: 'tinyint', nullable: true, name: 'part_number' })
  partNumber: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'task_type' })
  taskType: string;

  @Column({
    type: 'enum',
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'int', default: 0, name: 'time_spent' })
  timeSpent: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'int', default: 0, name: 'correct_answers' })
  correctAnswers: number;

  @Column({ type: 'int', default: 0, name: 'total_questions' })
  totalQuestions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_saved_at' })
  lastSavedAt: Date;

  @Column({ type: 'int', default: 0, name: 'auto_save_version' })
  autoSaveVersion: number;

  @OneToMany(() => PracticeAnswer, (answer) => answer.session)
  answers: PracticeAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
