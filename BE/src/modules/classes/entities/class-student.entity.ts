import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('class_students')
export class ClassStudent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  class_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joined_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  enrollment_method: string; // manual, invitation, self_enrollment

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // active, inactive, dropped, completed

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @Column({ type: 'integer', default: 0 })
  attended_sessions: number;

  @Column({ type: 'integer', default: 0 })
  total_sessions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  attendance_rate: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  average_score: number;

  @Column({ type: 'timestamp', nullable: true })
  removed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Class, classEntity => classEntity.students)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
