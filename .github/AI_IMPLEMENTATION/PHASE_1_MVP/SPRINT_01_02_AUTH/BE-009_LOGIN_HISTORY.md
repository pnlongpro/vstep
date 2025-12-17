# BE-009: Login History Tracking

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-009 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-003, BE-008 |

---

## 🎯 Objective

Implement Login History Tracking:
- Log tất cả login attempts (success/failed)
- Hiển thị lịch sử đăng nhập cho user
- Phát hiện suspicious activities
- Security alerts

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/login-history | Lấy lịch sử đăng nhập |
| GET | /auth/security-alerts | Lấy cảnh báo bảo mật |
| POST | /auth/dismiss-alert/:id | Dismiss alert |

### Features

1. **Login Tracking**:
   - Success/Failed attempts
   - IP address, device, location
   - Timestamp

2. **Security Alerts**:
   - New device login
   - Unusual location
   - Multiple failed attempts
   - Password changed

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── dto/
│   ├── login-history.dto.ts
│   └── security-alert.dto.ts
├── entities/
│   ├── login-history.entity.ts
│   └── security-alert.entity.ts
└── auth.service.ts (update)
```

### Step 1: Login History Entity

```typescript
// src/modules/auth/entities/login-history.entity.ts
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

export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  BLOCKED = 'blocked',
}

export enum LoginMethod {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
  REFRESH_TOKEN = 'refresh_token',
}

@Entity('login_history')
@Index(['userId', 'createdAt'])
@Index(['ipAddress'])
export class LoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, nullable: true })
  userId: string;

  @Column({ length: 255, nullable: true })
  email: string; // Store email even for failed attempts

  @Column({ type: 'enum', enum: LoginStatus })
  status: LoginStatus;

  @Column({ type: 'enum', enum: LoginMethod, default: LoginMethod.EMAIL_PASSWORD })
  method: LoginMethod;

  @Column({ length: 255, nullable: true })
  failureReason: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  deviceType: string;

  @Column({ length: 100, nullable: true })
  deviceName: string;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 2: Security Alert Entity

```typescript
// src/modules/auth/entities/security-alert.entity.ts
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

export enum AlertType {
  NEW_DEVICE = 'new_device',
  NEW_LOCATION = 'new_location',
  FAILED_ATTEMPTS = 'failed_attempts',
  PASSWORD_CHANGED = 'password_changed',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('security_alerts')
@Index(['userId', 'isDismissed', 'createdAt'])
export class SecurityAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.MEDIUM })
  severity: AlertSeverity;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isDismissed: boolean;

  @Column({ type: 'datetime', nullable: true })
  dismissedAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'datetime', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 3: DTOs

```typescript
// src/modules/auth/dto/login-history.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class LoginHistoryQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class LoginHistoryItemDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  method: string;

  @Expose()
  ipAddress: string;

  @Expose()
  location: string;

  @Expose()
  deviceType: string;

  @Expose()
  deviceName: string;

  @Expose()
  browser: string;

  @Expose()
  os: string;

  @Expose()
  createdAt: Date;
}

export class LoginHistoryResponseDto {
  @Type(() => LoginHistoryItemDto)
  items: LoginHistoryItemDto[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

```typescript
// src/modules/auth/dto/security-alert.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SecurityAlertItemDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  severity: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  metadata: Record<string, any>;

  @Expose()
  isDismissed: boolean;

  @Expose()
  isRead: boolean;

  @Expose()
  createdAt: Date;
}

export class SecurityAlertsResponseDto {
  @Type(() => SecurityAlertItemDto)
  alerts: SecurityAlertItemDto[];

  unreadCount: number;
  total: number;
}
```

### Step 4: Auth Service - Login History Methods

```typescript
// src/modules/auth/auth.service.ts (add these methods)
import { LoginHistory, LoginStatus, LoginMethod } from './entities/login-history.entity';
import { SecurityAlert, AlertType, AlertSeverity } from './entities/security-alert.entity';
import { parseUserAgent } from '../../shared/utils/user-agent-parser';

@Injectable()
export class AuthService {
  constructor(
    // ... existing injections
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
    @InjectRepository(SecurityAlert)
    private readonly securityAlertRepository: Repository<SecurityAlert>,
  ) {}

  /**
   * Log login attempt
   */
  async logLoginAttempt(data: {
    userId?: string;
    email: string;
    status: LoginStatus;
    method?: LoginMethod;
    failureReason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<LoginHistory> {
    const deviceInfo = data.userAgent
      ? parseUserAgent(data.userAgent)
      : null;

    const location = await this.getLocationFromIp(data.ipAddress);

    const loginHistory = this.loginHistoryRepository.create({
      userId: data.userId,
      email: data.email,
      status: data.status,
      method: data.method || LoginMethod.EMAIL_PASSWORD,
      failureReason: data.failureReason,
      ipAddress: data.ipAddress,
      location: location.full,
      country: location.country,
      city: location.city,
      deviceType: deviceInfo?.deviceType,
      deviceName: deviceInfo?.deviceName,
      browser: deviceInfo?.browser,
      os: deviceInfo?.os,
      userAgent: data.userAgent,
    });

    const saved = await this.loginHistoryRepository.save(loginHistory);

    // Check for security alerts
    if (data.status === LoginStatus.SUCCESS && data.userId) {
      await this.checkSecurityAlerts(data.userId, saved);
    }

    // Check for failed attempts
    if (data.status === LoginStatus.FAILED && data.userId) {
      await this.checkFailedAttempts(data.userId, data.email, data.ipAddress);
    }

    return saved;
  }

  /**
   * Get login history for user
   */
  async getLoginHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<LoginHistoryResponseDto> {
    const [items, total] = await this.loginHistoryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        status: item.status,
        method: item.method,
        ipAddress: this.maskIpAddress(item.ipAddress),
        location: item.location || 'Unknown',
        deviceType: item.deviceType || 'unknown',
        deviceName: item.deviceName || 'Unknown',
        browser: item.browser || 'Unknown',
        os: item.os || 'Unknown',
        createdAt: item.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Check for security alerts after login
   */
  private async checkSecurityAlerts(
    userId: string,
    loginHistory: LoginHistory,
  ): Promise<void> {
    // Check for new device
    const isNewDevice = await this.isNewDevice(userId, loginHistory);
    if (isNewDevice) {
      await this.createSecurityAlert({
        userId,
        type: AlertType.NEW_DEVICE,
        severity: AlertSeverity.MEDIUM,
        title: 'Đăng nhập từ thiết bị mới',
        description: `Tài khoản của bạn vừa được đăng nhập từ ${loginHistory.deviceName || 'thiết bị mới'} (${loginHistory.browser} trên ${loginHistory.os})`,
        metadata: {
          deviceName: loginHistory.deviceName,
          browser: loginHistory.browser,
          os: loginHistory.os,
          ipAddress: loginHistory.ipAddress,
          location: loginHistory.location,
        },
      });
    }

    // Check for new location
    const isNewLocation = await this.isNewLocation(userId, loginHistory);
    if (isNewLocation && !isNewDevice) {
      await this.createSecurityAlert({
        userId,
        type: AlertType.NEW_LOCATION,
        severity: AlertSeverity.MEDIUM,
        title: 'Đăng nhập từ vị trí mới',
        description: `Tài khoản của bạn vừa được đăng nhập từ ${loginHistory.location || 'vị trí mới'}`,
        metadata: {
          location: loginHistory.location,
          country: loginHistory.country,
          city: loginHistory.city,
          ipAddress: loginHistory.ipAddress,
        },
      });
    }
  }

  /**
   * Check for too many failed attempts
   */
  private async checkFailedAttempts(
    userId: string,
    email: string,
    ipAddress?: string,
  ): Promise<void> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const failedCount = await this.loginHistoryRepository.count({
      where: {
        email,
        status: LoginStatus.FAILED,
        createdAt: MoreThan(thirtyMinutesAgo),
      },
    });

    if (failedCount >= 5) {
      // Create alert for user if userId exists
      if (userId) {
        await this.createSecurityAlert({
          userId,
          type: AlertType.FAILED_ATTEMPTS,
          severity: AlertSeverity.HIGH,
          title: 'Nhiều lần đăng nhập thất bại',
          description: `Có ${failedCount} lần đăng nhập thất bại vào tài khoản của bạn trong 30 phút qua`,
          metadata: {
            failedCount,
            ipAddress,
          },
        });
      }

      // TODO: Implement account lockout if needed
    }
  }

  /**
   * Check if this is a new device
   */
  private async isNewDevice(
    userId: string,
    current: LoginHistory,
  ): Promise<boolean> {
    const deviceIdentifier = `${current.browser}-${current.os}-${current.deviceType}`;

    const previousLogin = await this.loginHistoryRepository.findOne({
      where: {
        userId,
        status: LoginStatus.SUCCESS,
        browser: current.browser,
        os: current.os,
        deviceType: current.deviceType,
        createdAt: LessThan(current.createdAt),
      },
    });

    return !previousLogin;
  }

  /**
   * Check if this is a new location
   */
  private async isNewLocation(
    userId: string,
    current: LoginHistory,
  ): Promise<boolean> {
    if (!current.country) return false;

    const previousLogin = await this.loginHistoryRepository.findOne({
      where: {
        userId,
        status: LoginStatus.SUCCESS,
        country: current.country,
        createdAt: LessThan(current.createdAt),
      },
    });

    return !previousLogin;
  }

  /**
   * Create security alert
   */
  async createSecurityAlert(data: {
    userId: string;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<SecurityAlert> {
    const alert = this.securityAlertRepository.create(data);
    return this.securityAlertRepository.save(alert);
  }

  /**
   * Get security alerts for user
   */
  async getSecurityAlerts(userId: string): Promise<SecurityAlertsResponseDto> {
    const alerts = await this.securityAlertRepository.find({
      where: { userId, isDismissed: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const unreadCount = alerts.filter((a) => !a.isRead).length;

    // Mark as read
    const unreadIds = alerts.filter((a) => !a.isRead).map((a) => a.id);
    if (unreadIds.length > 0) {
      await this.securityAlertRepository.update(unreadIds, {
        isRead: true,
        readAt: new Date(),
      });
    }

    return {
      alerts: alerts.map((alert) => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        metadata: alert.metadata,
        isDismissed: alert.isDismissed,
        isRead: true, // Now read
        createdAt: alert.createdAt,
      })),
      unreadCount,
      total: alerts.length,
    };
  }

  /**
   * Dismiss security alert
   */
  async dismissSecurityAlert(
    userId: string,
    alertId: string,
  ): Promise<{ message: string }> {
    const alert = await this.securityAlertRepository.findOne({
      where: { id: alertId, userId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await this.securityAlertRepository.update(alertId, {
      isDismissed: true,
      dismissedAt: new Date(),
    });

    return { message: 'Alert dismissed' };
  }

  /**
   * Get location from IP
   */
  private async getLocationFromIp(ip?: string): Promise<{
    full: string;
    country: string;
    city: string;
  }> {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return { full: 'Local', country: 'Local', city: 'Local' };
    }

    // TODO: Integrate with IP geolocation service
    // For now, return placeholder
    return {
      full: 'Hanoi, Vietnam',
      country: 'Vietnam',
      city: 'Hanoi',
    };
  }
}
```

### Step 5: Auth Controller - Login History Endpoints

```typescript
// src/modules/auth/auth.controller.ts (add these endpoints)
import { LoginHistoryQueryDto, LoginHistoryResponseDto } from './dto/login-history.dto';
import { SecurityAlertsResponseDto } from './dto/security-alert.dto';

@Controller('auth')
export class AuthController {
  // ... existing endpoints

  @Get('login-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get login history' })
  @ApiResponse({ status: 200, type: LoginHistoryResponseDto })
  async getLoginHistory(
    @CurrentUser('id') userId: string,
    @Query() query: LoginHistoryQueryDto,
  ): Promise<LoginHistoryResponseDto> {
    return this.authService.getLoginHistory(userId, query.page, query.limit);
  }

  @Get('security-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get security alerts' })
  @ApiResponse({ status: 200, type: SecurityAlertsResponseDto })
  async getSecurityAlerts(
    @CurrentUser('id') userId: string,
  ): Promise<SecurityAlertsResponseDto> {
    return this.authService.getSecurityAlerts(userId);
  }

  @Post('security-alerts/:id/dismiss')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dismiss security alert' })
  async dismissAlert(
    @CurrentUser('id') userId: string,
    @Param('id') alertId: string,
  ): Promise<{ message: string }> {
    return this.authService.dismissSecurityAlert(userId, alertId);
  }
}
```

### Step 6: Update Auth Module

```typescript
// src/modules/auth/auth.module.ts
import { LoginHistory } from './entities/login-history.entity';
import { SecurityAlert } from './entities/security-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      User,
      PasswordResetToken,
      EmailVerificationToken,
      OAuthAccount,
      LoginHistory,
      SecurityAlert,
    ]),
    // ... rest
  ],
})
export class AuthModule {}
```

### Step 7: Update Login Method

```typescript
// Update login method in auth.service.ts
async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
  const user = await this.usersService.findByEmail(dto.email);
  
  if (!user) {
    // Log failed attempt
    await this.logLoginAttempt({
      email: dto.email,
      status: LoginStatus.FAILED,
      failureReason: 'User not found',
      ipAddress,
      userAgent,
    });
    throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
  }

  const isPasswordValid = await this.usersService.validatePassword(user, dto.password);
  
  if (!isPasswordValid) {
    await this.logLoginAttempt({
      userId: user.id,
      email: dto.email,
      status: LoginStatus.FAILED,
      failureReason: 'Invalid password',
      ipAddress,
      userAgent,
    });
    throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
  }

  // Check status...

  // Log successful login
  await this.logLoginAttempt({
    userId: user.id,
    email: dto.email,
    status: LoginStatus.SUCCESS,
    ipAddress,
    userAgent,
  });

  // ... rest of login logic
}
```

---

## ✅ Acceptance Criteria

- [ ] Login attempts logged (success/failed)
- [ ] GET /auth/login-history returns paginated history
- [ ] Security alerts created for new device/location
- [ ] GET /auth/security-alerts returns alerts
- [ ] POST /auth/security-alerts/:id/dismiss works
- [ ] Failed attempts > 5 triggers alert
- [ ] IP addresses masked in responses

---

## 🧪 Testing

```bash
# 1. Get login history
curl -X GET "http://localhost:3000/api/auth/login-history?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"

# 2. Get security alerts
curl -X GET http://localhost:3000/api/auth/security-alerts \
  -H "Authorization: Bearer <access_token>"

# 3. Dismiss alert
curl -X POST http://localhost:3000/api/auth/security-alerts/<alert_id>/dismiss \
  -H "Authorization: Bearer <access_token>"
```

---

## 📚 References

- [IP Geolocation APIs](https://ip-api.com/)
- [Account Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## ✅ Sprint 1-2 Backend Complete!

All backend auth tasks completed:
- BE-001: Database Core ✅
- BE-002: User Entity ✅
- BE-003: Auth Service ✅
- BE-004: JWT Strategy ✅
- BE-005: Password Reset ✅
- BE-006: Email Verification ✅
- BE-007: OAuth2 (Google) ✅
- BE-008: Session Management ✅
- BE-009: Login History ✅

---

## ⏭️ Next: Frontend Tasks

→ `FE-001_AUTH_API.md` - Auth API Service Integration
