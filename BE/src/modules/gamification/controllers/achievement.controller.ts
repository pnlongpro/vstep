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
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AchievementService } from '../services/achievement.service';
import { CreateAchievementDto, UpdateAchievementDto } from '../dto/achievement.dto';
import { AchievementCategory } from '../entities/achievement.entity';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  async findAll(@Query('category') category?: AchievementCategory) {
    return this.achievementService.findAll(category);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user achievements with progress' })
  async getMyAchievements(@Req() req: any) {
    return this.achievementService.getUserAchievements(req.user.id);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get unnotified unlocked achievements' })
  async getNotifications(@Req() req: any) {
    return this.achievementService.getUnnotifiedAchievements(req.user.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create achievement (admin only)' })
  async create(@Body() dto: CreateAchievementDto) {
    return this.achievementService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update achievement (admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    return this.achievementService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete achievement (admin only)' })
  async delete(@Param('id') id: string) {
    return this.achievementService.delete(id);
  }
}
