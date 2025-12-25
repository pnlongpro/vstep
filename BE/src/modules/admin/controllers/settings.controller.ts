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
import { SystemSettingService } from '../services/system-setting.service';
import { CreateSystemSettingDto, UpdateSystemSettingDto } from '../dto/system-setting.dto';
import { SettingCategory } from '../entities/system-setting.entity';

@ApiTags('Admin - System Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SettingsController {
  constructor(private readonly settingService: SystemSettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system settings' })
  async findAll(@Query('category') category?: SettingCategory) {
    return this.settingService.findAll(category);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public settings (no auth required)' })
  async getPublic() {
    return this.settingService.getPublicSettings();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  async findByKey(@Param('key') key: string) {
    return this.settingService.findByKey(key);
  }

  @Post()
  @ApiOperation({ summary: 'Create new setting' })
  async create(@Body() dto: CreateSystemSettingDto, @Req() req: any) {
    return this.settingService.create(dto, req.user.id);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update setting' })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateSystemSettingDto,
    @Req() req: any,
  ) {
    return this.settingService.update(key, dto, req.user.id);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete setting' })
  async delete(@Param('key') key: string) {
    return this.settingService.delete(key);
  }

  @Post('refresh-cache')
  @ApiOperation({ summary: 'Refresh settings cache' })
  async refreshCache() {
    this.settingService.refreshCache();
    return { message: 'Cache refreshed' };
  }
}
