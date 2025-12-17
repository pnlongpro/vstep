import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto, UserResponseDto, TokensDto } from './dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, ipAddress, userAgent);
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
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(token || '');
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Token đã được làm mới', type: TokensDto })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensDto> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin user', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getMe(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.authService.getMe(user.id);
  }

  // ==================== Password Reset ====================

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Yêu cầu đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Email đã được gửi (nếu tồn tại)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto.email);
  }

  @Get('reset-password/validate')
  @Public()
  @ApiOperation({ summary: 'Kiểm tra token đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Token status' })
  async validateResetToken(
    @Query('token') token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    return this.authService.validateResetToken(token);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đặt lại mật khẩu với token' })
  @ApiResponse({ status: 200, description: 'Mật khẩu đã được đặt lại' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  // ==================== Email Verification ====================

  @Post('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực email với token' })
  @ApiResponse({ status: 200, description: 'Email verified' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi lại email xác thực' })
  @ApiResponse({ status: 200, description: 'Email sent' })
  async resendVerification(@Body() dto: ResendVerificationDto): Promise<{ message: string }> {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @Get('verification-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kiểm tra trạng thái xác thực email' })
  async getVerificationStatus(
    @CurrentUser() user: User,
  ): Promise<{ isVerified: boolean; verifiedAt: string | null }> {
    return this.authService.getVerificationStatus(user.id);
  }

  // ==================== Session Management ====================

  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách sessions' })
  async getSessions(@CurrentUser() user: User, @Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.getUserSessions(user.id, token);
  }

  @Delete('sessions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thu hồi session cụ thể' })
  async revokeSession(
    @CurrentUser() user: User,
    @Param('id') sessionId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.revokeSession(user.id, sessionId, token);
  }

  @Delete('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thu hồi tất cả sessions trừ session hiện tại' })
  async revokeAllSessions(
    @CurrentUser() user: User,
    @Req() req: Request,
  ): Promise<{ message: string; revokedCount: number }> {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.revokeAllSessions(user.id, token);
  }
}
