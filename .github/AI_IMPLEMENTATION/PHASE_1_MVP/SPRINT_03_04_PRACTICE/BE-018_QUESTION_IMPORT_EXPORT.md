# BE-018: Question Import/Export

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-018 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010, BE-012 |

---

## 🎯 Objective

Implement Question Import/Export Service với:
- Import questions từ Excel/CSV
- Export questions ra Excel/CSV
- Validation và error reporting
- Bulk import với progress tracking

---

## 💻 Implementation

### Step 1: Import/Export DTOs

```typescript
// src/modules/exams/dto/import-export.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillType, VstepLevel, QuestionType } from '@/shared/enums/practice.enums';

export enum ImportFormat {
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export class ImportQuestionsDto {
  @ApiProperty({ enum: ImportFormat })
  @IsEnum(ImportFormat)
  format: ImportFormat;

  @ApiPropertyOptional({ enum: SkillType })
  @IsOptional()
  @IsEnum(SkillType)
  defaultSkill?: SkillType;

  @ApiPropertyOptional({ enum: VstepLevel })
  @IsOptional()
  @IsEnum(VstepLevel)
  defaultLevel?: VstepLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  validateOnly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  examSetId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sectionId?: string;
}

export class ExportQuestionsDto {
  @ApiProperty({ enum: ImportFormat })
  @IsEnum(ImportFormat)
  format: ImportFormat;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionIds?: string[];

  @ApiPropertyOptional({ enum: SkillType })
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;

  @ApiPropertyOptional({ enum: VstepLevel })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includePassages?: boolean;
}

// Result DTOs
export class ImportResultDto {
  success: boolean;
  totalRows: number;
  importedCount: number;
  errorCount: number;
  errors: ImportErrorDto[];
  questionIds: string[];
}

export class ImportErrorDto {
  row: number;
  column?: string;
  value?: string;
  message: string;
}

export class ImportProgressDto {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  result?: ImportResultDto;
}
```

### Step 2: Question Row Interface

```typescript
// src/modules/exams/interfaces/question-row.interface.ts
export interface QuestionRowData {
  // Required fields
  type: string;
  skill: string;
  level: string;
  content: string;

  // Optional fields
  passageTitle?: string;
  passageContent?: string;
  audioUrl?: string;
  imageUrl?: string;
  
  // Options (for multiple choice)
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOption?: string; // A, B, C, or D
  
  // For other question types
  correctAnswer?: string;
  acceptableAnswers?: string; // comma-separated
  
  // Metadata
  explanation?: string;
  hint?: string;
  difficulty?: number;
  tags?: string; // comma-separated
  points?: number;
}

export const COLUMN_MAPPINGS: Record<string, keyof QuestionRowData> = {
  'Type': 'type',
  'Question Type': 'type',
  'Skill': 'skill',
  'Level': 'level',
  'Content': 'content',
  'Question': 'content',
  'Passage Title': 'passageTitle',
  'Passage Content': 'passageContent',
  'Passage': 'passageContent',
  'Audio URL': 'audioUrl',
  'Audio': 'audioUrl',
  'Image URL': 'imageUrl',
  'Image': 'imageUrl',
  'Option A': 'optionA',
  'A': 'optionA',
  'Option B': 'optionB',
  'B': 'optionB',
  'Option C': 'optionC',
  'C': 'optionC',
  'Option D': 'optionD',
  'D': 'optionD',
  'Correct Option': 'correctOption',
  'Correct': 'correctOption',
  'Answer': 'correctAnswer',
  'Correct Answer': 'correctAnswer',
  'Acceptable Answers': 'acceptableAnswers',
  'Explanation': 'explanation',
  'Hint': 'hint',
  'Difficulty': 'difficulty',
  'Tags': 'tags',
  'Points': 'points',
};
```

### Step 3: Import/Export Service

```typescript
// src/modules/exams/services/import-export.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { Question } from '../entities/question.entity';
import { QuestionOption } from '../entities/question-option.entity';
import { SectionPassage } from '../entities/section-passage.entity';
import { QuestionTag } from '../entities/question-tag.entity';
import { 
  ImportQuestionsDto, 
  ExportQuestionsDto, 
  ImportResultDto,
  ImportErrorDto,
  ImportProgressDto,
} from '../dto/import-export.dto';
import { QuestionRowData, COLUMN_MAPPINGS } from '../interfaces/question-row.interface';
import { CacheService } from '@/core/cache/cache.service';

@Injectable()
export class ImportExportService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(SectionPassage)
    private readonly passageRepository: Repository<SectionPassage>,
    @InjectRepository(QuestionTag)
    private readonly tagRepository: Repository<QuestionTag>,
    private readonly dataSource: DataSource,
    @InjectQueue('import-questions')
    private readonly importQueue: Queue,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Parse file and import questions
   */
  async importQuestions(
    file: Express.Multer.File,
    dto: ImportQuestionsDto,
    userId: string,
  ): Promise<ImportResultDto | ImportProgressDto> {
    // Parse file based on format
    const rows = await this.parseFile(file, dto.format);

    if (rows.length === 0) {
      throw new BadRequestException('File contains no data');
    }

    // For small imports, process immediately
    if (rows.length <= 100) {
      return this.processImport(rows, dto);
    }

    // For large imports, queue the job
    const job = await this.importQueue.add('import', {
      rows,
      dto,
      userId,
    });

    return {
      jobId: job.id.toString(),
      status: 'pending',
      progress: 0,
      totalRows: rows.length,
      processedRows: 0,
    };
  }

  /**
   * Parse file to row data
   */
  private async parseFile(
    file: Express.Multer.File,
    format: string,
  ): Promise<QuestionRowData[]> {
    const buffer = file.buffer;

    switch (format) {
      case 'excel':
        return this.parseExcel(buffer);
      case 'csv':
        return this.parseCsv(buffer.toString('utf-8'));
      case 'json':
        return JSON.parse(buffer.toString('utf-8'));
      default:
        throw new BadRequestException(`Unsupported format: ${format}`);
    }
  }

  /**
   * Parse Excel file
   */
  private parseExcel(buffer: Buffer): QuestionRowData[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      throw new BadRequestException('Excel file must have header row and at least one data row');
    }

    const headers = (jsonData[0] as string[]).map(h => 
      COLUMN_MAPPINGS[h?.trim()] || h?.toLowerCase().replace(/\s+/g, '')
    );

    return jsonData.slice(1).map((row: any[]) => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        if (header && row[index] !== undefined) {
          rowData[header] = row[index];
        }
      });
      return rowData as QuestionRowData;
    });
  }

  /**
   * Parse CSV file
   */
  private parseCsv(content: string): QuestionRowData[] {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        return COLUMN_MAPPINGS[header.trim()] || header.toLowerCase().replace(/\s+/g, '');
      },
    });

    if (result.errors.length > 0) {
      throw new BadRequestException(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
    }

    return result.data as QuestionRowData[];
  }

  /**
   * Process import synchronously
   */
  async processImport(
    rows: QuestionRowData[],
    dto: ImportQuestionsDto,
  ): Promise<ImportResultDto> {
    const errors: ImportErrorDto[] = [];
    const questionIds: string[] = [];
    let importedCount = 0;

    // Validate all rows first
    const validatedRows = rows.map((row, index) => ({
      row,
      rowNumber: index + 2, // +2 for 1-indexed and header row
      errors: this.validateRow(row, dto),
    }));

    if (dto.validateOnly) {
      const validationErrors = validatedRows
        .filter(v => v.errors.length > 0)
        .flatMap(v => v.errors.map(e => ({ ...e, row: v.rowNumber })));

      return {
        success: validationErrors.length === 0,
        totalRows: rows.length,
        importedCount: 0,
        errorCount: validationErrors.length,
        errors: validationErrors,
        questionIds: [],
      };
    }

    // Use transaction for import
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Group rows by passage for batch processing
      const passageGroups = this.groupByPassage(validatedRows);

      for (const group of passageGroups) {
        // Create passage if needed
        let passageId: string | null = null;
        
        if (group.passageTitle && group.passageContent) {
          const passage = this.passageRepository.create({
            title: group.passageTitle,
            content: group.passageContent,
            sectionId: dto.sectionId,
          });
          const savedPassage = await queryRunner.manager.save(passage);
          passageId = savedPassage.id;
        }

        // Import questions
        for (const item of group.items) {
          if (item.errors.length > 0) {
            errors.push(...item.errors.map(e => ({ ...e, row: item.rowNumber })));
            continue;
          }

          try {
            const question = await this.createQuestionFromRow(
              queryRunner.manager,
              item.row,
              dto,
              passageId,
            );
            questionIds.push(question.id);
            importedCount++;
          } catch (error) {
            errors.push({
              row: item.rowNumber,
              message: error.message,
            });
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return {
      success: errors.length === 0,
      totalRows: rows.length,
      importedCount,
      errorCount: errors.length,
      errors,
      questionIds,
    };
  }

  /**
   * Validate a single row
   */
  private validateRow(row: QuestionRowData, dto: ImportQuestionsDto): ImportErrorDto[] {
    const errors: ImportErrorDto[] = [];

    // Required fields
    if (!row.type && !row.content) {
      errors.push({ row: 0, column: 'type', message: 'Question type is required' });
    }

    if (!row.content) {
      errors.push({ row: 0, column: 'content', message: 'Question content is required' });
    }

    // Validate skill and level
    const skill = row.skill || dto.defaultSkill;
    const level = row.level || dto.defaultLevel;

    if (!skill) {
      errors.push({ row: 0, column: 'skill', message: 'Skill is required' });
    }

    if (!level) {
      errors.push({ row: 0, column: 'level', message: 'Level is required' });
    }

    // Validate multiple choice has options
    if (row.type === 'multiple_choice') {
      if (!row.optionA || !row.optionB) {
        errors.push({ row: 0, column: 'options', message: 'Multiple choice requires at least 2 options' });
      }
      if (!row.correctOption) {
        errors.push({ row: 0, column: 'correctOption', message: 'Correct option is required' });
      }
    }

    return errors;
  }

  /**
   * Group rows by passage
   */
  private groupByPassage(rows: any[]): any[] {
    const groups: Map<string, any> = new Map();

    for (const row of rows) {
      const key = row.row.passageTitle || 'no-passage';
      
      if (!groups.has(key)) {
        groups.set(key, {
          passageTitle: row.row.passageTitle,
          passageContent: row.row.passageContent,
          items: [],
        });
      }
      
      groups.get(key).items.push(row);
    }

    return Array.from(groups.values());
  }

  /**
   * Create question from row data
   */
  private async createQuestionFromRow(
    manager: any,
    row: QuestionRowData,
    dto: ImportQuestionsDto,
    passageId: string | null,
  ): Promise<Question> {
    const question = this.questionRepository.create({
      type: row.type as any,
      skill: (row.skill || dto.defaultSkill) as any,
      level: (row.level || dto.defaultLevel) as any,
      content: row.content,
      explanation: row.explanation,
      hint: row.hint,
      difficulty: row.difficulty || 1,
      points: row.points || 1,
      passageId,
      audioUrl: row.audioUrl,
      imageUrl: row.imageUrl,
    });

    const savedQuestion = await manager.save(Question, question);

    // Create options for multiple choice
    if (row.type === 'multiple_choice') {
      const options = [
        { label: 'A', text: row.optionA, isCorrect: row.correctOption === 'A' },
        { label: 'B', text: row.optionB, isCorrect: row.correctOption === 'B' },
        { label: 'C', text: row.optionC, isCorrect: row.correctOption === 'C' },
        { label: 'D', text: row.optionD, isCorrect: row.correctOption === 'D' },
      ].filter(o => o.text);

      for (let i = 0; i < options.length; i++) {
        const option = this.optionRepository.create({
          ...options[i],
          questionId: savedQuestion.id,
          orderIndex: i + 1,
        });
        await manager.save(QuestionOption, option);
      }
    } else if (row.correctAnswer) {
      // Store correct answer in metadata
      savedQuestion.metadata = {
        ...savedQuestion.metadata,
        correctAnswer: row.correctAnswer,
        acceptableAnswers: row.acceptableAnswers?.split(',').map(a => a.trim()),
      };
      await manager.save(Question, savedQuestion);
    }

    // Create tags
    if (row.tags) {
      const tagNames = row.tags.split(',').map(t => t.trim());
      for (const tagName of tagNames) {
        let tag = await manager.findOne(QuestionTag, { where: { name: tagName } });
        if (!tag) {
          tag = await manager.save(QuestionTag, { name: tagName });
        }
        // Link question to tag (many-to-many)
      }
    }

    return savedQuestion;
  }

  /**
   * Export questions to file
   */
  async exportQuestions(dto: ExportQuestionsDto): Promise<Buffer> {
    // Build query
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.passage', 'passage');

    if (dto.questionIds?.length) {
      query.whereInIds(dto.questionIds);
    }

    if (dto.skill) {
      query.andWhere('question.skill = :skill', { skill: dto.skill });
    }

    if (dto.level) {
      query.andWhere('question.level = :level', { level: dto.level });
    }

    const questions = await query.getMany();

    // Convert to export format
    const rows = questions.map(q => this.questionToExportRow(q, dto.includePassages));

    switch (dto.format) {
      case 'excel':
        return this.generateExcel(rows);
      case 'csv':
        return Buffer.from(this.generateCsv(rows));
      case 'json':
        return Buffer.from(JSON.stringify(rows, null, 2));
      default:
        throw new BadRequestException(`Unsupported format: ${dto.format}`);
    }
  }

  /**
   * Convert question to export row
   */
  private questionToExportRow(question: Question, includePassage: boolean): any {
    const row: any = {
      'Type': question.type,
      'Skill': question.skill,
      'Level': question.level,
      'Content': question.content,
      'Explanation': question.explanation,
      'Hint': question.hint,
      'Difficulty': question.difficulty,
      'Points': question.points,
    };

    if (includePassage && question.passage) {
      row['Passage Title'] = question.passage.title;
      row['Passage Content'] = question.passage.content;
    }

    // Add options
    if (question.options?.length) {
      const sortedOptions = question.options.sort((a, b) => a.orderIndex - b.orderIndex);
      sortedOptions.forEach(opt => {
        row[`Option ${opt.label}`] = opt.text;
        if (opt.isCorrect) {
          row['Correct Option'] = opt.label;
        }
      });
    }

    return row;
  }

  /**
   * Generate Excel file
   */
  private generateExcel(rows: any[]): Buffer {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate CSV string
   */
  private generateCsv(rows: any[]): string {
    return Papa.unparse(rows);
  }

  /**
   * Get import job status
   */
  async getImportStatus(jobId: string): Promise<ImportProgressDto> {
    const job = await this.importQueue.getJob(jobId);
    
    if (!job) {
      throw new BadRequestException(`Import job ${jobId} not found`);
    }

    const state = await job.getState();
    const progress = job.progress() || 0;

    return {
      jobId,
      status: state as any,
      progress: typeof progress === 'number' ? progress : 0,
      totalRows: job.data.rows.length,
      processedRows: Math.floor((typeof progress === 'number' ? progress : 0) * job.data.rows.length / 100),
      result: state === 'completed' ? job.returnvalue : undefined,
    };
  }

  /**
   * Download template file
   */
  async downloadTemplate(format: string): Promise<Buffer> {
    const templateRows = [
      {
        'Type': 'multiple_choice',
        'Skill': 'reading',
        'Level': 'B2',
        'Content': 'What is the main idea of the passage?',
        'Passage Title': 'Sample Passage',
        'Passage Content': 'This is a sample passage for Reading comprehension...',
        'Option A': 'First option',
        'Option B': 'Second option',
        'Option C': 'Third option',
        'Option D': 'Fourth option',
        'Correct Option': 'A',
        'Explanation': 'The answer is A because...',
        'Difficulty': 3,
        'Tags': 'main-idea,reading-comprehension',
      },
      {
        'Type': 'fill_blank',
        'Skill': 'listening',
        'Level': 'B1',
        'Content': 'The speaker mentioned that the event will take place on ____.',
        'Audio URL': 'https://example.com/audio.mp3',
        'Correct Answer': 'Friday',
        'Acceptable Answers': 'Friday,friday,FRIDAY',
        'Difficulty': 2,
      },
    ];

    switch (format) {
      case 'excel':
        return this.generateExcel(templateRows);
      case 'csv':
        return Buffer.from(this.generateCsv(templateRows));
      default:
        throw new BadRequestException('Template only available in Excel or CSV format');
    }
  }
}
```

### Step 4: Import Controller

```typescript
// src/modules/exams/controllers/import-export.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { ImportExportService } from '../services/import-export.service';
import { ImportQuestionsDto, ExportQuestionsDto } from '../dto';

@ApiTags('Question Import/Export')
@Controller('questions/import-export')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'teacher')
@ApiBearerAuth()
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import questions from file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importQuestions(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ImportQuestionsDto,
    @CurrentUser() user: User,
  ) {
    return this.importExportService.importQuestions(file, dto, user.id);
  }

  @Get('import/status/:jobId')
  @ApiOperation({ summary: 'Get import job status' })
  async getImportStatus(@Param('jobId') jobId: string) {
    return this.importExportService.getImportStatus(jobId);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export questions to file' })
  async exportQuestions(
    @Body() dto: ExportQuestionsDto,
    @Res() res: Response,
  ) {
    const buffer = await this.importExportService.exportQuestions(dto);

    const filename = `questions-export-${Date.now()}`;
    const contentType = dto.format === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : dto.format === 'csv' 
        ? 'text/csv' 
        : 'application/json';

    const extension = dto.format === 'excel' ? 'xlsx' : dto.format;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.${extension}`);
    res.send(buffer);
  }

  @Get('template')
  @ApiOperation({ summary: 'Download import template' })
  async downloadTemplate(
    @Query('format') format: string = 'excel',
    @Res() res: Response,
  ) {
    const buffer = await this.importExportService.downloadTemplate(format);

    const extension = format === 'excel' ? 'xlsx' : format;
    const contentType = format === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=question-import-template.${extension}`);
    res.send(buffer);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Excel import parses correctly
- [ ] CSV import parses correctly  
- [ ] Validation returns clear errors
- [ ] Large imports use job queue
- [ ] Export generates valid files
- [ ] Template includes all columns

---

## ⏭️ Next Task

→ `BE-019_PRACTICE_CACHING.md` - Practice Caching Strategy
