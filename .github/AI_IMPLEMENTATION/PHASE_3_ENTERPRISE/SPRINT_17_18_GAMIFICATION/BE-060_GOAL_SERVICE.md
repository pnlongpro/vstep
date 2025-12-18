# BE-060: Goal Entity & Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-060 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | - |

---

## 🎯 Objective

Implement goal setting system:
- Goal entity with types and targets
- Daily/Weekly/Monthly goals
- Progress tracking
- Auto-completion detection

---

## 📝 Implementation

### 1. entities/goal.entity.ts

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

export enum GoalType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export enum TargetType {
  PRACTICE_COUNT = 'practice_count',
  STUDY_TIME = 'study_time', // in minutes
  SCORE = 'score',
  XP = 'xp',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('goals')
export class GoalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'goal_type',
    type: 'enum',
    enum: GoalType,
    default: GoalType.DAILY,
  })
  goalType: GoalType;

  @Column({
    name: 'target_type',
    type: 'enum',
    enum: TargetType,
    default: TargetType.PRACTICE_COUNT,
  })
  targetType: TargetType;

  @Column({ name: 'target_value' })
  targetValue: number;

  @Column({ name: 'current_value', default: 0 })
  currentValue: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @Column({ name: 'xp_reward', default: 0 })
  xpReward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}
```

### 2. dto/goal.dto.ts

```typescript
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { GoalType, TargetType, GoalStatus } from '../entities/goal.entity';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(GoalType)
  goalType: GoalType;

  @IsEnum(TargetType)
  targetType: TargetType;

  @IsNumber()
  @Min(1)
  targetValue: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateGoalProgressDto {
  @IsNumber()
  @Min(0)
  increment: number;
}

export class GoalQueryDto {
  @IsEnum(GoalType)
  @IsOptional()
  goalType?: GoalType;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;

  @IsEnum(TargetType)
  @IsOptional()
  targetType?: TargetType;
}

export class GoalResponseDto {
  id: string;
  title: string;
  description: string;
  goalType: GoalType;
  targetType: TargetType;
  targetValue: number;
  currentValue: number;
  progress: number; // percentage
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  xpReward: number;
  daysRemaining: number;
  createdAt: Date;
  completedAt?: Date;
}
```

### 3. goal.service.ts

```typescript
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual, Between } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  GoalEntity,
  GoalType,
  GoalStatus,
  TargetType,
} from './entities/goal.entity';
import { CreateGoalDto, GoalQueryDto, GoalResponseDto } from './dto/goal.dto';
import { XpService } from '../xp/xp.service';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';

@Injectable()
export class GoalService {
  private readonly logger = new Logger(GoalService.name);

  constructor(
    @InjectRepository(GoalEntity)
    private goalRepo: Repository<GoalEntity>,
    private xpService: XpService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateGoalDto): Promise<GoalEntity> {
    const { startDate, endDate } = this.calculateDates(
      dto.goalType,
      dto.startDate,
      dto.endDate,
    );

    // Check for existing active goal of same type
    const existingActive = await this.goalRepo.findOne({
      where: {
        userId,
        goalType: dto.goalType,
        targetType: dto.targetType,
        status: GoalStatus.ACTIVE,
      },
    });

    if (existingActive) {
      throw new BadRequestException(
        'Bạn đã có mục tiêu cùng loại đang hoạt động',
      );
    }

    const goal = this.goalRepo.create({
      userId,
      ...dto,
      startDate,
      endDate,
      xpReward: this.calculateXpReward(dto.goalType, dto.targetValue),
    });

    return this.goalRepo.save(goal);
  }

  async findUserGoals(
    userId: string,
    query: GoalQueryDto,
  ): Promise<GoalResponseDto[]> {
    const where: any = { userId };

    if (query.goalType) where.goalType = query.goalType;
    if (query.status) where.status = query.status;
    if (query.targetType) where.targetType = query.targetType;

    const goals = await this.goalRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return goals.map((goal) => this.toResponseDto(goal));
  }

  async findActiveGoals(userId: string): Promise<GoalResponseDto[]> {
    const goals = await this.goalRepo.find({
      where: { userId, status: GoalStatus.ACTIVE },
      order: { endDate: 'ASC' },
    });

    return goals.map((goal) => this.toResponseDto(goal));
  }

  async findById(id: string): Promise<GoalEntity> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async updateProgress(
    userId: string,
    targetType: TargetType,
    increment: number,
  ): Promise<GoalEntity[]> {
    const now = new Date();

    // Find all active goals with matching target type
    const goals = await this.goalRepo.find({
      where: {
        userId,
        targetType,
        status: GoalStatus.ACTIVE,
        startDate: LessThan(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    const completedGoals: GoalEntity[] = [];

    for (const goal of goals) {
      goal.currentValue += increment;

      // Check if completed
      if (goal.currentValue >= goal.targetValue) {
        goal.status = GoalStatus.COMPLETED;
        goal.completedAt = new Date();

        // Award XP
        if (goal.xpReward > 0) {
          await this.xpService.addXp({
            userId,
            amount: goal.xpReward,
            sourceType: 'bonus',
            sourceId: goal.id,
            description: `Hoàn thành mục tiêu: ${goal.title}`,
          });
        }

        // Emit event
        this.eventEmitter.emit('goal.completed', { userId, goal });
        completedGoals.push(goal);
      }

      await this.goalRepo.save(goal);
    }

    return completedGoals;
  }

  async cancelGoal(userId: string, goalId: string): Promise<GoalEntity> {
    const goal = await this.goalRepo.findOne({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Chỉ có thể hủy mục tiêu đang hoạt động');
    }

    goal.status = GoalStatus.CANCELLED;
    return this.goalRepo.save(goal);
  }

  // Cron job to check expired goals
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredGoals(): Promise<void> {
    const now = new Date();

    const expiredGoals = await this.goalRepo.find({
      where: {
        status: GoalStatus.ACTIVE,
        endDate: LessThan(now),
      },
    });

    for (const goal of expiredGoals) {
      goal.status = GoalStatus.FAILED;
      await this.goalRepo.save(goal);

      this.eventEmitter.emit('goal.failed', {
        userId: goal.userId,
        goal,
      });
    }

    if (expiredGoals.length > 0) {
      this.logger.log(`Marked ${expiredGoals.length} goals as failed`);
    }
  }

  // Create recurring goals automatically
  async createRecurringGoals(userId: string): Promise<void> {
    // Auto-create daily goal based on user settings
    // This would be called when user first logs in each day
    const today = new Date();
    
    const existingDaily = await this.goalRepo.findOne({
      where: {
        userId,
        goalType: GoalType.DAILY,
        startDate: Between(startOfDay(today), endOfDay(today)),
      },
    });

    if (!existingDaily) {
      // Create default daily goal
      await this.create(userId, {
        title: 'Luyện tập hôm nay',
        goalType: GoalType.DAILY,
        targetType: TargetType.PRACTICE_COUNT,
        targetValue: 3,
      });
    }
  }

  private calculateDates(
    goalType: GoalType,
    startDateStr?: string,
    endDateStr?: string,
  ): { startDate: Date; endDate: Date } {
    const now = new Date();

    switch (goalType) {
      case GoalType.DAILY:
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now),
        };

      case GoalType.WEEKLY:
        return {
          startDate: startOfWeek(now, { weekStartsOn: 1 }),
          endDate: endOfWeek(now, { weekStartsOn: 1 }),
        };

      case GoalType.MONTHLY:
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };

      case GoalType.CUSTOM:
        if (!startDateStr || !endDateStr) {
          throw new BadRequestException(
            'Custom goal requires start and end dates',
          );
        }
        return {
          startDate: new Date(startDateStr),
          endDate: new Date(endDateStr),
        };

      default:
        return {
          startDate: now,
          endDate: addDays(now, 7),
        };
    }
  }

  private calculateXpReward(goalType: GoalType, targetValue: number): number {
    const baseReward = {
      [GoalType.DAILY]: 10,
      [GoalType.WEEKLY]: 50,
      [GoalType.MONTHLY]: 200,
      [GoalType.CUSTOM]: 30,
    };

    return baseReward[goalType] + Math.floor(targetValue / 5) * 5;
  }

  private toResponseDto(goal: GoalEntity): GoalResponseDto {
    const now = new Date();
    const daysRemaining = Math.max(0, differenceInDays(goal.endDate, now));
    const progress = Math.min(
      100,
      Math.round((goal.currentValue / goal.targetValue) * 100),
    );

    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      targetType: goal.targetType,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      progress,
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: goal.status,
      xpReward: goal.xpReward,
      daysRemaining,
      createdAt: goal.createdAt,
      completedAt: goal.completedAt,
    };
  }
}
```

### 4. goal.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { GoalService } from './goal.service';
import { CreateGoalDto, GoalQueryDto } from './dto/goal.dto';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalController {
  constructor(private goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  async create(@Request() req, @Body() dto: CreateGoalDto) {
    return this.goalService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user goals' })
  async getMyGoals(@Request() req, @Query() query: GoalQueryDto) {
    return this.goalService.findUserGoals(req.user.id, query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active goals' })
  async getActiveGoals(@Request() req) {
    return this.goalService.findActiveGoals(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get goal by ID' })
  async getById(@Param('id') id: string) {
    return this.goalService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a goal' })
  async cancel(@Request() req, @Param('id') id: string) {
    return this.goalService.cancelGoal(req.user.id, id);
  }

  @Post('init-daily')
  @ApiOperation({ summary: 'Initialize daily goals' })
  async initDaily(@Request() req) {
    await this.goalService.createRecurringGoals(req.user.id);
    return { message: 'Daily goals initialized' };
  }
}
```

### 5. goal.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalEntity } from './entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity]), XpModule],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Goal entity created with all types
- [ ] Daily/Weekly/Monthly date calculation works
- [ ] Progress updates correctly
- [ ] Auto-completes when target reached
- [ ] XP awarded on completion
- [ ] Expired goals marked as failed
- [ ] Cannot have duplicate active goals of same type
- [ ] Custom goals require dates

---

## 🧪 Test Cases

```typescript
describe('GoalService', () => {
  it('creates daily goal with correct dates', async () => {
    // Create daily goal
    // Verify startDate is start of today
    // Verify endDate is end of today
  });

  it('completes goal when target reached', async () => {
    // Create goal with target 5
    // Update progress by 5
    // Verify status is COMPLETED
    // Verify XP awarded
  });

  it('marks expired goals as failed', async () => {
    // Create goal with past end date
    // Run checkExpiredGoals
    // Verify status is FAILED
  });

  it('prevents duplicate active goals', async () => {
    // Create daily practice goal
    // Try to create another daily practice goal
    // Verify error thrown
  });
});
```
