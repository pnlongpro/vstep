import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { SectionPassageService } from '../services/section-passage.service';
import { CreateSectionDto } from '../dto/create-section.dto';
import { UpdateSectionDto } from '../dto/update-section.dto';
import { CreatePassageDto } from '../dto/create-passage.dto';
import { UpdatePassageDto } from '../dto/update-passage.dto';

@ApiTags('Sections & Passages')
@Controller('exam-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SectionPassageController {
  constructor(private readonly service: SectionPassageService) {}

  // Section endpoints

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new section' })
  async createSection(@Body() dto: CreateSectionDto) {
    return this.service.createSection(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section by ID' })
  async findSectionById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findSectionById(id);
  }

  @Get('exam-set/:examSetId')
  @ApiOperation({ summary: 'Get sections by exam set' })
  async findSectionsByExamSet(@Param('examSetId', ParseUUIDPipe) examSetId: string) {
    return this.service.findSectionsByExamSet(examSetId);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update section' })
  async updateSection(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSectionDto) {
    return this.service.updateSection(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete section' })
  async deleteSection(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteSection(id);
  }

  @Post('exam-set/:examSetId/reorder')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Reorder sections' })
  async reorderSections(
    @Param('examSetId', ParseUUIDPipe) examSetId: string,
    @Body('sectionIds') sectionIds: string[],
  ) {
    return this.service.reorderSections(examSetId, sectionIds);
  }

  // Passage endpoints

  @Post('passages')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create a new passage' })
  async createPassage(@Body() dto: CreatePassageDto) {
    return this.service.createPassage(dto);
  }

  @Get('passages/:id')
  @ApiOperation({ summary: 'Get passage by ID' })
  async findPassageById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPassageById(id);
  }

  @Get(':sectionId/passages')
  @ApiOperation({ summary: 'Get passages by section' })
  async findPassagesBySection(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    return this.service.findPassagesBySection(sectionId);
  }

  @Put('passages/:id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update passage' })
  async updatePassage(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePassageDto) {
    return this.service.updatePassage(id, dto);
  }

  @Delete('passages/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete passage' })
  async deletePassage(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deletePassage(id);
  }
}
