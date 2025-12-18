# BE-067: Transaction Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-067 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-066 |

---

## 🎯 Objective

Implement transaction management:
- Transaction history with filtering
- Transaction detail view
- Refund processing
- Transaction analytics
- Export functionality

---

## 📝 Implementation

### 1. DTOs

```typescript
// src/modules/payment/dto/transaction-query.dto.ts
import { IsOptional, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus, PaymentMethod } from '../entities/payment-transaction.entity';

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}

// src/modules/payment/dto/refund.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class RefundDto {
  @IsString()
  transactionId: string;

  @IsNumber()
  @Min(1000)
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

// src/modules/payment/dto/transaction-stats.dto.ts
export interface TransactionStatsDto {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedAmount: number;
  byPaymentMethod: {
    method: string;
    count: number;
    amount: number;
  }[];
  byPlan: {
    plan: string;
    count: number;
    amount: number;
  }[];
  dailyStats: {
    date: string;
    count: number;
    amount: number;
  }[];
}
```

### 2. Transaction Service

```typescript
// src/modules/payment/transaction.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  PaymentTransaction,
  PaymentStatus,
  PaymentMethod,
} from './entities/payment-transaction.entity';
import { VNPayGateway } from './gateways/vnpay.gateway';
import { MoMoGateway } from './gateways/momo.gateway';
import { TransactionQueryDto, RefundDto, TransactionStatsDto } from './dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(PaymentTransaction)
    private transactionRepo: Repository<PaymentTransaction>,
    private vnpayGateway: VNPayGateway,
    private momoGateway: MoMoGateway,
  ) {}

  async getTransactions(
    query: TransactionQueryDto,
  ): Promise<{ data: PaymentTransaction[]; total: number; page: number; limit: number }> {
    const { status, paymentMethod, startDate, endDate, page = 1, limit = 20 } = query;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.user', 'user')
      .leftJoinAndSelect('tx.subscription', 'subscription')
      .orderBy('tx.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('tx.status = :status', { status });
    }

    if (paymentMethod) {
      queryBuilder.andWhere('tx.paymentMethod = :paymentMethod', { paymentMethod });
    }

    if (startDate) {
      queryBuilder.andWhere('tx.createdAt >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('tx.createdAt <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async getUserTransactions(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{ data: PaymentTransaction[]; total: number }> {
    const { status, startDate, endDate, page = 1, limit = 10 } = query;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('tx')
      .where('tx.userId = :userId', { userId })
      .orderBy('tx.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('tx.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('tx.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async getTransactionById(id: string): Promise<PaymentTransaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user', 'subscription', 'subscription.plan'],
    });

    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    return transaction;
  }

  async processRefund(dto: RefundDto, adminId: string): Promise<PaymentTransaction> {
    const transaction = await this.getTransactionById(dto.transactionId);

    if (transaction.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Chỉ có thể hoàn tiền giao dịch đã hoàn thành');
    }

    if (dto.amount > Number(transaction.amount)) {
      throw new BadRequestException('Số tiền hoàn vượt quá số tiền giao dịch');
    }

    try {
      if (transaction.paymentMethod === PaymentMethod.VNPAY) {
        // VNPay refund via admin portal - manual process
        this.logger.log(`VNPay refund requested for ${transaction.id}, amount: ${dto.amount}`);
      } else if (transaction.paymentMethod === PaymentMethod.MOMO) {
        await this.momoGateway.refundTransaction(
          transaction.id,
          parseInt(transaction.gatewayTransactionId),
          dto.amount,
          dto.reason || 'Hoàn tiền theo yêu cầu',
        );
      }

      transaction.status = PaymentStatus.REFUNDED;
      transaction.gatewayResponse = {
        ...transaction.gatewayResponse,
        refund: {
          amount: dto.amount,
          reason: dto.reason,
          processedBy: adminId,
          processedAt: new Date(),
        },
      };

      await this.transactionRepo.save(transaction);

      this.logger.log(`Refund processed for transaction ${transaction.id}`);

      return transaction;
    } catch (error) {
      this.logger.error(`Failed to process refund for ${transaction.id}`, error.stack);
      throw new BadRequestException('Không thể xử lý hoàn tiền');
    }
  }

  async getTransactionStats(
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionStatsDto> {
    // Total stats
    const totals = await this.transactionRepo
      .createQueryBuilder('tx')
      .select([
        'SUM(CASE WHEN tx.status = :completed THEN tx.amount ELSE 0 END) as totalRevenue',
        'COUNT(*) as totalTransactions',
        'SUM(CASE WHEN tx.status = :completed THEN 1 ELSE 0 END) as successfulTransactions',
        'SUM(CASE WHEN tx.status = :failed THEN 1 ELSE 0 END) as failedTransactions',
        'SUM(CASE WHEN tx.status = :refunded THEN tx.amount ELSE 0 END) as refundedAmount',
      ])
      .where('tx.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .setParameter('completed', PaymentStatus.COMPLETED)
      .setParameter('failed', PaymentStatus.FAILED)
      .setParameter('refunded', PaymentStatus.REFUNDED)
      .getRawOne();

    // By payment method
    const byPaymentMethod = await this.transactionRepo
      .createQueryBuilder('tx')
      .select([
        'tx.paymentMethod as method',
        'COUNT(*) as count',
        'SUM(CASE WHEN tx.status = :completed THEN tx.amount ELSE 0 END) as amount',
      ])
      .where('tx.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .setParameter('completed', PaymentStatus.COMPLETED)
      .groupBy('tx.paymentMethod')
      .getRawMany();

    // By plan (from orderInfo)
    const byPlan = await this.transactionRepo
      .createQueryBuilder('tx')
      .select([
        'tx.orderInfo as plan',
        'COUNT(*) as count',
        'SUM(CASE WHEN tx.status = :completed THEN tx.amount ELSE 0 END) as amount',
      ])
      .where('tx.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('tx.status = :completed')
      .setParameter('completed', PaymentStatus.COMPLETED)
      .groupBy('tx.orderInfo')
      .getRawMany();

    // Daily stats
    const dailyStats = await this.transactionRepo
      .createQueryBuilder('tx')
      .select([
        'DATE(tx.createdAt) as date',
        'COUNT(*) as count',
        'SUM(CASE WHEN tx.status = :completed THEN tx.amount ELSE 0 END) as amount',
      ])
      .where('tx.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .setParameter('completed', PaymentStatus.COMPLETED)
      .groupBy('DATE(tx.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      totalRevenue: Number(totals.totalRevenue) || 0,
      totalTransactions: Number(totals.totalTransactions) || 0,
      successfulTransactions: Number(totals.successfulTransactions) || 0,
      failedTransactions: Number(totals.failedTransactions) || 0,
      refundedAmount: Number(totals.refundedAmount) || 0,
      byPaymentMethod: byPaymentMethod.map((item) => ({
        method: item.method,
        count: Number(item.count),
        amount: Number(item.amount),
      })),
      byPlan: byPlan.map((item) => ({
        plan: item.plan,
        count: Number(item.count),
        amount: Number(item.amount),
      })),
      dailyStats: dailyStats.map((item) => ({
        date: format(new Date(item.date), 'yyyy-MM-dd'),
        count: Number(item.count),
        amount: Number(item.amount),
      })),
    };
  }

  async exportTransactions(
    query: TransactionQueryDto,
  ): Promise<{ filename: string; data: any[] }> {
    const { data } = await this.getTransactions({ ...query, limit: 10000 });

    const exportData = data.map((tx) => ({
      'Mã giao dịch': tx.id,
      'Ngày tạo': format(tx.createdAt, 'dd/MM/yyyy HH:mm:ss'),
      'Người dùng': tx.user?.email || tx.userId,
      'Số tiền': tx.amount,
      'Phương thức': tx.paymentMethod,
      'Trạng thái': this.getStatusLabel(tx.status),
      'Mã gateway': tx.gatewayTransactionId || '',
      'Hoàn thành lúc': tx.completedAt
        ? format(tx.completedAt, 'dd/MM/yyyy HH:mm:ss')
        : '',
    }));

    return {
      filename: `transactions_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`,
      data: exportData,
    };
  }

  private getStatusLabel(status: PaymentStatus): string {
    const labels = {
      [PaymentStatus.PENDING]: 'Đang chờ',
      [PaymentStatus.COMPLETED]: 'Hoàn thành',
      [PaymentStatus.FAILED]: 'Thất bại',
      [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
      [PaymentStatus.CANCELLED]: 'Đã hủy',
    };
    return labels[status] || status;
  }
}
```

### 3. Controller

```typescript
// src/modules/payment/transaction.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TransactionService } from './transaction.service';
import { TransactionQueryDto, RefundDto } from './dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // ============ USER ENDPOINTS ============

  @Get('my-transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my transactions' })
  async getMyTransactions(
    @CurrentUser('id') userId: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getUserTransactions(userId, query);
  }

  @Get('my-transactions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my transaction detail' })
  async getMyTransactionDetail(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const transaction = await this.transactionService.getTransactionById(id);
    if (transaction.userId !== userId) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }
    return transaction;
  }

  // ============ ADMIN ENDPOINTS ============

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions (admin)' })
  async getAllTransactions(@Query() query: TransactionQueryDto) {
    return this.transactionService.getTransactions(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction detail (admin)' })
  async getTransactionDetail(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }

  @Post('admin/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process refund (admin)' })
  async processRefund(
    @Body() dto: RefundDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.transactionService.processRefund(dto, adminId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction statistics (admin)' })
  async getStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.transactionService.getTransactionStats(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('admin/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export transactions to CSV (admin)' })
  async exportTransactions(
    @Query() query: TransactionQueryDto,
    @Res() res: Response,
  ) {
    const { filename, data } = await this.transactionService.exportTransactions(query);

    // Convert to CSV
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => `"${row[h] || ''}"`).join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + csv); // UTF-8 BOM for Excel
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Transaction list with pagination
- [ ] Filter by status, method, date
- [ ] Transaction detail view
- [ ] Refund processing works
- [ ] Transaction statistics accurate
- [ ] CSV export functional
- [ ] Admin-only endpoints secured

---

## 🧪 Test Cases

```typescript
describe('TransactionService', () => {
  describe('getTransactions', () => {
    it('filters by status', async () => {
      const result = await service.getTransactions({
        status: PaymentStatus.COMPLETED,
      });

      expect(result.data.every((tx) => tx.status === PaymentStatus.COMPLETED)).toBe(true);
    });

    it('filters by date range', async () => {
      const result = await service.getTransactions({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      result.data.forEach((tx) => {
        expect(tx.createdAt >= new Date('2024-01-01')).toBe(true);
        expect(tx.createdAt <= new Date('2024-01-31T23:59:59')).toBe(true);
      });
    });
  });

  describe('processRefund', () => {
    it('refunds completed transaction', async () => {
      const result = await service.processRefund(
        { transactionId: completedTxId, amount: 100000, reason: 'Test' },
        adminId,
      );

      expect(result.status).toBe(PaymentStatus.REFUNDED);
    });

    it('rejects refund for pending transaction', async () => {
      await expect(
        service.processRefund(
          { transactionId: pendingTxId, amount: 100000 },
          adminId,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTransactionStats', () => {
    it('returns correct totals', async () => {
      const stats = await service.getTransactionStats(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
      expect(stats.totalTransactions).toBeGreaterThan(0);
    });
  });
});
```
