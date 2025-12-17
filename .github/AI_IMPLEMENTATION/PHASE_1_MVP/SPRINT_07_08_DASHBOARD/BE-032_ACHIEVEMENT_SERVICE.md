# Task: BE-032 - Achievement Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-032 |
| **Task Name** | Achievement Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 6h |
| **Priority** | P1 (High) |
| **Dependencies** | BE-028 |

---

## Description

Implement achievements và badges system để:
- Định nghĩa các loại achievements (badges)
- Track progress của user đến achievements
- Award badges khi đạt điều kiện
- Hiển thị collection và progress

---

## Acceptance Criteria

- [ ] Achievement entity với định nghĩa badges
- [ ] UserAchievement entity lưu badges đã unlock
- [ ] Achievement progress tracking
- [ ] Auto-check và award badges
- [ ] Badge categories và rarity levels
- [ ] Achievement notifications
- [ ] Achievement showcase cho profile

---

## Implementation

### 1. Achievement Entity

```typescript
// src/modules/dashboard/entities/achievement.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementCategory {
  STREAK = 'streak',
  LEARNING = 'learning',
  SKILL = 'skill',
  SCORE = 'score',
  SOCIAL = 'social',
  SPECIAL = 'special',
}

export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum AchievementConditionType {
  STREAK_DAYS = 'streak_days',
  TOTAL_STUDY_HOURS = 'total_study_hours',
  TESTS_COMPLETED = 'tests_completed',
  PRACTICE_SESSIONS = 'practice_sessions',
  QUESTIONS_ANSWERED = 'questions_answered',
  CORRECT_ANSWERS = 'correct_answers',
  SKILL_SCORE = 'skill_score',
  OVERALL_SCORE = 'overall_score',
  XP_TOTAL = 'xp_total',
  LEVEL = 'level',
  PERFECT_TESTS = 'perfect_tests',
  CONSECUTIVE_CORRECT = 'consecutive_correct',
  BADGES_EARNED = 'badges_earned',
  REFERRALS = 'referrals',
}

@Entity('achievements')
@Index(['category', 'isActive'])
@Index(['rarity'])
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string; // e.g., 'streak_7', 'writing_master', etc.

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AchievementCategory })
  category: AchievementCategory;

  @Column({ type: 'enum', enum: AchievementRarity })
  rarity: AchievementRarity;

  // Visual
  @Column({ type: 'varchar', length: 100 })
  icon: string;

  @Column({ name: 'icon_url', type: 'varchar', length: 500, nullable: true })
  iconUrl: string;

  @Column({ name: 'background_color', type: 'varchar', length: 20, nullable: true })
  backgroundColor: string;

  // Rewards
  @Column({ name: 'xp_reward', type: 'int', default: 0 })
  xpReward: number;

  // Condition
  @Column({ name: 'condition_type', type: 'enum', enum: AchievementConditionType })
  conditionType: AchievementConditionType;

  @Column({ name: 'condition_value', type: 'int' })
  conditionValue: number;

  @Column({ name: 'condition_skill', type: 'varchar', length: 20, nullable: true })
  conditionSkill: string; // For skill-specific achievements

  // Additional condition as JSON for complex conditions
  @Column({ name: 'condition_extra', type: 'json', nullable: true })
  conditionExtra: Record<string, any>;

  // Ordering and display
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_hidden', type: 'boolean', default: false })
  isHidden: boolean; // Hidden until unlocked

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Series (for multi-tier achievements like Streak 7 -> 30 -> 100)
  @Column({ name: 'series_id', type: 'varchar', length: 50, nullable: true })
  seriesId: string;

  @Column({ name: 'series_tier', type: 'int', nullable: true })
  seriesTier: number;

  @OneToMany(() => UserAchievement, (ua) => ua.achievement)
  userAchievements: UserAchievement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get rarityColor(): string {
    const colors: Record<AchievementRarity, string> = {
      [AchievementRarity.COMMON]: '#9CA3AF',
      [AchievementRarity.UNCOMMON]: '#22C55E',
      [AchievementRarity.RARE]: '#3B82F6',
      [AchievementRarity.EPIC]: '#A855F7',
      [AchievementRarity.LEGENDARY]: '#F59E0B',
    };
    return colors[this.rarity];
  }
}
```

### 2. User Achievement Entity

```typescript
// src/modules/dashboard/entities/user-achievement.entity.ts
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
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
@Index(['userId', 'achievementId'], { unique: true })
@Index(['unlockedAt'])
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'achievement_id', type: 'uuid' })
  @Index()
  achievementId: string;

  @ManyToOne(() => Achievement, (a) => a.userAchievements)
  @JoinColumn({ name: 'achievement_id' })
  achievement: Achievement;

  // Progress (for tracking before unlock)
  @Column({ name: 'current_progress', type: 'int', default: 0 })
  currentProgress: number;

  @Column({ name: 'target_progress', type: 'int' })
  targetProgress: number;

  @Column({ name: 'is_unlocked', type: 'boolean', default: false })
  isUnlocked: boolean;

  @Column({ name: 'unlocked_at', type: 'timestamp', nullable: true })
  unlockedAt: Date;

  // Display preferences
  @Column({ name: 'is_showcased', type: 'boolean', default: false })
  isShowcased: boolean; // For profile display

  @Column({ name: 'is_new', type: 'boolean', default: true })
  isNew: boolean; // For notification badge

  // XP awarded
  @Column({ name: 'xp_awarded', type: 'int', default: 0 })
  xpAwarded: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Computed
  get progressPercent(): number {
    if (this.targetProgress === 0) return 0;
    return Math.min(100, Math.round((this.currentProgress / this.targetProgress) * 100));
  }
}
```

### 3. Achievement Service

```typescript
// src/modules/dashboard/services/achievement.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Achievement, AchievementCategory, AchievementConditionType } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import { UserStatsRepository } from '../repositories/user-stats.repository';
import { XpService } from './xp.service';

export interface AchievementProgress {
  achievement: Achievement;
  currentProgress: number;
  targetProgress: number;
  progressPercent: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface AchievementShowcase {
  userId: string;
  badges: UserAchievement[];
  stats: {
    total: number;
    unlocked: number;
    byRarity: Record<string, number>;
    byCategory: Record<string, number>;
    recentUnlocks: UserAchievement[];
  };
}

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
    private readonly userStatsRepo: UserStatsRepository,
    private readonly xpService: XpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== Query Achievements ====================

  async getAllAchievements(): Promise<Achievement[]> {
    return this.achievementRepo.find({
      where: { isActive: true },
      order: { category: 'ASC', sortOrder: 'ASC' },
    });
  }

  async getAchievementsByCategory(category: AchievementCategory): Promise<Achievement[]> {
    return this.achievementRepo.find({
      where: { category, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    });
  }

  async getUnlockedAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementRepo.find({
      where: { userId, isUnlocked: true },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    });
  }

  async getAchievementProgress(userId: string): Promise<AchievementProgress[]> {
    const allAchievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    
    const userAchievementMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    );

    const progressList: AchievementProgress[] = [];

    for (const achievement of allAchievements) {
      const userAchievement = userAchievementMap.get(achievement.id);
      
      let currentProgress = 0;
      let isUnlocked = false;
      let unlockedAt: Date | undefined;

      if (userAchievement) {
        currentProgress = userAchievement.currentProgress;
        isUnlocked = userAchievement.isUnlocked;
        unlockedAt = userAchievement.unlockedAt;
      } else {
        // Calculate current progress from user stats
        currentProgress = await this.calculateProgress(userId, achievement);
      }

      progressList.push({
        achievement,
        currentProgress,
        targetProgress: achievement.conditionValue,
        progressPercent: Math.min(100, Math.round((currentProgress / achievement.conditionValue) * 100)),
        isUnlocked,
        unlockedAt,
      });
    }

    return progressList;
  }

  async getShowcasedAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementRepo.find({
      where: { userId, isShowcased: true, isUnlocked: true },
      relations: ['achievement'],
      take: 5,
    });
  }

  async getAchievementShowcase(userId: string): Promise<AchievementShowcase> {
    const allAchievements = await this.getAllAchievements();
    const userAchievements = await this.getUnlockedAchievements(userId);

    const byRarity: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const ua of userAchievements) {
      const rarity = ua.achievement.rarity;
      const category = ua.achievement.category;
      
      byRarity[rarity] = (byRarity[rarity] || 0) + 1;
      byCategory[category] = (byCategory[category] || 0) + 1;
    }

    const recentUnlocks = userAchievements.slice(0, 5);

    return {
      userId,
      badges: userAchievements,
      stats: {
        total: allAchievements.length,
        unlocked: userAchievements.length,
        byRarity,
        byCategory,
        recentUnlocks,
      },
    };
  }

  async getNewAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievementRepo.find({
      where: { userId, isUnlocked: true, isNew: true },
      relations: ['achievement'],
    });
  }

  // ==================== Unlock & Progress ====================

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const achievements = await this.getAllAchievements();
    const unlockedAchievements: UserAchievement[] = [];

    for (const achievement of achievements) {
      const unlocked = await this.checkAndUnlock(userId, achievement);
      if (unlocked) {
        unlockedAchievements.push(unlocked);
      }
    }

    return unlockedAchievements;
  }

  async checkAndUnlock(userId: string, achievement: Achievement): Promise<UserAchievement | null> {
    // Check if already unlocked
    const existing = await this.userAchievementRepo.findOne({
      where: { userId, achievementId: achievement.id },
    });

    if (existing?.isUnlocked) {
      return null;
    }

    // Calculate current progress
    const currentProgress = await this.calculateProgress(userId, achievement);

    // Check if condition is met
    if (currentProgress >= achievement.conditionValue) {
      // Unlock the achievement
      return this.unlockAchievement(userId, achievement, currentProgress);
    }

    // Update progress if exists
    if (existing) {
      existing.currentProgress = currentProgress;
      await this.userAchievementRepo.save(existing);
    }

    return null;
  }

  private async unlockAchievement(
    userId: string,
    achievement: Achievement,
    currentProgress: number,
  ): Promise<UserAchievement> {
    let userAchievement = await this.userAchievementRepo.findOne({
      where: { userId, achievementId: achievement.id },
    });

    if (!userAchievement) {
      userAchievement = this.userAchievementRepo.create({
        userId,
        achievementId: achievement.id,
        targetProgress: achievement.conditionValue,
      });
    }

    userAchievement.currentProgress = currentProgress;
    userAchievement.isUnlocked = true;
    userAchievement.unlockedAt = new Date();
    userAchievement.isNew = true;
    userAchievement.xpAwarded = achievement.xpReward;

    await this.userAchievementRepo.save(userAchievement);

    // Award XP
    if (achievement.xpReward > 0) {
      await this.xpService.awardXp(userId, achievement.xpReward, 'achievement_unlock', {
        referenceType: 'achievement',
        referenceId: achievement.id,
        description: `Mở khóa: ${achievement.name}`,
      });
    }

    // Update user stats badges count
    const stats = await this.userStatsRepo.findByUserId(userId);
    if (stats) {
      stats.totalBadges += 1;
      await this.userStatsRepo.save(stats);
    }

    // Emit event
    this.eventEmitter.emit('achievement.unlocked', {
      userId,
      achievementId: achievement.id,
      name: achievement.name,
      xpReward: achievement.xpReward,
    });

    // Load relation for return
    userAchievement.achievement = achievement;
    return userAchievement;
  }

  private async calculateProgress(
    userId: string,
    achievement: Achievement,
  ): Promise<number> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    if (!stats) return 0;

    switch (achievement.conditionType) {
      case AchievementConditionType.STREAK_DAYS:
        return stats.longestStreak;

      case AchievementConditionType.TOTAL_STUDY_HOURS:
        return Math.floor(stats.totalStudyMinutes / 60);

      case AchievementConditionType.TESTS_COMPLETED:
        return stats.totalTestsCompleted;

      case AchievementConditionType.PRACTICE_SESSIONS:
        return stats.totalPracticeSessions;

      case AchievementConditionType.QUESTIONS_ANSWERED:
        return stats.totalQuestionsAnswered;

      case AchievementConditionType.CORRECT_ANSWERS:
        return stats.totalCorrectAnswers;

      case AchievementConditionType.SKILL_SCORE:
        if (achievement.conditionSkill) {
          return Math.floor(stats[`${achievement.conditionSkill}Average`] || 0);
        }
        return 0;

      case AchievementConditionType.OVERALL_SCORE:
        return Math.floor(stats.highestScore);

      case AchievementConditionType.XP_TOTAL:
        return stats.totalXp;

      case AchievementConditionType.LEVEL:
        return stats.currentLevel;

      case AchievementConditionType.BADGES_EARNED:
        return stats.totalBadges;

      default:
        return 0;
    }
  }

  // ==================== Manage Showcase ====================

  async toggleShowcase(userId: string, achievementId: string): Promise<UserAchievement> {
    const userAchievement = await this.userAchievementRepo.findOne({
      where: { userId, achievementId, isUnlocked: true },
      relations: ['achievement'],
    });

    if (!userAchievement) {
      throw new NotFoundException('Achievement not found or not unlocked');
    }

    // Count current showcased
    if (!userAchievement.isShowcased) {
      const currentCount = await this.userAchievementRepo.count({
        where: { userId, isShowcased: true },
      });

      if (currentCount >= 5) {
        // Remove oldest showcased
        const oldest = await this.userAchievementRepo.findOne({
          where: { userId, isShowcased: true },
          order: { unlockedAt: 'ASC' },
        });
        if (oldest) {
          oldest.isShowcased = false;
          await this.userAchievementRepo.save(oldest);
        }
      }
    }

    userAchievement.isShowcased = !userAchievement.isShowcased;
    return this.userAchievementRepo.save(userAchievement);
  }

  async markAsSeen(userId: string, achievementIds: string[]): Promise<void> {
    await this.userAchievementRepo.update(
      { userId, achievementId: In(achievementIds) },
      { isNew: false },
    );
  }

  // ==================== Seed Achievements ====================

  async seedDefaultAchievements(): Promise<void> {
    const existingCount = await this.achievementRepo.count();
    if (existingCount > 0) return;

    const achievements: Partial<Achievement>[] = [
      // Streak achievements
      {
        code: 'streak_3',
        name: 'Khởi động',
        description: 'Học liên tục 3 ngày',
        category: AchievementCategory.STREAK,
        rarity: AchievementRarity.COMMON,
        icon: '🔥',
        xpReward: 20,
        conditionType: AchievementConditionType.STREAK_DAYS,
        conditionValue: 3,
        seriesId: 'streak',
        seriesTier: 1,
        sortOrder: 1,
      },
      {
        code: 'streak_7',
        name: 'Một tuần kiên trì',
        description: 'Học liên tục 7 ngày',
        category: AchievementCategory.STREAK,
        rarity: AchievementRarity.COMMON,
        icon: '🔥',
        xpReward: 50,
        conditionType: AchievementConditionType.STREAK_DAYS,
        conditionValue: 7,
        seriesId: 'streak',
        seriesTier: 2,
        sortOrder: 2,
      },
      {
        code: 'streak_30',
        name: 'Một tháng bất bại',
        description: 'Học liên tục 30 ngày',
        category: AchievementCategory.STREAK,
        rarity: AchievementRarity.RARE,
        icon: '🔥🔥',
        xpReward: 150,
        conditionType: AchievementConditionType.STREAK_DAYS,
        conditionValue: 30,
        seriesId: 'streak',
        seriesTier: 3,
        sortOrder: 3,
      },
      {
        code: 'streak_100',
        name: 'Huyền thoại 100 ngày',
        description: 'Học liên tục 100 ngày',
        category: AchievementCategory.STREAK,
        rarity: AchievementRarity.LEGENDARY,
        icon: '🔥🔥🔥',
        xpReward: 500,
        conditionType: AchievementConditionType.STREAK_DAYS,
        conditionValue: 100,
        seriesId: 'streak',
        seriesTier: 4,
        sortOrder: 4,
      },

      // Study time achievements
      {
        code: 'study_10h',
        name: '10 giờ đầu tiên',
        description: 'Tổng thời gian học đạt 10 giờ',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.COMMON,
        icon: '⏰',
        xpReward: 30,
        conditionType: AchievementConditionType.TOTAL_STUDY_HOURS,
        conditionValue: 10,
        seriesId: 'study_time',
        seriesTier: 1,
        sortOrder: 10,
      },
      {
        code: 'study_50h',
        name: '50 giờ kiên trì',
        description: 'Tổng thời gian học đạt 50 giờ',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.UNCOMMON,
        icon: '⏰',
        xpReward: 100,
        conditionType: AchievementConditionType.TOTAL_STUDY_HOURS,
        conditionValue: 50,
        seriesId: 'study_time',
        seriesTier: 2,
        sortOrder: 11,
      },
      {
        code: 'study_100h',
        name: 'Chiến binh 100 giờ',
        description: 'Tổng thời gian học đạt 100 giờ',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.RARE,
        icon: '⏰',
        xpReward: 200,
        conditionType: AchievementConditionType.TOTAL_STUDY_HOURS,
        conditionValue: 100,
        seriesId: 'study_time',
        seriesTier: 3,
        sortOrder: 12,
      },

      // Test achievements
      {
        code: 'tests_10',
        name: 'Thử thách đầu tiên',
        description: 'Hoàn thành 10 bài thi',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.COMMON,
        icon: '📝',
        xpReward: 40,
        conditionType: AchievementConditionType.TESTS_COMPLETED,
        conditionValue: 10,
        sortOrder: 20,
      },
      {
        code: 'tests_50',
        name: 'Thí sinh chuyên nghiệp',
        description: 'Hoàn thành 50 bài thi',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.UNCOMMON,
        icon: '📝',
        xpReward: 150,
        conditionType: AchievementConditionType.TESTS_COMPLETED,
        conditionValue: 50,
        sortOrder: 21,
      },

      // Score achievements
      {
        code: 'score_6',
        name: 'Đạt điểm 6',
        description: 'Đạt điểm 6 trở lên trong một bài thi',
        category: AchievementCategory.SCORE,
        rarity: AchievementRarity.UNCOMMON,
        icon: '🎯',
        xpReward: 100,
        conditionType: AchievementConditionType.OVERALL_SCORE,
        conditionValue: 6,
        sortOrder: 30,
      },
      {
        code: 'score_7',
        name: 'Vượt ngưỡng 7',
        description: 'Đạt điểm 7 trở lên trong một bài thi',
        category: AchievementCategory.SCORE,
        rarity: AchievementRarity.RARE,
        icon: '🎯',
        xpReward: 200,
        conditionType: AchievementConditionType.OVERALL_SCORE,
        conditionValue: 7,
        sortOrder: 31,
      },
      {
        code: 'score_8',
        name: 'Xuất sắc',
        description: 'Đạt điểm 8 trở lên trong một bài thi',
        category: AchievementCategory.SCORE,
        rarity: AchievementRarity.EPIC,
        icon: '🏆',
        xpReward: 300,
        conditionType: AchievementConditionType.OVERALL_SCORE,
        conditionValue: 8,
        sortOrder: 32,
      },
      {
        code: 'score_9',
        name: 'Thiên tài',
        description: 'Đạt điểm 9 trở lên trong một bài thi',
        category: AchievementCategory.SCORE,
        rarity: AchievementRarity.LEGENDARY,
        icon: '👑',
        xpReward: 500,
        conditionType: AchievementConditionType.OVERALL_SCORE,
        conditionValue: 9,
        sortOrder: 33,
      },

      // Skill achievements
      {
        code: 'reading_master',
        name: 'Reading Master',
        description: 'Đạt điểm 8 Reading trung bình',
        category: AchievementCategory.SKILL,
        rarity: AchievementRarity.EPIC,
        icon: '📖',
        xpReward: 250,
        conditionType: AchievementConditionType.SKILL_SCORE,
        conditionValue: 8,
        conditionSkill: 'reading',
        sortOrder: 40,
      },
      {
        code: 'listening_master',
        name: 'Listening Master',
        description: 'Đạt điểm 8 Listening trung bình',
        category: AchievementCategory.SKILL,
        rarity: AchievementRarity.EPIC,
        icon: '🎧',
        xpReward: 250,
        conditionType: AchievementConditionType.SKILL_SCORE,
        conditionValue: 8,
        conditionSkill: 'listening',
        sortOrder: 41,
      },
      {
        code: 'writing_master',
        name: 'Writing Master',
        description: 'Đạt điểm 8 Writing trung bình',
        category: AchievementCategory.SKILL,
        rarity: AchievementRarity.EPIC,
        icon: '✍️',
        xpReward: 250,
        conditionType: AchievementConditionType.SKILL_SCORE,
        conditionValue: 8,
        conditionSkill: 'writing',
        sortOrder: 42,
      },
      {
        code: 'speaking_master',
        name: 'Speaking Master',
        description: 'Đạt điểm 8 Speaking trung bình',
        category: AchievementCategory.SKILL,
        rarity: AchievementRarity.EPIC,
        icon: '🎤',
        xpReward: 250,
        conditionType: AchievementConditionType.SKILL_SCORE,
        conditionValue: 8,
        conditionSkill: 'speaking',
        sortOrder: 43,
      },

      // XP achievements
      {
        code: 'xp_1000',
        name: 'Tích lũy 1000 XP',
        description: 'Đạt tổng 1000 điểm kinh nghiệm',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.UNCOMMON,
        icon: '⭐',
        xpReward: 50,
        conditionType: AchievementConditionType.XP_TOTAL,
        conditionValue: 1000,
        sortOrder: 50,
      },
      {
        code: 'xp_10000',
        name: 'XP Master',
        description: 'Đạt tổng 10000 điểm kinh nghiệm',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.RARE,
        icon: '⭐⭐',
        xpReward: 200,
        conditionType: AchievementConditionType.XP_TOTAL,
        conditionValue: 10000,
        sortOrder: 51,
      },

      // Level achievements
      {
        code: 'level_5',
        name: 'Level 5',
        description: 'Đạt level 5',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.UNCOMMON,
        icon: '📈',
        xpReward: 50,
        conditionType: AchievementConditionType.LEVEL,
        conditionValue: 5,
        sortOrder: 60,
      },
      {
        code: 'level_10',
        name: 'Level 10',
        description: 'Đạt level 10',
        category: AchievementCategory.LEARNING,
        rarity: AchievementRarity.RARE,
        icon: '📈',
        xpReward: 100,
        conditionType: AchievementConditionType.LEVEL,
        conditionValue: 10,
        sortOrder: 61,
      },
    ];

    await this.achievementRepo.save(achievements);
  }
}
```

### 4. Achievement Controller

```typescript
// src/modules/dashboard/controllers/achievement.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AchievementService } from '../services/achievement.service';
import { AchievementCategory } from '../entities/achievement.entity';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  async getAllAchievements() {
    return this.achievementService.getAllAchievements();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get achievements by category' })
  async getByCategory(@Param('category') category: AchievementCategory) {
    return this.achievementService.getAchievementsByCategory(category);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get achievement progress for current user' })
  async getProgress(@CurrentUser('id') userId: string) {
    return this.achievementService.getAchievementProgress(userId);
  }

  @Get('unlocked')
  @ApiOperation({ summary: 'Get unlocked achievements' })
  async getUnlocked(@CurrentUser('id') userId: string) {
    return this.achievementService.getUnlockedAchievements(userId);
  }

  @Get('showcase')
  @ApiOperation({ summary: 'Get achievement showcase for profile' })
  async getShowcase(@CurrentUser('id') userId: string) {
    return this.achievementService.getAchievementShowcase(userId);
  }

  @Get('showcased')
  @ApiOperation({ summary: 'Get showcased achievements' })
  async getShowcased(@CurrentUser('id') userId: string) {
    return this.achievementService.getShowcasedAchievements(userId);
  }

  @Get('new')
  @ApiOperation({ summary: 'Get new (unseen) achievements' })
  async getNew(@CurrentUser('id') userId: string) {
    return this.achievementService.getNewAchievements(userId);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check and unlock new achievements' })
  async checkAchievements(@CurrentUser('id') userId: string) {
    return this.achievementService.checkAndUnlockAchievements(userId);
  }

  @Post(':achievementId/showcase')
  @ApiOperation({ summary: 'Toggle achievement showcase' })
  async toggleShowcase(
    @CurrentUser('id') userId: string,
    @Param('achievementId', ParseUUIDPipe) achievementId: string,
  ) {
    return this.achievementService.toggleShowcase(userId, achievementId);
  }

  @Post('seen')
  @ApiOperation({ summary: 'Mark achievements as seen' })
  async markSeen(
    @CurrentUser('id') userId: string,
    @Body() body: { achievementIds: string[] },
  ) {
    await this.achievementService.markAsSeen(userId, body.achievementIds);
    return { success: true };
  }
}
```

### 5. DTOs

```typescript
// src/modules/dashboard/dto/achievement.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  AchievementCategory, 
  AchievementRarity, 
  AchievementConditionType 
} from '../entities/achievement.entity';

export class AchievementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: AchievementCategory })
  category: AchievementCategory;

  @ApiProperty({ enum: AchievementRarity })
  rarity: AchievementRarity;

  @ApiProperty()
  icon: string;

  @ApiPropertyOptional()
  iconUrl?: string;

  @ApiProperty()
  xpReward: number;

  @ApiProperty({ enum: AchievementConditionType })
  conditionType: AchievementConditionType;

  @ApiProperty()
  conditionValue: number;

  @ApiPropertyOptional()
  conditionSkill?: string;

  @ApiProperty()
  isHidden: boolean;

  @ApiProperty()
  rarityColor: string;
}

export class AchievementProgressResponseDto {
  @ApiProperty()
  achievement: AchievementResponseDto;

  @ApiProperty()
  currentProgress: number;

  @ApiProperty()
  targetProgress: number;

  @ApiProperty()
  progressPercent: number;

  @ApiProperty()
  isUnlocked: boolean;

  @ApiPropertyOptional()
  unlockedAt?: Date;
}

export class UserAchievementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  achievement: AchievementResponseDto;

  @ApiProperty()
  currentProgress: number;

  @ApiProperty()
  targetProgress: number;

  @ApiProperty()
  progressPercent: number;

  @ApiProperty()
  isUnlocked: boolean;

  @ApiPropertyOptional()
  unlockedAt?: Date;

  @ApiProperty()
  isShowcased: boolean;

  @ApiProperty()
  isNew: boolean;

  @ApiProperty()
  xpAwarded: number;
}

export class AchievementShowcaseResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [UserAchievementResponseDto] })
  badges: UserAchievementResponseDto[];

  @ApiProperty()
  stats: {
    total: number;
    unlocked: number;
    byRarity: Record<string, number>;
    byCategory: Record<string, number>;
    recentUnlocks: UserAchievementResponseDto[];
  };
}

export class MarkSeenDto {
  @ApiProperty({ type: [String] })
  achievementIds: string[];
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/achievements` | Get all achievements |
| GET | `/achievements/category/:category` | Get by category |
| GET | `/achievements/progress` | Get progress |
| GET | `/achievements/unlocked` | Get unlocked |
| GET | `/achievements/showcase` | Get showcase data |
| GET | `/achievements/showcased` | Get showcased badges |
| GET | `/achievements/new` | Get new badges |
| POST | `/achievements/check` | Check and unlock |
| POST | `/achievements/:id/showcase` | Toggle showcase |
| POST | `/achievements/seen` | Mark as seen |

---

## Next Task

Continue with **BE-033: Streak Calculation** - Implement streak tracking and bonuses.
