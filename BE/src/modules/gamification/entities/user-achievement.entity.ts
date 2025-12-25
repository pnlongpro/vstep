import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
@Unique(['userId', 'achievementId'])
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'achievement_id' })
  achievementId: string;

  @ManyToOne(() => Achievement, (a) => a.userAchievements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievement_id' })
  achievement: Achievement;

  @Column({ default: 0 })
  progress: number;

  @Column({ name: 'is_unlocked', default: false })
  isUnlocked: boolean;

  @Column({ name: 'unlocked_at', nullable: true })
  unlockedAt: Date;

  @Column({ name: 'is_notified', default: false })
  isNotified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
