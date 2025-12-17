# BE-045: Class CRUD Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-045 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-044 |

---

## 🎯 Objective

Implement complete CRUD operations for Class management:
- Create new class with auto-generated invite code
- Update class details
- Delete class (soft delete)
- List classes for teacher with filters
- Get class details with statistics

---

## 📁 Files to Create

```
src/modules/classes/
├── classes.controller.ts
├── classes.service.ts
├── classes.module.ts
├── dto/
│   ├── create-class.dto.ts
│   ├── update-class.dto.ts
│   ├── class-query.dto.ts
│   └── class-response.dto.ts
└── classes.repository.ts
```

---

## 📝 Implementation

### 1. DTOs

#### create-class.dto.ts

```typescript
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClassLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum ClassStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export class CreateClassDto {
  @ApiProperty({ example: 'Lớp VSTEP B1 - Khóa 23' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Lớp luyện thi VSTEP B1 dành cho sinh viên năm 3' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ClassLevel, example: ClassLevel.B1 })
  @IsEnum(ClassLevel)
  level: ClassLevel;

  @ApiPropertyOptional({ example: '2024-03-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-06-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 30, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxStudents?: number;
}
```

#### update-class.dto.ts

```typescript
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateClassDto, ClassStatus } from './create-class.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;
}
```

#### class-query.dto.ts

```typescript
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClassLevel, ClassStatus } from './create-class.dto';

export class ClassQueryDto {
  @ApiPropertyOptional({ enum: ClassLevel })
  @IsOptional()
  @IsEnum(ClassLevel)
  level?: ClassLevel;

  @ApiPropertyOptional({ enum: ClassStatus })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ['name', 'createdAt', 'studentCount'], default: 'createdAt' })
  @IsOptional()
  sortBy?: 'name' | 'createdAt' | 'studentCount' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';
}
```

#### class-response.dto.ts

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassLevel, ClassStatus } from './create-class.dto';

export class ClassTeacherResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  avatar?: string;
}

export class ClassStatsResponse {
  @ApiProperty()
  totalStudents: number;

  @ApiProperty()
  activeStudents: number;

  @ApiProperty()
  totalAssignments: number;

  @ApiProperty()
  completedAssignments: number;

  @ApiProperty()
  averageScore: number;
}

export class ClassResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ClassLevel })
  level: ClassLevel;

  @ApiProperty({ enum: ClassStatus })
  status: ClassStatus;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty()
  maxStudents: number;

  @ApiProperty()
  inviteCode: string;

  @ApiProperty({ type: ClassTeacherResponse })
  teacher: ClassTeacherResponse;

  @ApiPropertyOptional({ type: ClassStatsResponse })
  stats?: ClassStatsResponse;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ClassListResponse {
  @ApiProperty({ type: [ClassResponse] })
  items: ClassResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
```

### 2. classes.repository.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClassEntity, ClassStatus } from './entities/class.entity';
import { ClassQueryDto } from './dto/class-query.dto';

@Injectable()
export class ClassesRepository {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepo: Repository<ClassEntity>,
  ) {}

  async create(data: Partial<ClassEntity>): Promise<ClassEntity> {
    const classEntity = this.classRepo.create(data);
    return this.classRepo.save(classEntity);
  }

  async findById(id: string, teacherId?: string): Promise<ClassEntity | null> {
    const qb = this.classRepo
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .leftJoinAndSelect('class.students', 'classStudents')
      .leftJoinAndSelect('classStudents.student', 'student')
      .where('class.id = :id', { id })
      .andWhere('class.deletedAt IS NULL');

    if (teacherId) {
      qb.andWhere('class.teacherId = :teacherId', { teacherId });
    }

    return qb.getOne();
  }

  async findByInviteCode(inviteCode: string): Promise<ClassEntity | null> {
    return this.classRepo.findOne({
      where: { inviteCode, status: ClassStatus.ACTIVE },
      relations: ['teacher'],
    });
  }

  async findByTeacher(
    teacherId: string,
    query: ClassQueryDto,
  ): Promise<{ items: ClassEntity[]; total: number }> {
    const qb = this.classRepo
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .loadRelationCountAndMap('class.studentCount', 'class.students')
      .where('class.teacherId = :teacherId', { teacherId })
      .andWhere('class.deletedAt IS NULL');

    // Apply filters
    if (query.level) {
      qb.andWhere('class.level = :level', { level: query.level });
    }

    if (query.status) {
      qb.andWhere('class.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('(class.name LIKE :search OR class.description LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    // Sorting
    const sortColumn = query.sortBy === 'studentCount' 
      ? 'studentCount' 
      : `class.${query.sortBy}`;
    qb.orderBy(sortColumn, query.order.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async update(id: string, data: Partial<ClassEntity>): Promise<ClassEntity> {
    await this.classRepo.update(id, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.classRepo.update(id, {
      deletedAt: new Date(),
      status: ClassStatus.ARCHIVED,
    });
  }

  async isInviteCodeUnique(code: string): Promise<boolean> {
    const count = await this.classRepo.count({ where: { inviteCode: code } });
    return count === 0;
  }

  async getClassStats(classId: string): Promise<any> {
    const result = await this.classRepo
      .createQueryBuilder('class')
      .leftJoin('class.students', 'cs')
      .leftJoin('class.assignments', 'a')
      .leftJoin('a.submissions', 's')
      .select([
        'COUNT(DISTINCT cs.id) as totalStudents',
        'COUNT(DISTINCT CASE WHEN cs.status = :active THEN cs.id END) as activeStudents',
        'COUNT(DISTINCT a.id) as totalAssignments',
        'AVG(s.score) as averageScore',
      ])
      .where('class.id = :classId', { classId })
      .setParameter('active', 'active')
      .getRawOne();

    return {
      totalStudents: parseInt(result.totalStudents) || 0,
      activeStudents: parseInt(result.activeStudents) || 0,
      totalAssignments: parseInt(result.totalAssignments) || 0,
      averageScore: parseFloat(result.averageScore) || 0,
    };
  }
}
```

### 3. classes.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ClassesRepository } from './classes.repository';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassQueryDto } from './dto/class-query.dto';
import { ClassResponse, ClassListResponse } from './dto/class-response.dto';
import { ClassEntity, ClassStatus } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(private readonly classesRepo: ClassesRepository) {}

  async create(teacherId: string, dto: CreateClassDto): Promise<ClassResponse> {
    // Generate unique invite code
    let inviteCode: string;
    let isUnique = false;
    
    while (!isUnique) {
      inviteCode = nanoid(8).toUpperCase();
      isUnique = await this.classesRepo.isInviteCodeUnique(inviteCode);
    }

    const classEntity = await this.classesRepo.create({
      ...dto,
      teacherId,
      inviteCode,
      status: ClassStatus.DRAFT,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });

    return this.toResponse(classEntity);
  }

  async findAll(teacherId: string, query: ClassQueryDto): Promise<ClassListResponse> {
    const { items, total } = await this.classesRepo.findByTeacher(teacherId, query);
    
    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      items: items.map((item) => this.toResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(classId: string, teacherId?: string): Promise<ClassResponse> {
    const classEntity = await this.classesRepo.findById(classId, teacherId);

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    // Get stats
    const stats = await this.classesRepo.getClassStats(classId);

    return this.toResponse(classEntity, stats);
  }

  async findByInviteCode(inviteCode: string): Promise<ClassResponse> {
    const classEntity = await this.classesRepo.findByInviteCode(inviteCode);

    if (!classEntity) {
      throw new NotFoundException('Invalid or expired invite code');
    }

    return this.toResponse(classEntity);
  }

  async update(
    classId: string,
    teacherId: string,
    dto: UpdateClassDto,
  ): Promise<ClassResponse> {
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own classes');
    }

    // Validate status transitions
    if (dto.status) {
      this.validateStatusTransition(classEntity.status, dto.status);
    }

    const updated = await this.classesRepo.update(classId, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : classEntity.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : classEntity.endDate,
    });

    return this.toResponse(updated);
  }

  async delete(classId: string, teacherId: string): Promise<void> {
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own classes');
    }

    if (classEntity.status === ClassStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete an active class. Archive it first.');
    }

    await this.classesRepo.softDelete(classId);
  }

  async regenerateInviteCode(classId: string, teacherId: string): Promise<string> {
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only modify your own classes');
    }

    let newCode: string;
    let isUnique = false;
    
    while (!isUnique) {
      newCode = nanoid(8).toUpperCase();
      isUnique = await this.classesRepo.isInviteCodeUnique(newCode);
    }

    await this.classesRepo.update(classId, { inviteCode: newCode });

    return newCode;
  }

  private validateStatusTransition(current: ClassStatus, next: ClassStatus): void {
    const validTransitions: Record<ClassStatus, ClassStatus[]> = {
      [ClassStatus.DRAFT]: [ClassStatus.ACTIVE, ClassStatus.ARCHIVED],
      [ClassStatus.ACTIVE]: [ClassStatus.COMPLETED, ClassStatus.ARCHIVED],
      [ClassStatus.COMPLETED]: [ClassStatus.ARCHIVED],
      [ClassStatus.ARCHIVED]: [],
    };

    if (!validTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}`,
      );
    }
  }

  private toResponse(entity: ClassEntity, stats?: any): ClassResponse {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      level: entity.level,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      maxStudents: entity.maxStudents,
      inviteCode: entity.inviteCode,
      teacher: entity.teacher
        ? {
            id: entity.teacher.id,
            name: entity.teacher.name,
            avatar: entity.teacher.avatar,
          }
        : null,
      stats: stats,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
```

### 4. classes.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassQueryDto } from './dto/class-query.dto';
import { ClassResponse, ClassListResponse } from './dto/class-response.dto';
import { UserPayload } from '@/shared/types/user-payload.type';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, type: ClassResponse })
  async create(
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateClassDto,
  ): Promise<ClassResponse> {
    return this.classesService.create(user.id, dto);
  }

  @Get()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Get all classes for teacher' })
  @ApiResponse({ status: 200, type: ClassListResponse })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Query() query: ClassQueryDto,
  ): Promise<ClassListResponse> {
    return this.classesService.findAll(user.id, query);
  }

  @Get('by-code/:code')
  @ApiOperation({ summary: 'Get class by invite code (for students joining)' })
  @ApiResponse({ status: 200, type: ClassResponse })
  @ApiParam({ name: 'code', example: 'ABC12345' })
  async findByInviteCode(@Param('code') code: string): Promise<ClassResponse> {
    return this.classesService.findByInviteCode(code);
  }

  @Get(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, type: ClassResponse })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<ClassResponse> {
    return this.classesService.findOne(id, user.id);
  }

  @Put(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, type: ClassResponse })
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<ClassResponse> {
    return this.classesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles('teacher', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete class (soft delete)' })
  @ApiResponse({ status: 204 })
  async delete(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.classesService.delete(id, user.id);
  }

  @Post(':id/regenerate-code')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Regenerate class invite code' })
  @ApiResponse({ status: 200, schema: { properties: { inviteCode: { type: 'string' } } } })
  async regenerateInviteCode(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<{ inviteCode: string }> {
    const inviteCode = await this.classesService.regenerateInviteCode(id, user.id);
    return { inviteCode };
  }
}
```

### 5. classes.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassStudentEntity } from './entities/class-student.entity';
import { ClassMaterialEntity } from './entities/class-material.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { ClassesRepository } from './classes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassEntity,
      ClassStudentEntity,
      ClassMaterialEntity,
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesRepository],
  exports: [ClassesService, ClassesRepository],
})
export class ClassesModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Create class with auto-generated invite code
- [ ] Update class details (only owner)
- [ ] Delete class (soft delete, only owner)
- [ ] List classes with pagination & filters
- [ ] Get single class with stats
- [ ] Validate status transitions
- [ ] Regenerate invite code
- [ ] Swagger documentation complete
- [ ] Unit tests passing

---

## 🧪 Test Cases

```typescript
describe('ClassesService', () => {
  describe('create', () => {
    it('should create class with unique invite code');
    it('should set status to draft by default');
  });

  describe('update', () => {
    it('should allow owner to update');
    it('should reject non-owner updates');
    it('should validate status transitions');
  });

  describe('delete', () => {
    it('should soft delete class');
    it('should reject deleting active class');
  });

  describe('findByInviteCode', () => {
    it('should find active class by code');
    it('should return 404 for invalid code');
  });
});
```
