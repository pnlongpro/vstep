# BE-007: OAuth2 Integration (Google)

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-007 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-002, BE-003, BE-004 |

---

## 🎯 Objective

Implement OAuth2 Authentication với Google:
- Google Sign-In button
- Link/Unlink Google account
- Auto-create account nếu chưa tồn tại

---

## 📝 Requirements

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/google | Redirect to Google OAuth |
| GET | /auth/google/callback | Google callback handler |
| POST | /auth/google/token | Verify Google ID token (mobile) |
| POST | /auth/link/google | Link Google account |
| DELETE | /auth/link/google | Unlink Google account |

### Business Rules

1. **New User via Google**:
   - Auto-create account
   - Email already verified
   - Generate random password (user can set later)
   - Status = ACTIVE

2. **Existing User**:
   - Link Google to existing account
   - Login with either email/password or Google

3. **Account Linking**:
   - User can link/unlink Google
   - Cannot unlink if no password set

---

## 💻 Implementation

### File Structure

```
src/modules/auth/
├── strategies/
│   └── google.strategy.ts
├── entities/
│   └── oauth-account.entity.ts
├── dto/
│   └── google-auth.dto.ts
└── auth.service.ts (update)
```

### Step 1: OAuth Account Entity

```typescript
// src/modules/auth/entities/oauth-account.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Entity('oauth_accounts')
@Unique(['provider', 'providerId'])
@Index(['userId'])
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column({ length: 255 })
  providerId: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  tokenExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 2: DTOs

```typescript
// src/modules/auth/dto/google-auth.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'Google ID token from client SDK',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleCallbackDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  error?: string;
}
```

### Step 3: Google Strategy

```typescript
// src/modules/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

export interface GoogleProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails, name, photos } = profile;

    const googleProfile: GoogleProfile = {
      id,
      email: emails?.[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
      accessToken,
      refreshToken,
    };

    done(null, googleProfile);
  }
}
```

### Step 4: Google Auth Guard

```typescript
// src/guards/google-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
```

### Step 5: Auth Service - Google Methods

```typescript
// src/modules/auth/auth.service.ts (add these methods)
import { OAuth2Client } from 'google-auth-library';
import { OAuthAccount, OAuthProvider } from './entities/oauth-account.entity';
import { GoogleProfile } from './strategies/google.strategy';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    // ... existing injections
    @InjectRepository(OAuthAccount)
    private readonly oauthAccountRepository: Repository<OAuthAccount>,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  /**
   * Handle Google OAuth callback
   */
  async googleLogin(googleProfile: GoogleProfile): Promise<AuthResponseDto> {
    const { id: googleId, email, firstName, lastName, picture, accessToken, refreshToken } = googleProfile;

    // Check if OAuth account exists
    let oauthAccount = await this.oauthAccountRepository.findOne({
      where: {
        provider: OAuthProvider.GOOGLE,
        providerId: googleId,
      },
      relations: ['user', 'user.role'],
    });

    let user: User;

    if (oauthAccount) {
      // Existing OAuth account - login
      user = oauthAccount.user;

      // Update tokens
      await this.oauthAccountRepository.update(oauthAccount.id, {
        accessToken,
        refreshToken,
      });
    } else {
      // Check if email already registered
      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser) {
        // Link Google to existing account
        user = existingUser;
        oauthAccount = await this.createOAuthAccount(
          user.id,
          OAuthProvider.GOOGLE,
          googleId,
          { email, name: `${firstName} ${lastName}`, avatar: picture, accessToken, refreshToken },
        );
      } else {
        // Create new user
        user = await this.createUserFromOAuth({
          email,
          firstName,
          lastName,
          avatar: picture,
        });

        // Create OAuth account
        oauthAccount = await this.createOAuthAccount(
          user.id,
          OAuthProvider.GOOGLE,
          googleId,
          { email, name: `${firstName} ${lastName}`, avatar: picture, accessToken, refreshToken },
        );
      }
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.accessToken, tokens.refreshToken);

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Get full user
    const fullUser = await this.usersService.findById(user.id);

    return {
      ...tokens,
      user: this.formatUser(fullUser),
    };
  }

  /**
   * Verify Google ID token (for mobile apps)
   */
  async verifyGoogleToken(idToken: string): Promise<AuthResponseDto> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const googleProfile: GoogleProfile = {
        id: payload.sub,
        email: payload.email || '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture || '',
        accessToken: idToken,
      };

      return this.googleLogin(googleProfile);
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  /**
   * Link Google account to existing user
   */
  async linkGoogleAccount(
    userId: string,
    idToken: string,
  ): Promise<{ message: string }> {
    // Verify token
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestException('Invalid Google token');
    }

    // Check if already linked
    const existingLink = await this.oauthAccountRepository.findOne({
      where: {
        provider: OAuthProvider.GOOGLE,
        providerId: payload.sub,
      },
    });

    if (existingLink) {
      if (existingLink.userId === userId) {
        throw new BadRequestException('Tài khoản Google đã được liên kết');
      }
      throw new BadRequestException('Tài khoản Google đã được liên kết với user khác');
    }

    // Create link
    await this.createOAuthAccount(userId, OAuthProvider.GOOGLE, payload.sub, {
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    });

    return { message: 'Liên kết tài khoản Google thành công' };
  }

  /**
   * Unlink Google account
   */
  async unlinkGoogleAccount(userId: string): Promise<{ message: string }> {
    // Check if user has password
    const user = await this.usersService.findById(userId);
    
    // Count OAuth accounts
    const oauthCount = await this.oauthAccountRepository.count({
      where: { userId },
    });

    // User must have either password or another OAuth
    if (!user.password && oauthCount <= 1) {
      throw new BadRequestException(
        'Bạn cần đặt mật khẩu trước khi hủy liên kết',
      );
    }

    // Delete Google link
    await this.oauthAccountRepository.delete({
      userId,
      provider: OAuthProvider.GOOGLE,
    });

    return { message: 'Đã hủy liên kết tài khoản Google' };
  }

  /**
   * Create OAuth account record
   */
  private async createOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    providerId: string,
    data: {
      email?: string;
      name?: string;
      avatar?: string;
      accessToken?: string;
      refreshToken?: string;
    },
  ): Promise<OAuthAccount> {
    const oauthAccount = this.oauthAccountRepository.create({
      userId,
      provider,
      providerId,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return this.oauthAccountRepository.save(oauthAccount);
  }

  /**
   * Create user from OAuth profile
   */
  private async createUserFromOAuth(profile: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }): Promise<User> {
    // Generate random password
    const randomPassword = crypto.randomBytes(16).toString('hex');

    // Get default role
    const role = await this.roleRepository.findOne({
      where: { name: 'student' },
    });

    // Create user
    const user = this.userRepository.create({
      email: profile.email,
      password: await bcrypt.hash(randomPassword, 10),
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
      roleId: role.id,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(), // Email verified via OAuth
    });

    const savedUser = await this.userRepository.save(user);

    // Create related entities
    await this.profileRepository.save({ userId: savedUser.id });
    await this.statsRepository.save({ userId: savedUser.id });
    await this.settingsRepository.save({ userId: savedUser.id });

    return savedUser;
  }

  /**
   * Get linked OAuth accounts for user
   */
  async getLinkedAccounts(userId: string): Promise<Array<{
    provider: string;
    email: string;
    linkedAt: Date;
  }>> {
    const accounts = await this.oauthAccountRepository.find({
      where: { userId },
      select: ['provider', 'email', 'createdAt'],
    });

    return accounts.map((acc) => ({
      provider: acc.provider,
      email: acc.email,
      linkedAt: acc.createdAt,
    }));
  }
}
```

### Step 6: Auth Controller - Google Endpoints

```typescript
// src/modules/auth/auth.controller.ts (add these endpoints)
import { GoogleAuthGuard } from '../../guards/google-auth.guard';
import { GoogleTokenDto } from './dto/google-auth.dto';

@Controller('auth')
export class AuthController {
  // ... existing endpoints

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Redirect to Google OAuth' })
  async googleAuth(): Promise<void> {
    // Guard handles redirect
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.googleLogin(req.user as GoogleProfile);

    // Redirect to frontend with tokens
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const redirectUrl = `${frontendUrl}/auth/oauth-callback?` +
      `accessToken=${result.accessToken}&` +
      `refreshToken=${result.refreshToken}`;

    res.redirect(redirectUrl);
  }

  @Post('google/token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google ID token (mobile)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async googleTokenAuth(
    @Body() dto: GoogleTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.verifyGoogleToken(dto.idToken);
  }

  @Post('link/google')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Link Google account' })
  async linkGoogle(
    @CurrentUser('id') userId: string,
    @Body() dto: GoogleTokenDto,
  ): Promise<{ message: string }> {
    return this.authService.linkGoogleAccount(userId, dto.idToken);
  }

  @Delete('link/google')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlink Google account' })
  async unlinkGoogle(
    @CurrentUser('id') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.unlinkGoogleAccount(userId);
  }

  @Get('linked-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get linked OAuth accounts' })
  async getLinkedAccounts(@CurrentUser('id') userId: string) {
    return this.authService.getLinkedAccounts(userId);
  }
}
```

### Step 7: Update Auth Module

```typescript
// src/modules/auth/auth.module.ts
import { OAuthAccount } from './entities/oauth-account.entity';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // ... existing imports
    TypeOrmModule.forFeature([
      Session,
      User,
      PasswordResetToken,
      EmailVerificationToken,
      OAuthAccount,
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy, // Add Google strategy
  ],
  // ... rest
})
export class AuthModule {}
```

---

## 🔧 Environment Variables

```env
# .env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE OAUTH FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WEB FLOW:                                                      │
│  ─────────                                                      │
│  1. User clicks "Sign in with Google"                           │
│          ↓                                                      │
│  2. GET /auth/google → Redirect to Google                       │
│          ↓                                                      │
│  3. User authorizes on Google                                   │
│          ↓                                                      │
│  4. GET /auth/google/callback                                   │
│          ↓                                                      │
│  5. [Find/Create user] → [Generate tokens]                      │
│          ↓                                                      │
│  6. Redirect to frontend with tokens                            │
│                                                                 │
│  MOBILE FLOW:                                                   │
│  ────────────                                                   │
│  1. User signs in with Google SDK                               │
│          ↓                                                      │
│  2. POST /auth/google/token { idToken }                         │
│          ↓                                                      │
│  3. [Verify token] → [Find/Create user] → [Generate tokens]     │
│          ↓                                                      │
│  4. Return { accessToken, refreshToken, user }                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

- [ ] GET /auth/google redirects to Google
- [ ] Callback handles Google response
- [ ] New users auto-created with ACTIVE status
- [ ] Existing users can login via Google
- [ ] POST /auth/google/token works (mobile)
- [ ] Link/Unlink Google account works
- [ ] Cannot unlink if no password set
- [ ] OAuth accounts stored in database

---

## 🧪 Testing

```bash
# 1. Web: Visit in browser
open http://localhost:3001/api/auth/google

# 2. Mobile: POST with ID token
curl -X POST http://localhost:3000/api/auth/google/token \
  -H "Content-Type: application/json" \
  -d '{"idToken": "<google_id_token>"}'

# 3. Link Google
curl -X POST http://localhost:3000/api/auth/link/google \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"idToken": "<google_id_token>"}'

# 4. Get linked accounts
curl -X GET http://localhost:3000/api/auth/linked-accounts \
  -H "Authorization: Bearer <access_token>"

# 5. Unlink Google
curl -X DELETE http://localhost:3000/api/auth/link/google \
  -H "Authorization: Bearer <access_token>"
```

---

## 📦 Dependencies

```bash
npm install passport-google-oauth20 google-auth-library
npm install -D @types/passport-google-oauth20
```

---

## 📚 References

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth20](http://www.passportjs.org/packages/passport-google-oauth20/)
- [NestJS OAuth](https://docs.nestjs.com/security/authentication#oauth2)

---

## ⏭️ Next Task

→ `BE-008_SESSION_MGMT.md` - Implement Session Management
