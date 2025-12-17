# BE-008: Session Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-008 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-003, BE-004 |

---

## 🎯 Objective

Implement Session Management hoàn chỉnh:
- Track active sessions
- View sessions from all devices
- Revoke specific sessions
- Revoke all sessions (logout everywhere)

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/sessions | Lấy danh sách sessions |
| GET | /auth/sessions/current | Session hiện tại |
| DELETE | /auth/sessions/:id | Revoke session cụ thể |
| DELETE | /auth/sessions | Revoke tất cả (trừ current) |

### Features

1. **Session Tracking**:
   - Device type (mobile/desktop/tablet)
   - Browser/OS info
   - IP address
   - Last active time

2. **Session Display**:
   - Current session highlighted
   - Grouped by device type
   - Show last active

3. **Security**:
   - Can't revoke current session (use logout instead)
   - Limit concurrent sessions (optional)

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── dto/
│   └── session.dto.ts
├── entities/
│   └── session.entity.ts (existing)
└── auth.service.ts (update)
```

### Step 1: Session Response DTO

```typescript
// src/modules/auth/dto/session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SessionResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  deviceType: string;

  @ApiProperty()
  @Expose()
  deviceName: string;

  @ApiProperty()
  @Expose()
  browser: string;

  @ApiProperty()
  @Expose()
  os: string;

  @ApiProperty()
  @Expose()
  ipAddress: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  isCurrent: boolean;

  @ApiProperty()
  @Expose()
  lastActiveAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class SessionListResponseDto {
  @ApiProperty({ type: [SessionResponseDto] })
  @Type(() => SessionResponseDto)
  sessions: SessionResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  currentSessionId: string;
}
```

### Step 2: Update Session Entity

```typescript
// src/modules/auth/entities/session.entity.ts
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

@Entity('sessions')
@Index(['token'])
@Index(['userId', 'isActive'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 500 })
  token: string;

  @Column({ length: 500, nullable: true })
  refreshToken: string;

  @Column({ length: 50, nullable: true })
  deviceType: string; // mobile, desktop, tablet

  @Column({ length: 100, nullable: true })
  deviceName: string; // iPhone 14, Chrome on Windows

  @Column({ length: 100, nullable: true })
  browser: string; // Chrome 120, Safari 17

  @Column({ length: 100, nullable: true })
  os: string; // Windows 11, iOS 17, Android 14

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 100, nullable: true })
  location: string; // Hanoi, Vietnam

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 3: User Agent Parser Utility

```typescript
// src/shared/utils/user-agent-parser.ts
import * as UAParser from 'ua-parser-js';

export interface ParsedUserAgent {
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  }

  // Device name
  const deviceName = result.device.vendor && result.device.model
    ? `${result.device.vendor} ${result.device.model}`
    : `${result.browser.name} on ${result.os.name}`;

  // Browser
  const browser = result.browser.name && result.browser.version
    ? `${result.browser.name} ${result.browser.major}`
    : 'Unknown Browser';

  // OS
  const os = result.os.name && result.os.version
    ? `${result.os.name} ${result.os.version}`
    : 'Unknown OS';

  return {
    deviceType,
    deviceName,
    browser,
    os,
  };
}
```

### Step 4: Auth Service - Session Methods

```typescript
// src/modules/auth/auth.service.ts (add these methods)
import { parseUserAgent, ParsedUserAgent } from '../../shared/utils/user-agent-parser';

@Injectable()
export class AuthService {
  // ... existing methods

  /**
   * Get all active sessions for user
   */
  async getUserSessions(
    userId: string,
    currentToken: string,
  ): Promise<SessionListResponseDto> {
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
        isActive: true,
        expiresAt: MoreThan(new Date()),
      },
      order: { lastActiveAt: 'DESC' },
    });

    // Find current session
    let currentSessionId = '';
    for (const session of sessions) {
      if (session.token === currentToken) {
        currentSessionId = session.id;
        break;
      }
    }

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      deviceType: session.deviceType || 'unknown',
      deviceName: session.deviceName || 'Unknown Device',
      browser: session.browser || 'Unknown',
      os: session.os || 'Unknown',
      ipAddress: this.maskIpAddress(session.ipAddress),
      location: session.location || 'Unknown',
      isCurrent: session.id === currentSessionId,
      lastActiveAt: session.lastActiveAt || session.createdAt,
      createdAt: session.createdAt,
    }));

    return {
      sessions: formattedSessions,
      total: sessions.length,
      currentSessionId,
    };
  }

  /**
   * Get current session details
   */
  async getCurrentSession(
    userId: string,
    token: string,
  ): Promise<SessionResponseDto | null> {
    const session = await this.sessionRepository.findOne({
      where: {
        userId,
        token,
        isActive: true,
      },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      deviceType: session.deviceType || 'unknown',
      deviceName: session.deviceName || 'Unknown Device',
      browser: session.browser || 'Unknown',
      os: session.os || 'Unknown',
      ipAddress: this.maskIpAddress(session.ipAddress),
      location: session.location || 'Unknown',
      isCurrent: true,
      lastActiveAt: session.lastActiveAt || session.createdAt,
      createdAt: session.createdAt,
    };
  }

  /**
   * Revoke specific session
   */
  async revokeSession(
    userId: string,
    sessionId: string,
    currentToken: string,
  ): Promise<{ message: string }> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        userId,
        isActive: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Check if trying to revoke current session
    if (session.token === currentToken) {
      throw new BadRequestException(
        'Cannot revoke current session. Use logout instead.',
      );
    }

    // Revoke session
    await this.sessionRepository.update(sessionId, {
      isActive: false,
      revokedAt: new Date(),
    });

    return { message: 'Session revoked successfully' };
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(
    userId: string,
    currentToken: string,
  ): Promise<{ message: string; revokedCount: number }> {
    // Find all active sessions except current
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
        isActive: true,
      },
    });

    let revokedCount = 0;
    for (const session of sessions) {
      if (session.token !== currentToken) {
        await this.sessionRepository.update(session.id, {
          isActive: false,
          revokedAt: new Date(),
        });
        revokedCount++;
      }
    }

    return {
      message: `Revoked ${revokedCount} sessions`,
      revokedCount,
    };
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(token: string): Promise<void> {
    await this.sessionRepository.update(
      { token, isActive: true },
      { lastActiveAt: new Date() },
    );
  }

  /**
   * Create session with device info
   */
  async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Session> {
    // Parse user agent
    const deviceInfo = userAgent
      ? parseUserAgent(userAgent)
      : { deviceType: 'unknown', deviceName: 'Unknown', browser: 'Unknown', os: 'Unknown' };

    // Limit concurrent sessions (keep last 5)
    const activeSessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (activeSessions.length >= 5) {
      const toRevoke = activeSessions.slice(4);
      for (const session of toRevoke) {
        await this.sessionRepository.update(session.id, {
          isActive: false,
          revokedAt: new Date(),
        });
      }
    }

    // Get location from IP (optional - requires geoip service)
    const location = await this.getLocationFromIp(ipAddress);

    // Create session
    const session = this.sessionRepository.create({
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      deviceType: deviceInfo.deviceType,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      location,
      lastActiveAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Get location from IP address
   */
  private async getLocationFromIp(ip?: string): Promise<string> {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return 'Local';
    }

    // TODO: Integrate with IP geolocation service (MaxMind, ip-api, etc.)
    // For now, return placeholder
    return 'Vietnam';
  }

  /**
   * Mask IP address for privacy
   */
  private maskIpAddress(ip?: string): string {
    if (!ip) return 'Unknown';
    
    if (ip.includes(':')) {
      // IPv6
      const parts = ip.split(':');
      return `${parts[0]}:${parts[1]}:****:****`;
    }
    
    // IPv4
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.***.***`;
  }

  /**
   * Cleanup expired sessions (cron job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.sessionRepository.update(
      {
        isActive: true,
        expiresAt: LessThan(new Date()),
      },
      { isActive: false },
    );

    return result.affected || 0;
  }
}
```

### Step 5: Auth Controller - Session Endpoints

```typescript
// src/modules/auth/auth.controller.ts (add these endpoints)
import { SessionResponseDto, SessionListResponseDto } from './dto/session.dto';

@Controller('auth')
export class AuthController {
  // ... existing endpoints

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active sessions' })
  @ApiResponse({ status: 200, type: SessionListResponseDto })
  async getSessions(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ): Promise<SessionListResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.getUserSessions(userId, token);
  }

  @Get('sessions/current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current session' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  async getCurrentSession(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ): Promise<SessionResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.getCurrentSession(userId, token);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke specific session' })
  @ApiResponse({ status: 200, description: 'Session revoked' })
  async revokeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.revokeSession(userId, sessionId, token);
  }

  @Delete('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all sessions except current' })
  @ApiResponse({ status: 200, description: 'Sessions revoked' })
  async revokeAllSessions(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ): Promise<{ message: string; revokedCount: number }> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.revokeAllSessions(userId, token);
  }
}
```

### Step 6: Session Activity Interceptor

```typescript
// src/common/interceptors/session-activity.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class SessionActivityInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    return next.handle().pipe(
      tap(() => {
        // Update session activity asynchronously
        if (token) {
          this.authService.updateSessionActivity(token).catch(() => {
            // Ignore errors
          });
        }
      }),
    );
  }
}
```

### Step 7: Cleanup Cron Job

```typescript
// src/modules/auth/tasks/session-cleanup.task.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionCleanupTask {
  private readonly logger = new Logger(SessionCleanupTask.name);

  constructor(private readonly authService: AuthService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    this.logger.log('Cleaning up expired sessions...');
    const count = await this.authService.cleanupExpiredSessions();
    this.logger.log(`Cleaned up ${count} expired sessions`);
  }
}
```

---

## 📦 Dependencies

```bash
npm install ua-parser-js
npm install -D @types/ua-parser-js
npm install @nestjs/schedule
```

---

## ✅ Acceptance Criteria

- [ ] GET /auth/sessions returns all active sessions
- [ ] Current session marked with isCurrent=true
- [ ] DELETE /auth/sessions/:id revokes specific session
- [ ] Cannot revoke current session
- [ ] DELETE /auth/sessions revokes all except current
- [ ] Device/browser info parsed correctly
- [ ] IP address masked for privacy
- [ ] Limit 5 concurrent sessions
- [ ] Expired sessions cleaned up

---

## 🧪 Testing

```bash
# 1. Get sessions
curl -X GET http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer <access_token>"

# 2. Get current session
curl -X GET http://localhost:3000/api/auth/sessions/current \
  -H "Authorization: Bearer <access_token>"

# 3. Revoke specific session
curl -X DELETE http://localhost:3000/api/auth/sessions/<session_id> \
  -H "Authorization: Bearer <access_token>"

# 4. Revoke all sessions
curl -X DELETE http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer <access_token>"
```

---

## 📚 References

- [NestJS Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [UA Parser JS](https://github.com/faisalman/ua-parser-js)

---

## ⏭️ Next Task

→ `BE-009_LOGIN_HISTORY.md` - Implement Login History Tracking
