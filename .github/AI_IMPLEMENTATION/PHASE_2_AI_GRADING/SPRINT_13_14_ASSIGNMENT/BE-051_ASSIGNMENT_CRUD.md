# BE-051: Assignment CRUD Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-051 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-050 |

---

## 🎯 Objective

Implement full CRUD operations for assignments:
- Create assignment with questions
- Update assignment details
- Publish/close assignment
- Delete (soft) assignment
- List assignments with filters
- Question management

---

## 📝 Implementation

### 1. dto/create-assignment.dto.ts

```typescript
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssignmentSkill, AssignmentLevel, ScoreCalculation } from '../entities/assignment.entity';

export class AssignmentQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(100)
  points?: number = 1;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean = true;
}

export class CreateAssignmentDto {
  @ApiProperty({ example: 'Reading Practice - Week 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @ApiProperty({ enum: AssignmentSkill })
  @IsEnum(AssignmentSkill)
  skill: AssignmentSkill;

  @ApiProperty({ enum: AssignmentLevel })
  @IsEnum(AssignmentLevel)
  level: AssignmentLevel;

  @ApiProperty({ example: '2024-01-30T23:59:59.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ example: 60, description: 'Time limit in minutes' })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(300)
  timeLimit?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxAttempts?: number = 1;

  @ApiPropertyOptional({ enum: ScoreCalculation, default: 'best' })
  @IsOptional()
  @IsEnum(ScoreCalculation)
  scoreCalculation?: ScoreCalculation = ScoreCalculation.BEST;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allowLateSubmission?: boolean = false;

  @ApiPropertyOptional({ example: 10, description: 'Penalty % per day' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  latePenalty?: number = 0;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  totalPoints?: number = 10;

  @ApiPropertyOptional({ example: 50, description: 'Passing score %' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  showAnswersAfter?: boolean = true;

  @ApiProperty({ type: [AssignmentQuestionDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions: AssignmentQuestionDto[];
}
```

### 2. dto/update-assignment.dto.ts

```typescript
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAssignmentDto } from './create-assignment.dto';

export class UpdateAssignmentDto extends PartialType(
  OmitType(CreateAssignmentDto, ['questions'] as const)
) {}

// For updating questions separately
export class UpdateQuestionsDto {
  @ApiProperty({ type: [AssignmentQuestionDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions: AssignmentQuestionDto[];
}
```

### 3. dto/assignment-query.dto.ts

```typescript
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AssignmentSkill, AssignmentLevel, AssignmentStatus } from '../entities/assignment.entity';

export class AssignmentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: AssignmentSkill })
  @IsOptional()
  @IsEnum(AssignmentSkill)
  skill?: AssignmentSkill;

  @ApiPropertyOptional({ enum: AssignmentLevel })
  @IsOptional()
  @IsEnum(AssignmentLevel)
  level?: AssignmentLevel;

  @ApiPropertyOptional({ enum: AssignmentStatus })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by due date range start' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by due date range end' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({ enum: ['dueDate', 'createdAt', 'title'], default: 'dueDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'dueDate';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
```

### 4. assignments.service.ts

```typescript
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { AssignmentEntity, AssignmentStatus } from './entities/assignment.entity';
import { AssignmentQuestionEntity } from './entities/assignment-question.entity';
import { AssignmentSubmissionEntity } from './entities/assignment-submission.entity';
import { CreateAssignmentDto, AssignmentQuestionDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto, UpdateQuestionsDto } from './dto/update-assignment.dto';
import { AssignmentQueryDto } from './dto/assignment-query.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepo: Repository<AssignmentEntity>,
    @InjectRepository(AssignmentQuestionEntity)
    private readonly questionRepo: Repository<AssignmentQuestionEntity>,
    @InjectRepository(AssignmentSubmissionEntity)
    private readonly submissionRepo: Repository<AssignmentSubmissionEntity>,
  ) {}

  async create(classId: string, teacherId: string, dto: CreateAssignmentDto): Promise<AssignmentEntity> {
    // Validate due date
    const dueDate = new Date(dto.dueDate);
    if (dueDate <= new Date()) {
      throw new BadRequestException('Due date must be in the future');
    }

    // Create assignment
    const assignment = this.assignmentRepo.create({
      classId,
      createdById: teacherId,
      title: dto.title,
      description: dto.description,
      instructions: dto.instructions,
      skill: dto.skill,
      level: dto.level,
      dueDate,
      timeLimit: dto.timeLimit,
      maxAttempts: dto.maxAttempts,
      scoreCalculation: dto.scoreCalculation,
      allowLateSubmission: dto.allowLateSubmission,
      latePenalty: dto.latePenalty,
      totalPoints: dto.totalPoints,
      passingScore: dto.passingScore,
      showAnswersAfter: dto.showAnswersAfter,
      status: AssignmentStatus.DRAFT,
    });

    await this.assignmentRepo.save(assignment);

    // Add questions
    await this.addQuestions(assignment.id, dto.questions);

    return this.findOne(assignment.id);
  }

  async findAll(classId: string, query: AssignmentQueryDto) {
    const qb = this.assignmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.createdBy', 'teacher')
      .leftJoin('a.questions', 'q')
      .addSelect('COUNT(q.id)', 'questionCount')
      .leftJoin('a.submissions', 's')
      .addSelect('COUNT(DISTINCT s.studentId)', 'submissionCount')
      .where('a.classId = :classId', { classId })
      .groupBy('a.id');

    // Filters
    if (query.skill) {
      qb.andWhere('a.skill = :skill', { skill: query.skill });
    }

    if (query.level) {
      qb.andWhere('a.level = :level', { level: query.level });
    }

    if (query.status) {
      qb.andWhere('a.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('a.title LIKE :search', { search: `%${query.search}%` });
    }

    if (query.dueDateFrom) {
      qb.andWhere('a.dueDate >= :from', { from: query.dueDateFrom });
    }

    if (query.dueDateTo) {
      qb.andWhere('a.dueDate <= :to', { to: query.dueDateTo });
    }

    // Sorting
    const sortField = query.sortBy === 'title' ? 'a.title' :
                      query.sortBy === 'createdAt' ? 'a.createdAt' : 'a.dueDate';
    qb.orderBy(sortField, query.sortOrder);

    // Pagination
    const total = await qb.getCount();
    const items = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getRawAndEntities();

    return {
      items: items.entities.map((entity, idx) => ({
        ...entity,
        questionCount: parseInt(items.raw[idx]?.questionCount) || 0,
        submissionCount: parseInt(items.raw[idx]?.submissionCount) || 0,
      })),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findOne(id: string): Promise<AssignmentEntity> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['class', 'createdBy', 'questions', 'questions.question'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, teacherId: string, dto: UpdateAssignmentDto): Promise<AssignmentEntity> {
    const assignment = await this.findOne(id);

    // Validate ownership
    if (assignment.createdById !== teacherId) {
      throw new ForbiddenException('You can only edit your own assignments');
    }

    // Cannot edit published assignment (except certain fields)
    if (assignment.status !== AssignmentStatus.DRAFT) {
      const allowedFields = ['dueDate', 'allowLateSubmission', 'latePenalty'];
      const attemptedFields = Object.keys(dto);
      const disallowed = attemptedFields.filter((f) => !allowedFields.includes(f));
      
      if (disallowed.length > 0) {
        throw new BadRequestException(
          `Cannot modify ${disallowed.join(', ')} after publishing`
        );
      }
    }

    // Validate due date if updating
    if (dto.dueDate) {
      const newDueDate = new Date(dto.dueDate);
      if (newDueDate <= new Date()) {
        throw new BadRequestException('Due date must be in the future');
      }
    }

    Object.assign(assignment, dto);
    await this.assignmentRepo.save(assignment);

    return this.findOne(id);
  }

  async updateQuestions(id: string, teacherId: string, dto: UpdateQuestionsDto): Promise<AssignmentEntity> {
    const assignment = await this.findOne(id);

    if (assignment.createdById !== teacherId) {
      throw new ForbiddenException('You can only edit your own assignments');
    }

    if (assignment.status !== AssignmentStatus.DRAFT) {
      throw new BadRequestException('Cannot modify questions after publishing');
    }

    // Remove existing questions
    await this.questionRepo.delete({ assignmentId: id });

    // Add new questions
    await this.addQuestions(id, dto.questions);

    return this.findOne(id);
  }

  async publish(id: string, teacherId: string): Promise<AssignmentEntity> {
    const assignment = await this.findOne(id);

    if (assignment.createdById !== teacherId) {
      throw new ForbiddenException('You can only publish your own assignments');
    }

    if (assignment.status !== AssignmentStatus.DRAFT) {
      throw new BadRequestException('Only draft assignments can be published');
    }

    if (!assignment.questions || assignment.questions.length === 0) {
      throw new BadRequestException('Assignment must have at least one question');
    }

    if (new Date(assignment.dueDate) <= new Date()) {
      throw new BadRequestException('Due date must be in the future');
    }

    assignment.status = AssignmentStatus.PUBLISHED;
    assignment.publishedAt = new Date();

    await this.assignmentRepo.save(assignment);

    return assignment;
  }

  async close(id: string, teacherId: string): Promise<AssignmentEntity> {
    const assignment = await this.findOne(id);

    if (assignment.createdById !== teacherId) {
      throw new ForbiddenException('You can only close your own assignments');
    }

    if (assignment.status !== AssignmentStatus.PUBLISHED) {
      throw new BadRequestException('Only published assignments can be closed');
    }

    assignment.status = AssignmentStatus.CLOSED;
    assignment.closedAt = new Date();

    await this.assignmentRepo.save(assignment);

    return assignment;
  }

  async delete(id: string, teacherId: string): Promise<void> {
    const assignment = await this.findOne(id);

    if (assignment.createdById !== teacherId) {
      throw new ForbiddenException('You can only delete your own assignments');
    }

    // Check for submissions
    const submissionCount = await this.submissionRepo.count({
      where: { assignmentId: id },
    });

    if (submissionCount > 0) {
      throw new BadRequestException(
        `Cannot delete assignment with ${submissionCount} submissions. Close it instead.`
      );
    }

    await this.assignmentRepo.remove(assignment);
  }

  async getStats(id: string) {
    const assignment = await this.findOne(id);

    const [
      totalSubmissions,
      submittedCount,
      gradedCount,
      avgScore,
    ] = await Promise.all([
      this.submissionRepo.count({ where: { assignmentId: id } }),
      this.submissionRepo.count({
        where: { assignmentId: id, status: In(['submitted', 'graded']) },
      }),
      this.submissionRepo.count({
        where: { assignmentId: id, status: 'graded' },
      }),
      this.submissionRepo
        .createQueryBuilder('s')
        .select('AVG(s.percentage)', 'avg')
        .where('s.assignmentId = :id', { id })
        .andWhere('s.status = :status', { status: 'graded' })
        .getRawOne(),
    ]);

    return {
      assignmentId: id,
      totalStudents: 0, // TODO: Get from class
      totalSubmissions,
      submittedCount,
      gradedCount,
      pendingGrade: submittedCount - gradedCount,
      averageScore: parseFloat(avgScore?.avg) || 0,
      passRate: 0, // TODO: Calculate
    };
  }

  private async addQuestions(assignmentId: string, questions: AssignmentQuestionDto[]): Promise<void> {
    const entities = questions.map((q) =>
      this.questionRepo.create({
        assignmentId,
        questionId: q.questionId,
        orderIndex: q.orderIndex,
        points: q.points || 1,
        required: q.required ?? true,
      })
    );

    await this.questionRepo.save(entities);
  }
}
```

### 5. assignments.controller.ts

```typescript
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto, UpdateQuestionsDto } from './dto/update-assignment.dto';
import { AssignmentQueryDto } from './dto/assignment-query.dto';

@ApiTags('Assignments')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post('classes/:classId/assignments')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Create new assignment' })
  @ApiParam({ name: 'classId', type: 'string' })
  async create(
    @Param('classId') classId: string,
    @Body() dto: CreateAssignmentDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.assignmentsService.create(classId, teacherId, dto);
  }

  @Get('classes/:classId/assignments')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'List assignments in class' })
  @ApiParam({ name: 'classId', type: 'string' })
  async findAll(
    @Param('classId') classId: string,
    @Query() query: AssignmentQueryDto,
  ) {
    return this.assignmentsService.findAll(classId, query);
  }

  @Get('assignments/:id')
  @Roles('teacher', 'student', 'admin')
  @ApiOperation({ summary: 'Get assignment details' })
  async findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Put('assignments/:id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Update assignment' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.assignmentsService.update(id, teacherId, dto);
  }

  @Put('assignments/:id/questions')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Update assignment questions' })
  async updateQuestions(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionsDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.assignmentsService.updateQuestions(id, teacherId, dto);
  }

  @Post('assignments/:id/publish')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Publish assignment' })
  async publish(
    @Param('id') id: string,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.assignmentsService.publish(id, teacherId);
  }

  @Post('assignments/:id/close')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Close assignment' })
  async close(
    @Param('id') id: string,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.assignmentsService.close(id, teacherId);
  }

  @Delete('assignments/:id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Delete assignment' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') teacherId: string,
  ) {
    await this.assignmentsService.delete(id, teacherId);
    return { message: 'Assignment deleted successfully' };
  }

  @Get('assignments/:id/stats')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Get assignment statistics' })
  async getStats(@Param('id') id: string) {
    return this.assignmentsService.getStats(id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Create assignment with questions
- [ ] Validate due date in future
- [ ] List with filters and pagination
- [ ] Update draft assignment only
- [ ] Update limited fields after publish
- [ ] Publish requires questions
- [ ] Close stops new submissions
- [ ] Delete only empty assignments
- [ ] Stats calculated correctly

---

## 🧪 Test Cases

```typescript
describe('AssignmentsService', () => {
  it('creates assignment with questions', async () => {
    const dto: CreateAssignmentDto = {
      title: 'Reading Week 1',
      skill: AssignmentSkill.READING,
      level: AssignmentLevel.B1,
      dueDate: futureDate.toISOString(),
      questions: [
        { questionId: 'q1', orderIndex: 0, points: 2 },
        { questionId: 'q2', orderIndex: 1, points: 1 },
      ],
    };

    const result = await service.create(classId, teacherId, dto);
    expect(result.questions).toHaveLength(2);
  });

  it('rejects past due date', async () => {
    await expect(
      service.create(classId, teacherId, {
        ...validDto,
        dueDate: '2020-01-01T00:00:00Z',
      })
    ).rejects.toThrow('Due date must be in the future');
  });

  it('blocks editing published assignment', async () => {
    await service.publish(assignmentId, teacherId);
    
    await expect(
      service.update(assignmentId, teacherId, { title: 'New' })
    ).rejects.toThrow('Cannot modify');
  });
});
```
