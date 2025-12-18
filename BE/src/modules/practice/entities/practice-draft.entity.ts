import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PracticeSession } from './practice-session.entity';

@Entity('practice_drafts')
@Index(['userId', 'sessionId'])
export class PracticeDraft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId: string;

  @ManyToOne(() => PracticeSession, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: PracticeSession;

  @Column({ name: 'question_id', type: 'uuid', nullable: true })
  questionId: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ name: 'word_count', type: 'int', default: 0 })
  wordCount: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ name: 'auto_saved', type: 'boolean', default: true })
  autoSaved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
