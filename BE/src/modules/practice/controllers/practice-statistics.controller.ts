import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PracticeStatisticsService } from '../services/practice-statistics.service';

@ApiTags('Practice Statistics')
@Controller('practice/statistics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PracticeStatisticsController {
  constructor(private readonly statisticsService: PracticeStatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user practice statistics' })
  async getUserStatistics(@CurrentUser('id') userId: string) {
    return this.statisticsService.getUserStatistics(userId);
  }

  @Get('by-skill')
  @ApiOperation({ summary: 'Get statistics by skill' })
  async getStatsBySkill(@CurrentUser('id') userId: string) {
    return this.statisticsService.getStatsBySkill(userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity' })
  async getRecentActivity(@CurrentUser('id') userId: string, @Query('limit') limit: number = 10) {
    return this.statisticsService.getRecentActivity(userId, limit);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get progress over time' })
  async getProgressOverTime(@CurrentUser('id') userId: string, @Query('days') days: number = 30) {
    return this.statisticsService.getProgressOverTime(userId, days);
  }
}
