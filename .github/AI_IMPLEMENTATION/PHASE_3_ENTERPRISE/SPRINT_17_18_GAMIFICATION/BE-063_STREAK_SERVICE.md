# BE-063: Streak Calculation Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-063 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-061 |

---

## 🎯 Objective

Implement streak tracking system:
- Daily activity tracking
- Streak calculation
- Freeze protection (optional)
- Streak-based XP bonuses
- Achievement triggers

---

## 📝 Implementation

### 1. entities/activity-log.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum ActivityType {
  PRACTICE = 'practice',
  EXAM = 'exam',
  REVIEW = 'review',
  LESSON = 'lesson',
  DAILY_LOGIN = 'daily_login',
}

@Entity('activity_logs')
@Index(['userId', 'activityDate'])
export class ActivityLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'activity_type',
    type: 'enum',
    enum: ActivityType,
  })
  activityType: ActivityType;

  @Column({ name: 'activity_date', type: 'date' })
  activityDate: Date;

  @Column({ name: 'activity_count', default: 1 })
  activityCount: number;

  @Column({ name: 'xp_earned', default: 0 })
  xpEarned: number;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. entities/streak-freeze.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('streak_freezes')
export class StreakFreezeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'freeze_date', type: 'date' })
  freezeDate: Date;

  @Column({ name: 'was_used', default: false })
  wasUsed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 3. dto/streak.dto.ts

```typescript
export class StreakInfoDto {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  freezesAvailable: number;
  freezesUsedThisMonth: number;
  streakAtRisk: boolean; // True if no activity today
  todayCompleted: boolean;
  weeklyProgress: DayStatus[];
}

export interface DayStatus {
  date: string;
  completed: boolean;
  frozen: boolean;
}

export class ActivitySummaryDto {
  today: {
    practiceCount: number;
    examCount: number;
    xpEarned: number;
    minutesSpent: number;
  };
  thisWeek: {
    activeDays: number;
    practiceCount: number;
    examCount: number;
    xpEarned: number;
  };
  thisMonth: {
    activeDays: number;
    practiceCount: number;
    examCount: number;
    xpEarned: number;
  };
}
```

### 4. streak.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityLogEntity, ActivityType } from './entities/activity-log.entity';
import { StreakFreezeEntity } from './entities/streak-freeze.entity';
import { UserStatsEntity } from '../../users/entities/user-stats.entity';
import { XpService } from '../xp/xp.service';
import { AchievementService } from '../achievements/achievement.service';
import { StreakInfoDto, ActivitySummaryDto, DayStatus } from './dto/streak.dto';
import {
  format,
  startOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  eachDayOfInterval,
  isToday,
  isYesterday,
} from 'date-fns';

const MAX_FREEZES_PER_MONTH = 2;

@Injectable()
export class StreakService {
  private readonly logger = new Logger(StreakService.name);

  constructor(
    @InjectRepository(ActivityLogEntity)
    private activityLogRepo: Repository<ActivityLogEntity>,
    @InjectRepository(StreakFreezeEntity)
    private freezeRepo: Repository<StreakFreezeEntity>,
    @InjectRepository(UserStatsEntity)
    private userStatsRepo: Repository<UserStatsEntity>,
    private xpService: XpService,
    private achievementService: AchievementService,
    private eventEmitter: EventEmitter2,
  ) {}

  async logActivity(
    userId: string,
    activityType: ActivityType,
    xpEarned: number = 0,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const today = startOfDay(new Date());

    // Check if already logged activity today
    let existing = await this.activityLogRepo.findOne({
      where: {
        userId,
        activityType,
        activityDate: today,
      },
    });

    if (existing) {
      existing.activityCount += 1;
      existing.xpEarned += xpEarned;
      await this.activityLogRepo.save(existing);
    } else {
      const log = this.activityLogRepo.create({
        userId,
        activityType,
        activityDate: today,
        xpEarned,
        metadata,
      });
      await this.activityLogRepo.save(log);

      // First activity of the day - update streak
      const hadActivityYesterday = await this.hasActivityOnDate(
        userId,
        subDays(today, 1),
      );

      if (hadActivityYesterday) {
        await this.incrementStreak(userId);
      } else {
        // Check for freeze
        const wasFrozen = await this.checkAndUseFreeze(userId, subDays(today, 1));
        if (wasFrozen) {
          await this.incrementStreak(userId);
        } else {
          await this.resetStreak(userId);
        }
      }
    }
  }

  async getStreakInfo(userId: string): Promise<StreakInfoDto> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    // Get this week's activities
    const weekActivities = await this.activityLogRepo.find({
      where: {
        userId,
        activityDate: Between(weekStart, weekEnd),
      },
    });

    // Build weekly progress
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weeklyProgress: DayStatus[] = await Promise.all(
      weekDays.map(async (date) => {
        const hasActivity = weekActivities.some(
          (a) => format(a.activityDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
        );
        const wasFrozen = await this.wasDateFrozen(userId, date);

        return {
          date: format(date, 'yyyy-MM-dd'),
          completed: hasActivity,
          frozen: wasFrozen,
        };
      }),
    );

    // Check today's activity
    const todayCompleted = await this.hasActivityOnDate(userId, today);

    // Get freezes info
    const monthStart = startOfMonth(today);
    const freezesUsed = await this.freezeRepo.count({
      where: {
        userId,
        wasUsed: true,
        createdAt: Between(monthStart, endOfMonth(today)),
      },
    });

    return {
      currentStreak: stats?.currentStreak || 0,
      longestStreak: stats?.longestStreak || 0,
      lastActivityDate: stats?.lastActivityDate || null,
      freezesAvailable: MAX_FREEZES_PER_MONTH - freezesUsed,
      freezesUsedThisMonth: freezesUsed,
      streakAtRisk: !todayCompleted && (stats?.currentStreak || 0) > 0,
      todayCompleted,
      weeklyProgress,
    };
  }

  async getActivitySummary(userId: string): Promise<ActivitySummaryDto> {
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const monthStart = startOfMonth(today);

    const [todayData, weekData, monthData] = await Promise.all([
      this.getActivityStats(userId, today, today),
      this.getActivityStats(userId, weekStart, today),
      this.getActivityStats(userId, monthStart, today),
    ]);

    return {
      today: todayData,
      thisWeek: weekData,
      thisMonth: monthData,
    };
  }

  async useFreeze(userId: string): Promise<boolean> {
    const today = startOfDay(new Date());
    const monthStart = startOfMonth(today);

    // Check available freezes
    const usedCount = await this.freezeRepo.count({
      where: {
        userId,
        wasUsed: true,
        createdAt: Between(monthStart, endOfMonth(today)),
      },
    });

    if (usedCount >= MAX_FREEZES_PER_MONTH) {
      return false;
    }

    // Create freeze for today
    const freeze = this.freezeRepo.create({
      userId,
      freezeDate: today,
      wasUsed: true,
    });
    await this.freezeRepo.save(freeze);

    return true;
  }

  private async hasActivityOnDate(userId: string, date: Date): Promise<boolean> {
    const count = await this.activityLogRepo.count({
      where: {
        userId,
        activityDate: startOfDay(date),
      },
    });
    return count > 0;
  }

  private async wasDateFrozen(userId: string, date: Date): Promise<boolean> {
    const freeze = await this.freezeRepo.findOne({
      where: {
        userId,
        freezeDate: startOfDay(date),
        wasUsed: true,
      },
    });
    return !!freeze;
  }

  private async checkAndUseFreeze(userId: string, date: Date): Promise<boolean> {
    return this.wasDateFrozen(userId, date);
  }

  private async incrementStreak(userId: string): Promise<void> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    if (!stats) return;

    const newStreak = stats.currentStreak + 1;
    const newLongest = Math.max(newStreak, stats.longestStreak);

    await this.userStatsRepo.update(
      { userId },
      {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: new Date(),
      },
    );

    // Award streak XP
    await this.xpService.addStreakXp(userId, newStreak);

    // Check achievements
    await this.achievementService.checkAndUnlock({
      userId,
      streak: newStreak,
    });

    // Emit event for milestone notifications
    if ([7, 14, 30, 60, 100, 365].includes(newStreak)) {
      this.eventEmitter.emit('streak.milestone', { userId, streak: newStreak });
    }

    this.logger.log(`User ${userId} streak: ${newStreak} days`);
  }

  private async resetStreak(userId: string): Promise<void> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    const previousStreak = stats?.currentStreak || 0;

    if (previousStreak > 0) {
      await this.userStatsRepo.update(
        { userId },
        {
          currentStreak: 1, // Starting new streak today
          lastActivityDate: new Date(),
        },
      );

      this.eventEmitter.emit('streak.lost', {
        userId,
        previousStreak,
      });

      this.logger.log(`User ${userId} lost streak of ${previousStreak} days`);
    }
  }

  private async getActivityStats(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const activities = await this.activityLogRepo.find({
      where: {
        userId,
        activityDate: Between(startDate, endDate),
      },
    });

    const practiceCount = activities
      .filter((a) => a.activityType === ActivityType.PRACTICE)
      .reduce((sum, a) => sum + a.activityCount, 0);

    const examCount = activities
      .filter((a) => a.activityType === ActivityType.EXAM)
      .reduce((sum, a) => sum + a.activityCount, 0);

    const xpEarned = activities.reduce((sum, a) => sum + a.xpEarned, 0);

    const activeDays = new Set(
      activities.map((a) => format(a.activityDate, 'yyyy-MM-dd')),
    ).size;

    return {
      activeDays,
      practiceCount,
      examCount,
      xpEarned,
      minutesSpent: activities.reduce(
        (sum, a) => sum + (a.metadata?.duration || 0),
        0,
      ),
    };
  }

  // Cron job to check for broken streaks
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkBrokenStreaks(): Promise<void> {
    const yesterday = subDays(startOfDay(new Date()), 1);

    // Find users with active streaks who didn't do activity yesterday
    const usersWithStreaks = await this.userStatsRepo.find({
      where: {
        currentStreak: LessThan(1),
        lastActivityDate: LessThan(yesterday),
      },
    });

    for (const stats of usersWithStreaks) {
      // Check if they had a freeze
      const wasFrozen = await this.wasDateFrozen(stats.userId, yesterday);
      
      if (!wasFrozen && stats.currentStreak > 0) {
        await this.userStatsRepo.update(
          { userId: stats.userId },
          { currentStreak: 0 },
        );

        this.eventEmitter.emit('streak.lost', {
          userId: stats.userId,
          previousStreak: stats.currentStreak,
        });
      }
    }
  }
}
```

### 5. streak.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { StreakService } from './streak.service';

@ApiTags('Streak')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('streak')
export class StreakController {
  constructor(private streakService: StreakService) {}

  @Get()
  @ApiOperation({ summary: 'Get streak info' })
  async getStreakInfo(@Request() req) {
    return this.streakService.getStreakInfo(req.user.id);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get activity summary' })
  async getActivitySummary(@Request() req) {
    return this.streakService.getActivitySummary(req.user.id);
  }

  @Post('freeze')
  @ApiOperation({ summary: 'Use a streak freeze' })
  async useFreeze(@Request() req) {
    const success = await this.streakService.useFreeze(req.user.id);
    return { success };
  }
}
```

### 6. streak.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogEntity } from './entities/activity-log.entity';
import { StreakFreezeEntity } from './entities/streak-freeze.entity';
import { UserStatsEntity } from '../../users/entities/user-stats.entity';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { XpModule } from '../xp/xp.module';
import { AchievementModule } from '../achievements/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityLogEntity,
      StreakFreezeEntity,
      UserStatsEntity,
    ]),
    XpModule,
    AchievementModule,
  ],
  controllers: [StreakController],
  providers: [StreakService],
  exports: [StreakService],
})
export class StreakModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Activity logged correctly
- [ ] Streak increments on consecutive days
- [ ] Streak resets on missed day
- [ ] Freeze protects streak
- [ ] Limited freezes per month
- [ ] Weekly progress shows correctly
- [ ] XP awarded for streaks
- [ ] Milestone notifications work

---

## 🧪 Test Cases

```typescript
describe('StreakService', () => {
  it('increments streak on consecutive days', async () => {
    // Day 1: Log activity
    // Day 2: Log activity
    // Verify streak = 2
  });

  it('resets streak on missed day', async () => {
    // Day 1: Log activity, streak = 1
    // Day 3: Log activity (missed day 2)
    // Verify streak = 1 (reset)
  });

  it('preserves streak with freeze', async () => {
    // Day 1: Log activity, streak = 5
    // Day 2: Use freeze
    // Day 3: Log activity
    // Verify streak = 6
  });

  it('limits freezes per month', async () => {
    // Use 2 freezes
    // Try to use 3rd freeze
    // Verify returns false
  });
});
```
