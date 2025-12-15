import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('ai_writing_results')
export class AIWritingResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  submission_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'text' })
  essay_text: string;

  @Column({ type: 'integer', nullable: true })
  word_count: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  overall_score: number; // 0-10

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  task_achievement: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  coherence_cohesion: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  lexical_resource: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  grammatical_range: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'jsonb', nullable: true })
  suggestions: string[];

  @Column({ type: 'jsonb', nullable: true })
  grammar_errors: Record<string, any>[];

  @Column({ type: 'integer', nullable: true, comment: 'in milliseconds' })
  processing_time: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  model_version: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}
