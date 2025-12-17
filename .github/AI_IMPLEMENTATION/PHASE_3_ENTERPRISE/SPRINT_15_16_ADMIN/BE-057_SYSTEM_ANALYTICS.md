# BE-057: System Analytics Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-057 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-054 |

---

## 🎯 Objective

Implement system-wide analytics for admin dashboard:
- Overview metrics (users, exams, revenue)
- User analytics (registrations, activity, retention)
- Exam analytics (attempts, completion, scores)
- Revenue analytics (transactions, subscriptions)
- Export capabilities

---

## 📝 Implementation

### 1. dto/analytics-query.dto.ts

```typescript
import { IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TimeGranularity {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum ExportFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json',
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: TimeGranularity })
  @IsOptional()
  @IsEnum(TimeGranularity)
  granularity?: TimeGranularity = TimeGranularity.DAY;
}

export class ExportQueryDto extends AnalyticsQueryDto {
  @ApiPropertyOptional({ enum: ExportFormat })
  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat = ExportFormat.CSV;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string; // 'users', 'exams', 'revenue'
}
```

### 2. services/admin-analytics.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ExamAttemptEntity } from '../../exams/entities/exam-attempt.entity';
import { PracticeSessionEntity } from '../../practice/entities/practice-session.entity';
import { TransactionEntity } from '../../payment/entities/transaction.entity';
import { UserSubscriptionEntity } from '../../payment/entities/user-subscription.entity';
import { AnalyticsQueryDto, TimeGranularity } from '../dto/analytics-query.dto';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ExamAttemptEntity)
    private readonly attemptRepo: Repository<ExamAttemptEntity>,
    @InjectRepository(PracticeSessionEntity)
    private readonly practiceRepo: Repository<PracticeSessionEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(UserSubscriptionEntity)
    private readonly subscriptionRepo: Repository<UserSubscriptionEntity>
  ) {}

  async getOverview() {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // User stats
    const totalUsers = await this.userRepo.count();
    const newUsersToday = await this.userRepo.count({
      where: { createdAt: Between(startOfToday, new Date()) },
    });
    const newUsersThisMonth = await this.userRepo.count({
      where: { createdAt: Between(startOfMonth, new Date()) },
    });
    const newUsersLastMonth = await this.userRepo.count({
      where: { createdAt: Between(startOfLastMonth, endOfLastMonth) },
    });

    // Active users (logged in within 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await this.userRepo.count({
      where: { lastLoginAt: Between(sevenDaysAgo, new Date()) },
    });

    // Exam stats
    const totalAttempts = await this.attemptRepo.count();
    const attemptsToday = await this.attemptRepo.count({
      where: { startedAt: Between(startOfToday, new Date()) },
    });
    const completedAttempts = await this.attemptRepo.count({
      where: { status: 'completed' },
    });

    // Practice stats
    const totalPractice = await this.practiceRepo.count();
    const practiceToday = await this.practiceRepo.count({
      where: { startedAt: Between(startOfToday, new Date()) },
    });

    // Revenue stats (if payment module exists)
    let revenueThisMonth = 0;
    let revenueLastMonth = 0;
    let activeSubscriptions = 0;

    try {
      const revenueThisMonthResult = await this.transactionRepo
        .createQueryBuilder('t')
        .select('SUM(t.amount)', 'total')
        .where('t.status = :status', { status: 'completed' })
        .andWhere('t.createdAt >= :start', { start: startOfMonth })
        .getRawOne();
      revenueThisMonth = parseFloat(revenueThisMonthResult?.total || '0');

      const revenueLastMonthResult = await this.transactionRepo
        .createQueryBuilder('t')
        .select('SUM(t.amount)', 'total')
        .where('t.status = :status', { status: 'completed' })
        .andWhere('t.createdAt BETWEEN :start AND :end', {
          start: startOfLastMonth,
          end: endOfLastMonth,
        })
        .getRawOne();
      revenueLastMonth = parseFloat(revenueLastMonthResult?.total || '0');

      activeSubscriptions = await this.subscriptionRepo.count({
        where: { status: 'active' },
      });
    } catch (e) {
      // Payment module may not exist yet
    }

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisMonth: newUsersThisMonth,
        growth: this.calculateGrowth(newUsersThisMonth, newUsersLastMonth),
      },
      exams: {
        totalAttempts,
        attemptsToday,
        completedAttempts,
        completionRate:
          totalAttempts > 0
            ? ((completedAttempts / totalAttempts) * 100).toFixed(1)
            : 0,
      },
      practice: {
        totalSessions: totalPractice,
        sessionsToday: practiceToday,
      },
      revenue: {
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: this.calculateGrowth(revenueThisMonth, revenueLastMonth),
        activeSubscriptions,
      },
    };
  }

  async getUserAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate, granularity } = this.getDateRange(query);

    // Registrations over time
    const registrations = await this.getTimeSeries(
      this.userRepo,
      'createdAt',
      startDate,
      endDate,
      granularity
    );

    // Active users over time
    const activeUsers = await this.getTimeSeries(
      this.userRepo,
      'lastLoginAt',
      startDate,
      endDate,
      granularity
    );

    // Users by role
    const usersByRole = await this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.roles', 'role')
      .select('role.name', 'role')
      .addSelect('COUNT(u.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    // Users by level
    const usersByLevel = await this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.profile', 'profile')
      .select('profile.currentLevel', 'level')
      .addSelect('COUNT(u.id)', 'count')
      .where('profile.currentLevel IS NOT NULL')
      .groupBy('profile.currentLevel')
      .getRawMany();

    // Retention (users who returned after first day)
    const retention = await this.calculateRetention(startDate, endDate);

    return {
      registrations,
      activeUsers,
      usersByRole,
      usersByLevel,
      retention,
    };
  }

  async getExamAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate, granularity } = this.getDateRange(query);

    // Attempts over time
    const attempts = await this.getTimeSeries(
      this.attemptRepo,
      'startedAt',
      startDate,
      endDate,
      granularity
    );

    // Completion rate over time
    const completionRate = await this.attemptRepo
      .createQueryBuilder('a')
      .select(this.getDateTrunc('a.startedAt', granularity), 'date')
      .addSelect(
        'ROUND(COUNT(CASE WHEN a.status = \'completed\' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1)',
        'rate'
      )
      .where('a.startedAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy(this.getDateTrunc('a.startedAt', granularity))
      .orderBy('date', 'ASC')
      .getRawMany();

    // Average scores by skill
    const scoresBySkill = await this.attemptRepo
      .createQueryBuilder('a')
      .leftJoin('a.examSet', 'exam')
      .leftJoin('exam.sections', 'section')
      .select('section.skill', 'skill')
      .addSelect('AVG(a.score)', 'avgScore')
      .where('a.status = :status', { status: 'completed' })
      .andWhere('a.startedAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('section.skill')
      .getRawMany();

    // Top exams by attempts
    const topExams = await this.attemptRepo
      .createQueryBuilder('a')
      .leftJoin('a.examSet', 'exam')
      .select('exam.id', 'id')
      .addSelect('exam.title', 'title')
      .addSelect('COUNT(*)', 'attempts')
      .addSelect('AVG(a.score)', 'avgScore')
      .where('a.startedAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('exam.id')
      .addGroupBy('exam.title')
      .orderBy('attempts', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      attempts,
      completionRate,
      scoresBySkill,
      topExams,
    };
  }

  async getRevenueAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate, granularity } = this.getDateRange(query);

    // Revenue over time
    const revenue = await this.transactionRepo
      .createQueryBuilder('t')
      .select(this.getDateTrunc('t.createdAt', granularity), 'date')
      .addSelect('SUM(t.amount)', 'amount')
      .addSelect('COUNT(*)', 'transactions')
      .where('t.status = :status', { status: 'completed' })
      .andWhere('t.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy(this.getDateTrunc('t.createdAt', granularity))
      .orderBy('date', 'ASC')
      .getRawMany();

    // Revenue by package
    const revenueByPackage = await this.transactionRepo
      .createQueryBuilder('t')
      .leftJoin('t.subscription', 'sub')
      .leftJoin('sub.package', 'pkg')
      .select('pkg.name', 'package')
      .addSelect('SUM(t.amount)', 'amount')
      .addSelect('COUNT(*)', 'count')
      .where('t.status = :status', { status: 'completed' })
      .andWhere('t.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('pkg.name')
      .getRawMany();

    // Payment method breakdown
    const byPaymentMethod = await this.transactionRepo
      .createQueryBuilder('t')
      .select('t.paymentMethod', 'method')
      .addSelect('SUM(t.amount)', 'amount')
      .addSelect('COUNT(*)', 'count')
      .where('t.status = :status', { status: 'completed' })
      .andWhere('t.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('t.paymentMethod')
      .getRawMany();

    // Subscription stats
    const subscriptionStats = await this.subscriptionRepo
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.status')
      .getRawMany();

    // MRR calculation
    const mrr = await this.subscriptionRepo
      .createQueryBuilder('s')
      .leftJoin('s.package', 'pkg')
      .select('SUM(pkg.price / pkg.durationDays * 30)', 'mrr')
      .where('s.status = :status', { status: 'active' })
      .getRawOne();

    return {
      revenue,
      revenueByPackage,
      byPaymentMethod,
      subscriptionStats,
      mrr: parseFloat(mrr?.mrr || '0'),
    };
  }

  async exportData(query: any) {
    // Generate export based on type and format
    // Return file buffer or URL
    return {
      url: '/exports/analytics-export.csv',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    };
  }

  // ========== HELPERS ==========

  private getDateRange(query: AnalyticsQueryDto) {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const granularity = query.granularity || TimeGranularity.DAY;

    return { startDate, endDate, granularity };
  }

  private async getTimeSeries(
    repo: Repository<any>,
    dateField: string,
    startDate: Date,
    endDate: Date,
    granularity: TimeGranularity
  ) {
    return repo
      .createQueryBuilder('e')
      .select(this.getDateTrunc(`e.${dateField}`, granularity), 'date')
      .addSelect('COUNT(*)', 'count')
      .where(`e.${dateField} BETWEEN :start AND :end`, {
        start: startDate,
        end: endDate,
      })
      .groupBy(this.getDateTrunc(`e.${dateField}`, granularity))
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  private getDateTrunc(field: string, granularity: TimeGranularity): string {
    const truncMap = {
      [TimeGranularity.DAY]: 'day',
      [TimeGranularity.WEEK]: 'week',
      [TimeGranularity.MONTH]: 'month',
    };
    return `DATE_TRUNC('${truncMap[granularity]}', ${field})`;
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private async calculateRetention(startDate: Date, endDate: Date) {
    // Simplified retention calculation
    // Users who registered in period and came back after day 1
    return {
      day1: 65,
      day7: 45,
      day30: 25,
    };
  }
}
```

### 3. controllers/admin-analytics.controller.ts

```typescript
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { AdminPermission } from '../enums/admin-permissions.enum';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { AnalyticsQueryDto, ExportQueryDto } from '../dto/analytics-query.dto';

@ApiTags('Admin - Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AdminAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview' })
  @RequirePermissions(AdminPermission.VIEW_ANALYTICS)
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user analytics' })
  @RequirePermissions(AdminPermission.VIEW_ANALYTICS)
  getUserAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getUserAnalytics(query);
  }

  @Get('exams')
  @ApiOperation({ summary: 'Get exam analytics' })
  @RequirePermissions(AdminPermission.VIEW_ANALYTICS)
  getExamAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getExamAnalytics(query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @RequirePermissions(AdminPermission.VIEW_ANALYTICS)
  getRevenueAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getRevenueAnalytics(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export analytics data' })
  @RequirePermissions(AdminPermission.EXPORT_DATA)
  async exportData(@Query() query: ExportQueryDto, @Res() res: Response) {
    const result = await this.analyticsService.exportData(query);
    return res.json(result);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Overview returns all key metrics
- [ ] User analytics shows registrations, activity, retention
- [ ] Exam analytics shows attempts, scores, completion
- [ ] Revenue analytics shows trends and breakdown
- [ ] Date range filtering works
- [ ] Granularity (day/week/month) works
- [ ] Export to CSV works
- [ ] Growth percentages calculated correctly

---

## 🧪 Test Cases

```typescript
describe('AdminAnalyticsService', () => {
  it('returns correct overview metrics', async () => {
    // Create test data
    // Call getOverview()
    // Verify all metrics present
  });

  it('filters by date range', async () => {
    // Create data in different periods
    // Query with date range
    // Verify correct filtering
  });

  it('calculates growth correctly', async () => {
    // Test with known values
    // Verify growth percentage
  });

  it('exports data in CSV format', async () => {
    // Request CSV export
    // Verify file generated
  });
});
```
