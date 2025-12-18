import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PracticeSession } from './practice-session.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('practice_answers')
export class PracticeAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => PracticeSession, (session) => session.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: PracticeSession;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ name: 'selected_option_id', type: 'uuid', nullable: true })
  selectedOptionId: string;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2, default: 1 })
  maxScore: number;

  @Column({ name: 'time_spent', type: 'int', default: 0, comment: 'Seconds spent on this question' })
  timeSpent: number;

  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({ name: 'answered_at', type: 'timestamp', nullable: true })
  answeredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
