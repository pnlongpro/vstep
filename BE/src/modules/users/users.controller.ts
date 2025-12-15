import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin profile đầy đủ' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê học tập' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async getStats(@Request() req) {
    return this.usersService.getStats(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }
}
