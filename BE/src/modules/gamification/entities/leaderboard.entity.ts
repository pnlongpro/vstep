import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
}

@Entity('leaderboard_entries')
@Unique(['userId', 'period', 'periodKey'])
@Index(['period', 'periodKey', 'score'])
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: LeaderboardPeriod,
  })
  period: LeaderboardPeriod;

  @Column({ name: 'period_key', length: 20 })
  periodKey: string; // e.g., '2024-W52', '2024-12', 'all'

  @Column({ default: 0 })
  score: number;

  @Column({ name: 'practice_count', default: 0 })
  practiceCount: number;

  @Column({ name: 'exam_count', default: 0 })
  examCount: number;

  @Column({ nullable: true })
  rank: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
