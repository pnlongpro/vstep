import { Controller, Get, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RoadmapService } from '../services/roadmap.service';
import { CreateRoadmapDto, UpdateRoadmapDto } from '../dto/dashboard.dto';

@ApiTags('Learning Roadmap')
@ApiBearerAuth()
@Controller('roadmap')
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @ApiOperation({ summary: 'Get user learning roadmap with milestones' })
  async getRoadmap(@Req() req: any) {
    return this.roadmapService.findByUserIdWithMilestones(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create learning roadmap' })
  async createRoadmap(@Req() req: any, @Body() dto: CreateRoadmapDto) {
    return this.roadmapService.create(req.user.id, dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update learning roadmap' })
  async updateRoadmap(@Req() req: any, @Body() dto: UpdateRoadmapDto) {
    return this.roadmapService.update(req.user.id, dto);
  }

  @Get('weekly-plan')
  @ApiOperation({ summary: 'Get weekly study plan' })
  async getWeeklyPlan(@Req() req: any) {
    return this.roadmapService.getWeeklyPlan(req.user.id);
  }
}
