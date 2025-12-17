# BE-014: Exam Set CRUD Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-014 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010 |

---

## 🎯 Objective

Implement Exam Set Service với:
- CRUD operations cho Exam Sets
- Filtering theo level, skill, status
- Clone exam set functionality
- Publish/unpublish workflow

---

## 💻 Implementation

### Step 1: DTOs

```typescript
// src/modules/exams/dto/create-exam-set.dto.ts
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsInt, 
  Min, 
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VstepLevel } from '@/shared/enums/practice.enums';

export class CreateExamSetDto {
  @ApiProperty({ example: 'VSTEP B2 - Mock Test 1' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  level: VstepLevel;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalDuration?: number; // minutes

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// src/modules/exams/dto/update-exam-set.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateExamSetDto } from './create-exam-set.dto';

export class UpdateExamSetDto extends PartialType(CreateExamSetDto) {}

// src/modules/exams/dto/exam-set-filter.dto.ts
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VstepLevel } from '@/shared/enums/practice.enums';

export class ExamSetFilterDto {
  @ApiPropertyOptional({ enum: VstepLevel })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
```

### Step 2: Exam Set Repository

```typescript
// src/modules/exams/repositories/exam-set.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ExamSet } from '../entities/exam-set.entity';
import { ExamSetFilterDto } from '../dto/exam-set-filter.dto';

@Injectable()
export class ExamSetRepository extends Repository<ExamSet> {
  constructor(private dataSource: DataSource) {
    super(ExamSet, dataSource.createEntityManager());
  }

  createQueryWithFilters(filters: ExamSetFilterDto): SelectQueryBuilder<ExamSet> {
    const query = this.createQueryBuilder('examSet')
      .leftJoinAndSelect('examSet.sections', 'sections')
      .loadRelationCountAndMap('examSet.questionCount', 'sections.questions');

    if (filters.level) {
      query.andWhere('examSet.level = :level', { level: filters.level });
    }

    if (filters.isActive !== undefined) {
      query.andWhere('examSet.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters.isFree !== undefined) {
      query.andWhere('examSet.isFree = :isFree', { isFree: filters.isFree });
    }

    if (filters.search) {
      query.andWhere(
        '(examSet.title LIKE :search OR examSet.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return query;
  }

  async findWithFilters(
    filters: ExamSetFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: ExamSet[]; total: number }> {
    const query = this.createQueryWithFilters(filters);

    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`examSet.${sortField}`, sortOrder);

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findByIdWithSections(id: string): Promise<ExamSet | null> {
    return this.createQueryBuilder('examSet')
      .leftJoinAndSelect('examSet.sections', 'sections')
      .leftJoinAndSelect('sections.passages', 'passages')
      .leftJoinAndSelect('passages.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('examSet.id = :id', { id })
      .orderBy('sections.orderIndex', 'ASC')
      .addOrderBy('passages.orderIndex', 'ASC')
      .addOrderBy('questions.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC')
      .getOne();
  }

  async getStatsByLevel(): Promise<any[]> {
    return this.createQueryBuilder('examSet')
      .select('examSet.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN examSet.isActive = true THEN 1 ELSE 0 END)', 'activeCount')
      .groupBy('examSet.level')
      .getRawMany();
  }
}
```

### Step 3: Exam Set Service

```typescript
// src/modules/exams/services/exam-set.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ExamSet } from '../entities/exam-set.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { ExamSetRepository } from '../repositories/exam-set.repository';
import { CreateExamSetDto, UpdateExamSetDto, ExamSetFilterDto } from '../dto';
import { PaginatedResult, PaginationDto } from '@/shared/dto/pagination.dto';
import { CacheService } from '@/core/cache/cache.service';

@Injectable()
export class ExamSetService {
  constructor(
    private readonly examSetRepository: ExamSetRepository,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Create a new exam set
   */
  async create(dto: CreateExamSetDto): Promise<ExamSet> {
    const examSet = this.examSetRepository.create({
      title: dto.title,
      description: dto.description,
      level: dto.level,
      totalDuration: dto.totalDuration,
      isActive: dto.isActive ?? false,
      isFree: dto.isFree ?? false,
      thumbnailUrl: dto.thumbnailUrl,
    });

    const saved = await this.examSetRepository.save(examSet);

    // Create default sections for VSTEP format
    await this.createDefaultSections(saved.id);

    await this.cacheService.deleteByPattern('exam-sets:*');

    return this.findById(saved.id);
  }

  /**
   * Create default VSTEP sections
   */
  private async createDefaultSections(examSetId: string): Promise<void> {
    const defaultSections = [
      { skill: 'listening', orderIndex: 1, duration: 40, title: 'Listening' },
      { skill: 'reading', orderIndex: 2, duration: 60, title: 'Reading' },
      { skill: 'writing', orderIndex: 3, duration: 60, title: 'Writing' },
      { skill: 'speaking', orderIndex: 4, duration: 12, title: 'Speaking' },
    ];

    const sections = defaultSections.map(s => 
      this.sectionRepository.create({
        ...s,
        examSetId,
      })
    );

    await this.sectionRepository.save(sections);
  }

  /**
   * Find exam set by ID
   */
  async findById(id: string): Promise<ExamSet> {
    const cacheKey = `exam-sets:${id}`;
    const cached = await this.cacheService.get<ExamSet>(cacheKey);
    if (cached) return cached;

    const examSet = await this.examSetRepository.findByIdWithSections(id);
    if (!examSet) {
      throw new NotFoundException(`Exam set with ID ${id} not found`);
    }

    await this.cacheService.set(cacheKey, examSet, 3600);
    return examSet;
  }

  /**
   * Find exam sets with filters
   */
  async findAll(
    filters: ExamSetFilterDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<ExamSet>> {
    const { items, total } = await this.examSetRepository.findWithFilters(
      filters,
      pagination.page,
      pagination.limit,
    );

    return {
      items,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Get public/active exam sets for students
   */
  async findPublicExamSets(level?: string): Promise<ExamSet[]> {
    const cacheKey = `exam-sets:public:${level || 'all'}`;
    const cached = await this.cacheService.get<ExamSet[]>(cacheKey);
    if (cached) return cached;

    const query = this.examSetRepository
      .createQueryBuilder('examSet')
      .leftJoinAndSelect('examSet.sections', 'sections')
      .where('examSet.isActive = :isActive', { isActive: true })
      .orderBy('examSet.createdAt', 'DESC');

    if (level) {
      query.andWhere('examSet.level = :level', { level });
    }

    const examSets = await query.getMany();
    await this.cacheService.set(cacheKey, examSets, 1800); // 30 minutes

    return examSets;
  }

  /**
   * Update exam set
   */
  async update(id: string, dto: UpdateExamSetDto): Promise<ExamSet> {
    const examSet = await this.findById(id);

    Object.assign(examSet, {
      title: dto.title ?? examSet.title,
      description: dto.description ?? examSet.description,
      level: dto.level ?? examSet.level,
      totalDuration: dto.totalDuration ?? examSet.totalDuration,
      isActive: dto.isActive ?? examSet.isActive,
      isFree: dto.isFree ?? examSet.isFree,
      thumbnailUrl: dto.thumbnailUrl ?? examSet.thumbnailUrl,
    });

    await this.examSetRepository.save(examSet);
    await this.cacheService.delete(`exam-sets:${id}`);
    await this.cacheService.deleteByPattern('exam-sets:public:*');

    return this.findById(id);
  }

  /**
   * Publish exam set (make active)
   */
  async publish(id: string): Promise<ExamSet> {
    const examSet = await this.findById(id);

    // Validate exam set has required content
    if (!examSet.sections || examSet.sections.length === 0) {
      throw new BadRequestException('Exam set must have at least one section');
    }

    const hasQuestions = examSet.sections.some(
      s => s.passages?.some(p => p.questions?.length > 0) || 
           s.questions?.length > 0
    );

    if (!hasQuestions) {
      throw new BadRequestException('Exam set must have questions before publishing');
    }

    examSet.isActive = true;
    examSet.publishedAt = new Date();

    await this.examSetRepository.save(examSet);
    await this.invalidateCache(id);

    return examSet;
  }

  /**
   * Unpublish exam set
   */
  async unpublish(id: string): Promise<ExamSet> {
    const examSet = await this.findById(id);
    examSet.isActive = false;

    await this.examSetRepository.save(examSet);
    await this.invalidateCache(id);

    return examSet;
  }

  /**
   * Clone exam set with all content
   */
  async clone(id: string, newTitle?: string): Promise<ExamSet> {
    const original = await this.findById(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clone exam set
      const cloned = this.examSetRepository.create({
        title: newTitle || `${original.title} (Copy)`,
        description: original.description,
        level: original.level,
        totalDuration: original.totalDuration,
        isActive: false, // Start as inactive
        isFree: original.isFree,
        thumbnailUrl: original.thumbnailUrl,
      });

      const savedExamSet = await queryRunner.manager.save(cloned);

      // Clone sections
      for (const section of original.sections || []) {
        const clonedSection = this.sectionRepository.create({
          examSetId: savedExamSet.id,
          skill: section.skill,
          title: section.title,
          instructions: section.instructions,
          duration: section.duration,
          orderIndex: section.orderIndex,
          audioUrl: section.audioUrl,
        });

        const savedSection = await queryRunner.manager.save(clonedSection);

        // Clone passages and questions... (simplified)
        // In production, add full deep cloning logic
      }

      await queryRunner.commitTransaction();
      return this.findById(savedExamSet.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete exam set
   */
  async delete(id: string): Promise<void> {
    const examSet = await this.findById(id);
    
    // Soft delete by setting isActive = false and adding deleted flag
    examSet.isActive = false;
    examSet.deletedAt = new Date();
    
    await this.examSetRepository.save(examSet);
    await this.invalidateCache(id);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<any> {
    const cacheKey = 'exam-sets:stats';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const byLevel = await this.examSetRepository.getStatsByLevel();
    const total = await this.examSetRepository.count();
    const active = await this.examSetRepository.count({ where: { isActive: true } });

    const stats = {
      total,
      active,
      inactive: total - active,
      byLevel,
    };

    await this.cacheService.set(cacheKey, stats, 300);
    return stats;
  }

  private async invalidateCache(id: string): Promise<void> {
    await this.cacheService.delete(`exam-sets:${id}`);
    await this.cacheService.deleteByPattern('exam-sets:public:*');
    await this.cacheService.delete('exam-sets:stats');
  }
}
```

### Step 4: Exam Set Controller

```typescript
// src/modules/exams/controllers/exam-set.controller.ts
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ExamSetService } from '../services/exam-set.service';
import { CreateExamSetDto, UpdateExamSetDto, ExamSetFilterDto } from '../dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';

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
  async findAll(
    @Query() filters: ExamSetFilterDto,
    @Query() pagination: PaginationDto,
  ) {
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExamSetDto,
  ) {
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

  @Post(':id/clone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clone exam set' })
  async clone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('title') title?: string,
  ) {
    return this.examSetService.clone(id, title);
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
```

---

## ✅ Acceptance Criteria

- [ ] CRUD operations complete
- [ ] Filtering by level, status works
- [ ] Clone creates full deep copy
- [ ] Publish validates required content
- [ ] Cache invalidation on updates
- [ ] Statistics calculated correctly

---

## ⏭️ Next Task

→ `BE-015_SECTION_PASSAGE_SERVICE.md` - Section & Passage Service
