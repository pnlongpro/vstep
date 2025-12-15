import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // Badges
  @Get('badges')
  @ApiOperation({ summary: 'Lấy danh sách badges' })
  async getBadges(@Request() req) {
    return this.gamificationService.getBadges(req.user.userId);
  }

  @Get('badges/earned')
  @ApiOperation({ summary: 'Lấy badges đã unlock' })
  async getEarnedBadges(@Request() req) {
    return this.gamificationService.getEarnedBadges(req.user.userId);
  }

  @Post('badges/check')
  @ApiOperation({ summary: 'Kiểm tra badges mới unlock (internal)' })
  async checkBadgeUnlock(@Request() req) {
    return this.gamificationService.checkBadgeUnlock(req.user.userId);
  }

  // Goals
  @Get('goals')
  @ApiOperation({ summary: 'Lấy danh sách goals' })
  async getGoals(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return this.gamificationService.getGoals(req.user.userId, status);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Tạo goal mới' })
  async createGoal(@Request() req, @Body() dto: CreateGoalDto) {
    return this.gamificationService.createGoal(req.user.userId, dto);
  }

  @Put('goals/:id')
  @ApiOperation({ summary: 'Cập nhật goal' })
  async updateGoal(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.gamificationService.updateGoal(id, req.user.userId, dto);
  }

  @Delete('goals/:id')
  @ApiOperation({ summary: 'Xóa goal' })
  async deleteGoal(@Request() req, @Param('id') id: string) {
    return this.gamificationService.deleteGoal(id, req.user.userId);
  }

  @Post('goals/:id/abandon')
  @ApiOperation({ summary: 'Bỏ goal (abandon)' })
  async abandonGoal(@Request() req, @Param('id') id: string) {
    return this.gamificationService.abandonGoal(id, req.user.userId);
  }

  // Leaderboards
  @Get('leaderboards')
  @ApiOperation({ summary: 'Xem bảng xếp hạng' })
  async getLeaderboard(
    @Request() req,
    @Query('scope') scope?: string,
    @Query('period') period?: string,
  ) {
    return this.gamificationService.getLeaderboard(req.user.userId, {
      scope,
      period,
    });
  }

  // Points
  @Get('points')
  @ApiOperation({ summary: 'Lấy điểm gamification' })
  async getPoints(@Request() req) {
    return this.gamificationService.getPoints(req.user.userId);
  }
}
