import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teacher_stats')
export class TeacherStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  teacher_id: string;

  @Column({ type: 'integer', default: 0 })
  current_classes: number;

  @Column({ type: 'integer', default: 0 })
  total_classes: number;

  @Column({ type: 'integer', default: 0 })
  current_students: number;

  @Column({ type: 'integer', default: 0 })
  total_students_taught: number;

  @Column({ type: 'integer', default: 0 })
  courses_created: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: number;

  @Column({ type: 'integer', default: 0 })
  total_reviews: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  student_pass_rate: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;
}
