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
import { AdminLogService } from '../services/admin-log.service';
import { AdminLogFilterDto } from '../dto/admin-log.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminLogService: AdminLogService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get admin action logs' })
  async getLogs(
    @Query() filter: AdminLogFilterDto,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminLogService.findAll(filter, +page, +limit);
  }

  @Get('logs/entity/:type/:id')
  @ApiOperation({ summary: 'Get logs for specific entity' })
  async getEntityLogs(
    @Param('type') entityType: string,
    @Param('id') entityId: string,
  ) {
    return this.adminLogService.findByEntity(entityType, entityId);
  }
}
