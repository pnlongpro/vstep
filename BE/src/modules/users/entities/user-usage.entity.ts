import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Tracks user's usage of limited features (mock tests, AI grading)
 * AI usage resets daily, mock test usage is cumulative for free plan
 */
@Entity('user_usage')
export class UserUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  // Mock test usage (cumulative for free plan)
  @Column({ type: 'int', default: 0, comment: 'Total mock tests completed' })
  mockTestsUsed: number;

  // AI Speaking usage (resets daily)
  @Column({ type: 'int', default: 0, comment: 'AI Speaking sessions used today' })
  aiSpeakingUsedToday: number;

  // AI Writing usage (resets daily)
  @Column({ type: 'int', default: 0, comment: 'AI Writing submissions used today' })
  aiWritingUsedToday: number;

  // Last reset date for daily limits
  @Column({ type: 'date', nullable: true, comment: 'Last date AI usage was reset' })
  lastAiResetDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Check if AI usage needs to be reset (new day)
   */
  needsReset(): boolean {
    if (!this.lastAiResetDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = new Date(this.lastAiResetDate);
    lastReset.setHours(0, 0, 0, 0);
    return today.getTime() > lastReset.getTime();
  }

  /**
   * Reset daily AI usage
   */
  resetDailyUsage(): void {
    this.aiSpeakingUsedToday = 0;
    this.aiWritingUsedToday = 0;
    this.lastAiResetDate = new Date();
  }
}
