# Task: BE-028 - User Stats Entity

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-028 |
| **Task Name** | User Stats Entity |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | None |

---

## Description

Tạo các entities để lưu trữ thống kê người dùng bao gồm:
- User Stats: Tổng số liệu học tập (hours, tests, XP, level)
- User Daily Stats: Thống kê hàng ngày cho streak và calendar
- XP Transactions: Log các hoạt động kiếm XP

---

## Acceptance Criteria

- [ ] UserStats entity với các trường thống kê tổng hợp
- [ ] UserDailyStats entity cho tracking hoạt động hàng ngày
- [ ] XpTransaction entity cho audit trail XP
- [ ] Migrations tạo bảng với indexes phù hợp
- [ ] DTOs cho request/response
- [ ] Repository với các query methods

---

## Implementation

### 1. User Stats Entity

```typescript
// src/modules/dashboard/entities/user-stats.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_stats')
@Index(['xp', 'level']) // For leaderboard queries
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index({ unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Study Metrics
  @Column({ name: 'total_study_minutes', type: 'int', default: 0 })
  totalStudyMinutes: number;

  @Column({ name: 'total_tests_completed', type: 'int', default: 0 })
  totalTestsCompleted: number;

  @Column({ name: 'total_practice_sessions', type: 'int', default: 0 })
  totalPracticeSessions: number;

  @Column({ name: 'total_questions_answered', type: 'int', default: 0 })
  totalQuestionsAnswered: number;

  @Column({ name: 'total_correct_answers', type: 'int', default: 0 })
  totalCorrectAnswers: number;

  // Scores
  @Column({ name: 'average_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  averageScore: number;

  @Column({ name: 'highest_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  highestScore: number;

  @Column({ name: 'latest_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  latestScore: number;

  // Skill-specific averages
  @Column({ name: 'reading_average', type: 'decimal', precision: 4, scale: 2, default: 0 })
  readingAverage: number;

  @Column({ name: 'listening_average', type: 'decimal', precision: 4, scale: 2, default: 0 })
  listeningAverage: number;

  @Column({ name: 'writing_average', type: 'decimal', precision: 4, scale: 2, default: 0 })
  writingAverage: number;

  @Column({ name: 'speaking_average', type: 'decimal', precision: 4, scale: 2, default: 0 })
  speakingAverage: number;

  // XP & Level
  @Column({ name: 'total_xp', type: 'int', default: 0 })
  totalXp: number;

  @Column({ name: 'current_level', type: 'int', default: 1 })
  currentLevel: number;

  @Column({ name: 'xp_to_next_level', type: 'int', default: 100 })
  xpToNextLevel: number;

  // Streaks
  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak: number;

  @Column({ name: 'longest_streak', type: 'int', default: 0 })
  longestStreak: number;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  lastActivityDate: Date;

  // Achievements
  @Column({ name: 'total_badges', type: 'int', default: 0 })
  totalBadges: number;

  @Column({ name: 'total_achievements', type: 'int', default: 0 })
  totalAchievements: number;

  // Engagement
  @Column({ name: 'weekly_goal_minutes', type: 'int', default: 300 })
  weeklyGoalMinutes: number;

  @Column({ name: 'current_vstep_level', type: 'varchar', length: 10, nullable: true })
  currentVstepLevel: string; // A2, B1, B2, C1

  @Column({ name: 'target_vstep_level', type: 'varchar', length: 10, nullable: true })
  targetVstepLevel: string;

  @Column({ name: 'target_exam_date', type: 'date', nullable: true })
  targetExamDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed properties
  get accuracy(): number {
    if (this.totalQuestionsAnswered === 0) return 0;
    return Math.round((this.totalCorrectAnswers / this.totalQuestionsAnswered) * 100);
  }

  get totalStudyHours(): number {
    return Math.round((this.totalStudyMinutes / 60) * 10) / 10;
  }

  get levelProgress(): number {
    const prevLevelXp = this.calculateXpForLevel(this.currentLevel);
    const nextLevelXp = this.calculateXpForLevel(this.currentLevel + 1);
    const currentProgress = this.totalXp - prevLevelXp;
    const levelRange = nextLevelXp - prevLevelXp;
    return Math.round((currentProgress / levelRange) * 100);
  }

  private calculateXpForLevel(level: number): number {
    // XP formula: 100 * level * 1.5^(level-1)
    return Math.floor(100 * level * Math.pow(1.5, level - 1));
  }
}
```

### 2. User Daily Stats Entity

```typescript
// src/modules/dashboard/entities/user-daily-stats.entity.ts
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

@Entity('user_daily_stats')
@Index(['userId', 'date'], { unique: true })
@Index(['date']) // For leaderboard queries
export class UserDailyStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  // Daily Metrics
  @Column({ name: 'study_minutes', type: 'int', default: 0 })
  studyMinutes: number;

  @Column({ name: 'tests_completed', type: 'int', default: 0 })
  testsCompleted: number;

  @Column({ name: 'practice_sessions', type: 'int', default: 0 })
  practiceSessions: number;

  @Column({ name: 'questions_answered', type: 'int', default: 0 })
  questionsAnswered: number;

  @Column({ name: 'correct_answers', type: 'int', default: 0 })
  correctAnswers: number;

  // Daily Scores
  @Column({ name: 'average_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  averageScore: number;

  @Column({ name: 'highest_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  highestScore: number;

  // Daily XP
  @Column({ name: 'xp_earned', type: 'int', default: 0 })
  xpEarned: number;

  // Skills practiced
  @Column({ name: 'reading_minutes', type: 'int', default: 0 })
  readingMinutes: number;

  @Column({ name: 'listening_minutes', type: 'int', default: 0 })
  listeningMinutes: number;

  @Column({ name: 'writing_minutes', type: 'int', default: 0 })
  writingMinutes: number;

  @Column({ name: 'speaking_minutes', type: 'int', default: 0 })
  speakingMinutes: number;

  // Streak status
  @Column({ name: 'goal_met', type: 'boolean', default: false })
  goalMet: boolean;

  // Activity count for calendar intensity
  @Column({ name: 'activity_count', type: 'int', default: 0 })
  activityCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Computed
  get accuracy(): number {
    if (this.questionsAnswered === 0) return 0;
    return Math.round((this.correctAnswers / this.questionsAnswered) * 100);
  }

  get intensity(): 'none' | 'low' | 'medium' | 'high' | 'extreme' {
    if (this.studyMinutes === 0) return 'none';
    if (this.studyMinutes < 15) return 'low';
    if (this.studyMinutes < 45) return 'medium';
    if (this.studyMinutes < 90) return 'high';
    return 'extreme';
  }
}
```

### 3. XP Transaction Entity

```typescript
// src/modules/dashboard/entities/xp-transaction.entity.ts
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

export enum XpSource {
  PRACTICE_COMPLETE = 'practice_complete',
  TEST_COMPLETE = 'test_complete',
  DAILY_STREAK = 'daily_streak',
  WEEKLY_GOAL = 'weekly_goal',
  ACHIEVEMENT_UNLOCK = 'achievement_unlock',
  PERFECT_SCORE = 'perfect_score',
  FIRST_OF_DAY = 'first_of_day',
  LEVEL_UP_BONUS = 'level_up_bonus',
  SKILL_IMPROVEMENT = 'skill_improvement',
  REFERRAL = 'referral',
  ADMIN_GRANT = 'admin_grant',
  ADMIN_DEDUCT = 'admin_deduct',
}

@Entity('xp_transactions')
@Index(['userId', 'createdAt'])
@Index(['source', 'createdAt'])
export class XpTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  amount: number; // Positive for earn, negative for deduct

  @Column({ type: 'enum', enum: XpSource })
  source: XpSource;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string; // 'practice_session', 'exam_attempt', 'achievement', etc.

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string;

  @Column({ name: 'balance_before', type: 'int' })
  balanceBefore: number;

  @Column({ name: 'balance_after', type: 'int' })
  balanceAfter: number;

  @Column({ name: 'level_before', type: 'int' })
  levelBefore: number;

  @Column({ name: 'level_after', type: 'int' })
  levelAfter: number;

  // Metadata for bonus calculations
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get isEarning(): boolean {
    return this.amount > 0;
  }

  get causedLevelUp(): boolean {
    return this.levelAfter > this.levelBefore;
  }
}
```

### 4. DTOs

```typescript
// src/modules/dashboard/dto/user-stats.dto.ts
import { IsOptional, IsNumber, IsString, IsDate, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserStatsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  // Study metrics
  @ApiProperty()
  totalStudyMinutes: number;

  @ApiProperty()
  totalStudyHours: number;

  @ApiProperty()
  totalTestsCompleted: number;

  @ApiProperty()
  totalPracticeSessions: number;

  @ApiProperty()
  totalQuestionsAnswered: number;

  @ApiProperty()
  totalCorrectAnswers: number;

  @ApiProperty()
  accuracy: number;

  // Scores
  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  highestScore: number;

  @ApiPropertyOptional()
  latestScore?: number;

  // Skill averages
  @ApiProperty()
  readingAverage: number;

  @ApiProperty()
  listeningAverage: number;

  @ApiProperty()
  writingAverage: number;

  @ApiProperty()
  speakingAverage: number;

  // XP & Level
  @ApiProperty()
  totalXp: number;

  @ApiProperty()
  currentLevel: number;

  @ApiProperty()
  xpToNextLevel: number;

  @ApiProperty()
  levelProgress: number;

  // Streaks
  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;

  @ApiPropertyOptional()
  lastActivityDate?: Date;

  // Achievements
  @ApiProperty()
  totalBadges: number;

  @ApiProperty()
  totalAchievements: number;

  // Goals
  @ApiProperty()
  weeklyGoalMinutes: number;

  @ApiPropertyOptional()
  currentVstepLevel?: string;

  @ApiPropertyOptional()
  targetVstepLevel?: string;

  @ApiPropertyOptional()
  targetExamDate?: Date;
}

export class UpdateUserGoalsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(1200)
  weeklyGoalMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(['A2', 'B1', 'B2', 'C1'])
  targetVstepLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetExamDate?: Date;
}

export class DailyStatsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

export class DailyStatsResponseDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  studyMinutes: number;

  @ApiProperty()
  testsCompleted: number;

  @ApiProperty()
  practiceSessions: number;

  @ApiProperty()
  questionsAnswered: number;

  @ApiProperty()
  accuracy: number;

  @ApiPropertyOptional()
  averageScore?: number;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  goalMet: boolean;

  @ApiProperty({ enum: ['none', 'low', 'medium', 'high', 'extreme'] })
  intensity: string;

  @ApiProperty()
  skillBreakdown: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
}

export class CalendarDataResponseDto {
  @ApiProperty({ type: [DailyStatsResponseDto] })
  data: DailyStatsResponseDto[];

  @ApiProperty()
  totalDays: number;

  @ApiProperty()
  activeDays: number;

  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;
}

export class XpTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  source: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  balanceAfter: number;

  @ApiProperty()
  levelAfter: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  causedLevelUp: boolean;
}

export class XpHistoryQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(XpSource)
  source?: XpSource;
}

import { XpSource } from '../entities/xp-transaction.entity';
```

### 5. Repository

```typescript
// src/modules/dashboard/repositories/user-stats.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { UserStats } from '../entities/user-stats.entity';
import { UserDailyStats } from '../entities/user-daily-stats.entity';
import { XpTransaction, XpSource } from '../entities/xp-transaction.entity';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

@Injectable()
export class UserStatsRepository extends Repository<UserStats> {
  constructor(private dataSource: DataSource) {
    super(UserStats, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<UserStats | null> {
    return this.findOne({ where: { userId } });
  }

  async getOrCreate(userId: string): Promise<UserStats> {
    let stats = await this.findByUserId(userId);
    if (!stats) {
      stats = this.create({ userId });
      await this.save(stats);
    }
    return stats;
  }

  async updateStudyTime(userId: string, minutes: number): Promise<UserStats> {
    const stats = await this.getOrCreate(userId);
    stats.totalStudyMinutes += minutes;
    stats.lastActivityDate = new Date();
    return this.save(stats);
  }

  async incrementTestsCompleted(userId: string): Promise<UserStats> {
    const stats = await this.getOrCreate(userId);
    stats.totalTestsCompleted += 1;
    stats.lastActivityDate = new Date();
    return this.save(stats);
  }

  async updateScore(userId: string, score: number, skill?: string): Promise<UserStats> {
    const stats = await this.getOrCreate(userId);
    
    // Update latest score
    stats.latestScore = score;
    
    // Update highest score
    if (score > stats.highestScore) {
      stats.highestScore = score;
    }
    
    // Recalculate average (simple moving average)
    const totalScores = stats.totalTestsCompleted + stats.totalPracticeSessions;
    if (totalScores > 0) {
      stats.averageScore = 
        (stats.averageScore * (totalScores - 1) + score) / totalScores;
    } else {
      stats.averageScore = score;
    }
    
    // Update skill average if specified
    if (skill) {
      const skillKey = `${skill}Average` as keyof UserStats;
      if (skillKey in stats) {
        // Update skill-specific average
        (stats as any)[skillKey] = 
          ((stats as any)[skillKey] * (totalScores - 1) + score) / totalScores;
      }
    }
    
    stats.lastActivityDate = new Date();
    return this.save(stats);
  }

  async addXp(userId: string, amount: number): Promise<{ stats: UserStats; leveledUp: boolean }> {
    const stats = await this.getOrCreate(userId);
    const prevLevel = stats.currentLevel;
    
    stats.totalXp += amount;
    
    // Check for level up
    while (stats.totalXp >= this.calculateXpForLevel(stats.currentLevel + 1)) {
      stats.currentLevel += 1;
    }
    
    // Update XP to next level
    stats.xpToNextLevel = this.calculateXpForLevel(stats.currentLevel + 1) - stats.totalXp;
    
    return {
      stats: await this.save(stats),
      leveledUp: stats.currentLevel > prevLevel,
    };
  }

  async updateStreak(userId: string, currentStreak: number): Promise<UserStats> {
    const stats = await this.getOrCreate(userId);
    stats.currentStreak = currentStreak;
    
    if (currentStreak > stats.longestStreak) {
      stats.longestStreak = currentStreak;
    }
    
    return this.save(stats);
  }

  async getLeaderboard(
    limit: number = 10,
    offset: number = 0,
    period?: 'week' | 'month' | 'all',
    vstepLevel?: string,
  ): Promise<{ stats: UserStats; rank: number }[]> {
    const query = this.createQueryBuilder('stats')
      .leftJoinAndSelect('stats.user', 'user')
      .orderBy('stats.totalXp', 'DESC')
      .skip(offset)
      .take(limit);

    if (vstepLevel) {
      query.where('stats.currentVstepLevel = :level', { level: vstepLevel });
    }

    const results = await query.getMany();
    
    return results.map((stats, index) => ({
      stats,
      rank: offset + index + 1,
    }));
  }

  private calculateXpForLevel(level: number): number {
    return Math.floor(100 * level * Math.pow(1.5, level - 1));
  }
}

@Injectable()
export class UserDailyStatsRepository extends Repository<UserDailyStats> {
  constructor(private dataSource: DataSource) {
    super(UserDailyStats, dataSource.createEntityManager());
  }

  async findByUserAndDate(userId: string, date: Date): Promise<UserDailyStats | null> {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.findOne({ 
      where: { 
        userId,
        date: dateStr as any,
      } 
    });
  }

  async getOrCreate(userId: string, date: Date = new Date()): Promise<UserDailyStats> {
    let dailyStats = await this.findByUserAndDate(userId, date);
    if (!dailyStats) {
      dailyStats = this.create({
        userId,
        date: startOfDay(date),
      });
      await this.save(dailyStats);
    }
    return dailyStats;
  }

  async incrementMetrics(
    userId: string,
    date: Date,
    metrics: Partial<{
      studyMinutes: number;
      testsCompleted: number;
      practiceSessions: number;
      questionsAnswered: number;
      correctAnswers: number;
      xpEarned: number;
      readingMinutes: number;
      listeningMinutes: number;
      writingMinutes: number;
      speakingMinutes: number;
    }>,
  ): Promise<UserDailyStats> {
    const dailyStats = await this.getOrCreate(userId, date);
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (value && key in dailyStats) {
        (dailyStats as any)[key] += value;
      }
    });
    
    dailyStats.activityCount += 1;
    
    return this.save(dailyStats);
  }

  async getDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserDailyStats[]> {
    return this.find({
      where: {
        userId,
        date: Between(startOfDay(startDate), endOfDay(endDate)),
      },
      order: { date: 'ASC' },
    });
  }

  async getCalendarData(userId: string, year: number): Promise<UserDailyStats[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    return this.getDateRange(userId, startDate, endDate);
  }

  async getRecentDays(userId: string, days: number = 30): Promise<UserDailyStats[]> {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    return this.getDateRange(userId, startDate, endDate);
  }

  async calculateStreak(userId: string): Promise<{ current: number; longest: number }> {
    const dailyStats = await this.find({
      where: { userId },
      order: { date: 'DESC' },
      select: ['date', 'studyMinutes', 'goalMet'],
    });

    if (dailyStats.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const stats of dailyStats) {
      const statsDate = new Date(stats.date);
      
      if (stats.studyMinutes > 0) {
        if (lastDate === null) {
          // First entry
          tempStreak = 1;
        } else {
          const dayDiff = Math.floor(
            (lastDate.getTime() - statsDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (dayDiff === 1) {
            // Consecutive day
            tempStreak += 1;
          } else {
            // Gap in streak
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
        lastDate = statsDate;
      }
    }

    // Check if current streak is active (includes today or yesterday)
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const lastActive = lastDate ? startOfDay(lastDate) : null;

    if (lastActive && (lastActive >= yesterday)) {
      currentStreak = tempStreak;
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { current: currentStreak, longest: longestStreak };
  }
}

@Injectable()
export class XpTransactionRepository extends Repository<XpTransaction> {
  constructor(private dataSource: DataSource) {
    super(XpTransaction, dataSource.createEntityManager());
  }

  async createTransaction(
    userId: string,
    amount: number,
    source: XpSource,
    currentStats: UserStats,
    options?: {
      description?: string;
      referenceType?: string;
      referenceId?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<XpTransaction> {
    const transaction = this.create({
      userId,
      amount,
      source,
      description: options?.description,
      referenceType: options?.referenceType,
      referenceId: options?.referenceId,
      metadata: options?.metadata,
      balanceBefore: currentStats.totalXp,
      balanceAfter: currentStats.totalXp + amount,
      levelBefore: currentStats.currentLevel,
      levelAfter: currentStats.currentLevel, // Will be updated after save
    });

    return this.save(transaction);
  }

  async getUserHistory(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      source?: XpSource;
    },
  ): Promise<{ transactions: XpTransaction[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (options?.source) {
      where.source = options.source;
    }

    const [transactions, total] = await this.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { transactions, total };
  }

  async getTotalEarnedToday(userId: string): Promise<number> {
    const today = startOfDay(new Date());
    
    const result = await this.createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'total')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.createdAt >= :today', { today })
      .andWhere('tx.amount > 0')
      .getRawOne();

    return result?.total || 0;
  }

  async getEarningsByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; amount: number }[]> {
    const results = await this.createQueryBuilder('tx')
      .select("DATE(tx.created_at)", 'date')
      .addSelect('SUM(tx.amount)', 'amount')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.createdAt BETWEEN :start AND :end', { 
        start: startDate, 
        end: endDate 
      })
      .andWhere('tx.amount > 0')
      .groupBy("DATE(tx.created_at)")
      .orderBy('date', 'ASC')
      .getRawMany();

    return results;
  }
}
```

### 6. Migration

```typescript
// src/migrations/XXXXXX-CreateUserStatsTable.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUserStatsTable1700000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // User Stats table
    await queryRunner.createTable(
      new Table({
        name: 'user_stats',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid', isUnique: true },
          { name: 'total_study_minutes', type: 'int', default: 0 },
          { name: 'total_tests_completed', type: 'int', default: 0 },
          { name: 'total_practice_sessions', type: 'int', default: 0 },
          { name: 'total_questions_answered', type: 'int', default: 0 },
          { name: 'total_correct_answers', type: 'int', default: 0 },
          { name: 'average_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'highest_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'latest_score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'reading_average', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'listening_average', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'writing_average', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'speaking_average', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'total_xp', type: 'int', default: 0 },
          { name: 'current_level', type: 'int', default: 1 },
          { name: 'xp_to_next_level', type: 'int', default: 100 },
          { name: 'current_streak', type: 'int', default: 0 },
          { name: 'longest_streak', type: 'int', default: 0 },
          { name: 'last_activity_date', type: 'date', isNullable: true },
          { name: 'total_badges', type: 'int', default: 0 },
          { name: 'total_achievements', type: 'int', default: 0 },
          { name: 'weekly_goal_minutes', type: 'int', default: 300 },
          { name: 'current_vstep_level', type: 'varchar', length: '10', isNullable: true },
          { name: 'target_vstep_level', type: 'varchar', length: '10', isNullable: true },
          { name: 'target_exam_date', type: 'date', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'user_stats',
      new TableIndex({
        name: 'IDX_user_stats_xp_level',
        columnNames: ['total_xp', 'current_level'],
      }),
    );

    // User Daily Stats table
    await queryRunner.createTable(
      new Table({
        name: 'user_daily_stats',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'study_minutes', type: 'int', default: 0 },
          { name: 'tests_completed', type: 'int', default: 0 },
          { name: 'practice_sessions', type: 'int', default: 0 },
          { name: 'questions_answered', type: 'int', default: 0 },
          { name: 'correct_answers', type: 'int', default: 0 },
          { name: 'average_score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'highest_score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'xp_earned', type: 'int', default: 0 },
          { name: 'reading_minutes', type: 'int', default: 0 },
          { name: 'listening_minutes', type: 'int', default: 0 },
          { name: 'writing_minutes', type: 'int', default: 0 },
          { name: 'speaking_minutes', type: 'int', default: 0 },
          { name: 'goal_met', type: 'boolean', default: false },
          { name: 'activity_count', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'user_daily_stats',
      new TableIndex({
        name: 'IDX_user_daily_stats_user_date',
        columnNames: ['user_id', 'date'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'user_daily_stats',
      new TableIndex({
        name: 'IDX_user_daily_stats_date',
        columnNames: ['date'],
      }),
    );

    // XP Transactions table
    await queryRunner.createTable(
      new Table({
        name: 'xp_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'amount', type: 'int' },
          { 
            name: 'source', 
            type: 'enum', 
            enum: [
              'practice_complete',
              'test_complete',
              'daily_streak',
              'weekly_goal',
              'achievement_unlock',
              'perfect_score',
              'first_of_day',
              'level_up_bonus',
              'skill_improvement',
              'referral',
              'admin_grant',
              'admin_deduct',
            ],
          },
          { name: 'description', type: 'varchar', length: '500', isNullable: true },
          { name: 'reference_type', type: 'varchar', length: '50', isNullable: true },
          { name: 'reference_id', type: 'uuid', isNullable: true },
          { name: 'balance_before', type: 'int' },
          { name: 'balance_after', type: 'int' },
          { name: 'level_before', type: 'int' },
          { name: 'level_after', type: 'int' },
          { name: 'metadata', type: 'json', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'xp_transactions',
      new TableIndex({
        name: 'IDX_xp_transactions_user_created',
        columnNames: ['user_id', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'xp_transactions',
      new TableIndex({
        name: 'IDX_xp_transactions_source',
        columnNames: ['source', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('xp_transactions');
    await queryRunner.dropTable('user_daily_stats');
    await queryRunner.dropTable('user_stats');
  }
}
```

### 7. Module Registration

```typescript
// src/modules/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStats } from './entities/user-stats.entity';
import { UserDailyStats } from './entities/user-daily-stats.entity';
import { XpTransaction } from './entities/xp-transaction.entity';
import { UserStatsRepository, UserDailyStatsRepository, XpTransactionRepository } from './repositories/user-stats.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStats, UserDailyStats, XpTransaction]),
  ],
  providers: [
    UserStatsRepository,
    UserDailyStatsRepository,
    XpTransactionRepository,
  ],
  exports: [
    UserStatsRepository,
    UserDailyStatsRepository,
    XpTransactionRepository,
    TypeOrmModule,
  ],
})
export class DashboardModule {}
```

---

## Next Task

Continue with **BE-029: Analytics Service** - Implement analytics calculations and aggregations.
