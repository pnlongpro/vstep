import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementCategory {
  LEARNING = 'learning',
  STREAK = 'streak',
  SKILL = 'skill',
  SOCIAL = 'social',
  MILESTONE = 'milestone',
}

export enum ConditionType {
  COUNT = 'count',
  STREAK = 'streak',
  SCORE = 'score',
  TIME = 'time',
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ name: 'badge_image', nullable: true })
  badgeImage: string;

  @Column({ name: 'xp_reward', default: 0 })
  xpReward: number;

  @Column({
    type: 'enum',
    enum: AchievementCategory,
    default: AchievementCategory.LEARNING,
  })
  category: AchievementCategory;

  @Column({
    name: 'condition_type',
    type: 'enum',
    enum: ConditionType,
    default: ConditionType.COUNT,
  })
  conditionType: ConditionType;

  @Column({ name: 'condition_value', default: 1 })
  conditionValue: number;

  @Column({ name: 'condition_metadata', type: 'json', nullable: true })
  conditionMetadata: Record<string, any>;

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @Column({
    type: 'enum',
    enum: AchievementRarity,
    default: AchievementRarity.COMMON,
  })
  rarity: AchievementRarity;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => UserAchievement, (ua) => ua.achievement)
  userAchievements: UserAchievement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
