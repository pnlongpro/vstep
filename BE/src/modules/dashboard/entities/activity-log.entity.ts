import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  PRACTICE_STARTED = 'practice_started',
  PRACTICE_COMPLETED = 'practice_completed',
  EXAM_STARTED = 'exam_started',
  EXAM_COMPLETED = 'exam_completed',
  SCORE_IMPROVED = 'score_improved',
  BADGE_EARNED = 'badge_earned',
  LEVEL_UP = 'level_up',
  XP_EARNED = 'xp_earned',
  STREAK_CONTINUED = 'streak_continued',
  STREAK_LOST = 'streak_lost',
  GOAL_COMPLETED = 'goal_completed',
  FIRST_OF_DAY = 'first_of_day',
}

export enum ActivityCategory {
  PRACTICE = 'practice',
  EXAM = 'exam',
  ACHIEVEMENT = 'achievement',
  STREAK = 'streak',
  GOAL = 'goal',
  LEARNING = 'learning',
}

@Entity('activity_logs')
@Index(['userId', 'createdAt'])
@Index(['type', 'createdAt'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'enum', enum: ActivityCategory })
  category: ActivityCategory;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ name: 'reference_type', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ length: 20, nullable: true })
  skill: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'xp_earned', default: 0 })
  xpEarned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
