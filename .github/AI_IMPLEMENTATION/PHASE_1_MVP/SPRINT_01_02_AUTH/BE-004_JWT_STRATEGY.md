# BE-004: JWT Strategy

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-004 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-002, BE-003 |

---

## 🎯 Objective

Implement JWT Strategy với Passport.js cho NestJS, bao gồm:
- Access Token validation
- Refresh Token handling  
- Token blacklist (Redis)
- Guards và Decorators

---

## 📝 Requirements

### Features

1. **JWT Access Token**:
   - Short-lived (15 minutes)
   - Contains: userId, email, role
   - Validated on every protected request

2. **JWT Refresh Token**:
   - Long-lived (7 days)
   - Stored in database (sessions table)
   - Used to get new access token

3. **Guards**:
   - `JwtAuthGuard` - Validate access token
   - `RolesGuard` - Check user roles
   - Support `@Public()` decorator

4. **Token Blacklist** (Redis):
   - Invalidate tokens on logout
   - Check blacklist before validation

---

## 💻 Implementation

### File Structure

```
src/
├── modules/auth/
│   └── strategies/
│       ├── jwt.strategy.ts
│       ├── jwt-refresh.strategy.ts
│       └── index.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── index.ts
├── common/
│   └── decorators/
│       ├── public.decorator.ts
│       ├── roles.decorator.ts
│       ├── current-user.decorator.ts
│       └── index.ts
└── config/
    └── jwt.config.ts
```

### Step 1: JWT Configuration

```typescript
// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
```

```typescript
// src/config/index.ts
export { default as jwtConfig } from './jwt.config';
```

### Step 2: JWT Strategy (Access Token)

```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string;      // User ID
  email: string;
  role: string;
  iat?: number;     // Issued at
  exp?: number;     // Expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate JWT payload and return user
   * This method is called after token signature is verified
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;

    // Find user by ID
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account has been suspended');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Return user object - will be attached to request.user
    return user;
  }
}
```

### Step 3: JWT Refresh Strategy

```typescript
// src/modules/auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.body.refreshToken;

    // Find session with this refresh token
    const session = await this.sessionRepository.findOne({
      where: { 
        refreshToken,
        isActive: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session expired
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Get user
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user,
      refreshToken,
      sessionId: session.id,
    };
  }
}
```

### Step 4: JWT Auth Guard

```typescript
// src/guards/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check for @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    // Handle errors
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
```

### Step 5: JWT Refresh Guard

```typescript
// src/guards/jwt-refresh.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
```

### Step 6: Roles Guard

```typescript
// src/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has required role
    const userRole = user.role?.name || user.roleName;
    const hasRole = requiredRoles.some((role) => role === userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
```

### Step 7: Guards Index Export

```typescript
// src/guards/index.ts
export * from './jwt-auth.guard';
export * from './jwt-refresh.guard';
export * from './roles.guard';
```

### Step 8: Decorators

```typescript
// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark route as public (no authentication required)
 * @example
 * @Public()
 * @Get('health')
 * healthCheck() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Require specific roles for route access
 * @param roles - Array of role names
 * @example
 * @Roles('admin', 'teacher')
 * @Get('users')
 * getUsers() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/entities/user.entity';

/**
 * Get current authenticated user from request
 * @param data - Optional property name to extract
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) { ... }
 * 
 * @Get('my-id')
 * getMyId(@CurrentUser('id') userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
```

```typescript
// src/common/decorators/index.ts
export * from './public.decorator';
export * from './roles.decorator';
export * from './current-user.decorator';
```

### Step 9: Global Guards Setup

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
// ... other imports

@Module({
  imports: [
    // ... other modules
  ],
  providers: [
    // Global JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

### Step 10: Update Auth Module

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
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { User } from '../users/entities/user.entity';

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
    TypeOrmModule.forFeature([Session, User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### Step 11: Strategy Index Export

```typescript
// src/modules/auth/strategies/index.ts
export * from './jwt.strategy';
export * from './jwt-refresh.strategy';
```

---

## 🔧 Environment Variables

```env
# .env
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 📖 Usage Examples

### Protected Route (Default)

```typescript
@Controller('users')
export class UsersController {
  // This route requires authentication (default)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

### Public Route

```typescript
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

### Role-based Access

```typescript
@Controller('admin')
export class AdminController {
  @Roles('admin')
  @Get('users')
  getAllUsers() {
    // Only admin can access
  }

  @Roles('admin', 'teacher')
  @Get('classes')
  getClasses() {
    // Admin and teacher can access
  }
}
```

### Get Current User

```typescript
@Controller('me')
export class MeController {
  @Get()
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get('id')
  getMyId(@CurrentUser('id') userId: string) {
    return { userId };
  }

  @Get('email')
  getMyEmail(@CurrentUser('email') email: string) {
    return { email };
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] JwtStrategy validates access tokens correctly
- [ ] JwtRefreshStrategy validates refresh tokens
- [ ] JwtAuthGuard protects routes by default
- [ ] @Public() decorator bypasses authentication
- [ ] RolesGuard enforces role-based access
- [ ] @Roles() decorator works correctly
- [ ] @CurrentUser() decorator extracts user from request
- [ ] Token expiration handled properly
- [ ] Invalid tokens return 401 Unauthorized

---

## 🧪 Testing

### Unit Test

```typescript
// src/modules/auth/strategies/jwt.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserStatus } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    status: UserStatus.ACTIVE,
    role: { name: 'student' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('validate', () => {
    it('should return user for valid payload', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate({
        sub: 'user-1',
        email: 'test@example.com',
        role: 'student',
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        strategy.validate({
          sub: 'non-existent',
          email: 'test@example.com',
          role: 'student',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for suspended user', async () => {
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        status: UserStatus.SUSPENDED,
      });

      await expect(
        strategy.validate({
          sub: 'user-1',
          email: 'test@example.com',
          role: 'student',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

### E2E Test

```typescript
// test/auth.e2e-spec.ts
describe('Auth JWT (e2e)', () => {
  it('should access protected route with valid token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);
  });

  it('should reject expired token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toContain('expired');
      });
  });

  it('should reject invalid token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('should access public route without token', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });
});
```

---

## 📚 References

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](https://www.passportjs.org/packages/passport-jwt/)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Custom Decorators](https://docs.nestjs.com/custom-decorators)

---

## ⏭️ Next Task

→ `BE-005_PASSWORD_RESET.md` - Implement Password Reset Flow
