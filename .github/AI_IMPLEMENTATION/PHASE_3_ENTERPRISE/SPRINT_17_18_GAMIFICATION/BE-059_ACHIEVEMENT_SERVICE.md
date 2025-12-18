# BE-059: Achievement Entity & Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-059 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | - |

---

## 🎯 Objective

Implement achievement/badge system:
- Achievement entity with conditions
- User achievement tracking
- Automatic unlock based on conditions
- Achievement notification trigger

---

## 📝 Implementation

### 1. entities/achievement.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAchievementEntity } from './user-achievement.entity';

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
export class AchievementEntity {
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
  conditionMetadata: {
    skill?: string;
    level?: string;
    source?: string;
    minScore?: number;
  };

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @Column({
    type: 'enum',
    enum: AchievementRarity,
    default: AchievementRarity.COMMON,
  })
  rarity: AchievementRarity;

  @OneToMany(() => UserAchievementEntity, (ua) => ua.achievement)
  userAchievements: UserAchievementEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. entities/user-achievement.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AchievementEntity } from './achievement.entity';

@Entity('user_achievements')
@Unique(['user', 'achievement'])
export class UserAchievementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => AchievementEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievement_id' })
  achievement: AchievementEntity;

  @Column({ name: 'achievement_id' })
  achievementId: string;

  @Column({ default: 0 })
  progress: number;

  @CreateDateColumn({ name: 'unlocked_at' })
  unlockedAt: Date;
}
```

### 3. dto/achievement.dto.ts

```typescript
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { AchievementCategory, ConditionType, AchievementRarity } from '../entities/achievement.entity';

export class CreateAchievementDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  badgeImage?: string;

  @IsNumber()
  @IsOptional()
  xpReward?: number;

  @IsEnum(AchievementCategory)
  category: AchievementCategory;

  @IsEnum(ConditionType)
  conditionType: ConditionType;

  @IsNumber()
  conditionValue: number;

  @IsObject()
  @IsOptional()
  conditionMetadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsEnum(AchievementRarity)
  @IsOptional()
  rarity?: AchievementRarity;
}

export class AchievementResponseDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeImage: string;
  xpReward: number;
  category: AchievementCategory;
  rarity: AchievementRarity;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  progressMax: number;
}
```

### 4. achievement.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AchievementEntity,
  AchievementCategory,
  ConditionType,
} from './entities/achievement.entity';
import { UserAchievementEntity } from './entities/user-achievement.entity';
import { XpService } from '../xp/xp.service';
import { CreateAchievementDto, AchievementResponseDto } from './dto/achievement.dto';

export interface AchievementCheckContext {
  userId: string;
  practiceCount?: number;
  examCount?: number;
  streak?: number;
  score?: number;
  skill?: string;
  level?: string;
  totalStudyTime?: number;
}

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(
    @InjectRepository(AchievementEntity)
    private achievementRepo: Repository<AchievementEntity>,
    @InjectRepository(UserAchievementEntity)
    private userAchievementRepo: Repository<UserAchievementEntity>,
    private xpService: XpService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<AchievementEntity[]> {
    return this.achievementRepo.find({
      order: { category: 'ASC', rarity: 'ASC' },
    });
  }

  async findByCategory(category: AchievementCategory): Promise<AchievementEntity[]> {
    return this.achievementRepo.find({
      where: { category },
      order: { rarity: 'ASC' },
    });
  }

  async getUserAchievements(userId: string): Promise<AchievementResponseDto[]> {
    // Get all achievements
    const achievements = await this.achievementRepo.find({
      where: { isHidden: false },
      order: { category: 'ASC', rarity: 'ASC' },
    });

    // Get user unlocked achievements
    const userAchievements = await this.userAchievementRepo.find({
      where: { userId },
    });

    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua]),
    );

    return achievements.map((achievement) => {
      const userAchievement = unlockedMap.get(achievement.id);
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        badgeImage: achievement.badgeImage,
        xpReward: achievement.xpReward,
        category: achievement.category,
        rarity: achievement.rarity,
        isUnlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement?.progress || 0,
        progressMax: achievement.conditionValue,
      };
    });
  }

  async checkAndUnlock(context: AchievementCheckContext): Promise<AchievementEntity[]> {
    const { userId } = context;
    const unlockedAchievements: AchievementEntity[] = [];

    // Get all achievements not yet unlocked by user
    const allAchievements = await this.achievementRepo.find();
    const userAchievements = await this.userAchievementRepo.find({
      where: { userId },
    });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const { met, progress } = this.checkCondition(achievement, context);

      if (met) {
        // Unlock achievement
        const userAchievement = this.userAchievementRepo.create({
          userId,
          achievementId: achievement.id,
          progress: achievement.conditionValue,
        });
        await this.userAchievementRepo.save(userAchievement);

        // Award XP
        if (achievement.xpReward > 0) {
          await this.xpService.addXp({
            userId,
            amount: achievement.xpReward,
            sourceType: 'achievement',
            sourceId: achievement.id,
            description: `Đạt thành tựu: ${achievement.name}`,
          });
        }

        // Emit event for notification
        this.eventEmitter.emit('achievement.unlocked', {
          userId,
          achievement,
        });

        unlockedAchievements.push(achievement);
        this.logger.log(`User ${userId} unlocked achievement: ${achievement.name}`);
      } else if (progress > 0) {
        // Update progress
        await this.userAchievementRepo.upsert(
          {
            userId,
            achievementId: achievement.id,
            progress,
          },
          ['userId', 'achievementId'],
        );
      }
    }

    return unlockedAchievements;
  }

  private checkCondition(
    achievement: AchievementEntity,
    context: AchievementCheckContext,
  ): { met: boolean; progress: number } {
    const { conditionType, conditionValue, conditionMetadata } = achievement;

    switch (conditionType) {
      case ConditionType.COUNT:
        return this.checkCountCondition(conditionValue, conditionMetadata, context);

      case ConditionType.STREAK:
        const streak = context.streak || 0;
        return { met: streak >= conditionValue, progress: streak };

      case ConditionType.SCORE:
        const score = context.score || 0;
        const minScore = conditionMetadata?.minScore || conditionValue;
        const skillMatch = !conditionMetadata?.skill || context.skill === conditionMetadata.skill;
        return { met: score >= minScore && skillMatch, progress: score };

      case ConditionType.TIME:
        const time = context.totalStudyTime || 0;
        return { met: time >= conditionValue, progress: time };

      default:
        return { met: false, progress: 0 };
    }
  }

  private checkCountCondition(
    conditionValue: number,
    metadata: Record<string, any> | undefined,
    context: AchievementCheckContext,
  ): { met: boolean; progress: number } {
    let count = 0;

    if (metadata?.source === 'practice') {
      count = context.practiceCount || 0;
    } else if (metadata?.source === 'exam') {
      count = context.examCount || 0;
    } else {
      // Total activities
      count = (context.practiceCount || 0) + (context.examCount || 0);
    }

    return { met: count >= conditionValue, progress: count };
  }

  async create(dto: CreateAchievementDto): Promise<AchievementEntity> {
    const achievement = this.achievementRepo.create(dto);
    return this.achievementRepo.save(achievement);
  }

  async update(id: string, dto: Partial<CreateAchievementDto>): Promise<AchievementEntity> {
    await this.achievementRepo.update(id, dto);
    return this.achievementRepo.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.achievementRepo.delete(id);
  }

  // Seed default achievements
  async seedDefaults(): Promise<void> {
    const count = await this.achievementRepo.count();
    if (count > 0) return;

    const defaults: CreateAchievementDto[] = [
      // Learning achievements
      {
        name: 'Bước đầu tiên',
        description: 'Hoàn thành bài luyện tập đầu tiên',
        category: AchievementCategory.LEARNING,
        conditionType: ConditionType.COUNT,
        conditionValue: 1,
        conditionMetadata: { source: 'practice' },
        xpReward: 20,
        rarity: AchievementRarity.COMMON,
      },
      {
        name: 'Học sinh chăm chỉ',
        description: 'Hoàn thành 50 bài luyện tập',
        category: AchievementCategory.LEARNING,
        conditionType: ConditionType.COUNT,
        conditionValue: 50,
        conditionMetadata: { source: 'practice' },
        xpReward: 100,
        rarity: AchievementRarity.RARE,
      },
      {
        name: 'Bậc thầy luyện tập',
        description: 'Hoàn thành 200 bài luyện tập',
        category: AchievementCategory.LEARNING,
        conditionType: ConditionType.COUNT,
        conditionValue: 200,
        conditionMetadata: { source: 'practice' },
        xpReward: 500,
        rarity: AchievementRarity.EPIC,
      },
      // Streak achievements
      {
        name: 'Chiến binh 7 ngày',
        description: 'Duy trì streak 7 ngày liên tục',
        category: AchievementCategory.STREAK,
        conditionType: ConditionType.STREAK,
        conditionValue: 7,
        xpReward: 50,
        rarity: AchievementRarity.COMMON,
      },
      {
        name: 'Nhà vô địch 30 ngày',
        description: 'Duy trì streak 30 ngày liên tục',
        category: AchievementCategory.STREAK,
        conditionType: ConditionType.STREAK,
        conditionValue: 30,
        xpReward: 200,
        rarity: AchievementRarity.RARE,
      },
      {
        name: 'Huyền thoại 100 ngày',
        description: 'Duy trì streak 100 ngày liên tục',
        category: AchievementCategory.STREAK,
        conditionType: ConditionType.STREAK,
        conditionValue: 100,
        xpReward: 1000,
        rarity: AchievementRarity.LEGENDARY,
      },
      // Score achievements
      {
        name: 'Điểm tuyệt đối',
        description: 'Đạt điểm 10/10 trong một bài thi',
        category: AchievementCategory.SKILL,
        conditionType: ConditionType.SCORE,
        conditionValue: 10,
        xpReward: 100,
        rarity: AchievementRarity.RARE,
      },
      {
        name: 'Reading Hero',
        description: 'Đạt điểm 9+ trong phần Reading',
        category: AchievementCategory.SKILL,
        conditionType: ConditionType.SCORE,
        conditionValue: 9,
        conditionMetadata: { skill: 'reading' },
        xpReward: 50,
        rarity: AchievementRarity.RARE,
      },
    ];

    for (const dto of defaults) {
      await this.achievementRepo.save(this.achievementRepo.create(dto));
    }

    this.logger.log(`Seeded ${defaults.length} default achievements`);
  }
}
```

### 5. achievement.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { AchievementCategory } from './entities/achievement.entity';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all achievements for current user' })
  async getMyAchievements(@Request() req) {
    return this.achievementService.getUserAchievements(req.user.id);
  }

  @Get('category/:category')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get achievements by category' })
  async getByCategory(@Param('category') category: AchievementCategory) {
    return this.achievementService.findByCategory(category);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all achievements (admin)' })
  async getAll() {
    return this.achievementService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create achievement (admin)' })
  async create(@Body() dto: CreateAchievementDto) {
    return this.achievementService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update achievement (admin)' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAchievementDto>,
  ) {
    return this.achievementService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete achievement (admin)' })
  async delete(@Param('id') id: string) {
    return this.achievementService.delete(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Seed default achievements (admin)' })
  async seed() {
    await this.achievementService.seedDefaults();
    return { message: 'Seeded default achievements' };
  }
}
```

### 6. achievement.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementEntity } from './entities/achievement.entity';
import { UserAchievementEntity } from './entities/user-achievement.entity';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AchievementEntity, UserAchievementEntity]),
    XpModule,
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Achievement entity created with all fields
- [ ] UserAchievement tracks unlocked badges
- [ ] Condition checking works for COUNT, STREAK, SCORE, TIME
- [ ] XP awarded on unlock
- [ ] Event emitted for notifications
- [ ] Admin CRUD endpoints work
- [ ] Default achievements seeded

---

## 🧪 Test Cases

```typescript
describe('AchievementService', () => {
  it('unlocks achievement when condition met', async () => {
    // Create "First Steps" achievement
    // Call checkAndUnlock with practiceCount: 1
    // Verify achievement unlocked
    // Verify XP added
  });

  it('tracks progress for incomplete achievements', async () => {
    // Create "50 practices" achievement
    // Call checkAndUnlock with practiceCount: 10
    // Verify progress saved as 10
  });

  it('does not duplicate unlock', async () => {
    // Unlock achievement
    // Call checkAndUnlock again
    // Verify not unlocked twice
  });
});
```
