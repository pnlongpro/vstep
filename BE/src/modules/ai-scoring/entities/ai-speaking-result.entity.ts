import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('ai_speaking_results')
export class AISpeakingResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  submission_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'varchar', length: 500 })
  audio_url: string;

  @Column({ type: 'integer', nullable: true, comment: 'in seconds' })
  audio_duration: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  overall_score: number; // 0-10

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  pronunciation: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  fluency: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  grammar: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  vocabulary: number;

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({ type: 'integer', nullable: true })
  words_per_minute: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'jsonb', nullable: true })
  suggestions: string[];

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
