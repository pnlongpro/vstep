import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exam } from './exam.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'homework' })
  assignment_type: string; // homework, quiz, test, project

  @Column({ type: 'uuid', nullable: true })
  exam_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assigned_date: Date;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true })
  total_points: number;

  @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true })
  passing_score: number;

  @Column({ type: 'varchar', length: 20, default: 'auto' })
  grading_method: string; // auto, manual, hybrid

  @Column({ type: 'varchar', length: 20, default: 'assigned' })
  status: string; // assigned, in_progress, completed, overdue

  @Column({ type: 'uuid' })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
