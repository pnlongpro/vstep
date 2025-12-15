import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  skill: string; // reading, listening, writing, speaking

  @Column({ type: 'varchar', length: 50 })
  question_type: string; // multiple_choice, true_false, matching, fill_blank, essay, speaking_task

  @Column({ type: 'text', nullable: true })
  question_text: string;

  @Column({ type: 'uuid', nullable: true })
  passage_id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  audio_url: string;

  @Column({ type: 'jsonb', nullable: true })
  options: Record<string, any>; // { A: "option 1", B: "option 2", C: "option 3", D: "option 4" }

  @Column({ type: 'text', nullable: true })
  correct_answer: string;

  @Column({ type: 'jsonb', nullable: true })
  correct_answers: string[]; // for multiple correct answers

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 1 })
  points: number;

  @Column({ type: 'varchar', length: 20, default: 'medium' })
  difficulty: string; // easy, medium, hard

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'integer', default: 0 })
  times_used: number;

  @Column({ type: 'uuid' })
  created_by: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // active, inactive, archived

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
