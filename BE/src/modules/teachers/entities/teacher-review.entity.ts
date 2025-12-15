import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teacher_reviews')
export class TeacherReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_id: string;

  @Column({ type: 'integer', default: 5 })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'jsonb', nullable: true })
  criteria_ratings: Record<string, any>; // { teaching: 5, communication: 4, knowledge: 5 }

  @Column({ type: 'boolean', default: true })
  is_anonymous: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
