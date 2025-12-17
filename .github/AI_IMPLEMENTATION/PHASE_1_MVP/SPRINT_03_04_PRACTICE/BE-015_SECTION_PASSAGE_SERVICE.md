# BE-015: Section & Passage Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-015 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010, BE-014 |

---

## 🎯 Objective

Implement Section and Passage services với:
- CRUD cho exam sections
- CRUD cho section passages
- Question ordering/reordering
- Audio file management cho Listening sections

---

## 💻 Implementation

### Step 1: Section DTOs

```typescript
// src/modules/exams/dto/create-section.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillType } from '@/shared/enums/practice.enums';

export class CreateSectionDto {
  @ApiProperty({ example: 'Reading Section 1' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: SkillType })
  @IsEnum(SkillType)
  skill: SkillType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  @Max(120)
  duration: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;

  @ApiPropertyOptional({ description: 'Audio URL for listening sections' })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'Audio duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(1)
  audioDuration?: number;
}

// src/modules/exams/dto/update-section.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateSectionDto } from './create-section.dto';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}

// src/modules/exams/dto/reorder-sections.dto.ts
import { IsArray, ValidateNested, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SectionOrderItem {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  orderIndex: number;
}

export class ReorderSectionsDto {
  @ApiProperty({ type: [SectionOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOrderItem)
  items: SectionOrderItem[];
}
```

### Step 2: Passage DTOs

```typescript
// src/modules/exams/dto/create-passage.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PassageType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class CreatePassageDto {
  @ApiProperty({ example: 'Passage 1: The Impact of Technology' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ enum: PassageType, default: PassageType.TEXT })
  @IsOptional()
  @IsEnum(PassageType)
  type?: PassageType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  audioDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  instructions?: string;
}

// src/modules/exams/dto/update-passage.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePassageDto } from './create-passage.dto';

export class UpdatePassageDto extends PartialType(CreatePassageDto) {}
```

### Step 3: Section Service

```typescript
// src/modules/exams/services/section.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExamSection } from '../entities/exam-section.entity';
import { ExamSet } from '../entities/exam-set.entity';
import { CreateSectionDto, UpdateSectionDto, ReorderSectionsDto } from '../dto';
import { CacheService } from '@/core/cache/cache.service';
import { MediaService } from '@/modules/media/media.service';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(ExamSet)
    private readonly examSetRepository: Repository<ExamSet>,
    private readonly cacheService: CacheService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Create a new section for an exam set
   */
  async create(examSetId: string, dto: CreateSectionDto): Promise<ExamSection> {
    // Verify exam set exists
    const examSet = await this.examSetRepository.findOne({
      where: { id: examSetId },
    });

    if (!examSet) {
      throw new NotFoundException(`Exam set ${examSetId} not found`);
    }

    // Get next order index if not provided
    if (!dto.orderIndex) {
      const maxOrder = await this.sectionRepository
        .createQueryBuilder('section')
        .where('section.examSetId = :examSetId', { examSetId })
        .select('MAX(section.orderIndex)', 'max')
        .getRawOne();

      dto.orderIndex = (maxOrder?.max || 0) + 1;
    }

    const section = this.sectionRepository.create({
      ...dto,
      examSetId,
    });

    const saved = await this.sectionRepository.save(section);
    await this.invalidateCache(examSetId);

    return saved;
  }

  /**
   * Find section by ID
   */
  async findById(id: string): Promise<ExamSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['passages', 'passages.questions', 'passages.questions.options'],
      order: {
        passages: {
          orderIndex: 'ASC',
          questions: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException(`Section ${id} not found`);
    }

    return section;
  }

  /**
   * Find sections by exam set ID
   */
  async findByExamSetId(examSetId: string): Promise<ExamSection[]> {
    return this.sectionRepository.find({
      where: { examSetId },
      relations: ['passages'],
      order: { orderIndex: 'ASC' },
    });
  }

  /**
   * Update section
   */
  async update(id: string, dto: UpdateSectionDto): Promise<ExamSection> {
    const section = await this.findById(id);

    Object.assign(section, dto);
    
    const updated = await this.sectionRepository.save(section);
    await this.invalidateCache(section.examSetId);

    return updated;
  }

  /**
   * Update section audio
   */
  async updateAudio(
    id: string,
    file: Express.Multer.File,
  ): Promise<ExamSection> {
    const section = await this.findById(id);

    if (section.skill !== 'listening') {
      throw new BadRequestException('Audio can only be added to listening sections');
    }

    // Delete old audio if exists
    if (section.audioUrl) {
      await this.mediaService.deleteFile(section.audioUrl);
    }

    // Upload new audio
    const { url, duration } = await this.mediaService.uploadAudio(file, {
      folder: `exam-sets/${section.examSetId}/sections`,
      encrypt: true,
    });

    section.audioUrl = url;
    section.audioDuration = duration;

    const updated = await this.sectionRepository.save(section);
    await this.invalidateCache(section.examSetId);

    return updated;
  }

  /**
   * Reorder sections
   */
  async reorder(examSetId: string, dto: ReorderSectionsDto): Promise<ExamSection[]> {
    const sectionIds = dto.items.map(item => item.id);
    
    const sections = await this.sectionRepository.find({
      where: {
        id: In(sectionIds),
        examSetId,
      },
    });

    if (sections.length !== dto.items.length) {
      throw new BadRequestException('Some sections not found or belong to different exam set');
    }

    // Update order indexes
    const updates = dto.items.map(item => 
      this.sectionRepository.update(item.id, { orderIndex: item.orderIndex })
    );

    await Promise.all(updates);
    await this.invalidateCache(examSetId);

    return this.findByExamSetId(examSetId);
  }

  /**
   * Delete section
   */
  async delete(id: string): Promise<void> {
    const section = await this.findById(id);
    const examSetId = section.examSetId;

    // Delete associated audio
    if (section.audioUrl) {
      await this.mediaService.deleteFile(section.audioUrl);
    }

    await this.sectionRepository.remove(section);
    await this.invalidateCache(examSetId);
  }

  /**
   * Get section statistics
   */
  async getStats(id: string): Promise<any> {
    const section = await this.findById(id);

    const questionCount = section.passages?.reduce(
      (acc, p) => acc + (p.questions?.length || 0), 0
    ) || 0;

    return {
      id: section.id,
      skill: section.skill,
      duration: section.duration,
      passageCount: section.passages?.length || 0,
      questionCount,
      hasAudio: !!section.audioUrl,
      audioDuration: section.audioDuration,
    };
  }

  private async invalidateCache(examSetId: string): Promise<void> {
    await this.cacheService.delete(`exam-sets:${examSetId}`);
    await this.cacheService.deleteByPattern('exam-sets:public:*');
  }
}
```

### Step 4: Passage Service

```typescript
// src/modules/exams/services/passage.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SectionPassage } from '../entities/section-passage.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { Question } from '../entities/question.entity';
import { CreatePassageDto, UpdatePassageDto } from '../dto';
import { CacheService } from '@/core/cache/cache.service';
import { MediaService } from '@/modules/media/media.service';

@Injectable()
export class PassageService {
  constructor(
    @InjectRepository(SectionPassage)
    private readonly passageRepository: Repository<SectionPassage>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly cacheService: CacheService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Create a new passage for a section
   */
  async create(sectionId: string, dto: CreatePassageDto): Promise<SectionPassage> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Section ${sectionId} not found`);
    }

    // Get next order index
    if (!dto.orderIndex) {
      const maxOrder = await this.passageRepository
        .createQueryBuilder('passage')
        .where('passage.sectionId = :sectionId', { sectionId })
        .select('MAX(passage.orderIndex)', 'max')
        .getRawOne();

      dto.orderIndex = (maxOrder?.max || 0) + 1;
    }

    const passage = this.passageRepository.create({
      ...dto,
      sectionId,
    });

    const saved = await this.passageRepository.save(passage);
    await this.invalidateCache(section.examSetId);

    return saved;
  }

  /**
   * Find passage by ID with questions
   */
  async findById(id: string): Promise<SectionPassage> {
    const passage = await this.passageRepository.findOne({
      where: { id },
      relations: ['section', 'questions', 'questions.options'],
      order: {
        questions: { orderIndex: 'ASC' },
      },
    });

    if (!passage) {
      throw new NotFoundException(`Passage ${id} not found`);
    }

    return passage;
  }

  /**
   * Find passages by section ID
   */
  async findBySectionId(sectionId: string): Promise<SectionPassage[]> {
    return this.passageRepository.find({
      where: { sectionId },
      relations: ['questions'],
      order: { orderIndex: 'ASC' },
    });
  }

  /**
   * Update passage
   */
  async update(id: string, dto: UpdatePassageDto): Promise<SectionPassage> {
    const passage = await this.findById(id);

    Object.assign(passage, dto);
    
    const updated = await this.passageRepository.save(passage);
    await this.invalidateCache(passage.section.examSetId);

    return updated;
  }

  /**
   * Upload passage audio (for listening passages)
   */
  async uploadAudio(
    id: string,
    file: Express.Multer.File,
  ): Promise<SectionPassage> {
    const passage = await this.findById(id);

    // Delete old audio if exists
    if (passage.audioUrl) {
      await this.mediaService.deleteFile(passage.audioUrl);
    }

    const { url, duration } = await this.mediaService.uploadAudio(file, {
      folder: `sections/${passage.sectionId}/passages`,
      encrypt: true,
    });

    passage.audioUrl = url;
    passage.audioDuration = duration;
    passage.type = 'audio';

    const updated = await this.passageRepository.save(passage);
    await this.invalidateCache(passage.section.examSetId);

    return updated;
  }

  /**
   * Upload passage image
   */
  async uploadImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<SectionPassage> {
    const passage = await this.findById(id);

    // Delete old image if exists
    if (passage.imageUrl) {
      await this.mediaService.deleteFile(passage.imageUrl);
    }

    const url = await this.mediaService.uploadImage(file, {
      folder: `sections/${passage.sectionId}/passages`,
      maxWidth: 1200,
      maxHeight: 800,
      quality: 85,
    });

    passage.imageUrl = url;

    const updated = await this.passageRepository.save(passage);
    await this.invalidateCache(passage.section.examSetId);

    return updated;
  }

  /**
   * Add question to passage
   */
  async addQuestion(passageId: string, questionId: string): Promise<void> {
    const passage = await this.findById(passageId);
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found`);
    }

    // Get next order index
    const maxOrder = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.passageId = :passageId', { passageId })
      .select('MAX(question.orderIndex)', 'max')
      .getRawOne();

    question.passageId = passageId;
    question.orderIndex = (maxOrder?.max || 0) + 1;

    await this.questionRepository.save(question);
    await this.invalidateCache(passage.section.examSetId);
  }

  /**
   * Remove question from passage
   */
  async removeQuestion(passageId: string, questionId: string): Promise<void> {
    const passage = await this.findById(passageId);
    const question = await this.questionRepository.findOne({
      where: { id: questionId, passageId },
    });

    if (!question) {
      throw new NotFoundException(`Question ${questionId} not found in passage`);
    }

    question.passageId = null;
    await this.questionRepository.save(question);
    await this.invalidateCache(passage.section.examSetId);
  }

  /**
   * Reorder questions in passage
   */
  async reorderQuestions(
    passageId: string,
    questionOrder: { id: string; orderIndex: number }[],
  ): Promise<SectionPassage> {
    const passage = await this.findById(passageId);

    const updates = questionOrder.map(item =>
      this.questionRepository.update(
        { id: item.id, passageId },
        { orderIndex: item.orderIndex },
      )
    );

    await Promise.all(updates);
    await this.invalidateCache(passage.section.examSetId);

    return this.findById(passageId);
  }

  /**
   * Delete passage
   */
  async delete(id: string): Promise<void> {
    const passage = await this.findById(id);
    const examSetId = passage.section.examSetId;

    // Delete associated media
    if (passage.audioUrl) {
      await this.mediaService.deleteFile(passage.audioUrl);
    }
    if (passage.imageUrl) {
      await this.mediaService.deleteFile(passage.imageUrl);
    }

    // Orphan questions (don't delete, just unlink)
    await this.questionRepository.update(
      { passageId: id },
      { passageId: null },
    );

    await this.passageRepository.remove(passage);
    await this.invalidateCache(examSetId);
  }

  private async invalidateCache(examSetId: string): Promise<void> {
    await this.cacheService.delete(`exam-sets:${examSetId}`);
    await this.cacheService.deleteByPattern('exam-sets:public:*');
  }
}
```

### Step 5: Controllers

```typescript
// src/modules/exams/controllers/section.controller.ts
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { SectionService } from '../services/section.service';
import { CreateSectionDto, UpdateSectionDto, ReorderSectionsDto } from '../dto';

@ApiTags('Exam Sections')
@Controller('exam-sets/:examSetId/sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'teacher')
@ApiBearerAuth()
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  async create(
    @Param('examSetId', ParseUUIDPipe) examSetId: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionService.create(examSetId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections of an exam set' })
  async findAll(@Param('examSetId', ParseUUIDPipe) examSetId: string) {
    return this.sectionService.findByExamSetId(examSetId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get section statistics' })
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.getStats(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update section' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionService.update(id, dto);
  }

  @Post(':id/audio')
  @ApiOperation({ summary: 'Upload section audio' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sectionService.updateAudio(id, file);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder sections' })
  async reorder(
    @Param('examSetId', ParseUUIDPipe) examSetId: string,
    @Body() dto: ReorderSectionsDto,
  ) {
    return this.sectionService.reorder(examSetId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete section' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionService.delete(id);
  }
}

// src/modules/exams/controllers/passage.controller.ts
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { PassageService } from '../services/passage.service';
import { CreatePassageDto, UpdatePassageDto } from '../dto';

@ApiTags('Section Passages')
@Controller('sections/:sectionId/passages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'teacher')
@ApiBearerAuth()
export class PassageController {
  constructor(private readonly passageService: PassageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new passage' })
  async create(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() dto: CreatePassageDto,
  ) {
    return this.passageService.create(sectionId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all passages of a section' })
  async findAll(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    return this.passageService.findBySectionId(sectionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get passage by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.passageService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update passage' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePassageDto,
  ) {
    return this.passageService.update(id, dto);
  }

  @Post(':id/audio')
  @ApiOperation({ summary: 'Upload passage audio' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.passageService.uploadAudio(id, file);
  }

  @Post(':id/image')
  @ApiOperation({ summary: 'Upload passage image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.passageService.uploadImage(id, file);
  }

  @Post(':id/questions/:questionId')
  @ApiOperation({ summary: 'Add question to passage' })
  async addQuestion(
    @Param('id', ParseUUIDPipe) passageId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.passageService.addQuestion(passageId, questionId);
  }

  @Delete(':id/questions/:questionId')
  @ApiOperation({ summary: 'Remove question from passage' })
  async removeQuestion(
    @Param('id', ParseUUIDPipe) passageId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.passageService.removeQuestion(passageId, questionId);
  }

  @Post(':id/questions/reorder')
  @ApiOperation({ summary: 'Reorder questions in passage' })
  async reorderQuestions(
    @Param('id', ParseUUIDPipe) passageId: string,
    @Body() questionOrder: { id: string; orderIndex: number }[],
  ) {
    return this.passageService.reorderQuestions(passageId, questionOrder);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete passage' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.passageService.delete(id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Section CRUD works correctly
- [ ] Passage CRUD works correctly
- [ ] Audio upload encrypted for listening
- [ ] Image upload with optimization
- [ ] Question ordering persists
- [ ] Cascade delete with media cleanup

---

## ⏭️ Next Task

→ `BE-016_PRACTICE_STATISTICS.md` - Practice Statistics Service
