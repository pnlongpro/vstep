import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from './exam.entity';

@Entity('exam_sections')
export class ExamSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  exam_id: string;

  @Column({ type: 'varchar', length: 20 })
  skill: string; // reading, listening, writing, speaking

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  order_number: number;

  @Column({ type: 'integer', nullable: true, comment: 'in minutes' })
  duration: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'jsonb', nullable: true })
  question_ids: string[]; // Array of question IDs

  @Column({ type: 'integer', default: 0 })
  total_questions: number;

  @Column({ type: 'decimal', precision: 6, scale: 1, default: 0 })
  total_points: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Exam, exam => exam.sections)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
