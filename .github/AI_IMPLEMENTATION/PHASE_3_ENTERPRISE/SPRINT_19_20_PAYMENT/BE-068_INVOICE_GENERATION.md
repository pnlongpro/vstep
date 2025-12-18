# BE-068: Invoice Generation

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-068 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 19-20 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-066, BE-067 |

---

## 🎯 Objective

Implement invoice generation system:
- Invoice entity with auto-numbering
- PDF generation
- Email sending with attachment
- Invoice management

---

## 📝 Implementation

### 1. Invoice Entity

```typescript
// src/modules/payment/entities/invoice.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PaymentTransaction } from './payment-transaction.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  invoiceNumber: string; // INV-2024-00001

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  transactionId: string;

  @ManyToOne(() => PaymentTransaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: PaymentTransaction;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column()
  issueDate: Date;

  @Column()
  dueDate: Date;

  // Billing info
  @Column({ length: 255 })
  customerName: string;

  @Column({ length: 255, nullable: true })
  customerEmail: string;

  @Column({ length: 50, nullable: true })
  customerPhone: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ length: 20, nullable: true })
  taxCode: string;

  // Line items
  @Column('json')
  items: InvoiceItem[];

  // Totals
  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 500, nullable: true })
  pdfUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
```

### 2. Invoice DTOs

```typescript
// src/modules/payment/dto/create-invoice.dto.ts
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

// src/modules/payment/dto/invoice-query.dto.ts
import { IsOptional, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../entities/invoice.entity';

export class InvoiceQueryDto {
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

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
```

### 3. Invoice Service

```typescript
// src/modules/payment/invoice.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { format, addDays, startOfDay, endOfDay, startOfYear } from 'date-fns';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { S3 } from 'aws-sdk';
import { Invoice, InvoiceStatus, InvoiceItem } from './entities/invoice.entity';
import { PaymentTransaction, PaymentStatus } from './entities/payment-transaction.entity';
import { MailerService } from '../../core/mailer/mailer.service';
import { CreateInvoiceDto, InvoiceQueryDto } from './dto';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  private s3: S3;
  private bucketName: string;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(PaymentTransaction)
    private transactionRepo: Repository<PaymentTransaction>,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      accessKeyId: this.configService.get('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      s3ForcePathStyle: true,
    });
    this.bucketName = this.configService.get('S3_BUCKET_INVOICES');
  }

  async createInvoice(
    userId: string,
    dto: CreateInvoiceDto,
  ): Promise<Invoice> {
    // Calculate totals
    const items: InvoiceItem[] = dto.items.map((item) => ({
      ...item,
      amount: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discount = dto.discount || 0;
    const taxableAmount = subtotal - discount;
    const taxRate = dto.taxRate || 0;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = this.invoiceRepo.create({
      invoiceNumber,
      userId,
      transactionId: dto.transactionId,
      status: InvoiceStatus.DRAFT,
      issueDate: new Date(),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : addDays(new Date(), 30),
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      customerAddress: dto.customerAddress,
      taxCode: dto.taxCode,
      items,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,
      currency: 'VND',
      notes: dto.notes,
    });

    await this.invoiceRepo.save(invoice);

    this.logger.log(`Invoice ${invoiceNumber} created for user ${userId}`);

    return invoice;
  }

  async createInvoiceFromTransaction(
    transactionId: string,
  ): Promise<Invoice> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId, status: PaymentStatus.COMPLETED },
      relations: ['user', 'subscription', 'subscription.plan'],
    });

    if (!transaction) {
      throw new NotFoundException('Giao dịch không tồn tại hoặc chưa hoàn thành');
    }

    // Check if invoice already exists
    const existingInvoice = await this.invoiceRepo.findOne({
      where: { transactionId },
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    return this.createInvoice(transaction.userId, {
      transactionId,
      customerName: transaction.user?.name || 'Khách hàng',
      customerEmail: transaction.user?.email,
      items: [
        {
          description: transaction.orderInfo,
          quantity: 1,
          unitPrice: Number(transaction.amount),
        },
      ],
    });
  }

  async issueInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Chỉ có thể phát hành hóa đơn nháp');
    }

    // Generate PDF
    const pdfUrl = await this.generatePDF(invoice);

    invoice.status = InvoiceStatus.ISSUED;
    invoice.pdfUrl = pdfUrl;

    await this.invoiceRepo.save(invoice);

    return invoice;
  }

  async markAsPaid(invoiceId: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Không thể cập nhật hóa đơn đã hủy');
    }

    invoice.status = InvoiceStatus.PAID;
    await this.invoiceRepo.save(invoice);

    return invoice;
  }

  async cancelInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Không thể hủy hóa đơn đã thanh toán');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    await this.invoiceRepo.save(invoice);

    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['user', 'transaction'],
    });

    if (!invoice) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }

    return invoice;
  }

  async getUserInvoices(
    userId: string,
    query: InvoiceQueryDto,
  ): Promise<{ data: Invoice[]; total: number }> {
    const { status, startDate, endDate, page = 1, limit = 10 } = query;

    const queryBuilder = this.invoiceRepo
      .createQueryBuilder('inv')
      .where('inv.userId = :userId', { userId })
      .orderBy('inv.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('inv.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('inv.issueDate BETWEEN :startDate AND :endDate', {
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

  async getAllInvoices(query: InvoiceQueryDto): Promise<{ data: Invoice[]; total: number }> {
    const { status, startDate, endDate, page = 1, limit = 20 } = query;

    const queryBuilder = this.invoiceRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.user', 'user')
      .orderBy('inv.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('inv.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('inv.issueDate BETWEEN :startDate AND :endDate', {
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

  async generatePDF(invoice: Invoice): Promise<string> {
    const template = this.getInvoiceTemplate();
    const html = Handlebars.compile(template)({
      invoice: {
        ...invoice,
        issueDateFormatted: format(invoice.issueDate, 'dd/MM/yyyy'),
        dueDateFormatted: format(invoice.dueDate, 'dd/MM/yyyy'),
        subtotalFormatted: this.formatCurrency(invoice.subtotal),
        discountFormatted: this.formatCurrency(invoice.discount),
        taxAmountFormatted: this.formatCurrency(invoice.taxAmount),
        totalFormatted: this.formatCurrency(invoice.total),
        items: invoice.items.map((item) => ({
          ...item,
          unitPriceFormatted: this.formatCurrency(item.unitPrice),
          amountFormatted: this.formatCurrency(item.amount),
        })),
      },
      company: {
        name: this.configService.get('COMPANY_NAME', 'VSTEP Learning'),
        address: this.configService.get('COMPANY_ADDRESS', 'Hà Nội, Việt Nam'),
        phone: this.configService.get('COMPANY_PHONE', '1900-xxx-xxx'),
        email: this.configService.get('COMPANY_EMAIL', 'contact@vstep.vn'),
        taxCode: this.configService.get('COMPANY_TAX_CODE', ''),
      },
    });

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });

    await browser.close();

    // Upload to S3
    const key = `invoices/${format(new Date(), 'yyyy/MM')}/${invoice.invoiceNumber}.pdf`;

    await this.s3
      .putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      })
      .promise();

    return `${this.configService.get('S3_PUBLIC_URL')}/${this.bucketName}/${key}`;
  }

  async downloadPDF(invoiceId: string, userId?: string): Promise<Buffer> {
    const invoice = await this.getInvoiceById(invoiceId);

    // Check permission
    if (userId && invoice.userId !== userId) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }

    if (!invoice.pdfUrl) {
      // Generate if not exists
      invoice.pdfUrl = await this.generatePDF(invoice);
      await this.invoiceRepo.save(invoice);
    }

    // Download from S3
    const key = invoice.pdfUrl.replace(`${this.configService.get('S3_PUBLIC_URL')}/${this.bucketName}/`, '');

    const response = await this.s3
      .getObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();

    return response.Body as Buffer;
  }

  async sendInvoiceEmail(invoiceId: string): Promise<void> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (!invoice.customerEmail) {
      throw new BadRequestException('Không có email khách hàng');
    }

    const pdfBuffer = await this.downloadPDF(invoiceId);

    await this.mailerService.sendMail({
      to: invoice.customerEmail,
      subject: `Hóa đơn ${invoice.invoiceNumber} - VSTEP Learning`,
      template: 'invoice',
      context: {
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        total: this.formatCurrency(invoice.total),
        issueDate: format(invoice.issueDate, 'dd/MM/yyyy'),
      },
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    this.logger.log(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerEmail}`);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const yearStart = startOfYear(new Date());

    const count = await this.invoiceRepo.count({
      where: {
        createdAt: MoreThanOrEqual(yearStart),
      },
    });

    const sequence = String(count + 1).padStart(5, '0');
    return `INV-${year}-${sequence}`;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  private getInvoiceTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Arial', sans-serif; font-size: 14px; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .company { font-size: 12px; }
    .company-name { font-size: 20px; font-weight: bold; color: #2563eb; }
    .invoice-title { font-size: 28px; color: #333; text-align: right; }
    .invoice-number { font-size: 14px; color: #666; }
    .customer { margin-bottom: 30px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .table th { background: #f3f4f6; padding: 12px; text-align: left; }
    .table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
    .notes { margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      <div class="company-name">{{company.name}}</div>
      <p>{{company.address}}</p>
      <p>ĐT: {{company.phone}}</p>
      <p>Email: {{company.email}}</p>
      {{#if company.taxCode}}<p>MST: {{company.taxCode}}</p>{{/if}}
    </div>
    <div>
      <div class="invoice-title">HÓA ĐƠN</div>
      <div class="invoice-number">Số: {{invoice.invoiceNumber}}</div>
      <p>Ngày: {{invoice.issueDateFormatted}}</p>
      <p>Hạn thanh toán: {{invoice.dueDateFormatted}}</p>
    </div>
  </div>

  <div class="customer">
    <strong>Khách hàng:</strong>
    <p>{{invoice.customerName}}</p>
    {{#if invoice.customerEmail}}<p>Email: {{invoice.customerEmail}}</p>{{/if}}
    {{#if invoice.customerPhone}}<p>ĐT: {{invoice.customerPhone}}</p>{{/if}}
    {{#if invoice.customerAddress}}<p>Địa chỉ: {{invoice.customerAddress}}</p>{{/if}}
    {{#if invoice.taxCode}}<p>MST: {{invoice.taxCode}}</p>{{/if}}
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>STT</th>
        <th>Mô tả</th>
        <th style="text-align: center;">SL</th>
        <th style="text-align: right;">Đơn giá</th>
        <th style="text-align: right;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      {{#each invoice.items}}
      <tr>
        <td>{{@index}}</td>
        <td>{{description}}</td>
        <td style="text-align: center;">{{quantity}}</td>
        <td style="text-align: right;">{{unitPriceFormatted}}</td>
        <td style="text-align: right;">{{amountFormatted}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Tạm tính:</span>
      <span>{{invoice.subtotalFormatted}}</span>
    </div>
    {{#if invoice.discount}}
    <div class="total-row">
      <span>Giảm giá:</span>
      <span>-{{invoice.discountFormatted}}</span>
    </div>
    {{/if}}
    {{#if invoice.taxRate}}
    <div class="total-row">
      <span>Thuế ({{invoice.taxRate}}%):</span>
      <span>{{invoice.taxAmountFormatted}}</span>
    </div>
    {{/if}}
    <div class="total-row grand-total">
      <span>TỔNG CỘNG:</span>
      <span>{{invoice.totalFormatted}}</span>
    </div>
  </div>

  {{#if invoice.notes}}
  <div class="notes">
    <strong>Ghi chú:</strong>
    <p>{{invoice.notes}}</p>
  </div>
  {{/if}}

  <div class="footer">
    <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
    <p>{{company.name}} - {{company.email}}</p>
  </div>
</body>
</html>
    `;
  }
}
```

### 4. Controller

```typescript
// src/modules/payment/invoice.controller.ts
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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, InvoiceQueryDto } from './dto';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  // ============ USER ENDPOINTS ============

  @Get('my-invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my invoices' })
  async getMyInvoices(
    @CurrentUser('id') userId: string,
    @Query() query: InvoiceQueryDto,
  ) {
    return this.invoiceService.getUserInvoices(userId, query);
  }

  @Get('my-invoices/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my invoice detail' })
  async getMyInvoiceDetail(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    if (invoice.userId !== userId) {
      throw new NotFoundException('Hóa đơn không tồn tại');
    }
    return invoice;
  }

  @Get('my-invoices/:id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download my invoice PDF' })
  async downloadMyInvoice(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoiceService.downloadPDF(id, userId);
    const invoice = await this.invoiceService.getInvoiceById(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );
    res.send(pdfBuffer);
  }

  // ============ ADMIN ENDPOINTS ============

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all invoices (admin)' })
  async getAllInvoices(@Query() query: InvoiceQueryDto) {
    return this.invoiceService.getAllInvoices(query);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create invoice (admin)' })
  async createInvoice(
    @Body() dto: CreateInvoiceDto & { userId: string },
  ) {
    return this.invoiceService.createInvoice(dto.userId, dto);
  }

  @Post('admin/from-transaction/:transactionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create invoice from transaction (admin)' })
  async createFromTransaction(@Param('transactionId') transactionId: string) {
    return this.invoiceService.createInvoiceFromTransaction(transactionId);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice detail (admin)' })
  async getInvoiceDetail(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }

  @Post('admin/:id/issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Issue invoice (admin)' })
  async issueInvoice(@Param('id') id: string) {
    return this.invoiceService.issueInvoice(id);
  }

  @Post('admin/:id/paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark invoice as paid (admin)' })
  async markAsPaid(@Param('id') id: string) {
    return this.invoiceService.markAsPaid(id);
  }

  @Post('admin/:id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel invoice (admin)' })
  async cancelInvoice(@Param('id') id: string) {
    return this.invoiceService.cancelInvoice(id);
  }

  @Post('admin/:id/send-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send invoice email (admin)' })
  async sendInvoiceEmail(@Param('id') id: string) {
    await this.invoiceService.sendInvoiceEmail(id);
    return { success: true, message: 'Email đã được gửi' };
  }

  @Get('admin/:id/download')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download invoice PDF (admin)' })
  async downloadInvoice(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoiceService.downloadPDF(id);
    const invoice = await this.invoiceService.getInvoiceById(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );
    res.send(pdfBuffer);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Invoice entity with auto-numbering
- [ ] Create invoice from transaction
- [ ] PDF generation with template
- [ ] Upload PDF to S3
- [ ] Download PDF endpoint
- [ ] Email invoice with attachment
- [ ] Invoice status lifecycle

---

## 🧪 Test Cases

```typescript
describe('InvoiceService', () => {
  describe('createInvoice', () => {
    it('creates invoice with auto-number', async () => {
      const invoice = await service.createInvoice(userId, {
        customerName: 'Test User',
        items: [{ description: 'Gói Premium', quantity: 1, unitPrice: 199000 }],
      });

      expect(invoice.invoiceNumber).toMatch(/^INV-\d{4}-\d{5}$/);
      expect(invoice.total).toBe(199000);
    });

    it('calculates totals correctly with discount and tax', async () => {
      const invoice = await service.createInvoice(userId, {
        customerName: 'Test User',
        items: [{ description: 'Gói VIP', quantity: 1, unitPrice: 499000 }],
        discount: 50000,
        taxRate: 10,
      });

      expect(invoice.subtotal).toBe(499000);
      expect(invoice.discount).toBe(50000);
      expect(invoice.taxAmount).toBe(44900); // (499000 - 50000) * 0.1
      expect(invoice.total).toBe(493900);
    });
  });

  describe('generatePDF', () => {
    it('generates PDF and uploads to S3', async () => {
      const invoice = await service.createInvoice(userId, mockDto);
      const pdfUrl = await service.generatePDF(invoice);

      expect(pdfUrl).toContain('.pdf');
      expect(pdfUrl).toContain(invoice.invoiceNumber);
    });
  });

  describe('sendInvoiceEmail', () => {
    it('sends email with PDF attachment', async () => {
      const invoice = await service.createInvoice(userId, {
        ...mockDto,
        customerEmail: 'test@example.com',
      });

      await service.issueInvoice(invoice.id);
      await service.sendInvoiceEmail(invoice.id);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          attachments: expect.arrayContaining([
            expect.objectContaining({ filename: `${invoice.invoiceNumber}.pdf` }),
          ]),
        }),
      );
    });
  });
});
```
