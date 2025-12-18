# BE-064: VNPay Integration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-064 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | - |

---

## 🎯 Objective

Implement VNPay payment gateway:
- Generate payment URL
- Handle payment callback (return URL)
- Process IPN (Instant Payment Notification)
- Verify transaction signatures
- Update transaction status

---

## 📝 Implementation

### 1. Entity: PaymentTransaction

```typescript
// src/modules/payment/entities/payment-transaction.entity.ts
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
import { UserSubscription } from '../../subscription/entities/user-subscription.entity';

export enum PaymentMethod {
  VNPAY = 'vnpay',
  MOMO = 'momo',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

@Entity('payment_transactions')
@Index(['userId', 'createdAt'])
@Index(['status'])
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  subscriptionId?: string;

  @ManyToOne(() => UserSubscription, { nullable: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription?: UserSubscription;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'VND' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true })
  gatewayTransactionId?: string;

  @Column('json', { nullable: true })
  gatewayResponse?: Record<string, any>;

  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  orderInfo?: string;

  @Column({ nullable: true })
  promoCode?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;
}
```

### 2. VNPay Gateway Service

```typescript
// src/modules/payment/gateways/vnpay.gateway.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as querystring from 'qs';
import { format } from 'date-fns';

export interface VNPayCreatePaymentParams {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddress: string;
  locale?: 'vn' | 'en';
  bankCode?: string;
}

export interface VNPayReturnData {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

@Injectable()
export class VNPayGateway {
  private readonly logger = new Logger(VNPayGateway.name);
  
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly vnpUrl: string;
  private readonly returnUrl: string;

  constructor(private configService: ConfigService) {
    this.tmnCode = this.configService.get('VNPAY_TMN_CODE');
    this.hashSecret = this.configService.get('VNPAY_HASH_SECRET');
    this.vnpUrl = this.configService.get('VNPAY_URL');
    this.returnUrl = this.configService.get('VNPAY_RETURN_URL');
  }

  createPaymentUrl(params: VNPayCreatePaymentParams): string {
    const { orderId, amount, orderInfo, ipAddress, locale = 'vn', bankCode } = params;

    const createDate = format(new Date(), 'yyyyMMddHHmmss');
    const expireDate = format(
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      'yyyyMMddHHmmss',
    );

    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay requires amount * 100
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddress,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sort parameters
    const sortedParams = this.sortObject(vnpParams);

    // Create signature
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams.vnp_SecureHash = signed;

    const paymentUrl = `${this.vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;

    this.logger.log(`Created VNPay payment URL for order ${orderId}`);

    return paymentUrl;
  }

  verifyReturnUrl(vnpParams: VNPayReturnData): boolean {
    const secureHash = vnpParams.vnp_SecureHash;

    // Remove hash params
    const paramsToVerify = { ...vnpParams };
    delete paramsToVerify.vnp_SecureHash;
    delete (paramsToVerify as any).vnp_SecureHashType;

    // Sort and create signature
    const sortedParams = this.sortObject(paramsToVerify);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValid = secureHash === signed;

    if (!isValid) {
      this.logger.warn(`Invalid VNPay signature for order ${vnpParams.vnp_TxnRef}`);
    }

    return isValid;
  }

  isPaymentSuccess(responseCode: string): boolean {
    return responseCode === '00';
  }

  getResponseMessage(responseCode: string): string {
    const messages: Record<string, string> = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    };

    return messages[responseCode] || 'Lỗi không xác định';
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
        sorted[key] = obj[key];
      }
    }

    return sorted;
  }
}
```

### 3. Payment Service

```typescript
// src/modules/payment/payment.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PaymentTransaction,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment-transaction.entity';
import { VNPayGateway, VNPayReturnData } from './gateways/vnpay.gateway';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(PaymentTransaction)
    private transactionRepo: Repository<PaymentTransaction>,
    private vnpayGateway: VNPayGateway,
    private subscriptionService: SubscriptionService,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async createVNPayPayment(
    userId: string,
    dto: CreatePaymentDto,
    ipAddress: string,
  ): Promise<{ paymentUrl: string; transactionId: string }> {
    // Calculate final amount with promo code
    let finalAmount = dto.amount;
    let discountAmount = 0;

    if (dto.promoCode) {
      const discount = await this.subscriptionService.calculateDiscount(
        dto.promoCode,
        dto.planCode,
        dto.amount,
      );
      discountAmount = discount.amount;
      finalAmount = dto.amount - discountAmount;
    }

    // Create pending transaction
    const transaction = this.transactionRepo.create({
      userId,
      amount: finalAmount,
      paymentMethod: PaymentMethod.VNPAY,
      status: PaymentStatus.PENDING,
      ipAddress,
      orderInfo: `Thanh toán gói ${dto.planCode}`,
      promoCode: dto.promoCode,
      discountAmount,
    });

    await this.transactionRepo.save(transaction);

    // Generate VNPay payment URL
    const paymentUrl = this.vnpayGateway.createPaymentUrl({
      orderId: transaction.id,
      amount: finalAmount,
      orderInfo: transaction.orderInfo,
      ipAddress,
      locale: 'vn',
      bankCode: dto.bankCode,
    });

    this.logger.log(`Created VNPay payment for user ${userId}, transaction ${transaction.id}`);

    return {
      paymentUrl,
      transactionId: transaction.id,
    };
  }

  async handleVNPayReturn(vnpParams: VNPayReturnData): Promise<{
    success: boolean;
    message: string;
    transactionId: string;
  }> {
    const transactionId = vnpParams.vnp_TxnRef;

    // Verify signature
    if (!this.vnpayGateway.verifyReturnUrl(vnpParams)) {
      this.logger.error(`Invalid VNPay signature for transaction ${transactionId}`);
      return {
        success: false,
        message: 'Chữ ký không hợp lệ',
        transactionId,
      };
    }

    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    // Check if already processed
    if (transaction.status !== PaymentStatus.PENDING) {
      return {
        success: transaction.status === PaymentStatus.COMPLETED,
        message: 'Giao dịch đã được xử lý',
        transactionId,
      };
    }

    const isSuccess = this.vnpayGateway.isPaymentSuccess(vnpParams.vnp_ResponseCode);
    const message = this.vnpayGateway.getResponseMessage(vnpParams.vnp_ResponseCode);

    if (isSuccess) {
      await this.completePayment(transaction, vnpParams);
      return {
        success: true,
        message: 'Thanh toán thành công',
        transactionId,
      };
    } else {
      await this.failPayment(transaction, vnpParams, message);
      return {
        success: false,
        message,
        transactionId,
      };
    }
  }

  async handleVNPayIPN(vnpParams: VNPayReturnData): Promise<{
    RspCode: string;
    Message: string;
  }> {
    const transactionId = vnpParams.vnp_TxnRef;

    // Verify signature
    if (!this.vnpayGateway.verifyReturnUrl(vnpParams)) {
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      return { RspCode: '01', Message: 'Transaction not found' };
    }

    // Verify amount
    const vnpAmount = parseInt(vnpParams.vnp_Amount) / 100;
    if (vnpAmount !== Number(transaction.amount)) {
      return { RspCode: '04', Message: 'Amount mismatch' };
    }

    // Check if already processed
    if (transaction.status !== PaymentStatus.PENDING) {
      return { RspCode: '02', Message: 'Transaction already processed' };
    }

    const isSuccess = this.vnpayGateway.isPaymentSuccess(vnpParams.vnp_ResponseCode);

    if (isSuccess) {
      await this.completePayment(transaction, vnpParams);
      return { RspCode: '00', Message: 'Success' };
    } else {
      const message = this.vnpayGateway.getResponseMessage(vnpParams.vnp_ResponseCode);
      await this.failPayment(transaction, vnpParams, message);
      return { RspCode: '00', Message: 'Recorded failure' };
    }
  }

  private async completePayment(
    transaction: PaymentTransaction,
    gatewayResponse: Record<string, any>,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update transaction
      transaction.status = PaymentStatus.COMPLETED;
      transaction.gatewayTransactionId = gatewayResponse.vnp_TransactionNo;
      transaction.gatewayResponse = gatewayResponse;
      transaction.completedAt = new Date();

      await queryRunner.manager.save(transaction);

      // Activate subscription
      const subscription = await this.subscriptionService.activateFromPayment(
        transaction.userId,
        transaction.orderInfo, // Contains plan code
        transaction.id,
        queryRunner.manager,
      );

      transaction.subscriptionId = subscription.id;
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      // Emit event
      this.eventEmitter.emit('payment.completed', {
        transactionId: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        subscriptionId: subscription.id,
      });

      this.logger.log(`Payment completed for transaction ${transaction.id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to complete payment ${transaction.id}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async failPayment(
    transaction: PaymentTransaction,
    gatewayResponse: Record<string, any>,
    message: string,
  ): Promise<void> {
    transaction.status = PaymentStatus.FAILED;
    transaction.gatewayResponse = { ...gatewayResponse, failureMessage: message };
    await this.transactionRepo.save(transaction);

    this.eventEmitter.emit('payment.failed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      message,
    });

    this.logger.log(`Payment failed for transaction ${transaction.id}: ${message}`);
  }

  async getTransaction(id: string): Promise<PaymentTransaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user', 'subscription'],
    });

    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    return transaction;
  }

  async getUserTransactions(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: PaymentTransaction[]; total: number }> {
    const [data, total] = await this.transactionRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}
```

### 4. DTOs

```typescript
// src/modules/payment/dto/create-payment.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  planCode: string;

  @IsNumber()
  @Min(1000)
  amount: number;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  promoCode?: string;
}

// src/modules/payment/dto/verify-payment.dto.ts
import { IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  transactionId: string;
}
```

### 5. Controller

```typescript
// src/modules/payment/payment.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VNPayReturnData } from './gateways/vnpay.gateway';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('vnpay/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create VNPay payment' })
  async createVNPayPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.paymentService.createVNPayPayment(userId, dto, ipAddress);
  }

  @Get('vnpay/return')
  @ApiOperation({ summary: 'VNPay return URL handler' })
  async handleVNPayReturn(
    @Query() vnpParams: VNPayReturnData,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.handleVNPayReturn(vnpParams);

    // Redirect to frontend with result
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = result.success
      ? `${frontendUrl}/payment/success?txn=${result.transactionId}`
      : `${frontendUrl}/payment/failed?txn=${result.transactionId}&msg=${encodeURIComponent(result.message)}`;

    return res.redirect(redirectUrl);
  }

  @Post('vnpay/ipn')
  @ApiOperation({ summary: 'VNPay IPN webhook' })
  async handleVNPayIPN(@Query() vnpParams: VNPayReturnData) {
    return this.paymentService.handleVNPayIPN(vnpParams);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user transactions' })
  async getMyTransactions(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.paymentService.getUserTransactions(userId, page, limit);
  }

  @Get('transactions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction detail' })
  async getTransaction(@Param('id') id: string) {
    return this.paymentService.getTransaction(id);
  }
}
```

### 6. Module

```typescript
// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { VNPayGateway } from './gateways/vnpay.gateway';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction]),
    SubscriptionModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, VNPayGateway],
  exports: [PaymentService],
})
export class PaymentModule {}
```

---

## ✅ Acceptance Criteria

- [ ] VNPay sandbox integration working
- [ ] Payment URL generation correct
- [ ] Return URL callback processed
- [ ] IPN webhook handled properly
- [ ] Signature verification secure
- [ ] Transaction status updated
- [ ] Error messages in Vietnamese
- [ ] Logging for all transactions

---

## 🧪 Test Cases

```typescript
describe('VNPayGateway', () => {
  describe('createPaymentUrl', () => {
    it('generates valid payment URL', () => {
      const url = gateway.createPaymentUrl({
        orderId: 'test-123',
        amount: 100000,
        orderInfo: 'Test payment',
        ipAddress: '127.0.0.1',
      });

      expect(url).toContain('vnp_TxnRef=test-123');
      expect(url).toContain('vnp_Amount=10000000'); // x100
      expect(url).toContain('vnp_SecureHash=');
    });
  });

  describe('verifyReturnUrl', () => {
    it('validates correct signature', () => {
      const params = createValidVNPayParams();
      expect(gateway.verifyReturnUrl(params)).toBe(true);
    });

    it('rejects invalid signature', () => {
      const params = { ...createValidVNPayParams(), vnp_SecureHash: 'invalid' };
      expect(gateway.verifyReturnUrl(params)).toBe(false);
    });
  });
});

describe('PaymentService', () => {
  describe('createVNPayPayment', () => {
    it('creates pending transaction', async () => {
      const result = await service.createVNPayPayment(
        userId,
        { planCode: 'premium', amount: 199000 },
        '127.0.0.1',
      );

      expect(result.paymentUrl).toBeDefined();
      expect(result.transactionId).toBeDefined();

      const tx = await repo.findOne({ where: { id: result.transactionId } });
      expect(tx.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('handleVNPayIPN', () => {
    it('completes payment and activates subscription', async () => {
      const result = await service.handleVNPayIPN(successVNPayParams);

      expect(result.RspCode).toBe('00');

      const tx = await repo.findOne({ where: { id: transactionId } });
      expect(tx.status).toBe(PaymentStatus.COMPLETED);
      expect(tx.subscriptionId).toBeDefined();
    });
  });
});
```
