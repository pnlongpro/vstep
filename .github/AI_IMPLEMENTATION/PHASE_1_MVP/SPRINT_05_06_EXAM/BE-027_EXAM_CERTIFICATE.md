# BE-027: Exam Certificate Generation

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-027 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P3 (Low) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-026 |

---

## 🎯 Objective

Implement Certificate Generation với:
- Auto-generate certificate for passing scores
- Customizable certificate template
- QR code verification
- PDF download

---

## 💻 Implementation

### Step 1: Certificate DTOs

```typescript
// src/modules/exams/dto/certificate.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class GenerateCertificateDto {
  @ApiProperty()
  @IsUUID()
  attemptId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeDateOfBirth?: boolean;
}

export class CertificateDto {
  @ApiProperty()
  certificateId: string;

  @ApiProperty()
  certificateNumber: string;

  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  examTitle: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  vstepScore: number;

  @ApiProperty()
  band: string;

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  expiryDate: Date;

  @ApiProperty()
  verificationUrl: string;

  @ApiProperty()
  qrCodeUrl: string;

  @ApiProperty()
  downloadUrl: string;

  @ApiProperty()
  skillScores: {
    skill: string;
    score: number;
  }[];
}

export class CertificateVerificationDto {
  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  certificateNumber: string;

  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  examTitle: string;

  @ApiProperty()
  vstepScore: number;

  @ApiProperty()
  band: string;

  @ApiProperty()
  issueDate: Date;

  @ApiProperty()
  isExpired: boolean;

  @ApiPropertyOptional()
  expiryDate?: Date;

  @ApiPropertyOptional()
  message?: string;
}

export class CertificateTemplateDto {
  templateId: string;
  name: string;
  thumbnail: string;
  isDefault: boolean;
}
```

### Step 2: Certificate Entity

```typescript
// src/modules/exams/entities/certificate.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { ExamAttempt } from './exam-attempt.entity';

@Entity('certificates')
@Index(['certificateNumber'], { unique: true })
@Index(['userId'])
@Index(['verificationCode'], { unique: true })
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'certificate_number' })
  certificateNumber: string;

  @Column({ name: 'verification_code' })
  verificationCode: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'attempt_id' })
  attemptId: string;

  @ManyToOne(() => ExamAttempt)
  @JoinColumn({ name: 'attempt_id' })
  attempt: ExamAttempt;

  // Certificate details
  @Column({ name: 'recipient_name' })
  recipientName: string;

  @Column({ name: 'exam_title' })
  examTitle: string;

  @Column()
  level: string;

  @Column({ name: 'vstep_score', type: 'decimal', precision: 3, scale: 1 })
  vstepScore: number;

  @Column()
  band: string;

  @Column({ name: 'skill_scores', type: 'json' })
  skillScores: { skill: string; score: number }[];

  // Dates
  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  // Files
  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  @Column({ name: 'qr_code_url', nullable: true })
  qrCodeUrl: string;

  // Template
  @Column({ name: 'template_id', nullable: true })
  templateId: string;

  // Status
  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'revoked_reason', nullable: true })
  revokedReason: string;

  @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
  revokedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Step 3: Certificate Service

```typescript
// src/modules/exams/services/certificate.service.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import { Certificate } from '../entities/certificate.entity';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { User } from '@/modules/users/entities/user.entity';
import { StorageService } from '@/core/storage/storage.service';
import {
  GenerateCertificateDto,
  CertificateDto,
  CertificateVerificationDto,
} from '../dto/certificate.dto';
import { VSTEP_BANDS } from '../constants/vstep-scoring.constants';

const PASSING_SCORE = 4.0; // Minimum VSTEP score for certificate
const CERTIFICATE_VALIDITY_YEARS = 2;

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);
  private readonly appUrl: string;

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamResult)
    private readonly resultRepository: Repository<ExamResult>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl = this.configService.get('APP_URL') || 'https://vstepro.vn';
  }

  /**
   * Generate certificate for exam attempt
   */
  async generateCertificate(
    userId: string,
    dto: GenerateCertificateDto,
  ): Promise<CertificateDto> {
    // Check if certificate already exists
    const existingCert = await this.certificateRepository.findOne({
      where: { attemptId: dto.attemptId, userId },
    });

    if (existingCert) {
      return this.formatCertificateDto(existingCert);
    }

    // Get attempt and result
    const attempt = await this.attemptRepository.findOne({
      where: { id: dto.attemptId, userId },
      relations: ['examSet'],
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    if (attempt.status !== AttemptStatus.COMPLETED) {
      throw new BadRequestException('Exam is not completed');
    }

    // Check passing score
    if (!attempt.vstepScore || attempt.vstepScore < PASSING_SCORE) {
      throw new BadRequestException(
        `Certificate requires minimum VSTEP score of ${PASSING_SCORE}. Your score: ${attempt.vstepScore || 0}`
      );
    }

    // Get result for skill scores
    const result = await this.resultRepository.findOne({
      where: { attemptId: dto.attemptId },
    });

    // Get user
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // Generate certificate number and verification code
    const certificateNumber = this.generateCertificateNumber(attempt.examSet.level);
    const verificationCode = this.generateVerificationCode();

    // Calculate dates
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + CERTIFICATE_VALIDITY_YEARS);

    // Generate QR code
    const verificationUrl = `${this.appUrl}/verify/${verificationCode}`;
    const qrCodeDataUrl = await this.generateQRCode(verificationUrl);

    // Create certificate record first
    const certificate = this.certificateRepository.create({
      certificateNumber,
      verificationCode,
      userId,
      attemptId: dto.attemptId,
      recipientName: dto.displayName || user.name,
      examTitle: attempt.examSet.title,
      level: attempt.examSet.level,
      vstepScore: attempt.vstepScore,
      band: this.determineBand(attempt.vstepScore),
      skillScores: result?.resultData?.skillAnalysis?.map(s => ({
        skill: s.skill,
        score: s.vstepScore,
      })) || [],
      issueDate,
      expiryDate,
    });

    await this.certificateRepository.save(certificate);

    // Generate PDF
    const pdfBuffer = await this.generatePDF(certificate, qrCodeDataUrl);

    // Upload files
    const [pdfUrl, qrCodeUrl] = await Promise.all([
      this.storageService.upload(
        pdfBuffer,
        `certificates/${certificate.id}.pdf`,
        'application/pdf',
      ),
      this.storageService.upload(
        Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'),
        `certificates/${certificate.id}-qr.png`,
        'image/png',
      ),
    ]);

    // Update certificate with URLs
    certificate.pdfUrl = pdfUrl;
    certificate.qrCodeUrl = qrCodeUrl;
    await this.certificateRepository.save(certificate);

    return this.formatCertificateDto(certificate);
  }

  /**
   * Get certificate by ID
   */
  async getCertificate(certificateId: string, userId: string): Promise<CertificateDto> {
    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId, userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return this.formatCertificateDto(certificate);
  }

  /**
   * Get user's certificates
   */
  async getUserCertificates(userId: string): Promise<CertificateDto[]> {
    const certificates = await this.certificateRepository.find({
      where: { userId, isRevoked: false },
      order: { createdAt: 'DESC' },
    });

    return certificates.map(c => this.formatCertificateDto(c));
  }

  /**
   * Verify certificate
   */
  async verifyCertificate(verificationCode: string): Promise<CertificateVerificationDto> {
    const certificate = await this.certificateRepository.findOne({
      where: { verificationCode },
    });

    if (!certificate) {
      return {
        isValid: false,
        certificateNumber: '',
        recipientName: '',
        examTitle: '',
        vstepScore: 0,
        band: '',
        issueDate: new Date(),
        isExpired: false,
        message: 'Certificate not found',
      };
    }

    if (certificate.isRevoked) {
      return {
        isValid: false,
        certificateNumber: certificate.certificateNumber,
        recipientName: certificate.recipientName,
        examTitle: certificate.examTitle,
        vstepScore: certificate.vstepScore,
        band: certificate.band,
        issueDate: certificate.issueDate,
        isExpired: false,
        message: `Certificate revoked: ${certificate.revokedReason}`,
      };
    }

    const isExpired = certificate.expiryDate && certificate.expiryDate < new Date();

    return {
      isValid: !isExpired,
      certificateNumber: certificate.certificateNumber,
      recipientName: certificate.recipientName,
      examTitle: certificate.examTitle,
      vstepScore: certificate.vstepScore,
      band: certificate.band,
      issueDate: certificate.issueDate,
      isExpired,
      expiryDate: certificate.expiryDate,
      message: isExpired ? 'Certificate has expired' : 'Valid certificate',
    };
  }

  /**
   * Download certificate PDF
   */
  async downloadCertificate(certificateId: string, userId: string): Promise<Buffer> {
    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId, userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.pdfUrl) {
      // Return stored PDF
      return this.storageService.download(certificate.pdfUrl);
    }

    // Regenerate PDF
    const verificationUrl = `${this.appUrl}/verify/${certificate.verificationCode}`;
    const qrCodeDataUrl = await this.generateQRCode(verificationUrl);
    return this.generatePDF(certificate, qrCodeDataUrl);
  }

  /**
   * Revoke certificate (admin)
   */
  async revokeCertificate(certificateId: string, reason: string): Promise<void> {
    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    certificate.isRevoked = true;
    certificate.revokedReason = reason;
    certificate.revokedAt = new Date();
    await this.certificateRepository.save(certificate);
  }

  // Private helpers
  private generateCertificateNumber(level: string): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VSTEP-${level}-${year}-${random}`;
  }

  private generateVerificationCode(): string {
    return uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
  }

  private determineBand(score: number): string {
    for (const [band, range] of Object.entries(VSTEP_BANDS)) {
      if (score >= range.min && score <= range.max) {
        return band;
      }
    }
    return 'A1';
  }

  private async generateQRCode(url: string): Promise<string> {
    return QRCode.toDataURL(url, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  }

  private async generatePDF(certificate: Certificate, qrCodeDataUrl: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(2)
        .stroke('#1a365d');

      // Inner border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .stroke('#4a5568');

      // Header
      doc.fillColor('#1a365d')
        .fontSize(36)
        .font('Helvetica-Bold')
        .text('CERTIFICATE', 0, 80, { align: 'center' });

      doc.fontSize(18)
        .text('VSTEP English Proficiency', 0, 125, { align: 'center' });

      // Certificate number
      doc.fontSize(10)
        .fillColor('#718096')
        .text(`Certificate No: ${certificate.certificateNumber}`, 0, 160, { align: 'center' });

      // Recipient
      doc.fontSize(14)
        .fillColor('#2d3748')
        .text('This is to certify that', 0, 200, { align: 'center' });

      doc.fontSize(28)
        .fillColor('#1a365d')
        .font('Helvetica-Bold')
        .text(certificate.recipientName, 0, 225, { align: 'center' });

      doc.fontSize(14)
        .fillColor('#2d3748')
        .font('Helvetica')
        .text('has successfully completed', 0, 270, { align: 'center' });

      doc.fontSize(20)
        .fillColor('#1a365d')
        .font('Helvetica-Bold')
        .text(certificate.examTitle, 0, 295, { align: 'center' });

      // Score box
      const scoreBoxX = (doc.page.width - 200) / 2;
      doc.rect(scoreBoxX, 335, 200, 80)
        .fillAndStroke('#e2e8f0', '#4a5568');

      doc.fontSize(24)
        .fillColor('#1a365d')
        .text(`VSTEP Score: ${certificate.vstepScore.toFixed(1)}`, scoreBoxX, 350, {
          width: 200,
          align: 'center',
        });

      doc.fontSize(18)
        .text(`Band: ${certificate.band}`, scoreBoxX, 385, {
          width: 200,
          align: 'center',
        });

      // Skill scores
      const skillStartY = 430;
      const skillWidth = 100;
      const totalSkillsWidth = certificate.skillScores.length * skillWidth;
      const skillStartX = (doc.page.width - totalSkillsWidth) / 2;

      doc.fontSize(10);
      certificate.skillScores.forEach((skill, index) => {
        const x = skillStartX + index * skillWidth;
        doc.fillColor('#4a5568')
          .text(skill.skill.toUpperCase(), x, skillStartY, {
            width: skillWidth,
            align: 'center',
          });
        doc.fillColor('#1a365d')
          .font('Helvetica-Bold')
          .text(skill.score.toFixed(1), x, skillStartY + 15, {
            width: skillWidth,
            align: 'center',
          })
          .font('Helvetica');
      });

      // Dates
      doc.fontSize(10)
        .fillColor('#718096')
        .text(`Issue Date: ${this.formatDate(certificate.issueDate)}`, 100, 480)
        .text(`Valid Until: ${this.formatDate(certificate.expiryDate)}`, doc.page.width - 200, 480);

      // QR Code
      const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
      doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });

      doc.fontSize(8)
        .fillColor('#718096')
        .text('Scan to verify', doc.page.width - 150, doc.page.height - 45, {
          width: 100,
          align: 'center',
        });

      // Footer
      doc.fontSize(8)
        .text('This certificate is issued by VSTEPRO and can be verified online.', 0, doc.page.height - 60, {
          align: 'center',
          width: doc.page.width,
        });

      doc.end();
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatCertificateDto(certificate: Certificate): CertificateDto {
    return {
      certificateId: certificate.id,
      certificateNumber: certificate.certificateNumber,
      recipientName: certificate.recipientName,
      examTitle: certificate.examTitle,
      level: certificate.level,
      vstepScore: certificate.vstepScore,
      band: certificate.band,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate,
      verificationUrl: `${this.appUrl}/verify/${certificate.verificationCode}`,
      qrCodeUrl: certificate.qrCodeUrl,
      downloadUrl: `${this.appUrl}/api/certificates/${certificate.id}/download`,
      skillScores: certificate.skillScores,
    };
  }
}
```

### Step 4: Certificate Controller

```typescript
// src/modules/exams/controllers/certificate.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { CertificateService } from '../services/certificate.service';
import {
  GenerateCertificateDto,
  CertificateDto,
  CertificateVerificationDto,
} from '../dto/certificate.dto';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('generate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate certificate for exam' })
  async generateCertificate(
    @Request() req,
    @Body() dto: GenerateCertificateDto,
  ): Promise<CertificateDto> {
    return this.certificateService.generateCertificate(req.user.id, dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user certificates' })
  async getUserCertificates(@Request() req): Promise<CertificateDto[]> {
    return this.certificateService.getUserCertificates(req.user.id);
  }

  @Get(':certificateId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get certificate details' })
  async getCertificate(
    @Request() req,
    @Param('certificateId') certificateId: string,
  ): Promise<CertificateDto> {
    return this.certificateService.getCertificate(certificateId, req.user.id);
  }

  @Get(':certificateId/download')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download certificate PDF' })
  async downloadCertificate(
    @Request() req,
    @Param('certificateId') certificateId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.certificateService.downloadCertificate(
      certificateId,
      req.user.id,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`,
    });

    return new StreamableFile(buffer);
  }

  @Get('verify/:verificationCode')
  @Public()
  @ApiOperation({ summary: 'Verify certificate (public)' })
  async verifyCertificate(
    @Param('verificationCode') verificationCode: string,
  ): Promise<CertificateVerificationDto> {
    return this.certificateService.verifyCertificate(verificationCode);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Certificate generated for passing scores only
- [ ] Unique certificate number generated
- [ ] QR code links to verification page
- [ ] PDF download works
- [ ] Public verification endpoint works
- [ ] Certificate expiry tracked
- [ ] Revocation possible by admin

---

## ⏭️ Next Task

→ `FE-020_EXAM_API_SERVICE.md` - Frontend Exam API Service
