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
  Headers,
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
import { StudyMaterialService } from '../services/study-material.service';
import {
  StudyMaterialFilterDto,
  CreateStudyMaterialDto,
  UpdateStudyMaterialDto,
  UpdateMaterialStatusDto,
  RateMaterialDto,
  StudyMaterialListResponseDto,
  DocumentStatisticsDto,
} from '../dto/study-material.dto';

@ApiTags('Study Materials')
@Controller('documents/study')
export class StudyMaterialController {
  constructor(private readonly studyMaterialService: StudyMaterialService) {}

  // ========== Public Endpoints ==========

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published study materials' })
  @ApiResponse({ status: 200, type: StudyMaterialListResponseDto })
  async findAll(@Query() filter: StudyMaterialFilterDto) {
    return this.studyMaterialService.findAllPublic(filter);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get study material by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const material = await this.studyMaterialService.findById(id);
    
    // Track view
    await this.studyMaterialService.incrementView(id, req.user?.id, ip, userAgent);

    return {
      success: true,
      data: material,
    };
  }

  @Post(':id/download')
  @Public()
  @ApiOperation({ summary: 'Track document download' })
  async trackDownload(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Ip() ip: string,
  ) {
    await this.studyMaterialService.incrementDownload(id, req.user?.id, ip);
    return { success: true };
  }

  // ========== Authenticated Endpoints ==========

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate a study material' })
  async rate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RateMaterialDto,
    @Request() req,
  ) {
    await this.studyMaterialService.rateMaterial(id, req.user.id, dto);
    return { success: true, message: 'Rating submitted' };
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle bookmark on material' })
  async toggleBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    const isBookmarked = await this.studyMaterialService.toggleBookmark(id, req.user.id);
    return {
      success: true,
      isBookmarked,
      message: isBookmarked ? 'Bookmarked' : 'Unbookmarked',
    };
  }

  @Get('user/bookmarks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bookmarked materials' })
  async getBookmarks(@Request() req) {
    const bookmarks = await this.studyMaterialService.getBookmarks(req.user.id);
    return { success: true, data: bookmarks };
  }

  // ========== Admin Endpoints ==========

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all study materials (Admin)' })
  async findAllAdmin(@Query() filter: StudyMaterialFilterDto) {
    return this.studyMaterialService.findAllAdmin(filter);
  }

  @Get('admin/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get document statistics (Admin)' })
  @ApiResponse({ status: 200, type: DocumentStatisticsDto })
  async getStatistics() {
    return this.studyMaterialService.getStatistics();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create study material (Admin)' })
  async create(@Body() dto: CreateStudyMaterialDto, @Request() req) {
    const material = await this.studyMaterialService.create(dto, req.user.id);
    return { success: true, data: material };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update study material (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudyMaterialDto,
    @Request() req,
  ) {
    const material = await this.studyMaterialService.update(id, dto, req.user.id);
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
    const material = await this.studyMaterialService.updateStatus(id, dto, req.user.id);
    return { success: true, data: material };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete study material (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.studyMaterialService.delete(id);
    return { success: true, message: 'Material deleted' };
  }
}
