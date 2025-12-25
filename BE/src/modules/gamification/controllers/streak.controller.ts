import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { StreakService } from '../services/streak.service';

@ApiTags('Streak')
@ApiBearerAuth()
@Controller('streak')
@UseGuards(JwtAuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  @ApiOperation({ summary: 'Get current streak info' })
  async getStreak(@Req() req: any) {
    return this.streakService.getOrCreate(req.user.id);
  }

  @Post('record')
  @ApiOperation({ summary: 'Record daily activity' })
  async recordActivity(@Req() req: any) {
    return this.streakService.recordActivity(req.user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get streak leaderboard' })
  async getLeaderboard() {
    return this.streakService.getLeaderboard();
  }
}
