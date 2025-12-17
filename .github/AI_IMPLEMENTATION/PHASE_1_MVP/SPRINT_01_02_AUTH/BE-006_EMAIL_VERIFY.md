# BE-006: Email Verification

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-006 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-002, BE-003, BE-005 |

---

## 🎯 Objective

Implement Email Verification Flow:
- Gửi email xác thực khi đăng ký
- Verify email qua link
- Resend verification email

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/verify-email | Xác thực email với token |
| POST | /auth/resend-verification | Gửi lại email xác thực |

### Business Rules

1. **Registration**:
   - User status = PENDING sau khi đăng ký
   - Tự động gửi email verification

2. **Verification Token**:
   - 64 characters random
   - Expires sau 24 giờ
   - Single use

3. **After Verification**:
   - User status = ACTIVE
   - emailVerifiedAt = current time

4. **Resend**:
   - Rate limit: 1 request/5 minutes
   - Invalidate old tokens

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── dto/
│   ├── verify-email.dto.ts
│   └── resend-verification.dto.ts
├── entities/
│   └── email-verification-token.entity.ts
├── templates/
│   └── email-verification.html
└── auth.service.ts (update)
```

### Step 1: Email Verification Token Entity

```typescript
// src/modules/auth/entities/email-verification-token.entity.ts
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

@Entity('email_verification_tokens')
@Index(['token'])
@Index(['userId'])
export class EmailVerificationToken {
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
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Helpers
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
// src/modules/auth/dto/verify-email.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'abc123def456...',
    description: 'Token từ email xác thực',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}
```

```typescript
// src/modules/auth/dto/resend-verification.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email cần gửi lại xác thực',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}
```

### Step 3: Email Template

```html
<!-- src/modules/auth/templates/email-verification.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Xác thực email - VSTEPRO</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9fafb; }
    .button { 
      display: inline-block; 
      background: #16a34a; 
      color: white; 
      padding: 14px 35px; 
      text-decoration: none; 
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .note { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 VSTEPRO</h1>
      <p>Nền tảng luyện thi VSTEP</p>
    </div>
    <div class="content">
      <h2>Xác thực địa chỉ email</h2>
      <p>Xin chào <strong>{{userName}}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản VSTEPRO!</p>
      <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
      
      <center>
        <a href="{{verifyLink}}" class="button">✓ Xác thực email</a>
      </center>
      
      <p class="note">Link này sẽ hết hạn sau 24 giờ.</p>
      
      <p>Nếu bạn không đăng ký tài khoản VSTEPRO, vui lòng bỏ qua email này.</p>
      
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

### Step 4: Auth Service - Email Verification Methods

```typescript
// src/modules/auth/auth.service.ts (add these methods)
import { EmailVerificationToken } from './entities/email-verification-token.entity';

@Injectable()
export class AuthService {
  constructor(
    // ... existing injections
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
  ) {}

  /**
   * Send verification email after registration
   */
  async sendVerificationEmail(user: User): Promise<void> {
    // Invalidate old tokens
    await this.emailVerificationTokenRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true },
    );

    // Generate token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);

    // Create token record
    const verificationToken = this.emailVerificationTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await this.emailVerificationTokenRepository.save(verificationToken);

    // Build verify link
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const verifyLink = `${frontendUrl}/auth/verify-email?token=${rawToken}`;

    // Send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Xác thực email - VSTEPRO',
      template: 'email-verification',
      context: {
        userName: user.firstName,
        verifyLink,
      },
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string; user: any }> {
    // Find valid tokens
    const tokens = await this.emailVerificationTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    let validTokenRecord: EmailVerificationToken | null = null;

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

    // Check if already verified
    if (validTokenRecord.user.emailVerifiedAt) {
      return {
        message: 'Email đã được xác thực trước đó',
        user: this.formatUser(validTokenRecord.user),
      };
    }

    // Update user
    await this.usersService.verifyEmail(validTokenRecord.userId);

    // Mark token as used
    await this.emailVerificationTokenRepository.update(validTokenRecord.id, {
      isUsed: true,
      verifiedAt: new Date(),
    });

    // Get updated user
    const user = await this.usersService.findById(validTokenRecord.userId);

    return {
      message: 'Email đã được xác thực thành công',
      user: this.formatUser(user),
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    // Security: don't reveal if email exists
    if (!user) {
      return { message: 'Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email.' };
    }

    // Check if already verified
    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email đã được xác thực');
    }

    // Check rate limit (1 request per 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentToken = await this.emailVerificationTokenRepository.findOne({
      where: {
        userId: user.id,
        createdAt: MoreThan(fiveMinutesAgo),
      },
    });

    if (recentToken) {
      throw new BadRequestException(
        'Vui lòng đợi 5 phút trước khi gửi lại email xác thực',
      );
    }

    // Send new verification email
    await this.sendVerificationEmail(user);

    return { message: 'Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email.' };
  }

  /**
   * Update register method to send verification email
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // ... existing registration logic

    // Send verification email
    await this.sendVerificationEmail(user);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }
}
```

### Step 5: Auth Controller - Email Verification Endpoints

```typescript
// src/modules/auth/auth.controller.ts (add these endpoints)
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Controller('auth')
export class AuthController {
  // ... existing endpoints

  @Post('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực email với token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<{ message: string; user: any }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi lại email xác thực' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Rate limit or already verified' })
  async resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @Get('verification-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kiểm tra trạng thái xác thực email' })
  async getVerificationStatus(@CurrentUser() user: User) {
    return {
      isVerified: !!user.emailVerifiedAt,
      verifiedAt: user.emailVerifiedAt,
    };
  }
}
```

### Step 6: Update Auth Module

```typescript
// src/modules/auth/auth.module.ts
import { EmailVerificationToken } from './entities/email-verification-token.entity';

@Module({
  imports: [
    // ... existing imports
    TypeOrmModule.forFeature([
      Session,
      User,
      PasswordResetToken,
      EmailVerificationToken,
    ]),
  ],
  // ... rest
})
export class AuthModule {}
```

### Step 7: Verification Guard (Optional)

```typescript
// src/guards/email-verified.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRE_VERIFIED_EMAIL = 'requireVerifiedEmail';
export const RequireVerifiedEmail = () => SetMetadata(REQUIRE_VERIFIED_EMAIL, true);

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireVerified = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_VERIFIED_EMAIL,
      [context.getHandler(), context.getClass()],
    );

    if (!requireVerified) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.emailVerifiedAt) {
      throw new ForbiddenException('Vui lòng xác thực email để tiếp tục');
    }

    return true;
  }
}
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  EMAIL VERIFICATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REGISTRATION                                                │
│     User → POST /auth/register                                  │
│          ↓                                                      │
│     [Create user (status=PENDING)] → [Send verification email]  │
│          ↓                                                      │
│     Response: { user, tokens }                                  │
│                                                                 │
│  2. USER CLICKS EMAIL LINK                                      │
│     Email link → Frontend /auth/verify-email?token=xxx          │
│          ↓                                                      │
│     Frontend → POST /auth/verify-email { token }                │
│          ↓                                                      │
│     [Validate token] → [Update user status=ACTIVE]              │
│          ↓                                                      │
│     Response: "Email verified"                                  │
│                                                                 │
│  3. RESEND (if needed)                                          │
│     User → POST /auth/resend-verification { email }             │
│          ↓                                                      │
│     [Check rate limit] → [Invalidate old] → [Send new email]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

- [ ] Verification email sent on registration
- [ ] POST /auth/verify-email verifies email
- [ ] User status changes from PENDING to ACTIVE
- [ ] emailVerifiedAt timestamp set
- [ ] Token expires after 24 hours
- [ ] Token is single-use
- [ ] POST /auth/resend-verification works
- [ ] Rate limit: 1 resend per 5 minutes
- [ ] EmailVerifiedGuard optional protection

---

## 🧪 Testing

```bash
# 1. Register (email sent automatically)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Verify email (get token from email)
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "<token>"}'

# 3. Resend verification
curl -X POST http://localhost:3000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 4. Check verification status
curl -X GET http://localhost:3000/api/auth/verification-status \
  -H "Authorization: Bearer <access_token>"
```

---

## 📚 References

- [Email Verification Best Practices](https://www.mailgun.com/blog/email/email-verification-best-practices/)
- [NestJS Guards](https://docs.nestjs.com/guards)

---

## ⏭️ Next Task

→ `BE-007_OAUTH2.md` - Implement OAuth2 Integration (Google)
