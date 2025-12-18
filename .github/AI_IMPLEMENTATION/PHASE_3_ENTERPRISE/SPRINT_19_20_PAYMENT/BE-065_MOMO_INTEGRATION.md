# BE-065: MoMo Integration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-065 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | - |

---

## 🎯 Objective

Implement MoMo payment gateway:
- Generate QR code payment
- Generate payment deeplink
- Handle MoMo IPN webhook
- Verify transaction signatures
- Query transaction status

---

## 📝 Implementation

### 1. MoMo Gateway Service

```typescript
// src/modules/payment/gateways/momo.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';

export interface MoMoPaymentRequest {
  orderId: string;
  amount: number;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  requestType: 'payWithMethod' | 'payWithATM' | 'payWithCC' | 'captureWallet';
  extraData?: string;
}

export interface MoMoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  qrCodeUrl?: string;
  deeplink?: string;
  deeplinkMiniApp?: string;
}

export interface MoMoIPNData {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

@Injectable()
export class MoMoGateway {
  private readonly logger = new Logger(MoMoGateway.name);

  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly endpoint: string;
  private readonly returnUrl: string;
  private readonly ipnUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.partnerCode = this.configService.get('MOMO_PARTNER_CODE');
    this.accessKey = this.configService.get('MOMO_ACCESS_KEY');
    this.secretKey = this.configService.get('MOMO_SECRET_KEY');
    this.endpoint = this.configService.get('MOMO_ENDPOINT');
    this.returnUrl = this.configService.get('MOMO_RETURN_URL');
    this.ipnUrl = this.configService.get('MOMO_IPN_URL');
  }

  async createPayment(params: MoMoPaymentRequest): Promise<MoMoPaymentResponse> {
    const requestId = `${params.orderId}_${Date.now()}`;
    const extraData = params.extraData || '';

    // Create signature
    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `amount=${params.amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${this.ipnUrl}`,
      `orderId=${params.orderId}`,
      `orderInfo=${params.orderInfo}`,
      `partnerCode=${this.partnerCode}`,
      `redirectUrl=${this.returnUrl}`,
      `requestId=${requestId}`,
      `requestType=${params.requestType}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'VSTEP Learning Platform',
      storeId: this.partnerCode,
      requestId,
      amount: params.amount,
      orderId: params.orderId,
      orderInfo: params.orderInfo,
      redirectUrl: this.returnUrl,
      ipnUrl: this.ipnUrl,
      lang: 'vi',
      requestType: params.requestType,
      autoCapture: true,
      extraData,
      signature,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.endpoint}/create`, requestBody),
      );

      this.logger.log(`MoMo payment created for order ${params.orderId}`);

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create MoMo payment: ${error.message}`);
      throw error;
    }
  }

  async createQRPayment(
    orderId: string,
    amount: number,
    orderInfo: string,
  ): Promise<MoMoPaymentResponse> {
    return this.createPayment({
      orderId,
      amount,
      orderInfo,
      redirectUrl: this.returnUrl,
      ipnUrl: this.ipnUrl,
      requestType: 'captureWallet',
    });
  }

  verifySignature(ipnData: MoMoIPNData): boolean {
    const receivedSignature = ipnData.signature;

    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `amount=${ipnData.amount}`,
      `extraData=${ipnData.extraData}`,
      `message=${ipnData.message}`,
      `orderId=${ipnData.orderId}`,
      `orderInfo=${ipnData.orderInfo}`,
      `orderType=${ipnData.orderType}`,
      `partnerCode=${ipnData.partnerCode}`,
      `payType=${ipnData.payType}`,
      `requestId=${ipnData.requestId}`,
      `responseTime=${ipnData.responseTime}`,
      `resultCode=${ipnData.resultCode}`,
      `transId=${ipnData.transId}`,
    ].join('&');

    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const isValid = receivedSignature === expectedSignature;

    if (!isValid) {
      this.logger.warn(`Invalid MoMo signature for order ${ipnData.orderId}`);
    }

    return isValid;
  }

  isPaymentSuccess(resultCode: number): boolean {
    return resultCode === 0;
  }

  getResultMessage(resultCode: number): string {
    const messages: Record<number, string> = {
      0: 'Giao dịch thành công',
      9000: 'Giao dịch đã được xác nhận thành công',
      10: 'Hệ thống đang được bảo trì',
      11: 'Truy cập bị từ chối',
      12: 'Phiên bản API không được hỗ trợ',
      13: 'Xác thực thương nhân thất bại',
      20: 'Yêu cầu không đúng định dạng',
      21: 'Số tiền không hợp lệ',
      22: 'Số tiền vượt quá hạn mức',
      40: 'RequestId bị trùng',
      41: 'OrderId bị trùng',
      42: 'OrderId không hợp lệ',
      43: 'Đã xảy ra xung đột trong quá trình xử lý',
      1000: 'Giao dịch thất bại do lỗi không xác định',
      1001: 'Giao dịch thất bại do tài khoản người dùng không đủ tiền',
      1002: 'Giao dịch bị từ chối bởi nhà phát hành',
      1003: 'Giao dịch bị hủy',
      1004: 'Giao dịch thất bại do số tiền vượt quá hạn mức thanh toán',
      1005: 'Giao dịch thất bại do URL hoặc QR code đã hết hạn',
      1006: 'Giao dịch thất bại do người dùng đã hủy thanh toán',
      1007: 'Giao dịch bị từ chối vì tài khoản không tồn tại hoặc chưa được kích hoạt',
    };

    return messages[resultCode] || 'Lỗi không xác định';
  }

  async queryTransaction(orderId: string, requestId: string): Promise<any> {
    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `orderId=${orderId}`,
      `partnerCode=${this.partnerCode}`,
      `requestId=${requestId}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      requestId,
      orderId,
      lang: 'vi',
      signature,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.endpoint}/query`, requestBody),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to query MoMo transaction: ${error.message}`);
      throw error;
    }
  }

  async refundTransaction(
    orderId: string,
    transId: number,
    amount: number,
    description: string,
  ): Promise<any> {
    const requestId = `refund_${orderId}_${Date.now()}`;

    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `amount=${amount}`,
      `description=${description}`,
      `orderId=${orderId}`,
      `partnerCode=${this.partnerCode}`,
      `requestId=${requestId}`,
      `transId=${transId}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      orderId,
      requestId,
      amount,
      transId,
      lang: 'vi',
      description,
      signature,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.endpoint}/refund`, requestBody),
      );

      this.logger.log(`MoMo refund initiated for order ${orderId}`);

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to refund MoMo transaction: ${error.message}`);
      throw error;
    }
  }
}
```

### 2. Payment Service Extension

```typescript
// src/modules/payment/payment.service.ts - Add MoMo methods
import { MoMoGateway, MoMoIPNData } from './gateways/momo.gateway';

@Injectable()
export class PaymentService {
  constructor(
    // ... existing dependencies
    private momoGateway: MoMoGateway,
  ) {}

  async createMoMoPayment(
    userId: string,
    dto: CreatePaymentDto,
    ipAddress: string,
  ): Promise<{
    payUrl: string;
    qrCodeUrl: string;
    deeplink: string;
    transactionId: string;
  }> {
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
      paymentMethod: PaymentMethod.MOMO,
      status: PaymentStatus.PENDING,
      ipAddress,
      orderInfo: `Thanh toán gói ${dto.planCode}`,
      promoCode: dto.promoCode,
      discountAmount,
    });

    await this.transactionRepo.save(transaction);

    try {
      // Create MoMo payment
      const momoResponse = await this.momoGateway.createQRPayment(
        transaction.id,
        finalAmount,
        transaction.orderInfo,
      );

      if (momoResponse.resultCode !== 0) {
        throw new BadRequestException(
          this.momoGateway.getResultMessage(momoResponse.resultCode),
        );
      }

      this.logger.log(`Created MoMo payment for user ${userId}, transaction ${transaction.id}`);

      return {
        payUrl: momoResponse.payUrl,
        qrCodeUrl: momoResponse.qrCodeUrl,
        deeplink: momoResponse.deeplink,
        transactionId: transaction.id,
      };
    } catch (error) {
      // Mark transaction as failed
      transaction.status = PaymentStatus.FAILED;
      transaction.gatewayResponse = { error: error.message };
      await this.transactionRepo.save(transaction);
      throw error;
    }
  }

  async handleMoMoIPN(ipnData: MoMoIPNData): Promise<{ status: number }> {
    const transactionId = ipnData.orderId;

    // Verify signature
    if (!this.momoGateway.verifySignature(ipnData)) {
      this.logger.error(`Invalid MoMo signature for transaction ${transactionId}`);
      return { status: 1 }; // Invalid signature
    }

    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      this.logger.error(`Transaction ${transactionId} not found`);
      return { status: 2 }; // Transaction not found
    }

    // Verify amount
    if (ipnData.amount !== Number(transaction.amount)) {
      this.logger.error(`Amount mismatch for transaction ${transactionId}`);
      return { status: 3 }; // Amount mismatch
    }

    // Check if already processed
    if (transaction.status !== PaymentStatus.PENDING) {
      return { status: 0 }; // Already processed
    }

    const isSuccess = this.momoGateway.isPaymentSuccess(ipnData.resultCode);

    if (isSuccess) {
      await this.completeMoMoPayment(transaction, ipnData);
    } else {
      const message = this.momoGateway.getResultMessage(ipnData.resultCode);
      await this.failPayment(
        transaction,
        ipnData as unknown as Record<string, any>,
        message,
      );
    }

    return { status: 0 }; // Success
  }

  private async completeMoMoPayment(
    transaction: PaymentTransaction,
    ipnData: MoMoIPNData,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update transaction
      transaction.status = PaymentStatus.COMPLETED;
      transaction.gatewayTransactionId = ipnData.transId.toString();
      transaction.gatewayResponse = ipnData as unknown as Record<string, any>;
      transaction.completedAt = new Date();

      await queryRunner.manager.save(transaction);

      // Activate subscription
      const subscription = await this.subscriptionService.activateFromPayment(
        transaction.userId,
        transaction.orderInfo,
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
        paymentMethod: 'momo',
      });

      this.logger.log(`MoMo payment completed for transaction ${transaction.id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to complete MoMo payment ${transaction.id}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async queryMoMoTransaction(transactionId: string): Promise<any> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    const requestId = `query_${transactionId}_${Date.now()}`;
    return this.momoGateway.queryTransaction(transactionId, requestId);
  }
}
```

### 3. Controller Extension

```typescript
// src/modules/payment/payment.controller.ts - Add MoMo endpoints

@Controller('payment')
export class PaymentController {
  // ... existing endpoints

  @Post('momo/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create MoMo payment' })
  async createMoMoPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.paymentService.createMoMoPayment(userId, dto, ipAddress);
  }

  @Get('momo/return')
  @ApiOperation({ summary: 'MoMo return URL handler' })
  async handleMoMoReturn(
    @Query('orderId') orderId: string,
    @Query('resultCode') resultCode: number,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (resultCode === 0) {
      return res.redirect(`${frontendUrl}/payment/success?txn=${orderId}`);
    } else {
      const message = this.paymentService.getMoMoResultMessage(resultCode);
      return res.redirect(
        `${frontendUrl}/payment/failed?txn=${orderId}&msg=${encodeURIComponent(message)}`,
      );
    }
  }

  @Post('momo/ipn')
  @ApiOperation({ summary: 'MoMo IPN webhook' })
  async handleMoMoIPN(@Body() ipnData: MoMoIPNData) {
    return this.paymentService.handleMoMoIPN(ipnData);
  }

  @Get('momo/query/:transactionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Query MoMo transaction status' })
  async queryMoMoTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.queryMoMoTransaction(transactionId);
  }
}
```

### 4. Module Update

```typescript
// src/modules/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { VNPayGateway } from './gateways/vnpay.gateway';
import { MoMoGateway } from './gateways/momo.gateway';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    SubscriptionModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, VNPayGateway, MoMoGateway],
  exports: [PaymentService],
})
export class PaymentModule {}
```

---

## ✅ Acceptance Criteria

- [ ] MoMo sandbox integration working
- [ ] QR code generation correct
- [ ] Deeplink for mobile works
- [ ] IPN webhook handled properly
- [ ] Signature verification secure
- [ ] Transaction status queries work
- [ ] Refund functionality available
- [ ] Error messages in Vietnamese

---

## 🧪 Test Cases

```typescript
describe('MoMoGateway', () => {
  describe('createPayment', () => {
    it('returns payment URLs', async () => {
      const response = await gateway.createQRPayment(
        'order-123',
        100000,
        'Test payment',
      );

      expect(response.resultCode).toBe(0);
      expect(response.payUrl).toBeDefined();
      expect(response.qrCodeUrl).toBeDefined();
    });
  });

  describe('verifySignature', () => {
    it('validates correct signature', () => {
      const ipnData = createValidMoMoIPN();
      expect(gateway.verifySignature(ipnData)).toBe(true);
    });

    it('rejects invalid signature', () => {
      const ipnData = { ...createValidMoMoIPN(), signature: 'invalid' };
      expect(gateway.verifySignature(ipnData)).toBe(false);
    });
  });
});

describe('PaymentService - MoMo', () => {
  describe('createMoMoPayment', () => {
    it('creates pending transaction', async () => {
      const result = await service.createMoMoPayment(
        userId,
        { planCode: 'premium', amount: 199000 },
        '127.0.0.1',
      );

      expect(result.payUrl).toBeDefined();
      expect(result.qrCodeUrl).toBeDefined();
      expect(result.transactionId).toBeDefined();
    });
  });

  describe('handleMoMoIPN', () => {
    it('completes payment on success', async () => {
      const result = await service.handleMoMoIPN(successMoMoIPN);

      expect(result.status).toBe(0);

      const tx = await repo.findOne({ where: { id: transactionId } });
      expect(tx.status).toBe(PaymentStatus.COMPLETED);
    });

    it('fails payment on error', async () => {
      const result = await service.handleMoMoIPN(failedMoMoIPN);

      expect(result.status).toBe(0);

      const tx = await repo.findOne({ where: { id: transactionId } });
      expect(tx.status).toBe(PaymentStatus.FAILED);
    });
  });
});
```
