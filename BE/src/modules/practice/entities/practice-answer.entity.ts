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

@Entity('practice_answers')
export class PracticeAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PracticeSession, (session) => session.answers)
  @JoinColumn({ name: 'session_id' })
  session: PracticeSession;

  @Column({ name: 'session_id' })
  sessionId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ type: 'boolean', nullable: true, name: 'is_correct' })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0, name: 'time_spent' })
  timeSpent: number;

  @Column({
    type: 'enum',
    enum: ['choice', 'text', 'audio', 'essay'],
    name: 'answer_type',
  })
  answerType: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'audio_url' })
  audioUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
