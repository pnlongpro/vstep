import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_test_results')
export class StudentTestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid', nullable: true })
  test_id: string;

  @Column({ type: 'varchar', length: 20 })
  test_type: string; // reading, listening, writing, speaking

  @Column({ type: 'varchar', length: 20 })
  test_mode: string; // practice, exam, mock_exam

  @Column({ type: 'varchar', length: 5, nullable: true })
  level: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  score: number;

  @Column({ type: 'integer', nullable: true })
  total_questions: number;

  @Column({ type: 'integer', nullable: true })
  correct_answers: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'integer', nullable: true, comment: 'in seconds' })
  time_taken: number;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @Column({ type: 'timestamp' })
  submitted_at: Date;

  @Column({ type: 'uuid', nullable: true })
  class_id: string;

  @Column({ type: 'uuid', nullable: true })
  assignment_id: string;

  @Column({ type: 'varchar', length: 20, default: 'completed' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
