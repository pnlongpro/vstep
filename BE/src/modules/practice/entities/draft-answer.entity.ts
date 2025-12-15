import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PracticeSession } from './practice-session.entity';

@Entity('draft_answers')
export class DraftAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0, name: 'word_count' })
  wordCount: number;

  @Column({
    type: 'enum',
    enum: ['email', 'essay', 'graph'],
    name: 'task_type',
  })
  taskType: string;

  @Column({ type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] })
  level: string;

  @Column({ type: 'timestamp', name: 'last_saved_at' })
  lastSavedAt: Date;

  @Column({ type: 'int', default: 0, name: 'auto_save_count' })
  autoSaveCount: number;

  @ManyToOne(() => PracticeSession, { nullable: true })
  @JoinColumn({ name: 'practice_session_id' })
  practiceSession: PracticeSession;

  @Column({ type: 'int', nullable: true, name: 'practice_session_id' })
  practiceSessionId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
