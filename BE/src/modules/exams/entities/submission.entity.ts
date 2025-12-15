import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assignment } from './assignment.entity';
import { Exam } from './exam.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  assignment_id: string;

  @Column({ type: 'uuid' })
  exam_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'integer', default: 1 })
  attempt_number: number;

  @Column({ type: 'jsonb' })
  answers: Record<string, any>;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  submitted_at: Date;

  @Column({ type: 'integer', nullable: true, comment: 'in seconds' })
  time_spent: number;

  @Column({ type: 'varchar', length: 20, default: 'in_progress' })
  status: string; // in_progress, submitted, graded, overdue

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  auto_score: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  graded_score: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  final_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'boolean', nullable: true })
  passed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Assignment)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
