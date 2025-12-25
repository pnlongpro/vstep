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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { GoalService } from '../services/goal.service';
import { CreateGoalDto, UpdateGoalProgressDto } from '../dto/goal.dto';
import { GoalStatus } from '../entities/goal.entity';

@ApiTags('Goals')
@ApiBearerAuth()
@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get()
  @ApiOperation({ summary: 'Get user goals' })
  async findUserGoals(@Req() req: any, @Query('status') status?: GoalStatus) {
    return this.goalService.findUserGoals(req.user.id, status);
  }

  @Post()
  @ApiOperation({ summary: 'Create new goal' })
  async create(@Req() req: any, @Body() dto: CreateGoalDto) {
    return this.goalService.create(req.user.id, dto);
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  async updateProgress(@Param('id') id: string, @Body() dto: UpdateGoalProgressDto) {
    return this.goalService.updateProgress(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete goal' })
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.goalService.deleteGoal(id, req.user.id);
  }
}
