import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_progress')
export class StudentProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid', nullable: true })
  course_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress_percentage: number;

  @Column({ type: 'integer', default: 0 })
  completed_lessons: number;

  @Column({ type: 'integer', default: 0 })
  total_lessons: number;

  @Column({ type: 'integer', default: 0, comment: 'in seconds' })
  time_spent: number;

  @Column({ type: 'timestamp', nullable: true })
  last_accessed_at: Date;

  @Column({ type: 'varchar', length: 20, default: 'in_progress' })
  status: string; // not_started, in_progress, completed

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
