import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ClassAnalyticsService } from '../services/class-analytics.service';

@ApiTags('Teacher - Analytics')
@ApiBearerAuth()
@Controller('teacher/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
export class TeacherAnalyticsController {
  constructor(private readonly analyticsService: ClassAnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get teacher dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard stats' })
  async getDashboard(@Request() req) {
    const stats = await this.analyticsService.getTeacherDashboard(req.user.id);
    return {
      success: true,
      data: stats,
    };
  }

  @Get('classes/:classId')
  @ApiOperation({ summary: 'Get detailed analytics for a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO format)' })
  @ApiResponse({ status: 200, description: 'Returns class analytics' })
  async getClassAnalytics(
    @Request() req,
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const analytics = await this.analyticsService.getClassAnalytics(
      classId,
      req.user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      data: analytics,
    };
  }

  @Get('classes/:classId/students')
  @ApiOperation({ summary: 'Get student progress for a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns student progress list' })
  async getStudentProgress(@Request() req, @Param('classId') classId: string) {
    const progress = await this.analyticsService.getStudentProgress(
      classId,
      req.user.id,
    );
    return {
      success: true,
      data: progress,
    };
  }

  @Get('top-students')
  @ApiOperation({ summary: 'Get top performing students across all classes' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of students (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns top students' })
  async getTopStudents(@Request() req, @Query('limit') limit?: number) {
    const students = await this.analyticsService.getTopStudents(
      req.user.id,
      limit || 10,
    );
    return {
      success: true,
      data: students,
    };
  }
}
