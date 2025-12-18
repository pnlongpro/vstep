import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Session } from './entities/session.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { OAuthAccount, OAuthProvider } from './entities/oauth-account.entity';
import { LoginHistory, LoginStatus, LoginMethod } from './entities/login-history.entity';
import { SecurityAlert, AlertType, AlertSeverity } from './entities/security-alert.entity';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto, TokensDto, GoogleAuthDto } from './dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    @InjectRepository(OAuthAccount)
    private readonly oauthAccountRepository: Repository<OAuthAccount>,
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
    @InjectRepository(SecurityAlert)
    private readonly securityAlertRepository: Repository<SecurityAlert>,
  ) {}

  /**
   * Register new user
   */
  async register(
    dto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    // Create user
    const user = await this.usersService.create({
      email: dto.email.toLowerCase(),
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(
      user.id,
      tokens.accessToken,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(user),
    };
  }

  /**
   * Login user
   */
  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    // Find user with password
    const user = await this.usersService.findByEmailWithPassword(
      dto.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(
      user.id,
      tokens.accessToken,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Get full user data
    const fullUser = await this.usersService.findById(user.id);

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(fullUser),
    };
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<{ message: string }> {
    await this.sessionRepository.update(
      { token, isActive: true },
      { isActive: false, revokedAt: new Date() },
    );

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(refreshToken: string): Promise<TokensDto> {
    // Find session
    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        isActive: true,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!session) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Get user
    const user = await this.usersService.findById(session.userId);

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Update session
    await this.sessionRepository.update(session.id, {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      lastActiveAt: new Date(),
    });

    return tokens;
  }

  /**
   * Get current user
   */
  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return UserResponseDto.fromEntity(user);
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User): Promise<TokensDto> {
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

    // Parse expiry
    const expiresIn = this.parseExpiry(
      this.configService.get('JWT_EXPIRES_IN', '15m'),
    );

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Create session
   */
  private async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Session> {
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

    // Parse refresh token expiry (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = this.sessionRepository.create({
      userId,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      lastActiveAt: new Date(),
      expiresAt,
    });

    return this.sessionRepository.save(session);
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 900;
    }
  }

  // ==================== Password Reset ====================

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email.toLowerCase());

    // Always return success for security (don't reveal if email exists)
    const successMessage = { message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.' };

    if (!user) {
      return successMessage;
    }

    // Check rate limit (1 request per minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentToken = await this.passwordResetTokenRepository.findOne({
      where: {
        userId: user.id,
        createdAt: MoreThan(oneMinuteAgo),
      },
    });

    if (recentToken) {
      throw new BadRequestException('Vui lòng đợi 1 phút trước khi gửi lại yêu cầu');
    }

    // Invalidate old tokens
    await this.passwordResetTokenRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true },
    );

    // Generate new token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);

    const resetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await this.passwordResetTokenRepository.save(resetToken);

    // TODO: Send email with reset link
    // const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    // const resetLink = `${frontendUrl}/auth/reset-password?token=${rawToken}`;
    // await this.mailerService.sendPasswordResetEmail(user.email, resetLink);

    console.log(`[DEV] Password reset token for ${user.email}: ${rawToken}`);

    return successMessage;
  }

  /**
   * Validate reset token
   */
  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const tokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        return { valid: true, email: tokenRecord.user.email };
      }
    }

    return { valid: false };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokens = await this.passwordResetTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    let validToken: PasswordResetToken | null = null;

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        validToken = tokenRecord;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Update password
    await this.usersService.updatePassword(validToken.userId, newPassword);

    // Mark token as used
    await this.passwordResetTokenRepository.update(validToken.id, {
      isUsed: true,
      usedAt: new Date(),
    });

    // Invalidate all sessions for security
    await this.sessionRepository.update(
      { userId: validToken.userId, isActive: true },
      { isActive: false, revokedAt: new Date() },
    );

    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }

  // ==================== Email Verification ====================

  /**
   * Send verification email
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

    const verificationToken = this.emailVerificationTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await this.emailVerificationTokenRepository.save(verificationToken);

    // TODO: Send email
    // const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    // const verifyLink = `${frontendUrl}/auth/verify-email?token=${rawToken}`;

    console.log(`[DEV] Email verification token for ${user.email}: ${rawToken}`);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string; user: UserResponseDto }> {
    const tokens = await this.emailVerificationTokenRepository.find({
      where: {
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    let validToken: EmailVerificationToken | null = null;

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(token, tokenRecord.token);
      if (isMatch) {
        validToken = tokenRecord;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Check if already verified
    if (validToken.user.emailVerifiedAt) {
      return {
        message: 'Email đã được xác thực trước đó',
        user: UserResponseDto.fromEntity(validToken.user),
      };
    }

    // Update user
    await this.usersService.verifyEmail(validToken.userId);

    // Mark token as used
    await this.emailVerificationTokenRepository.update(validToken.id, {
      isUsed: true,
      verifiedAt: new Date(),
    });

    // Get updated user
    const user = await this.usersService.findById(validToken.userId);

    return {
      message: 'Email đã được xác thực thành công',
      user: UserResponseDto.fromEntity(user),
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email.toLowerCase());

    const successMessage = { message: 'Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email.' };

    if (!user) {
      return successMessage;
    }

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
      throw new BadRequestException('Vui lòng đợi 5 phút trước khi gửi lại email xác thực');
    }

    await this.sendVerificationEmail(user);

    return successMessage;
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(userId: string): Promise<{ isVerified: boolean; verifiedAt: string | null }> {
    const user = await this.usersService.findById(userId);
    return {
      isVerified: !!user.emailVerifiedAt,
      verifiedAt: user.emailVerifiedAt?.toISOString() || null,
    };
  }

  // ==================== Session Management ====================

  /**
   * Get all active sessions for user
   */
  async getUserSessions(userId: string, currentToken: string): Promise<{
    sessions: any[];
    total: number;
    currentSessionId: string;
  }> {
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
        isActive: true,
        expiresAt: MoreThan(new Date()),
      },
      order: { lastActiveAt: 'DESC' },
    });

    let currentSessionId = '';
    for (const session of sessions) {
      if (session.token === currentToken) {
        currentSessionId = session.id;
        break;
      }
    }

    return {
      sessions: sessions.map((s) => ({
        id: s.id,
        deviceType: s.deviceType || 'unknown',
        deviceName: s.deviceName || 'Unknown Device',
        browser: s.browser || 'Unknown',
        os: s.os || 'Unknown',
        ipAddress: this.maskIpAddress(s.ipAddress),
        location: s.location || 'Unknown',
        isCurrent: s.id === currentSessionId,
        lastActiveAt: s.lastActiveAt || s.createdAt,
        createdAt: s.createdAt,
      })),
      total: sessions.length,
      currentSessionId,
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
      throw new BadRequestException('Session không tồn tại');
    }

    if (session.token === currentToken) {
      throw new BadRequestException('Không thể thu hồi session hiện tại. Sử dụng logout thay thế.');
    }

    await this.sessionRepository.update(sessionId, {
      isActive: false,
      revokedAt: new Date(),
    });

    return { message: 'Đã thu hồi session' };
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(
    userId: string,
    currentToken: string,
  ): Promise<{ message: string; revokedCount: number }> {
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
      message: `Đã thu hồi ${revokedCount} sessions`,
      revokedCount,
    };
  }

  /**
   * Mask IP address for privacy
   */
  private maskIpAddress(ip?: string): string {
    if (!ip) return 'Unknown';

    if (ip.includes(':')) {
      const parts = ip.split(':');
      return `${parts[0]}:${parts[1]}:****:****`;
    }

    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }

    return ip;
  }

  // ==================== OAuth (Google) ====================

  /**
   * Authenticate with Google
   */
  async googleAuth(
    dto: GoogleAuthDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const { accessToken, googleId, email, name, picture } = dto;

    // Validate Google token (in production, should verify with Google API)
    if (!accessToken) {
      throw new BadRequestException('Access token không hợp lệ');
    }

    // Check if OAuth account exists
    let oauthAccount = await this.oauthAccountRepository.findOne({
      where: {
        provider: OAuthProvider.GOOGLE,
        providerId: googleId,
      },
      relations: ['user'],
    });

    let user: User;

    if (oauthAccount) {
      // Existing OAuth user - login
      user = await this.usersService.findById(oauthAccount.userId);
    } else {
      // Check if email already exists
      const existingUser = await this.usersService.findByEmail(email);

      if (existingUser) {
        // Link Google to existing account
        oauthAccount = this.oauthAccountRepository.create({
          userId: existingUser.id,
          provider: OAuthProvider.GOOGLE,
          providerId: googleId,
          email,
          name,
          avatar: picture,
          accessToken,
        });
        await this.oauthAccountRepository.save(oauthAccount);
        user = existingUser;
      } else {
        // Create new user
        const nameParts = (name || '').split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        user = await this.usersService.create({
          email: email.toLowerCase(),
          password: crypto.randomBytes(32).toString('hex'), // Random password
          firstName,
          lastName,
        });

        // Verify email automatically
        await this.usersService.verifyEmail(user.id);

        // Update avatar if provided
        if (picture) {
          // Update user avatar
        }

        // Create OAuth account link
        oauthAccount = this.oauthAccountRepository.create({
          userId: user.id,
          provider: OAuthProvider.GOOGLE,
          providerId: googleId,
          email,
          name,
          avatar: picture,
          accessToken,
        });
        await this.oauthAccountRepository.save(oauthAccount);
      }
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(
      user.id,
      tokens.accessToken,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Get full user data
    const fullUser = await this.usersService.findById(user.id);

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(fullUser),
    };
  }

  /**
   * Link OAuth account to existing user
   */
  async linkOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    providerId: string,
    data: { email?: string; name?: string; avatar?: string; accessToken?: string },
  ): Promise<{ message: string }> {
    // Check if already linked
    const existing = await this.oauthAccountRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });

    if (existing) {
      if (existing.userId === userId) {
        throw new ConflictException('Tài khoản đã được liên kết');
      }
      throw new ConflictException('Tài khoản Google này đã liên kết với tài khoản khác');
    }

    // Create link
    const oauthAccount = this.oauthAccountRepository.create({
      userId,
      provider,
      providerId,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      accessToken: data.accessToken,
    });

    await this.oauthAccountRepository.save(oauthAccount);

    return { message: 'Đã liên kết tài khoản thành công' };
  }

  /**
   * Unlink OAuth account
   */
  async unlinkOAuthAccount(
    userId: string,
    provider: OAuthProvider,
  ): Promise<{ message: string }> {
    const account = await this.oauthAccountRepository.findOne({
      where: {
        userId,
        provider,
      },
    });

    if (!account) {
      throw new BadRequestException('Không tìm thấy liên kết tài khoản');
    }

    // Check if user has password (can't unlink if no other auth method)
    const user = await this.usersService.findByIdWithPassword(userId);
    const otherOAuthAccounts = await this.oauthAccountRepository.count({
      where: { userId },
    });

    if (!user.password && otherOAuthAccounts <= 1) {
      throw new BadRequestException('Không thể hủy liên kết. Vui lòng đặt mật khẩu trước.');
    }

    await this.oauthAccountRepository.delete(account.id);

    return { message: 'Đã hủy liên kết tài khoản' };
  }

  /**
   * Get linked OAuth accounts
   */
  async getLinkedAccounts(userId: string): Promise<{
    provider: string;
    email: string;
    linkedAt: string;
  }[]> {
    const accounts = await this.oauthAccountRepository.find({
      where: { userId },
    });

    return accounts.map((a) => ({
      provider: a.provider,
      email: a.email,
      linkedAt: a.createdAt.toISOString(),
    }));
  }

  // ==================== Login History ====================

  /**
   * Record login attempt
   */
  async recordLoginAttempt(
    userId: string | null,
    email: string,
    status: LoginStatus,
    method: LoginMethod,
    ipAddress?: string,
    userAgent?: string,
    failureReason?: string,
  ): Promise<LoginHistory> {
    const entry = this.loginHistoryRepository.create({
      userId,
      email,
      status,
      method,
      failureReason,
      ipAddress,
      userAgent,
    });

    return this.loginHistoryRepository.save(entry);
  }

  /**
   * Get login history for user
   */
  async getLoginHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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
        deviceName: item.deviceName || 'Unknown Device',
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

  // ==================== Security Alerts ====================

  /**
   * Create security alert
   */
  async createSecurityAlert(
    userId: string,
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<SecurityAlert> {
    const alert = this.securityAlertRepository.create({
      userId,
      type,
      severity,
      title,
      description,
      metadata,
    });

    return this.securityAlertRepository.save(alert);
  }

  /**
   * Get security alerts for user
   */
  async getSecurityAlerts(userId: string): Promise<{
    alerts: any[];
    unreadCount: number;
    total: number;
  }> {
    const alerts = await this.securityAlertRepository.find({
      where: { userId, isDismissed: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const unreadCount = alerts.filter((a) => !a.isRead).length;

    return {
      alerts: alerts.map((a) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        title: a.title,
        description: a.description,
        metadata: a.metadata,
        isDismissed: a.isDismissed,
        isRead: a.isRead,
        createdAt: a.createdAt,
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
      throw new BadRequestException('Alert không tồn tại');
    }

    await this.securityAlertRepository.update(alertId, {
      isDismissed: true,
      dismissedAt: new Date(),
    });

    return { message: 'Đã ẩn thông báo' };
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(
    userId: string,
    alertId: string,
  ): Promise<{ message: string }> {
    await this.securityAlertRepository.update(
      { id: alertId, userId },
      { isRead: true, readAt: new Date() },
    );

    return { message: 'OK' };
  }
}
