import { Controller, Get, Post, Body, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { QuestionImportExportService, QuestionExportData } from '../services/question-import-export.service';
import { Skill, VstepLevel } from '../../../shared/enums/exam.enum';

@ApiTags('Question Import/Export')
@Controller('questions/import-export')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuestionImportExportController {
  constructor(private readonly importExportService: QuestionImportExportService) {}

  @Get('export/json')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Export questions to JSON' })
  async exportToJson(
    @Query('skill') skill?: Skill,
    @Query('level') level?: VstepLevel,
    @Query('limit') limit?: number,
  ) {
    return this.importExportService.exportToJson({ skill, level, limit: limit ? Number(limit) : undefined });
  }

  @Get('export/csv')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Export questions to CSV' })
  async exportToCsv(
    @Res() res: Response,
    @Query('skill') skill?: Skill,
    @Query('level') level?: VstepLevel,
    @Query('limit') limit?: number,
  ) {
    const csv = await this.importExportService.exportToCsv({ skill, level, limit: limit ? Number(limit) : undefined });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=questions.csv');
    res.send(csv);
  }

  @Post('import/json')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Import questions from JSON' })
  async importFromJson(@Body() data: QuestionExportData[]) {
    return this.importExportService.importFromJson(data);
  }

  @Post('import/csv')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Import questions from CSV' })
  async importFromCsv(@Body('csv') csvContent: string) {
    return this.importExportService.importFromCsv(csvContent);
  }
}
