import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';
import { CalendarQueryDto } from '../dto/dashboard.dto';
import { subDays, subMonths } from 'date-fns';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview' })
  async getOverview(@Req() req: any) {
    return this.dashboardService.getOverview(req.user.id);
  }

  @Get('weekly-summary')
  @ApiOperation({ summary: 'Get weekly summary' })
  async getWeeklySummary(@Req() req: any) {
    return this.dashboardService.getWeeklySummary(req.user.id);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get activity calendar data' })
  async getCalendar(@Req() req: any, @Query() query: CalendarQueryDto) {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    const startDate = query.startDate ? new Date(query.startDate) : subMonths(endDate, 3);
    return this.dashboardService.getCalendarData(req.user.id, startDate, endDate);
  }

  @Get('skill-progress')
  @ApiOperation({ summary: 'Get skill progress over time' })
  async getSkillProgress(@Req() req: any, @Query('days') days = 30) {
    return this.dashboardService.getSkillProgress(req.user.id, +days);
  }
}
