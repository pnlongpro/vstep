# BE-005: Password Reset Flow

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-005 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-002, BE-003 |

---

## 🎯 Objective

Implement Password Reset Flow hoàn chỉnh:
- Forgot Password (gửi email reset link)
- Validate Reset Token
- Reset Password với new password

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/forgot-password | Gửi email reset password |
| GET | /auth/reset-password/:token | Validate reset token |
| POST | /auth/reset-password | Reset password với token |

### Business Rules

1. **Forgot Password**:
   - Tạo reset token (random, unique)
   - Token expires sau 1 giờ
   - Gửi email với reset link
   - Rate limit: 3 requests/hour per email

2. **Reset Token**:
   - 64 characters random string
   - Hashed trước khi lưu DB
   - Single use (invalidate sau khi dùng)

3. **Reset Password**:
   - Validate token chưa expired
   - Password requirements giống register
   - Invalidate tất cả sessions sau reset
   - Gửi email xác nhận thay đổi

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── dto/
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
├── entities/
│   └── password-reset-token.entity.ts
├── templates/
│   ├── password-reset.html
│   └── password-changed.html
└── auth.service.ts (update)
```

### Step 1: Password Reset Token Entity

```typescript
// src/modules/auth/entities/password-reset-token.entity.ts
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

@Entity('password_reset_tokens')
@Index(['token'])
@Index(['userId'])
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 128 })
  token: string; // Hashed token

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'datetime', nullable: true })
  usedAt: Date;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Helper methods
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isUsed && !this.isExpired;
  }
}
```

### Step 2: DTOs

```typescript
// src/modules/auth/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email đăng ký tài khoản',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}
```

```typescript
// src/modules/auth/dto/reset-password.dto.ts
import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'abc123def456...',
    description: 'Token từ email reset password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;

  @ApiProperty({
    example: 'NewPassword@123',
    description: 'Mật khẩu mới',
  })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số hoặc ký tự đặc biệt',
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword@123',
    description: 'Xác nhận mật khẩu mới',
  })
  @IsString()
  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
  confirmPassword: string;
}

export class ValidateResetTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
```

### Step 3: Email Templates

```html
<!-- src/modules/auth/templates/password-reset.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Đặt lại mật khẩu - VSTEPRO</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .button { 
      display: inline-block; 
      background: #2563eb; 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .warning { color: #dc2626; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VSTEPRO</h1>
    </div>
    <div class="content">
      <h2>Đặt lại mật khẩu</h2>
      <p>Xin chào {{userName}},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
      
      <a href="{{resetLink}}" class="button">Đặt lại mật khẩu</a>
      
      <p class="warning">Link này sẽ hết hạn sau 1 giờ.</p>
      
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      
      <p>Trân trọng,<br>Đội ngũ VSTEPRO</p>
    </div>
    <div class="footer">
      <p>© 2024 VSTEPRO. All rights reserved.</p>
      <p>Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
  </div>
</body>
</html>
```

```html
<!-- src/modules/auth/templates/password-changed.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mật khẩu đã được thay đổi - VSTEPRO</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .success { color: #16a34a; font-weight: bold; }
    .warning { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VSTEPRO</h1>
    </div>
    <div class="content">
      <h2 class="success">✓ Mật khẩu đã được thay đổi thành công</h2>
      <p>Xin chào {{userName}},</p>
      <p>Mật khẩu tài khoản của bạn đã được thay đổi thành công vào lúc {{changedAt}}.</p>
      
      <div class="warning">
        <strong>⚠️ Lưu ý bảo mật:</strong>
        <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi qua email support@vstepro.vn</p>
      </div>
      
      <p>Trân trọng,<br>Đội ngũ VSTEPRO</p>
    </div>
    <div class="footer">
      <p>© 2024 VSTEPRO. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Step 4: Auth Service - Password Reset Methods

```typescript
// src/modules/auth/auth.service.ts (add these methods)
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { MailerService } from '../../core/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    // ... existing injections
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // ... existing methods

  /**
   * Request password reset - sends email with reset link
   */
  async forgotPassword(email: string, ipAddress?: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    
    // Always return success message (security: don't reveal if email exists)
    if (!user) {
      return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.' };
    }

    // Check rate limit (max 3 requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await this.passwordResetTokenRepository.count({
      where: {
        userId: user.id,
        createdAt: MoreThan(oneHourAgo),
      },
    });

    if (recentRequests >= 3) {
      throw new BadRequestException(
        'Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 1 giờ.',
      );
    }

    // Invalidate old tokens
    await this.passwordResetTokenRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true },
    );

    // Generate random token
    const rawToken = crypto.randomBytes(32).toString('hex'); // 64 chars
    const hashedToken = await bcrypt.hash(rawToken, 10);

    // Create token record
    const resetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      ipAddress,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    // Build reset link
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${rawToken}`;

    // Send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Đặt lại mật khẩu - VSTEPRO',
      template: 'password-reset',
      context: {
        userName: user.firstName,
        resetLink,
      },
    });

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu.' };
  }

  /**
   * Validate reset token
   */
  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    // Find all non-used, non-expired tokens
    const tokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    // Check each token (bcrypt compare)
    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        return {
          valid: true,
          email: this.maskEmail(tokenRecord.user.email),
        };
      }
    }

    return { valid: false };
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    // Find valid token
    const tokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    let validTokenRecord: PasswordResetToken | null = null;

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        validTokenRecord = tokenRecord;
        break;
      }
    }

    if (!validTokenRecord) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Update password
    await this.usersService.updatePassword(validTokenRecord.userId, newPassword);

    // Mark token as used
    await this.passwordResetTokenRepository.update(validTokenRecord.id, {
      isUsed: true,
      usedAt: new Date(),
    });

    // Invalidate all user sessions (force re-login)
    await this.sessionRepository.update(
      { userId: validTokenRecord.userId },
      { isActive: false },
    );

    // Send confirmation email
    const user = validTokenRecord.user;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mật khẩu đã được thay đổi - VSTEPRO',
      template: 'password-changed',
      context: {
        userName: user.firstName,
        changedAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      },
    });

    return { message: 'Mật khẩu đã được thay đổi thành công' };
  }

  /**
   * Mask email for privacy
   */
  private maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  }
}
```

### Step 5: Auth Controller - Password Reset Endpoints

```typescript
// src/modules/auth/auth.controller.ts (add these endpoints)
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto, ValidateResetTokenDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  // ... existing endpoints

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Yêu cầu đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Email đã được gửi (nếu tồn tại)' })
  @ApiResponse({ status: 400, description: 'Rate limit exceeded' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    return this.authService.forgotPassword(dto.email, ipAddress);
  }

  @Get('reset-password/validate')
  @Public()
  @ApiOperation({ summary: 'Kiểm tra token reset password còn hợp lệ không' })
  @ApiResponse({ status: 200, description: 'Token validation result' })
  async validateResetToken(
    @Query('token') token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    if (!token) {
      return { valid: false };
    }
    return this.authService.validateResetToken(token);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đặt lại mật khẩu với token' })
  @ApiResponse({ status: 200, description: 'Mật khẩu đã được thay đổi' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc hết hạn' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(
      dto.token,
      dto.newPassword,
      dto.confirmPassword,
    );
  }
}
```

### Step 6: Update Auth Module

```typescript
// src/modules/auth/auth.module.ts
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { MailerModule } from '../../core/mailer/mailer.module';

@Module({
  imports: [
    // ... existing imports
    TypeOrmModule.forFeature([Session, User, PasswordResetToken]),
    MailerModule,
  ],
  // ... rest
})
export class AuthModule {}
```

### Step 7: Mailer Service (Basic Implementation)

```typescript
// src/core/mailer/mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      // Load template
      const templatePath = path.join(
        __dirname,
        '..',
        '..',
        'modules',
        'auth',
        'templates',
        `${options.template}.html`,
      );

      let html: string;
      
      if (fs.existsSync(templatePath)) {
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        html = template(options.context);
      } else {
        // Fallback: simple text
        html = `<p>${JSON.stringify(options.context)}</p>`;
        this.logger.warn(`Template not found: ${templatePath}`);
      }

      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM', 'noreply@vstepro.vn'),
        to: options.to,
        subject: options.subject,
        html,
      });

      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      // Don't throw - email failure shouldn't break the flow
    }
  }
}
```

```typescript
// src/core/mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
```

---

## 🔧 Environment Variables

```env
# .env
FRONTEND_URL=http://localhost:3000

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=VSTEPRO <noreply@vstepro.vn>
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PASSWORD RESET FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FORGOT PASSWORD                                             │
│     User → POST /auth/forgot-password { email }                 │
│          ↓                                                      │
│     [Check rate limit] → [Generate token] → [Send email]        │
│          ↓                                                      │
│     Response: "Email sent if exists"                            │
│                                                                 │
│  2. USER CLICKS EMAIL LINK                                      │
│     Email link → Frontend /auth/reset-password?token=xxx        │
│          ↓                                                      │
│     Frontend → GET /auth/reset-password/validate?token=xxx      │
│          ↓                                                      │
│     [Validate token] → { valid: true/false }                    │
│                                                                 │
│  3. RESET PASSWORD                                              │
│     User → POST /auth/reset-password                            │
│            { token, newPassword, confirmPassword }              │
│          ↓                                                      │
│     [Validate token] → [Update password] → [Invalidate sessions]│
│          ↓                                                      │
│     [Send confirmation email] → Response: "Success"             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

- [ ] POST /auth/forgot-password sends reset email
- [ ] Rate limit: max 3 requests/hour per email
- [ ] Token expires after 1 hour
- [ ] Token is single-use
- [ ] GET /auth/reset-password/validate checks token validity
- [ ] POST /auth/reset-password changes password
- [ ] All sessions invalidated after password reset
- [ ] Confirmation email sent after reset
- [ ] Secure: doesn't reveal if email exists

---

## 🧪 Testing

### Manual Test

```bash
# 1. Request reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Validate token (get from email)
curl -X GET "http://localhost:3000/api/auth/reset-password/validate?token=<token>"

# 3. Reset password
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<token>",
    "newPassword": "NewPassword@123",
    "confirmPassword": "NewPassword@123"
  }'
```

### Unit Test

```typescript
// src/modules/auth/auth.service.spec.ts
describe('Password Reset', () => {
  describe('forgotPassword', () => {
    it('should create reset token and send email', async () => {
      const email = 'test@example.com';
      userService.findByEmail.mockResolvedValue(mockUser);
      
      const result = await service.forgotPassword(email);
      
      expect(result.message).toContain('email');
      expect(mailerService.sendMail).toHaveBeenCalled();
    });

    it('should return same message for non-existent email', async () => {
      userService.findByEmail.mockResolvedValue(null);
      
      const result = await service.forgotPassword('notexist@example.com');
      
      expect(result.message).toContain('email');
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('should enforce rate limit', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      tokenRepository.count.mockResolvedValue(3);
      
      await expect(service.forgotPassword('test@example.com'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const result = await service.resetPassword(
        validToken,
        'NewPass@123',
        'NewPass@123',
      );
      
      expect(result.message).toContain('thành công');
      expect(userService.updatePassword).toHaveBeenCalled();
    });

    it('should reject mismatched passwords', async () => {
      await expect(
        service.resetPassword(validToken, 'Pass1', 'Pass2'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid token', async () => {
      tokenRepository.find.mockResolvedValue([]);
      
      await expect(
        service.resetPassword('invalid', 'NewPass@123', 'NewPass@123'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
```

---

## 🔒 Security Considerations

1. **Token Security**:
   - Random 64-char token (256 bits entropy)
   - Hashed with bcrypt before storing
   - Never log raw tokens

2. **Rate Limiting**:
   - 3 requests/hour per email
   - Prevents email bombing

3. **Privacy**:
   - Same response for existing/non-existing emails
   - Masked email in validation response

4. **Session Invalidation**:
   - All sessions invalidated after password reset
   - Forces re-authentication

---

## 📚 References

- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [NestJS Mailer](https://docs.nestjs.com/techniques/email)
- [Nodemailer Documentation](https://nodemailer.com/)

---

## ⏭️ Next Task

→ `BE-006_EMAIL_VERIFY.md` - Implement Email Verification Flow
