# BE-012: Question Service & Repository

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-012 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010 |

---

## 🎯 Objective

Implement Question Service với:
- CRUD operations cho Question Bank
- Query với filters (level, skill, type, tags)
- Pagination & sorting
- Random question selection cho practice

---

## 💻 Implementation

### Step 1: Question Repository

```typescript
// src/modules/questions/repositories/question.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionFilterDto } from '../dto/question-filter.dto';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }

  createQueryWithFilters(filters: QuestionFilterDto): SelectQueryBuilder<Question> {
    const query = this.createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.tags', 'tags');

    if (filters.skill) {
      query.andWhere('question.skill = :skill', { skill: filters.skill });
    }

    if (filters.level) {
      query.andWhere('question.level = :level', { level: filters.level });
    }

    if (filters.type) {
      query.andWhere('question.type = :type', { type: filters.type });
    }

    if (filters.partNumber) {
      query.andWhere('question.partNumber = :partNumber', { 
        partNumber: filters.partNumber 
      });
    }

    if (filters.difficulty) {
      query.andWhere('question.difficulty = :difficulty', { 
        difficulty: filters.difficulty 
      });
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      query.andWhere('tags.id IN (:...tagIds)', { tagIds: filters.tagIds });
    }

    if (filters.search) {
      query.andWhere(
        '(question.content LIKE :search OR question.explanation LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.isActive !== undefined) {
      query.andWhere('question.isActive = :isActive', { 
        isActive: filters.isActive 
      });
    }

    return query;
  }

  async findWithFilters(
    filters: QuestionFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: Question[]; total: number }> {
    const query = this.createQueryWithFilters(filters);

    // Apply sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`question.${sortField}`, sortOrder);

    // Apply pagination
    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findRandomQuestions(
    filters: QuestionFilterDto,
    count: number,
  ): Promise<Question[]> {
    const query = this.createQueryWithFilters(filters);
    
    // Random order
    query.orderBy('RAND()').take(count);
    
    return query.getMany();
  }

  async findByExamSection(sectionId: string): Promise<Question[]> {
    return this.createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .innerJoin('question.section', 'section')
      .where('section.id = :sectionId', { sectionId })
      .orderBy('question.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC')
      .getMany();
  }

  async findByPassage(passageId: string): Promise<Question[]> {
    return this.createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .where('question.passageId = :passageId', { passageId })
      .orderBy('question.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC')
      .getMany();
  }

  async countByFilters(filters: QuestionFilterDto): Promise<number> {
    return this.createQueryWithFilters(filters).getCount();
  }

  async getStatsBySkillAndLevel(): Promise<any[]> {
    return this.createQueryBuilder('question')
      .select('question.skill', 'skill')
      .addSelect('question.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('question.isActive = true')
      .groupBy('question.skill')
      .addGroupBy('question.level')
      .getRawMany();
  }
}
```

### Step 2: DTOs

```typescript
// src/modules/questions/dto/question-filter.dto.ts
import { IsOptional, IsEnum, IsString, IsArray, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VstepLevel, Skill, QuestionType } from '@/shared/enums/practice.enums';

export class QuestionFilterDto {
  @ApiPropertyOptional({ enum: Skill })
  @IsOptional()
  @IsEnum(Skill)
  skill?: Skill;

  @ApiPropertyOptional({ enum: VstepLevel })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional({ enum: QuestionType })
  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  partNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tagIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

// src/modules/questions/dto/create-question.dto.ts
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsInt, 
  Min, 
  Max, 
  IsArray, 
  ValidateNested,
  IsBoolean,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VstepLevel, Skill, QuestionType } from '@/shared/enums/practice.enums';

export class CreateQuestionOptionDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class CreateQuestionDto {
  @ApiProperty({ enum: Skill })
  @IsEnum(Skill)
  skill: Skill;

  @ApiProperty({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  level: VstepLevel;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  partNumber?: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  context?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @ApiPropertyOptional({ type: [CreateQuestionOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options?: CreateQuestionOptionDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sectionId?: string;
}

// src/modules/questions/dto/update-question.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
```

### Step 3: Question Service

```typescript
// src/modules/questions/services/question.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionOption } from '../entities/question-option.entity';
import { QuestionTag } from '../entities/question-tag.entity';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuestionDto, UpdateQuestionDto, QuestionFilterDto } from '../dto';
import { PaginatedResult, PaginationDto } from '@/shared/dto/pagination.dto';
import { CacheService } from '@/core/cache/cache.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: typeof QuestionOption,
    @InjectRepository(QuestionTag)
    private readonly tagRepository: typeof QuestionTag,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Create a new question with options and tags
   */
  async create(dto: CreateQuestionDto): Promise<Question> {
    // Validate options for multiple choice questions
    if (
      ['multiple_choice', 'true_false_ng'].includes(dto.type) && 
      (!dto.options || dto.options.length === 0)
    ) {
      throw new BadRequestException('Options are required for this question type');
    }

    // Create question
    const question = this.questionRepository.create({
      skill: dto.skill,
      level: dto.level,
      type: dto.type,
      partNumber: dto.partNumber,
      content: dto.content,
      context: dto.context,
      audioUrl: dto.audioUrl,
      imageUrl: dto.imageUrl,
      correctAnswer: dto.correctAnswer,
      explanation: dto.explanation,
      points: dto.points ?? 1,
      difficulty: dto.difficulty ?? 3,
      passageId: dto.passageId,
      sectionId: dto.sectionId,
    });

    // Save question first to get ID
    const savedQuestion = await this.questionRepository.save(question);

    // Create options
    if (dto.options && dto.options.length > 0) {
      const options = dto.options.map((opt, index) => 
        this.optionRepository.create({
          ...opt,
          questionId: savedQuestion.id,
          orderIndex: opt.orderIndex ?? index,
        })
      );
      await this.optionRepository.save(options);
    }

    // Associate tags
    if (dto.tagIds && dto.tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(dto.tagIds) });
      savedQuestion.tags = tags;
      await this.questionRepository.save(savedQuestion);
    }

    // Invalidate cache
    await this.cacheService.deleteByPattern('questions:*');

    // Return with relations
    return this.findById(savedQuestion.id);
  }

  /**
   * Find question by ID with all relations
   */
  async findById(id: string): Promise<Question> {
    const cacheKey = `questions:${id}`;
    const cached = await this.cacheService.get<Question>(cacheKey);
    if (cached) return cached;

    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options', 'tags', 'passage', 'section'],
      order: { options: { orderIndex: 'ASC' } },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    await this.cacheService.set(cacheKey, question, 3600); // 1 hour
    return question;
  }

  /**
   * Find questions with filters and pagination
   */
  async findAll(
    filters: QuestionFilterDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Question>> {
    const { items, total } = await this.questionRepository.findWithFilters(
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
   * Get random questions for practice session
   */
  async getRandomQuestions(
    filters: QuestionFilterDto,
    count: number,
  ): Promise<Question[]> {
    return this.questionRepository.findRandomQuestions(filters, count);
  }

  /**
   * Get questions by passage
   */
  async findByPassage(passageId: string): Promise<Question[]> {
    return this.questionRepository.findByPassage(passageId);
  }

  /**
   * Get questions by exam section
   */
  async findBySection(sectionId: string): Promise<Question[]> {
    return this.questionRepository.findByExamSection(sectionId);
  }

  /**
   * Update question
   */
  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findById(id);

    // Update basic fields
    Object.assign(question, {
      skill: dto.skill ?? question.skill,
      level: dto.level ?? question.level,
      type: dto.type ?? question.type,
      partNumber: dto.partNumber ?? question.partNumber,
      content: dto.content ?? question.content,
      context: dto.context ?? question.context,
      audioUrl: dto.audioUrl ?? question.audioUrl,
      imageUrl: dto.imageUrl ?? question.imageUrl,
      correctAnswer: dto.correctAnswer ?? question.correctAnswer,
      explanation: dto.explanation ?? question.explanation,
      points: dto.points ?? question.points,
      difficulty: dto.difficulty ?? question.difficulty,
    });

    await this.questionRepository.save(question);

    // Update options if provided
    if (dto.options !== undefined) {
      // Remove existing options
      await this.optionRepository.delete({ questionId: id });
      
      // Create new options
      if (dto.options.length > 0) {
        const options = dto.options.map((opt, index) => 
          this.optionRepository.create({
            ...opt,
            questionId: id,
            orderIndex: opt.orderIndex ?? index,
          })
        );
        await this.optionRepository.save(options);
      }
    }

    // Update tags if provided
    if (dto.tagIds !== undefined) {
      const tags = dto.tagIds.length > 0
        ? await this.tagRepository.findBy({ id: In(dto.tagIds) })
        : [];
      question.tags = tags;
      await this.questionRepository.save(question);
    }

    // Invalidate cache
    await this.cacheService.delete(`questions:${id}`);
    await this.cacheService.deleteByPattern('questions:list:*');

    return this.findById(id);
  }

  /**
   * Soft delete question
   */
  async delete(id: string): Promise<void> {
    const question = await this.findById(id);
    question.isActive = false;
    await this.questionRepository.save(question);
    await this.cacheService.delete(`questions:${id}`);
  }

  /**
   * Hard delete question
   */
  async hardDelete(id: string): Promise<void> {
    await this.optionRepository.delete({ questionId: id });
    await this.questionRepository.delete(id);
    await this.cacheService.delete(`questions:${id}`);
  }

  /**
   * Get question statistics
   */
  async getStats(): Promise<any> {
    const cacheKey = 'questions:stats';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const stats = await this.questionRepository.getStatsBySkillAndLevel();
    const totalCount = await this.questionRepository.count({ where: { isActive: true } });

    const result = {
      total: totalCount,
      bySkillAndLevel: stats,
    };

    await this.cacheService.set(cacheKey, result, 300); // 5 minutes
    return result;
  }

  /**
   * Validate answer
   */
  async validateAnswer(
    questionId: string,
    answer: string | string[],
  ): Promise<{ isCorrect: boolean; correctAnswer?: string; explanation?: string }> {
    const question = await this.findById(questionId);

    let isCorrect = false;

    switch (question.type) {
      case 'multiple_choice':
      case 'true_false_ng':
        const correctOption = question.options?.find(o => o.isCorrect);
        isCorrect = correctOption?.id === answer || correctOption?.label === answer;
        break;

      case 'fill_blank':
      case 'short_answer':
        // Case-insensitive comparison, trim whitespace
        const normalizedAnswer = String(answer).toLowerCase().trim();
        const normalizedCorrect = question.correctAnswer?.toLowerCase().trim();
        isCorrect = normalizedAnswer === normalizedCorrect;
        break;

      case 'matching':
        // For matching, answer is array of pairs
        if (Array.isArray(answer) && question.correctAnswer) {
          const correctPairs = JSON.parse(question.correctAnswer);
          isCorrect = JSON.stringify(answer.sort()) === JSON.stringify(correctPairs.sort());
        }
        break;

      case 'essay':
      case 'speaking_task':
        // These require AI scoring - return false, will be handled separately
        isCorrect = false;
        break;
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }
}
```

### Step 4: Question Controller

```typescript
// src/modules/questions/controllers/question.controller.ts
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
import { QuestionService } from '../services/question.service';
import { 
  CreateQuestionDto, 
  UpdateQuestionDto, 
  QuestionFilterDto 
} from '../dto';
import { PaginationDto } from '@/shared/dto/pagination.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  async create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions with filters' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  async findAll(
    @Query() filters: QuestionFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.questionService.findAll(filters, pagination);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get question statistics' })
  async getStats() {
    return this.questionService.getStats();
  }

  @Get('random')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get random questions for practice' })
  async getRandomQuestions(
    @Query() filters: QuestionFilterDto,
    @Query('count') count: number = 10,
  ) {
    return this.questionService.getRandomQuestions(filters, count);
  }

  @Get('passage/:passageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions by passage' })
  async findByPassage(@Param('passageId', ParseUUIDPipe) passageId: string) {
    return this.questionService.findByPassage(passageId);
  }

  @Get('section/:sectionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get questions by exam section' })
  async findBySection(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    return this.questionService.findBySection(sectionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiResponse({ status: 200, description: 'Question details' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a question' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a question' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.delete(id);
  }

  @Post(':id/validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate an answer' })
  async validateAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('answer') answer: string | string[],
  ) {
    return this.questionService.validateAnswer(id, answer);
  }
}
```

### Step 5: Question Module

```typescript
// src/modules/questions/question.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionTag } from './entities/question-tag.entity';
import { QuestionRepository } from './repositories/question.repository';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';
import { CacheModule } from '@/core/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionOption, QuestionTag]),
    CacheModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionService, QuestionRepository],
})
export class QuestionModule {}
```

---

## ✅ Acceptance Criteria

- [ ] CRUD operations functional
- [ ] Filter by skill, level, type works
- [ ] Pagination returns correct pages
- [ ] Random questions are random (different each call)
- [ ] Answer validation works for all question types
- [ ] Cache invalidation on updates
- [ ] Role-based access control enforced

---

## ⏭️ Next Task

→ `BE-013_AUTO_SCORING.md` - Auto Scoring Service
