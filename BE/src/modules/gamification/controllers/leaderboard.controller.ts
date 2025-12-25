import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { LeaderboardService } from '../services/leaderboard.service';
import { LeaderboardPeriod } from '../entities/leaderboard.entity';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get leaderboard' })
  async getLeaderboard(
    @Query('period') period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.leaderboardService.getLeaderboard(period, +limit, +offset);
  }

  @Get('my-rank')
  @ApiOperation({ summary: 'Get current user rank' })
  async getMyRank(
    @Req() req: any,
    @Query('period') period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
  ) {
    return this.leaderboardService.getUserStats(req.user.id, period);
  }
}
