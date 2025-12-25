import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ActivityService } from '../services/activity.service';
import { ActivityQueryDto } from '../dto/dashboard.dto';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent activities' })
  async getActivities(@Req() req: any, @Query() query: ActivityQueryDto) {
    return this.activityService.getRecentActivities(
      req.user.id,
      query.page,
      query.limit,
      query.category,
    );
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get activity timeline grouped by date' })
  async getTimeline(@Req() req: any, @Query('days') days = 30) {
    return this.activityService.getActivityTimeline(req.user.id, +days);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get activity summary by category' })
  async getSummary(@Req() req: any, @Query('days') days = 7) {
    return this.activityService.getActivitySummary(req.user.id, +days);
  }
}
