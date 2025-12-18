# BE-066: Subscription Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-066 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-064, BE-065 |

---

## 🎯 Objective

Implement subscription management:
- Subscription plan CRUD
- User subscription lifecycle
- Plan upgrade/downgrade
- Auto-renewal handling
- Expiration processing
- Feature access control

---

## 📝 Implementation

### 1. Entities

```typescript
// src/modules/subscription/entities/subscription-plan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanCode {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip',
}

export interface PlanFeatures {
  mockTestsPerMonth: number; // -1 = unlimited
  practiceUnlimited: boolean;
  aiWritingFeedback: boolean;
  aiSpeakingFeedback: boolean;
  progressTracking: boolean;
  basicAnalytics: boolean;
  detailedAnalytics: boolean;
  advancedAnalytics: boolean;
  communityAccess: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  downloadResources: boolean;
  oneOnOneTutoring: number; // hours per month
  personalizedPlan: boolean;
  certificateDownload: boolean;
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: PlanCode, unique: true })
  code: PlanCode;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  durationMonths: number;

  @Column('json')
  features: PlanFeatures;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

```typescript
// src/modules/subscription/entities/user-subscription.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

@Entity('user_subscriptions')
@Index(['userId', 'status'])
@Index(['endDate'])
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  planId: string;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 2. Subscription Service

```typescript
// src/modules/subscription/subscription.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addMonths, isBefore, isAfter } from 'date-fns';
import {
  SubscriptionPlan,
  PlanCode,
  PlanFeatures,
} from './entities/subscription-plan.entity';
import {
  UserSubscription,
  SubscriptionStatus,
} from './entities/user-subscription.entity';
import { PromoService } from '../promo/promo.service';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private subscriptionRepo: Repository<UserSubscription>,
    private promoService: PromoService,
    private eventEmitter: EventEmitter2,
  ) {}

  // ============ PLAN MANAGEMENT ============

  async getAllPlans(includeInactive = false): Promise<SubscriptionPlan[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.planRepo.find({
      where,
      order: { sortOrder: 'ASC' },
    });
  }

  async getPlanByCode(code: PlanCode): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOne({ where: { code } });
    if (!plan) {
      throw new NotFoundException(`Plan ${code} not found`);
    }
    return plan;
  }

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const existing = await this.planRepo.findOne({ where: { code: data.code } });
    if (existing) {
      throw new ConflictException(`Plan ${data.code} already exists`);
    }

    const plan = this.planRepo.create(data);
    return this.planRepo.save(plan);
  }

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    Object.assign(plan, data);
    return this.planRepo.save(plan);
  }

  // ============ SUBSCRIPTION MANAGEMENT ============

  async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    return this.subscriptionRepo.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: MoreThan(new Date()),
      },
      relations: ['plan'],
    });
  }

  async getUserSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
    return this.subscriptionRepo.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async activateFromPayment(
    userId: string,
    orderInfo: string,
    transactionId: string,
    manager?: EntityManager,
  ): Promise<UserSubscription> {
    const repo = manager
      ? manager.getRepository(UserSubscription)
      : this.subscriptionRepo;

    // Parse plan code from order info
    const planCodeMatch = orderInfo.match(/gói (\w+)/i);
    const planCode = planCodeMatch ? planCodeMatch[1].toLowerCase() : 'basic';

    const plan = await this.getPlanByCode(planCode as PlanCode);

    // Cancel existing active subscription
    const existingActive = await this.getUserActiveSubscription(userId);
    if (existingActive) {
      existingActive.status = SubscriptionStatus.CANCELLED;
      existingActive.cancelledAt = new Date();
      existingActive.cancelReason = 'Upgraded to new plan';
      await repo.save(existingActive);
    }

    // Create new subscription
    const now = new Date();
    const endDate = addMonths(now, plan.durationMonths);

    const subscription = repo.create({
      userId,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      endDate,
      transactionId,
      autoRenew: false,
    });

    const saved = await repo.save(subscription);

    // Emit event
    this.eventEmitter.emit('subscription.activated', {
      userId,
      planCode: plan.code,
      subscriptionId: saved.id,
    });

    this.logger.log(`Subscription activated for user ${userId}, plan ${plan.code}`);

    return saved;
  }

  async cancelSubscription(userId: string, reason?: string): Promise<UserSubscription> {
    const subscription = await this.getUserActiveSubscription(userId);

    if (!subscription) {
      throw new NotFoundException('Không có gói đang hoạt động');
    }

    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason || 'User requested';

    // Keep ACTIVE until end date, just disable auto-renew
    await this.subscriptionRepo.save(subscription);

    this.eventEmitter.emit('subscription.cancelled', {
      userId,
      subscriptionId: subscription.id,
      reason,
    });

    this.logger.log(`Subscription cancelled for user ${userId}`);

    return subscription;
  }

  async toggleAutoRenew(userId: string, autoRenew: boolean): Promise<UserSubscription> {
    const subscription = await this.getUserActiveSubscription(userId);

    if (!subscription) {
      throw new NotFoundException('Không có gói đang hoạt động');
    }

    subscription.autoRenew = autoRenew;
    return this.subscriptionRepo.save(subscription);
  }

  // ============ FEATURE ACCESS ============

  async getUserFeatures(userId: string): Promise<PlanFeatures> {
    const subscription = await this.getUserActiveSubscription(userId);

    if (!subscription) {
      // Return free plan features
      const freePlan = await this.getPlanByCode(PlanCode.FREE);
      return freePlan.features;
    }

    return subscription.plan.features;
  }

  async checkFeatureAccess(userId: string, feature: keyof PlanFeatures): Promise<boolean> {
    const features = await this.getUserFeatures(userId);
    return !!features[feature];
  }

  async checkMockTestLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    const features = await this.getUserFeatures(userId);

    if (features.mockTestsPerMonth === -1) {
      return { allowed: true, remaining: -1 }; // Unlimited
    }

    // Count tests this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const testsThisMonth = await this.countUserMockTests(userId, startOfMonth);
    const remaining = Math.max(0, features.mockTestsPerMonth - testsThisMonth);

    return {
      allowed: remaining > 0,
      remaining,
    };
  }

  private async countUserMockTests(userId: string, since: Date): Promise<number> {
    // This would query exam_attempts table
    // Placeholder implementation
    return 0;
  }

  // ============ PROMO CODE ============

  async calculateDiscount(
    promoCode: string,
    planCode: string,
    amount: number,
  ): Promise<{ amount: number; message: string }> {
    return this.promoService.calculateDiscount(promoCode, planCode, amount);
  }

  // ============ SCHEDULED TASKS ============

  @Cron(CronExpression.EVERY_HOUR)
  async processExpiredSubscriptions(): Promise<void> {
    const expired = await this.subscriptionRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: LessThan(new Date()),
      },
    });

    for (const subscription of expired) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepo.save(subscription);

      this.eventEmitter.emit('subscription.expired', {
        userId: subscription.userId,
        subscriptionId: subscription.id,
      });

      this.logger.log(`Subscription expired for user ${subscription.userId}`);
    }

    if (expired.length > 0) {
      this.logger.log(`Processed ${expired.length} expired subscriptions`);
    }
  }

  @Cron('0 9 * * *') // Every day at 9 AM
  async sendExpirationReminders(): Promise<void> {
    const threeDaysFromNow = addMonths(new Date(), 0);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const aboutToExpire = await this.subscriptionRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: LessThan(threeDaysFromNow),
        autoRenew: false,
      },
      relations: ['user', 'plan'],
    });

    for (const subscription of aboutToExpire) {
      this.eventEmitter.emit('subscription.expiring-soon', {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        endDate: subscription.endDate,
        planName: subscription.plan.name,
      });
    }

    if (aboutToExpire.length > 0) {
      this.logger.log(`Sent ${aboutToExpire.length} expiration reminders`);
    }
  }
}
```

### 3. DTOs

```typescript
// src/modules/subscription/dto/create-subscription.dto.ts
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { PlanCode } from '../entities/subscription-plan.entity';

export class CreateSubscriptionDto {
  @IsEnum(PlanCode)
  planCode: PlanCode;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}

// src/modules/subscription/dto/update-plan.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { PlanFeatures } from '../entities/subscription-plan.entity';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  durationMonths?: number;

  @IsOptional()
  @IsObject()
  features?: Partial<PlanFeatures>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
```

### 4. Controller

```typescript
// src/modules/subscription/subscription.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubscriptionService } from './subscription.service';
import { UpdatePlanDto } from './dto/update-plan.dto';

@ApiTags('Subscription')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  // ============ PUBLIC ENDPOINTS ============

  @Get('plans')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  async getPlans() {
    return this.subscriptionService.getAllPlans();
  }

  // ============ USER ENDPOINTS ============

  @Get('my-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  async getMySubscription(@CurrentUser('id') userId: string) {
    const subscription = await this.subscriptionService.getUserActiveSubscription(userId);
    const features = await this.subscriptionService.getUserFeatures(userId);
    const mockTestLimit = await this.subscriptionService.checkMockTestLimit(userId);

    return {
      subscription,
      features,
      mockTestLimit,
    };
  }

  @Get('my-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscription history' })
  async getMyHistory(@CurrentUser('id') userId: string) {
    return this.subscriptionService.getUserSubscriptionHistory(userId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel current subscription' })
  async cancelSubscription(
    @CurrentUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.subscriptionService.cancelSubscription(userId, reason);
  }

  @Patch('auto-renew')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle auto-renewal' })
  async toggleAutoRenew(
    @CurrentUser('id') userId: string,
    @Body('autoRenew') autoRenew: boolean,
  ) {
    return this.subscriptionService.toggleAutoRenew(userId, autoRenew);
  }

  // ============ ADMIN ENDPOINTS ============

  @Get('admin/plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all plans including inactive (admin)' })
  async getAdminPlans() {
    return this.subscriptionService.getAllPlans(true);
  }

  @Patch('admin/plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription plan (admin)' })
  async updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.subscriptionService.updatePlan(id, dto);
  }
}
```

### 5. Feature Guard

```typescript
// src/guards/feature.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionService } from '../modules/subscription/subscription.service';
import { PlanFeatures } from '../modules/subscription/entities/subscription-plan.entity';

export const RequireFeature = Reflector.createDecorator<keyof PlanFeatures>();

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.get(RequireFeature, context.getHandler());

    if (!requiredFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Authentication required');
    }

    const hasAccess = await this.subscriptionService.checkFeatureAccess(
      userId,
      requiredFeature,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `Feature "${requiredFeature}" requires a premium subscription`,
      );
    }

    return true;
  }
}

// Usage example:
// @UseGuards(JwtAuthGuard, FeatureGuard)
// @RequireFeature('aiWritingFeedback')
// async getWritingFeedback() { ... }
```

### 6. Seeds

```typescript
// src/seeds/subscription-plans.seed.ts
import { DataSource } from 'typeorm';
import { SubscriptionPlan, PlanCode } from '../modules/subscription/entities/subscription-plan.entity';

const PLANS = [
  {
    name: 'Miễn phí',
    code: PlanCode.FREE,
    price: 0,
    durationMonths: 0,
    sortOrder: 0,
    features: {
      mockTestsPerMonth: 2,
      practiceUnlimited: false,
      aiWritingFeedback: false,
      aiSpeakingFeedback: false,
      progressTracking: true,
      basicAnalytics: true,
      detailedAnalytics: false,
      advancedAnalytics: false,
      communityAccess: true,
      emailSupport: false,
      prioritySupport: false,
      downloadResources: false,
      oneOnOneTutoring: 0,
      personalizedPlan: false,
      certificateDownload: false,
    },
  },
  {
    name: 'Cơ bản',
    code: PlanCode.BASIC,
    price: 99000,
    durationMonths: 1,
    sortOrder: 1,
    features: {
      mockTestsPerMonth: 10,
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: false,
      progressTracking: true,
      basicAnalytics: true,
      detailedAnalytics: true,
      advancedAnalytics: false,
      communityAccess: true,
      emailSupport: true,
      prioritySupport: false,
      downloadResources: false,
      oneOnOneTutoring: 0,
      personalizedPlan: false,
      certificateDownload: false,
    },
  },
  {
    name: 'Cao cấp',
    code: PlanCode.PREMIUM,
    price: 199000,
    durationMonths: 1,
    sortOrder: 2,
    features: {
      mockTestsPerMonth: -1,
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: true,
      progressTracking: true,
      basicAnalytics: true,
      detailedAnalytics: true,
      advancedAnalytics: true,
      communityAccess: true,
      emailSupport: true,
      prioritySupport: true,
      downloadResources: true,
      oneOnOneTutoring: 0,
      personalizedPlan: false,
      certificateDownload: false,
    },
  },
  {
    name: 'VIP',
    code: PlanCode.VIP,
    price: 499000,
    durationMonths: 1,
    sortOrder: 3,
    features: {
      mockTestsPerMonth: -1,
      practiceUnlimited: true,
      aiWritingFeedback: true,
      aiSpeakingFeedback: true,
      progressTracking: true,
      basicAnalytics: true,
      detailedAnalytics: true,
      advancedAnalytics: true,
      communityAccess: true,
      emailSupport: true,
      prioritySupport: true,
      downloadResources: true,
      oneOnOneTutoring: 2,
      personalizedPlan: true,
      certificateDownload: true,
    },
  },
];

export async function seedSubscriptionPlans(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(SubscriptionPlan);

  for (const planData of PLANS) {
    const existing = await repo.findOne({ where: { code: planData.code } });

    if (!existing) {
      await repo.save(repo.create(planData));
      console.log(`Created plan: ${planData.name}`);
    }
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] All 4 plans defined and seeded
- [ ] User subscription activation works
- [ ] Subscription cancellation works
- [ ] Auto-renewal toggle works
- [ ] Feature access control implemented
- [ ] Expiration processing scheduled
- [ ] Reminder emails scheduled
- [ ] FeatureGuard working

---

## 🧪 Test Cases

```typescript
describe('SubscriptionService', () => {
  describe('getUserActiveSubscription', () => {
    it('returns active subscription', async () => {
      const sub = await service.getUserActiveSubscription(userId);
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('returns null for no active subscription', async () => {
      const sub = await service.getUserActiveSubscription(newUserId);
      expect(sub).toBeNull();
    });
  });

  describe('activateFromPayment', () => {
    it('creates active subscription', async () => {
      const sub = await service.activateFromPayment(
        userId,
        'Thanh toán gói premium',
        transactionId,
      );

      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
      expect(sub.plan.code).toBe(PlanCode.PREMIUM);
    });

    it('cancels previous subscription', async () => {
      await service.activateFromPayment(userId, 'gói basic', tx1);
      await service.activateFromPayment(userId, 'gói premium', tx2);

      const history = await service.getUserSubscriptionHistory(userId);
      expect(history[0].status).toBe(SubscriptionStatus.ACTIVE);
      expect(history[1].status).toBe(SubscriptionStatus.CANCELLED);
    });
  });

  describe('checkFeatureAccess', () => {
    it('returns true for allowed feature', async () => {
      const allowed = await service.checkFeatureAccess(userId, 'aiWritingFeedback');
      expect(allowed).toBe(true);
    });

    it('returns false for disallowed feature', async () => {
      const allowed = await service.checkFeatureAccess(freeUserId, 'aiSpeakingFeedback');
      expect(allowed).toBe(false);
    });
  });
});
```
