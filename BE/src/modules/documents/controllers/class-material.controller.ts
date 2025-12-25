import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { ClassMaterialService } from '../services/class-material.service';
import {
  ClassMaterialFilterDto,
  CreateClassMaterialDto,
  UpdateClassMaterialDto,
  ClassMaterialListResponseDto,
  ClassMaterialStatisticsDto,
  BulkMaterialActionDto,
} from '../dto/class-material.dto';
import { UpdateMaterialStatusDto } from '../dto/study-material.dto';

@ApiTags('Class Materials')
@Controller('documents/class')
export class ClassMaterialController {
  constructor(private readonly classMaterialService: ClassMaterialService) {}

  // ========== Public/Student Endpoints ==========

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published class materials' })
  @ApiResponse({ status: 200, type: ClassMaterialListResponseDto })
  async findPublic(@Query() filter: ClassMaterialFilterDto) {
    return this.classMaterialService.findPublic(filter);
  }

  @Get('courses')
  @Public()
  @ApiOperation({ summary: 'Get available courses with material counts' })
  async getCourses() {
    return this.classMaterialService.getCourses();
  }

  @Get('course/:course')
  @Public()
  @ApiOperation({ summary: 'Get materials by course' })
  async findByCourse(@Param('course') course: string) {
    const materials = await this.classMaterialService.findByCourse(course);
    return { success: true, data: materials };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get class material by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Ip() ip: string,
  ) {
    const material = await this.classMaterialService.findById(id);
    
    // Track view
    await this.classMaterialService.incrementView(id, req.user?.id, ip);

    return { success: true, data: material };
  }

  @Post(':id/download')
  @Public()
  @ApiOperation({ summary: 'Track material download' })
  async trackDownload(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Ip() ip: string,
  ) {
    await this.classMaterialService.incrementDownload(id, req.user?.id, ip);
    return { success: true };
  }

  // ========== Admin Endpoints ==========

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all class materials (Admin)' })
  async findAllAdmin(@Query() filter: ClassMaterialFilterDto) {
    return this.classMaterialService.findAll(filter);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending contributions (Admin)' })
  async findPending(@Query() filter: ClassMaterialFilterDto) {
    return this.classMaterialService.findPending(filter);
  }

  @Get('admin/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get class material statistics (Admin)' })
  @ApiResponse({ status: 200, type: ClassMaterialStatisticsDto })
  async getStatistics() {
    return this.classMaterialService.getStatistics();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create class material (Admin)' })
  async create(@Body() dto: CreateClassMaterialDto, @Request() req) {
    const material = await this.classMaterialService.create(dto, req.user.id);
    return { success: true, data: material };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update class material (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassMaterialDto,
  ) {
    const material = await this.classMaterialService.update(id, dto);
    return { success: true, data: material };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update material status (Admin)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaterialStatusDto,
    @Request() req,
  ) {
    const material = await this.classMaterialService.updateStatus(id, dto, req.user.id);
    return { success: true, data: material };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete class material (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.classMaterialService.delete(id);
    return { success: true, message: 'Material deleted' };
  }

  @Post('admin/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk action on materials (Admin)' })
  async bulkAction(@Body() dto: BulkMaterialActionDto, @Request() req) {
    const result = await this.classMaterialService.bulkAction(dto, req.user.id);
    return { success: true, ...result };
  }
}
