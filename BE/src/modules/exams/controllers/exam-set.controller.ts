import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { ExamSetService } from '../services/exam-set.service';
import { CreateExamSetDto } from '../dto/create-exam-set.dto';
import { UpdateExamSetDto } from '../dto/update-exam-set.dto';
import { ExamSetFilterDto } from '../dto/exam-set-filter.dto';
import { PaginationDto } from '../../../shared/dto/pagination.dto';

@ApiTags('Exam Sets')
@Controller('exam-sets')
export class ExamSetController {
  constructor(private readonly examSetService: ExamSetService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new exam set' })
  @ApiResponse({ status: 201, description: 'Exam set created' })
  async create(@Body() dto: CreateExamSetDto) {
    return this.examSetService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam sets with filters (admin)' })
  async findAll(@Query() filters: ExamSetFilterDto, @Query() pagination: PaginationDto) {
    return this.examSetService.findAll(filters, pagination);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get public/active exam sets' })
  async findPublic(@Query('level') level?: string) {
    return this.examSetService.findPublicExamSets(level);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam set statistics' })
  async getStats() {
    return this.examSetService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get exam set by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.examSetService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exam set' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateExamSetDto) {
    return this.examSetService.update(id, dto);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish exam set' })
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.examSetService.publish(id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish exam set' })
  async unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.examSetService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete exam set' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.examSetService.delete(id);
  }
}
