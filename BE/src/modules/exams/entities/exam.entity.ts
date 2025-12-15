import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ExamSection } from './exam-section.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'practice' })
  exam_type: string; // practice, mock_test, official

  @Column({ type: 'varchar', length: 5 })
  level: string; // A2, B1, B2, C1

  @Column({ type: 'jsonb', nullable: true })
  skills: string[]; // ['reading', 'listening', 'writing', 'speaking']

  @Column({ type: 'integer', default: 0 })
  total_questions: number;

  @Column({ type: 'decimal', precision: 6, scale: 1, default: 0 })
  total_points: number;

  @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true })
  passing_score: number;

  @Column({ type: 'integer', nullable: true, comment: 'in minutes' })
  total_duration: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string; // draft, published, archived

  @Column({ type: 'uuid' })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => ExamSection, section => section.exam)
  sections: ExamSection[];
}
