# Task: BE-033 - Streak Calculation

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-033 |
| **Task Name** | Streak Calculation |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P1 (High) |
| **Dependencies** | BE-031 |

---

## Description

Implement streak calculation và tracking để:
- Tính toán streak liên tục
- Cấp XP bonus cho streak milestones
- Streak freeze feature (premium)
- Streak recovery
- Streak notifications

---

## Acceptance Criteria

- [ ] Streak calculation service
- [ ] Daily streak update logic
- [ ] Streak milestone bonuses (7, 30, 100 days)
- [ ] Streak freeze feature cho premium users
- [ ] Streak recovery trong 24h
- [ ] Streak history tracking
- [ ] Notifications khi gần mất streak

---

## Implementation

### 1. Streak Entity

```typescript
// src/modules/dashboard/entities/streak.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_streaks')
export class UserStreak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Current streak
  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak: number;

  @Column({ name: 'longest_streak', type: 'int', default: 0 })
  longestStreak: number;

  // Dates
  @Column({ name: 'streak_start_date', type: 'date', nullable: true })
  streakStartDate: Date;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  lastActivityDate: Date;

  // Freeze feature
  @Column({ name: 'freeze_count', type: 'int', default: 0 })
  freezeCount: number;

  @Column({ name: 'freeze_used_today', type: 'boolean', default: false })
  freezeUsedToday: boolean;

  @Column({ name: 'last_freeze_date', type: 'date', nullable: true })
  lastFreezeDate: Date;

  // Recovery
  @Column({ name: 'can_recover', type: 'boolean', default: false })
  canRecover: boolean;

  @Column({ name: 'recovery_deadline', type: 'timestamp', nullable: true })
  recoveryDeadline: Date;

  @Column({ name: 'streak_before_break', type: 'int', default: 0 })
  streakBeforeBreak: number;

  // Stats
  @Column({ name: 'total_active_days', type: 'int', default: 0 })
  totalActiveDays: number;

  @Column({ name: 'total_streak_bonuses', type: 'int', default: 0 })
  totalStreakBonuses: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get isActive(): boolean {
    if (!this.lastActivityDate) return false;
    const today = new Date();
    const lastActive = new Date(this.lastActivityDate);
    const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }

  get daysUntilStreakLost(): number {
    if (!this.lastActivityDate) return 0;
    const today = new Date();
    const lastActive = new Date(this.lastActivityDate);
    const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 1 - diffDays);
  }
}
```

### 2. Streak History Entity

```typescript
// src/modules/dashboard/entities/streak-history.entity.ts
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

export enum StreakEventType {
  STARTED = 'started',
  CONTINUED = 'continued',
  FROZEN = 'frozen',
  LOST = 'lost',
  RECOVERED = 'recovered',
  MILESTONE_7 = 'milestone_7',
  MILESTONE_30 = 'milestone_30',
  MILESTONE_100 = 'milestone_100',
  MILESTONE_365 = 'milestone_365',
}

@Entity('streak_history')
@Index(['userId', 'createdAt'])
export class StreakHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: StreakEventType })
  eventType: StreakEventType;

  @Column({ name: 'streak_value', type: 'int' })
  streakValue: number;

  @Column({ name: 'xp_bonus', type: 'int', default: 0 })
  xpBonus: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 3. Streak Service

```typescript
// src/modules/dashboard/services/streak.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStreak } from '../entities/streak.entity';
import { StreakHistory, StreakEventType } from '../entities/streak-history.entity';
import { UserStatsRepository, UserDailyStatsRepository } from '../repositories/user-stats.repository';
import { XpService } from './xp.service';
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  isSameDay, 
  differenceInDays,
  addHours,
} from 'date-fns';

export interface StreakStatus {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  lastActivityDate: Date | null;
  streakStartDate: Date | null;
  daysUntilLost: number;
  canRecover: boolean;
  recoveryDeadline: Date | null;
  streakBeforeBreak: number;
  freezeCount: number;
  hasActivityToday: boolean;
  nextMilestone: {
    days: number;
    remaining: number;
    xpBonus: number;
  } | null;
}

export interface StreakMilestone {
  days: number;
  xpBonus: number;
  name: string;
  icon: string;
}

@Injectable()
export class StreakService {
  private readonly MILESTONES: StreakMilestone[] = [
    { days: 7, xpBonus: 50, name: 'Một tuần', icon: '🔥' },
    { days: 14, xpBonus: 75, name: 'Hai tuần', icon: '🔥' },
    { days: 30, xpBonus: 150, name: 'Một tháng', icon: '🔥🔥' },
    { days: 60, xpBonus: 200, name: 'Hai tháng', icon: '🔥🔥' },
    { days: 100, xpBonus: 500, name: '100 ngày', icon: '🔥🔥🔥' },
    { days: 365, xpBonus: 1000, name: 'Một năm', icon: '👑' },
  ];

  private readonly DAILY_STREAK_XP = 5; // Base XP per day
  private readonly RECOVERY_HOURS = 24;
  private readonly FREEZE_COST_XP = 100;

  constructor(
    @InjectRepository(UserStreak)
    private readonly streakRepo: Repository<UserStreak>,
    @InjectRepository(StreakHistory)
    private readonly historyRepo: Repository<StreakHistory>,
    private readonly userStatsRepo: UserStatsRepository,
    private readonly dailyStatsRepo: UserDailyStatsRepository,
    private readonly xpService: XpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== Get Streak Status ====================

  async getStreakStatus(userId: string): Promise<StreakStatus> {
    const streak = await this.getOrCreateStreak(userId);
    const today = startOfDay(new Date());
    const hasActivityToday = await this.hasActivityToday(userId);

    // Calculate days until lost
    let daysUntilLost = 0;
    if (streak.lastActivityDate && streak.currentStreak > 0) {
      const lastActive = startOfDay(new Date(streak.lastActivityDate));
      const diffDays = differenceInDays(today, lastActive);
      daysUntilLost = Math.max(0, 1 - diffDays);
    }

    // Find next milestone
    const nextMilestone = this.getNextMilestone(streak.currentStreak);

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isActive: streak.isActive,
      lastActivityDate: streak.lastActivityDate,
      streakStartDate: streak.streakStartDate,
      daysUntilLost,
      canRecover: streak.canRecover && streak.recoveryDeadline && new Date() < streak.recoveryDeadline,
      recoveryDeadline: streak.recoveryDeadline,
      streakBeforeBreak: streak.streakBeforeBreak,
      freezeCount: streak.freezeCount,
      hasActivityToday,
      nextMilestone,
    };
  }

  async getStreakHistory(userId: string, limit: number = 30): Promise<StreakHistory[]> {
    return this.historyRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ==================== Update Streak ====================

  async recordActivity(userId: string): Promise<{
    streak: UserStreak;
    xpEarned: number;
    milestone?: StreakMilestone;
    isNewStreak: boolean;
  }> {
    const streak = await this.getOrCreateStreak(userId);
    const today = startOfDay(new Date());
    const hasActivityToday = await this.hasActivityToday(userId);

    if (hasActivityToday) {
      // Already recorded today
      return { streak, xpEarned: 0, isNewStreak: false };
    }

    let xpEarned = 0;
    let milestone: StreakMilestone | undefined;
    let isNewStreak = false;

    if (!streak.lastActivityDate) {
      // First ever activity
      streak.currentStreak = 1;
      streak.streakStartDate = today;
      isNewStreak = true;
      
      await this.logHistory(userId, StreakEventType.STARTED, 1, 'Bắt đầu streak mới');
      this.eventEmitter.emit('streak.update', { userId, streakDays: 1, type: 'started' });
    } else {
      const lastActive = startOfDay(new Date(streak.lastActivityDate));
      const diffDays = differenceInDays(today, lastActive);

      if (diffDays === 0) {
        // Same day, no change
        return { streak, xpEarned: 0, isNewStreak: false };
      } else if (diffDays === 1) {
        // Consecutive day - continue streak
        streak.currentStreak += 1;
        
        // Check for milestones
        const reachedMilestone = this.MILESTONES.find(m => m.days === streak.currentStreak);
        if (reachedMilestone) {
          milestone = reachedMilestone;
          xpEarned += reachedMilestone.xpBonus;
          streak.totalStreakBonuses += reachedMilestone.xpBonus;
          
          await this.logHistory(
            userId, 
            this.getMilestoneEventType(reachedMilestone.days),
            streak.currentStreak,
            `Đạt mốc ${reachedMilestone.name}!`,
            reachedMilestone.xpBonus,
          );
          
          this.eventEmitter.emit('streak.update', { 
            userId, 
            streakDays: streak.currentStreak, 
            type: 'milestone' 
          });
        } else {
          await this.logHistory(userId, StreakEventType.CONTINUED, streak.currentStreak);
          this.eventEmitter.emit('streak.update', { 
            userId, 
            streakDays: streak.currentStreak, 
            type: 'continued' 
          });
        }
      } else if (diffDays === 2 && streak.freezeCount > 0 && !streak.freezeUsedToday) {
        // Use freeze
        streak.freezeCount -= 1;
        streak.freezeUsedToday = true;
        streak.lastFreezeDate = today;
        
        await this.logHistory(userId, StreakEventType.FROZEN, streak.currentStreak, 'Đã dùng streak freeze');
      } else {
        // Streak broken
        await this.breakStreak(userId, streak);
        
        // Start new streak
        streak.currentStreak = 1;
        streak.streakStartDate = today;
        isNewStreak = true;
        
        await this.logHistory(userId, StreakEventType.STARTED, 1, 'Bắt đầu streak mới');
        this.eventEmitter.emit('streak.update', { userId, streakDays: 1, type: 'started' });
      }
    }

    // Update last activity
    streak.lastActivityDate = today;
    streak.totalActiveDays += 1;
    streak.freezeUsedToday = false;

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // Clear recovery state
    streak.canRecover = false;
    streak.recoveryDeadline = null;
    streak.streakBeforeBreak = 0;

    await this.streakRepo.save(streak);

    // Update user stats
    await this.userStatsRepo.updateStreak(userId, streak.currentStreak);

    // Award daily XP
    const dailyXp = this.calculateDailyXp(streak.currentStreak);
    xpEarned += dailyXp;

    if (xpEarned > 0) {
      await this.xpService.awardXp(userId, xpEarned, 'daily_streak', {
        description: `Streak ngày ${streak.currentStreak}`,
        metadata: { streakDays: streak.currentStreak },
      });
    }

    return { streak, xpEarned, milestone, isNewStreak };
  }

  private async breakStreak(userId: string, streak: UserStreak): Promise<void> {
    if (streak.currentStreak === 0) return;

    // Log streak lost
    await this.logHistory(
      userId, 
      StreakEventType.LOST, 
      streak.currentStreak,
      `Mất streak ${streak.currentStreak} ngày`,
    );

    // Emit event
    this.eventEmitter.emit('streak.update', { 
      userId, 
      streakDays: streak.currentStreak, 
      type: 'lost' 
    });

    // Allow recovery for significant streaks
    if (streak.currentStreak >= 7) {
      streak.canRecover = true;
      streak.recoveryDeadline = addHours(new Date(), this.RECOVERY_HOURS);
      streak.streakBeforeBreak = streak.currentStreak;
    }

    streak.currentStreak = 0;
    streak.streakStartDate = null;
  }

  // ==================== Streak Recovery ====================

  async recoverStreak(userId: string): Promise<UserStreak> {
    const streak = await this.getOrCreateStreak(userId);

    if (!streak.canRecover) {
      throw new BadRequestException('Không thể khôi phục streak');
    }

    if (streak.recoveryDeadline && new Date() > streak.recoveryDeadline) {
      throw new BadRequestException('Đã quá thời hạn khôi phục streak');
    }

    // Deduct XP for recovery
    const recoveryCost = Math.min(100, streak.streakBeforeBreak * 5);
    const stats = await this.userStatsRepo.findByUserId(userId);
    
    if (!stats || stats.totalXp < recoveryCost) {
      throw new BadRequestException(`Cần ${recoveryCost} XP để khôi phục streak`);
    }

    await this.xpService.deductXp(userId, recoveryCost, 'Khôi phục streak');

    // Restore streak
    streak.currentStreak = streak.streakBeforeBreak;
    streak.lastActivityDate = startOfDay(new Date());
    streak.canRecover = false;
    streak.recoveryDeadline = null;
    streak.streakBeforeBreak = 0;

    await this.streakRepo.save(streak);
    await this.userStatsRepo.updateStreak(userId, streak.currentStreak);

    await this.logHistory(
      userId, 
      StreakEventType.RECOVERED, 
      streak.currentStreak,
      `Khôi phục streak ${streak.currentStreak} ngày`,
    );

    return streak;
  }

  // ==================== Streak Freeze ====================

  async purchaseFreeze(userId: string): Promise<UserStreak> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    
    if (!stats || stats.totalXp < this.FREEZE_COST_XP) {
      throw new BadRequestException(`Cần ${this.FREEZE_COST_XP} XP để mua streak freeze`);
    }

    await this.xpService.deductXp(userId, this.FREEZE_COST_XP, 'Mua streak freeze');

    const streak = await this.getOrCreateStreak(userId);
    streak.freezeCount += 1;
    
    return this.streakRepo.save(streak);
  }

  async getFreezeCount(userId: string): Promise<number> {
    const streak = await this.getOrCreateStreak(userId);
    return streak.freezeCount;
  }

  // ==================== Check Streak Status ====================

  async checkAndUpdateStreaks(): Promise<void> {
    // This should be run by a cron job daily
    const yesterday = subDays(startOfDay(new Date()), 1);
    
    // Find all streaks that might need updating
    const streaks = await this.streakRepo.find({
      where: {
        currentStreak: 1, // At least 1 day streak
      },
    });

    for (const streak of streaks) {
      if (!streak.lastActivityDate) continue;

      const lastActive = startOfDay(new Date(streak.lastActivityDate));
      const diffDays = differenceInDays(startOfDay(new Date()), lastActive);

      if (diffDays > 1) {
        // Check if freeze can be auto-applied
        if (streak.freezeCount > 0 && !streak.freezeUsedToday && diffDays === 2) {
          streak.freezeCount -= 1;
          streak.freezeUsedToday = true;
          streak.lastFreezeDate = new Date();
          
          await this.logHistory(
            streak.userId, 
            StreakEventType.FROZEN, 
            streak.currentStreak,
            'Tự động sử dụng streak freeze',
          );
        } else {
          // Break streak
          await this.breakStreak(streak.userId, streak);
        }
        
        await this.streakRepo.save(streak);
      }
    }
  }

  // ==================== Helper Methods ====================

  private async getOrCreateStreak(userId: string): Promise<UserStreak> {
    let streak = await this.streakRepo.findOne({ where: { userId } });
    
    if (!streak) {
      streak = this.streakRepo.create({ userId });
      await this.streakRepo.save(streak);
    }
    
    return streak;
  }

  private async hasActivityToday(userId: string): Promise<boolean> {
    const today = startOfDay(new Date());
    const dailyStats = await this.dailyStatsRepo.findByUserAndDate(userId, today);
    return dailyStats !== null && dailyStats.studyMinutes > 0;
  }

  private calculateDailyXp(streakDays: number): number {
    // Base 5 XP + bonus based on streak length
    let bonus = 0;
    if (streakDays >= 100) bonus = 10;
    else if (streakDays >= 30) bonus = 5;
    else if (streakDays >= 7) bonus = 2;
    
    return this.DAILY_STREAK_XP + bonus;
  }

  private getNextMilestone(currentStreak: number): StreakStatus['nextMilestone'] {
    const next = this.MILESTONES.find(m => m.days > currentStreak);
    if (!next) return null;
    
    return {
      days: next.days,
      remaining: next.days - currentStreak,
      xpBonus: next.xpBonus,
    };
  }

  private getMilestoneEventType(days: number): StreakEventType {
    switch (days) {
      case 7: return StreakEventType.MILESTONE_7;
      case 30: return StreakEventType.MILESTONE_30;
      case 100: return StreakEventType.MILESTONE_100;
      case 365: return StreakEventType.MILESTONE_365;
      default: return StreakEventType.CONTINUED;
    }
  }

  private async logHistory(
    userId: string,
    eventType: StreakEventType,
    streakValue: number,
    description?: string,
    xpBonus: number = 0,
  ): Promise<void> {
    await this.historyRepo.save({
      userId,
      eventType,
      streakValue,
      xpBonus,
      description,
    });
  }
}
```

### 4. Streak Controller

```typescript
// src/modules/dashboard/controllers/streak.controller.ts
import {
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { StreakService } from '../services/streak.service';

@ApiTags('Streak')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  @ApiOperation({ summary: 'Get current streak status' })
  async getStatus(@CurrentUser('id') userId: string) {
    return this.streakService.getStreakStatus(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get streak history' })
  async getHistory(@CurrentUser('id') userId: string) {
    return this.streakService.getStreakHistory(userId);
  }

  @Post('record')
  @ApiOperation({ summary: 'Record activity and update streak' })
  async recordActivity(@CurrentUser('id') userId: string) {
    return this.streakService.recordActivity(userId);
  }

  @Post('recover')
  @ApiOperation({ summary: 'Recover lost streak (costs XP)' })
  async recover(@CurrentUser('id') userId: string) {
    return this.streakService.recoverStreak(userId);
  }

  @Get('freeze')
  @ApiOperation({ summary: 'Get freeze count' })
  async getFreezeCount(@CurrentUser('id') userId: string) {
    return { freezeCount: await this.streakService.getFreezeCount(userId) };
  }

  @Post('freeze/purchase')
  @ApiOperation({ summary: 'Purchase streak freeze (costs XP)' })
  async purchaseFreeze(@CurrentUser('id') userId: string) {
    return this.streakService.purchaseFreeze(userId);
  }
}
```

### 5. Streak DTOs

```typescript
// src/modules/dashboard/dto/streak.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StreakStatusResponseDto {
  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastActivityDate?: Date;

  @ApiPropertyOptional()
  streakStartDate?: Date;

  @ApiProperty()
  daysUntilLost: number;

  @ApiProperty()
  canRecover: boolean;

  @ApiPropertyOptional()
  recoveryDeadline?: Date;

  @ApiProperty()
  streakBeforeBreak: number;

  @ApiProperty()
  freezeCount: number;

  @ApiProperty()
  hasActivityToday: boolean;

  @ApiPropertyOptional()
  nextMilestone?: {
    days: number;
    remaining: number;
    xpBonus: number;
  };
}

export class StreakHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty()
  streakValue: number;

  @ApiProperty()
  xpBonus: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;
}

export class RecordActivityResponseDto {
  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  isNewStreak: boolean;

  @ApiPropertyOptional()
  milestone?: {
    days: number;
    xpBonus: number;
    name: string;
    icon: string;
  };
}
```

### 6. Cron Job for Daily Streak Check

```typescript
// src/modules/dashboard/crons/streak.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StreakService } from '../services/streak.service';

@Injectable()
export class StreakCronService {
  private readonly logger = new Logger(StreakCronService.name);

  constructor(private readonly streakService: StreakService) {}

  // Run at midnight every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleStreakCheck(): Promise<void> {
    this.logger.log('Starting daily streak check...');
    
    try {
      await this.streakService.checkAndUpdateStreaks();
      this.logger.log('Daily streak check completed');
    } catch (error) {
      this.logger.error('Error during streak check:', error);
    }
  }

  // Run every 6 hours to send reminder notifications
  @Cron('0 */6 * * *')
  async handleStreakReminders(): Promise<void> {
    this.logger.log('Sending streak reminders...');
    // TODO: Implement notification service integration
    // Find users who haven't studied today and have active streaks
  }
}
```

### 7. Migration

```typescript
// src/migrations/XXXXXX-CreateStreakTables.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStreakTables1700000009000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // User Streaks table
    await queryRunner.createTable(
      new Table({
        name: 'user_streaks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid', isUnique: true },
          { name: 'current_streak', type: 'int', default: 0 },
          { name: 'longest_streak', type: 'int', default: 0 },
          { name: 'streak_start_date', type: 'date', isNullable: true },
          { name: 'last_activity_date', type: 'date', isNullable: true },
          { name: 'freeze_count', type: 'int', default: 0 },
          { name: 'freeze_used_today', type: 'boolean', default: false },
          { name: 'last_freeze_date', type: 'date', isNullable: true },
          { name: 'can_recover', type: 'boolean', default: false },
          { name: 'recovery_deadline', type: 'timestamp', isNullable: true },
          { name: 'streak_before_break', type: 'int', default: 0 },
          { name: 'total_active_days', type: 'int', default: 0 },
          { name: 'total_streak_bonuses', type: 'int', default: 0 },
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

    // Streak History table
    await queryRunner.createTable(
      new Table({
        name: 'streak_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'event_type',
            type: 'enum',
            enum: [
              'started', 'continued', 'frozen', 'lost', 'recovered',
              'milestone_7', 'milestone_30', 'milestone_100', 'milestone_365',
            ],
          },
          { name: 'streak_value', type: 'int' },
          { name: 'xp_bonus', type: 'int', default: 0 },
          { name: 'description', type: 'text', isNullable: true },
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
      'streak_history',
      new TableIndex({
        name: 'IDX_streak_history_user_created',
        columnNames: ['user_id', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('streak_history');
    await queryRunner.dropTable('user_streaks');
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/streak` | Get streak status |
| GET | `/streak/history` | Get streak history |
| POST | `/streak/record` | Record activity |
| POST | `/streak/recover` | Recover streak |
| GET | `/streak/freeze` | Get freeze count |
| POST | `/streak/freeze/purchase` | Purchase freeze |

---

## Next Task

Continue with **BE-034: Leaderboard Service** - Implement leaderboard rankings.
