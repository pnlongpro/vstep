# BE-056: Exam Management Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-056 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-054 |

---

## 🎯 Objective

Implement admin exam management capabilities:
- CRUD exam sets with sections
- CRUD questions in bank
- Publish/unpublish exam sets
- Bulk import questions
- Clone exam sets

---

## 📝 Implementation

### 1. dto/exam-query.dto.ts

```typescript
import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class ExamSetQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ enum: ExamStatus })
  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class QuestionQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ 
    enum: ['multiple_choice', 'true_false', 'fill_blank', 'matching', 'essay', 'speaking_task'] 
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOrphan?: boolean; // Not linked to any exam

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
```

### 2. dto/create-exam.dto.ts

```typescript
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  label: string; // A, B, C, D

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ enum: ['multiple_choice', 'true_false', 'fill_blank', 'essay', 'speaking_task'] })
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({ type: [CreateOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleAnswer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsString()
  level: string;

  @ApiProperty({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  @IsString()
  skill: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(10)
  points?: number = 1;
}

export class CreateSectionDto {
  @ApiProperty({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  @IsString()
  skill: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  duration: number; // minutes

  @ApiProperty()
  @IsNumber()
  orderIndex: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionIds?: string[]; // Link existing questions
}

export class CreateExamSetDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsString()
  level: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  totalDuration: number; // minutes

  @ApiPropertyOptional({ type: [CreateSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}
```

### 3. services/admin-exams.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { ExamSetEntity } from '../../exams/entities/exam-set.entity';
import { ExamSectionEntity } from '../../exams/entities/exam-section.entity';
import { QuestionEntity } from '../../questions/entities/question.entity';
import { QuestionOptionEntity } from '../../questions/entities/question-option.entity';
import { AdminLogService } from './admin-logs.service';
import { ExamSetQueryDto, QuestionQueryDto, ExamStatus } from '../dto/exam-query.dto';
import { CreateExamSetDto, CreateQuestionDto } from '../dto/create-exam.dto';

@Injectable()
export class AdminExamsService {
  constructor(
    @InjectRepository(ExamSetEntity)
    private readonly examSetRepo: Repository<ExamSetEntity>,
    @InjectRepository(ExamSectionEntity)
    private readonly sectionRepo: Repository<ExamSectionEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(QuestionOptionEntity)
    private readonly optionRepo: Repository<QuestionOptionEntity>,
    private readonly adminLogService: AdminLogService
  ) {}

  // ========== EXAM SETS ==========

  async findAllExamSets(query: ExamSetQueryDto) {
    const { search, level, status, page, limit } = query;

    const qb = this.examSetRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.sections', 'section')
      .loadRelationCountAndMap('exam.attemptCount', 'exam.attempts');

    if (search) {
      qb.andWhere(
        '(exam.title ILIKE :search OR exam.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (level) {
      qb.andWhere('exam.level = :level', { level });
    }

    if (status) {
      qb.andWhere('exam.status = :status', { status });
    }

    qb.orderBy('exam.createdAt', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneExamSet(id: string) {
    const exam = await this.examSetRepo.findOne({
      where: { id },
      relations: ['sections', 'sections.questions', 'sections.questions.options'],
      order: {
        sections: {
          orderIndex: 'ASC',
          questions: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam set not found');
    }

    return exam;
  }

  async createExamSet(dto: CreateExamSetDto, adminId: string) {
    const exam = this.examSetRepo.create({
      title: dto.title,
      description: dto.description,
      level: dto.level,
      totalDuration: dto.totalDuration,
      status: ExamStatus.DRAFT,
    });

    const savedExam = await this.examSetRepo.save(exam);

    // Create sections if provided
    if (dto.sections?.length) {
      for (const sectionDto of dto.sections) {
        const section = this.sectionRepo.create({
          ...sectionDto,
          examSetId: savedExam.id,
        });

        const savedSection = await this.sectionRepo.save(section);

        // Link questions
        if (sectionDto.questionIds?.length) {
          await this.questionRepo.update(
            { id: In(sectionDto.questionIds) },
            { sectionId: savedSection.id }
          );
        }
      }
    }

    await this.adminLogService.log({
      adminId,
      action: 'exam.create',
      entityType: 'exam_set',
      entityId: savedExam.id,
      newData: { title: dto.title, level: dto.level },
    });

    return this.findOneExamSet(savedExam.id);
  }

  async updateExamSet(id: string, dto: Partial<CreateExamSetDto>, adminId: string) {
    const exam = await this.examSetRepo.findOne({ where: { id } });

    if (!exam) {
      throw new NotFoundException('Exam set not found');
    }

    if (exam.status === ExamStatus.PUBLISHED) {
      throw new BadRequestException('Cannot edit published exam. Unpublish first.');
    }

    const oldData = { ...exam };

    Object.assign(exam, dto);
    await this.examSetRepo.save(exam);

    await this.adminLogService.log({
      adminId,
      action: 'exam.update',
      entityType: 'exam_set',
      entityId: id,
      oldData,
      newData: dto,
    });

    return this.findOneExamSet(id);
  }

  async publishExamSet(id: string, adminId: string) {
    const exam = await this.findOneExamSet(id);

    if (exam.status === ExamStatus.PUBLISHED) {
      throw new BadRequestException('Exam is already published');
    }

    // Validate exam has sections and questions
    if (!exam.sections?.length) {
      throw new BadRequestException('Exam must have at least one section');
    }

    const totalQuestions = exam.sections.reduce(
      (sum, s) => sum + (s.questions?.length || 0),
      0
    );

    if (totalQuestions === 0) {
      throw new BadRequestException('Exam must have at least one question');
    }

    exam.status = ExamStatus.PUBLISHED;
    exam.publishedAt = new Date();
    await this.examSetRepo.save(exam);

    await this.adminLogService.log({
      adminId,
      action: 'exam.publish',
      entityType: 'exam_set',
      entityId: id,
    });

    return { success: true, message: 'Exam published successfully' };
  }

  async unpublishExamSet(id: string, adminId: string) {
    const exam = await this.examSetRepo.findOne({ where: { id } });

    if (!exam) {
      throw new NotFoundException('Exam set not found');
    }

    if (exam.status !== ExamStatus.PUBLISHED) {
      throw new BadRequestException('Exam is not published');
    }

    exam.status = ExamStatus.DRAFT;
    await this.examSetRepo.save(exam);

    await this.adminLogService.log({
      adminId,
      action: 'exam.unpublish',
      entityType: 'exam_set',
      entityId: id,
    });

    return { success: true, message: 'Exam unpublished' };
  }

  async deleteExamSet(id: string, adminId: string) {
    const exam = await this.examSetRepo.findOne({ where: { id } });

    if (!exam) {
      throw new NotFoundException('Exam set not found');
    }

    // Soft delete
    await this.examSetRepo.softDelete(id);

    await this.adminLogService.log({
      adminId,
      action: 'exam.delete',
      entityType: 'exam_set',
      entityId: id,
      oldData: { title: exam.title },
    });

    return { success: true };
  }

  async cloneExamSet(id: string, adminId: string) {
    const original = await this.findOneExamSet(id);

    // Clone exam set
    const clone = this.examSetRepo.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      level: original.level,
      totalDuration: original.totalDuration,
      status: ExamStatus.DRAFT,
    });

    const savedClone = await this.examSetRepo.save(clone);

    // Clone sections and link questions
    for (const section of original.sections) {
      const sectionClone = this.sectionRepo.create({
        skill: section.skill,
        title: section.title,
        instructions: section.instructions,
        passage: section.passage,
        audioUrl: section.audioUrl,
        duration: section.duration,
        orderIndex: section.orderIndex,
        examSetId: savedClone.id,
      });

      await this.sectionRepo.save(sectionClone);

      // Note: Questions are shared, not cloned
      // If you want to clone questions too, add that logic here
    }

    await this.adminLogService.log({
      adminId,
      action: 'exam.clone',
      entityType: 'exam_set',
      entityId: savedClone.id,
      newData: { originalId: id, newId: savedClone.id },
    });

    return this.findOneExamSet(savedClone.id);
  }

  // ========== QUESTIONS ==========

  async findAllQuestions(query: QuestionQueryDto) {
    const { search, skill, level, type, isOrphan, page, limit } = query;

    const qb = this.questionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.options', 'option');

    if (search) {
      qb.andWhere('q.text ILIKE :search', { search: `%${search}%` });
    }

    if (skill) {
      qb.andWhere('q.skill = :skill', { skill });
    }

    if (level) {
      qb.andWhere('q.level = :level', { level });
    }

    if (type) {
      qb.andWhere('q.type = :type', { type });
    }

    if (isOrphan) {
      qb.andWhere('q.sectionId IS NULL');
    }

    qb.orderBy('q.createdAt', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createQuestion(dto: CreateQuestionDto, adminId: string) {
    const question = this.questionRepo.create({
      type: dto.type,
      text: dto.text,
      passage: dto.passage,
      audioUrl: dto.audioUrl,
      correctAnswer: dto.correctAnswer,
      sampleAnswer: dto.sampleAnswer,
      explanation: dto.explanation,
      level: dto.level,
      skill: dto.skill,
      points: dto.points || 1,
    });

    const savedQuestion = await this.questionRepo.save(question);

    // Create options
    if (dto.options?.length) {
      const options = dto.options.map((o, idx) =>
        this.optionRepo.create({
          ...o,
          questionId: savedQuestion.id,
          orderIndex: idx,
        })
      );
      await this.optionRepo.save(options);
    }

    await this.adminLogService.log({
      adminId,
      action: 'question.create',
      entityType: 'question',
      entityId: savedQuestion.id,
      newData: { type: dto.type, skill: dto.skill, level: dto.level },
    });

    return this.questionRepo.findOne({
      where: { id: savedQuestion.id },
      relations: ['options'],
    });
  }

  async updateQuestion(id: string, dto: Partial<CreateQuestionDto>, adminId: string) {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const oldData = { ...question };

    Object.assign(question, dto);
    await this.questionRepo.save(question);

    // Update options if provided
    if (dto.options) {
      // Delete old options
      await this.optionRepo.delete({ questionId: id });

      // Create new options
      const options = dto.options.map((o, idx) =>
        this.optionRepo.create({
          ...o,
          questionId: id,
          orderIndex: idx,
        })
      );
      await this.optionRepo.save(options);
    }

    await this.adminLogService.log({
      adminId,
      action: 'question.update',
      entityType: 'question',
      entityId: id,
      oldData,
      newData: dto,
    });

    return this.questionRepo.findOne({
      where: { id },
      relations: ['options'],
    });
  }

  async deleteQuestion(id: string, adminId: string) {
    const question = await this.questionRepo.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.questionRepo.softDelete(id);

    await this.adminLogService.log({
      adminId,
      action: 'question.delete',
      entityType: 'question',
      entityId: id,
      oldData: { text: question.text?.substring(0, 100) },
    });

    return { success: true };
  }

  async bulkImportQuestions(file: Express.Multer.File, adminId: string) {
    // Parse CSV/Excel file
    // Validate each row
    // Create questions in batch
    // Return import result

    // This is a placeholder - actual implementation depends on file format
    return {
      success: true,
      imported: 0,
      errors: [],
    };
  }

  // ========== STATS ==========

  async getStats() {
    const totalExams = await this.examSetRepo.count();
    const publishedExams = await this.examSetRepo.count({
      where: { status: ExamStatus.PUBLISHED },
    });
    const totalQuestions = await this.questionRepo.count();

    // Questions by skill
    const questionsBySkill = await this.questionRepo
      .createQueryBuilder('q')
      .select('q.skill', 'skill')
      .addSelect('COUNT(*)', 'count')
      .groupBy('q.skill')
      .getRawMany();

    return {
      totalExams,
      publishedExams,
      draftExams: totalExams - publishedExams,
      totalQuestions,
      questionsBySkill,
    };
  }
}
```

### 4. controllers/admin-exams.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { AdminPermission } from '../enums/admin-permissions.enum';
import { AdminExamsService } from '../services/admin-exams.service';
import { ExamSetQueryDto, QuestionQueryDto } from '../dto/exam-query.dto';
import { CreateExamSetDto, CreateQuestionDto } from '../dto/create-exam.dto';

@ApiTags('Admin - Exams')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminExamsController {
  constructor(private readonly examsService: AdminExamsService) {}

  // ========== EXAM SETS ==========

  @Get('exam-sets')
  @ApiOperation({ summary: 'List exam sets' })
  @RequirePermissions(AdminPermission.VIEW_EXAMS)
  findAllExamSets(@Query() query: ExamSetQueryDto) {
    return this.examsService.findAllExamSets(query);
  }

  @Get('exam-sets/stats')
  @ApiOperation({ summary: 'Get exam statistics' })
  @RequirePermissions(AdminPermission.VIEW_EXAMS)
  getStats() {
    return this.examsService.getStats();
  }

  @Get('exam-sets/:id')
  @ApiOperation({ summary: 'Get exam set details' })
  @RequirePermissions(AdminPermission.VIEW_EXAMS)
  findOneExamSet(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.findOneExamSet(id);
  }

  @Post('exam-sets')
  @ApiOperation({ summary: 'Create exam set' })
  @RequirePermissions(AdminPermission.CREATE_EXAMS)
  createExamSet(@Body() dto: CreateExamSetDto, @Req() req: any) {
    return this.examsService.createExamSet(dto, req.user.id);
  }

  @Put('exam-sets/:id')
  @ApiOperation({ summary: 'Update exam set' })
  @RequirePermissions(AdminPermission.EDIT_EXAMS)
  updateExamSet(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateExamSetDto>,
    @Req() req: any
  ) {
    return this.examsService.updateExamSet(id, dto, req.user.id);
  }

  @Post('exam-sets/:id/publish')
  @ApiOperation({ summary: 'Publish exam set' })
  @RequirePermissions(AdminPermission.PUBLISH_EXAMS)
  publishExamSet(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.examsService.publishExamSet(id, req.user.id);
  }

  @Post('exam-sets/:id/unpublish')
  @ApiOperation({ summary: 'Unpublish exam set' })
  @RequirePermissions(AdminPermission.PUBLISH_EXAMS)
  unpublishExamSet(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.examsService.unpublishExamSet(id, req.user.id);
  }

  @Post('exam-sets/:id/clone')
  @ApiOperation({ summary: 'Clone exam set' })
  @RequirePermissions(AdminPermission.CREATE_EXAMS)
  cloneExamSet(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.examsService.cloneExamSet(id, req.user.id);
  }

  @Delete('exam-sets/:id')
  @ApiOperation({ summary: 'Delete exam set' })
  @RequirePermissions(AdminPermission.DELETE_EXAMS)
  deleteExamSet(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.examsService.deleteExamSet(id, req.user.id);
  }

  // ========== QUESTIONS ==========

  @Get('questions')
  @ApiOperation({ summary: 'List questions' })
  @RequirePermissions(AdminPermission.VIEW_EXAMS)
  findAllQuestions(@Query() query: QuestionQueryDto) {
    return this.examsService.findAllQuestions(query);
  }

  @Post('questions')
  @ApiOperation({ summary: 'Create question' })
  @RequirePermissions(AdminPermission.CREATE_EXAMS)
  createQuestion(@Body() dto: CreateQuestionDto, @Req() req: any) {
    return this.examsService.createQuestion(dto, req.user.id);
  }

  @Put('questions/:id')
  @ApiOperation({ summary: 'Update question' })
  @RequirePermissions(AdminPermission.EDIT_EXAMS)
  updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateQuestionDto>,
    @Req() req: any
  ) {
    return this.examsService.updateQuestion(id, dto, req.user.id);
  }

  @Delete('questions/:id')
  @ApiOperation({ summary: 'Delete question' })
  @RequirePermissions(AdminPermission.DELETE_EXAMS)
  deleteQuestion(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.examsService.deleteQuestion(id, req.user.id);
  }

  @Post('questions/import')
  @ApiOperation({ summary: 'Bulk import questions' })
  @ApiConsumes('multipart/form-data')
  @RequirePermissions(AdminPermission.IMPORT_QUESTIONS)
  @UseInterceptors(FileInterceptor('file'))
  bulkImport(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.examsService.bulkImportQuestions(file, req.user.id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] List exam sets with filters
- [ ] Create exam set with sections
- [ ] Update exam set (draft only)
- [ ] Publish exam set (validates content)
- [ ] Unpublish exam set
- [ ] Delete exam set (soft delete)
- [ ] Clone exam set
- [ ] List questions with filters
- [ ] Create question with options
- [ ] Update question
- [ ] Delete question
- [ ] Bulk import questions (CSV)
- [ ] All actions logged

---

## 🧪 Test Cases

```typescript
describe('AdminExamsController', () => {
  it('creates exam set successfully', async () => {
    // POST /admin/exam-sets with valid data
    // Verify exam created
  });

  it('prevents editing published exam', async () => {
    // Publish exam
    // Try to update
    // Verify 400 error
  });

  it('validates exam before publish', async () => {
    // Create exam without questions
    // Try to publish
    // Verify validation error
  });

  it('clones exam set correctly', async () => {
    // Clone exam
    // Verify new exam created
    // Verify sections cloned
  });

  it('bulk imports questions', async () => {
    // Upload CSV file
    // Verify questions created
  });
});
```
