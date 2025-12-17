# BE-003: Auth Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-003 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 16h |
| **Dependencies** | BE-001, BE-002 |

---

## 🎯 Objective

Implement Authentication Service với đầy đủ chức năng: Register, Login, Logout.

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Đăng ký user mới |
| POST | /auth/login | Đăng nhập |
| POST | /auth/logout | Đăng xuất |
| GET | /auth/me | Lấy thông tin user hiện tại |

### Business Rules

1. **Register**:
   - Email phải unique
   - Password >= 8 ký tự
   - Tự động tạo profile, stats, settings
   - Gửi email verification (optional)

2. **Login**:
   - Validate email + password
   - Check account status (not suspended)
   - Generate JWT tokens (access + refresh)
   - Log login history

3. **Logout**:
   - Invalidate current session
   - Clear refresh token

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── auth-response.dto.ts
├── entities/
│   └── session.entity.ts
├── guards/
│   └── local-auth.guard.ts
└── strategies/
    └── local.strategy.ts
```

### Step 1: DTOs

```typescript
// src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số hoặc ký tự đặc biệt',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;
}
```

```typescript
// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Mật khẩu không được để trống' })
  password: string;
}
```

```typescript
// src/modules/auth/dto/auth-response.dto.ts
import { Expose, Type } from 'class-transformer';

export class AuthUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string;

  @Expose()
  role: {
    id: string;
    name: string;
  };
}

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  @Type(() => AuthUserDto)
  user: AuthUserDto;
}

export class MessageResponseDto {
  @Expose()
  message: string;

  @Expose()
  success: boolean;
}
```

### Step 2: Session Entity

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
@Index(['userId'])
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
  deviceType: string;

  @Column({ length: 100, nullable: true })
  deviceName: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 3: Auth Service

```typescript
// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Đăng ký user mới
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Check if email exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Create user
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.accessToken, tokens.refreshToken);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  /**
   * Đăng nhập
   */
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    // Find user
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check password
    const isPasswordValid = await this.usersService.validatePassword(user, dto.password);
    if (!isPasswordValid) {
      // Log failed attempt
      await this.logLoginAttempt(user.id, false, ipAddress, userAgent, 'Invalid password');
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.accessToken, tokens.refreshToken, ipAddress, userAgent);

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Log successful login
    await this.logLoginAttempt(user.id, true, ipAddress, userAgent);

    // Get full user with relations
    const fullUser = await this.usersService.findById(user.id);

    return {
      ...tokens,
      user: this.formatUser(fullUser),
    };
  }

  /**
   * Đăng xuất
   */
  async logout(userId: string, token: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, token },
      { isActive: false },
    );
  }

  /**
   * Refresh token
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Find session
      const session = await this.sessionRepository.findOne({
        where: { refreshToken, isActive: true },
      });

      if (!session) {
        throw new UnauthorizedException('Session không hợp lệ');
      }

      // Get user
      const user = await this.usersService.findById(payload.sub);

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Update session
      await this.sessionRepository.update(session.id, {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  /**
   * Validate user from JWT payload
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }
    return user;
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || 'student',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Calculate expiry in seconds
    const expiresIn = 15 * 60; // 15 minutes

    return { accessToken, refreshToken, expiresIn };
  }

  /**
   * Create session record
   */
  private async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Session> {
    // Invalidate old sessions (optional - keep last 3)
    const sessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (sessions.length >= 3) {
      const toDeactivate = sessions.slice(2);
      for (const session of toDeactivate) {
        await this.sessionRepository.update(session.id, { isActive: false });
      }
    }

    // Create new session
    const session = this.sessionRepository.create({
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      deviceType: this.parseDeviceType(userAgent),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Log login attempt
   */
  private async logLoginAttempt(
    userId: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    failureReason?: string,
  ): Promise<void> {
    // TODO: Implement login history logging
    // This will be done in BE-009
  }

  /**
   * Parse device type from user agent
   */
  private parseDeviceType(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    if (userAgent.includes('Mobile')) return 'mobile';
    if (userAgent.includes('Tablet')) return 'tablet';
    return 'desktop';
  }

  /**
   * Format user for response
   */
  private formatUser(user: User): any {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      avatar: user.avatar,
      status: user.status,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        displayName: user.role.displayName,
      } : null,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }
}
```

### Step 4: Auth Controller

```typescript
// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, MessageResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(user.id, token);
    return { message: 'Đăng xuất thành công', success: true };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại' })
  @ApiResponse({ status: 200, description: 'User info' })
  async getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      avatar: user.avatar,
      status: user.status,
      role: user.role,
    };
  }
}
```

### Step 5: Auth Module

```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities/session.entity';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Step 6: Custom Decorators

```typescript
// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

---

## ✅ Acceptance Criteria

- [ ] POST /auth/register creates user and returns tokens
- [ ] POST /auth/login validates credentials and returns tokens
- [ ] POST /auth/logout invalidates session
- [ ] GET /auth/me returns current user info
- [ ] JWT tokens generated correctly
- [ ] Password hashed with bcrypt
- [ ] Proper error messages for invalid inputs
- [ ] Session tracking working

---

## 🧪 Testing

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get me
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

---

## 📚 References

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT](https://www.passportjs.org/packages/passport-jwt/)
- [Module Auth Doc](../../../docs/01-MODULE-AUTHENTICATION.md)

---

## ⏭️ Next Task

→ `BE-004_JWT_STRATEGY.md` - Implement JWT Strategy
