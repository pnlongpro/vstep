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
import { User } from './user.entity';

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

/**
 * User's subscription package with feature limits
 */
@Entity('user_packages')
@Index(['userId'])
@Index(['plan'])
export class UserPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  plan: PlanType;

  // Feature limits
  @Column({ type: 'int', default: 3, comment: 'Max mock tests allowed (0 = unlimited)' })
  mockTestLimit: number;

  @Column({ type: 'int', default: 1, comment: 'Max AI Speaking sessions per day (0 = unlimited)' })
  aiSpeakingDailyLimit: number;

  @Column({ type: 'int', default: 1, comment: 'Max AI Writing submissions per day (0 = unlimited)' })
  aiWritingDailyLimit: number;

  // Subscription dates
  @Column({ type: 'datetime', nullable: true, comment: 'When the package was activated' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true, comment: 'When the package expires (null = never)' })
  endDate: Date;

  @Column({ type: 'boolean', default: false, comment: 'Auto-renew subscription' })
  autoRenew: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Check if package is expired
   */
  isExpired(): boolean {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate);
  }

  /**
   * Get days remaining until expiry
   */
  getDaysRemaining(): number | null {
    if (!this.endDate) return null;
    const now = new Date();
    const end = new Date(this.endDate);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  /**
   * Get default limits for a plan type
   */
  static getDefaultLimits(plan: PlanType): { mockTestLimit: number; aiSpeakingDailyLimit: number; aiWritingDailyLimit: number } {
    switch (plan) {
      case PlanType.FREE:
        return { mockTestLimit: 3, aiSpeakingDailyLimit: 1, aiWritingDailyLimit: 1 };
      case PlanType.BASIC:
        return { mockTestLimit: 10, aiSpeakingDailyLimit: 5, aiWritingDailyLimit: 5 };
      case PlanType.PREMIUM:
        return { mockTestLimit: 0, aiSpeakingDailyLimit: 0, aiWritingDailyLimit: 0 }; // 0 = unlimited
      default:
        return { mockTestLimit: 3, aiSpeakingDailyLimit: 1, aiWritingDailyLimit: 1 };
    }
  }
}
