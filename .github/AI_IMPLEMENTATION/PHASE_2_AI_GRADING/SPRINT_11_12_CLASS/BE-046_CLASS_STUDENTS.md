# BE-046: Class Students Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-046 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-044, BE-045 |

---

## 🎯 Objective

Implement student management for classes:
- Join class by invite code
- Add students directly (teacher)
- Remove students from class
- List class students with stats
- Update student status

---

## 📁 Files to Create/Update

```
src/modules/classes/
├── class-students.service.ts     # NEW
├── class-students.controller.ts  # NEW
├── dto/
│   ├── join-class.dto.ts        # NEW
│   ├── add-students.dto.ts      # NEW
│   └── class-student-response.dto.ts  # NEW
└── classes.module.ts            # UPDATE
```

---

## 📝 Implementation

### 1. DTOs

#### join-class.dto.ts

```typescript
import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinClassDto {
  @ApiProperty({ 
    example: 'ABC12345',
    description: 'Class invite code (8 characters)' 
  })
  @IsString()
  @Length(8, 8)
  inviteCode: string;
}
```

#### add-students.dto.ts

```typescript
import { IsArray, IsString, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddStudentsDto {
  @ApiProperty({ 
    example: ['student-uuid-1', 'student-uuid-2'],
    description: 'Array of student user IDs to add' 
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  studentIds: string[];

  @ApiPropertyOptional({ 
    example: 'Chào mừng các bạn đến với lớp học!',
    description: 'Welcome message to send to students' 
  })
  @IsOptional()
  @IsString()
  welcomeMessage?: string;
}

export class RemoveStudentDto {
  @ApiPropertyOptional({ 
    example: 'Học viên rời lớp theo yêu cầu',
    description: 'Reason for removal' 
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
```

#### class-student-response.dto.ts

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentProgressStats {
  @ApiProperty()
  totalAssignments: number;

  @ApiProperty()
  completedAssignments: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  lastActivityAt: Date | null;
}

export class ClassStudentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  studentName: string;

  @ApiPropertyOptional()
  studentAvatar?: string;

  @ApiProperty()
  studentEmail: string;

  @ApiProperty({ enum: ['active', 'inactive', 'removed'] })
  status: string;

  @ApiProperty()
  enrolledAt: Date;

  @ApiPropertyOptional({ type: StudentProgressStats })
  progress?: StudentProgressStats;
}

export class ClassStudentsListResponse {
  @ApiProperty({ type: [ClassStudentResponse] })
  students: ClassStudentResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  activeCount: number;
}
```

### 2. class-students.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClassEntity, ClassStatus } from './entities/class.entity';
import { ClassStudentEntity, StudentStatus } from './entities/class-student.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ClassesRepository } from './classes.repository';
import { AddStudentsDto } from './dto/add-students.dto';
import { ClassStudentResponse, ClassStudentsListResponse, StudentProgressStats } from './dto/class-student-response.dto';

@Injectable()
export class ClassStudentsService {
  constructor(
    private readonly classesRepo: ClassesRepository,
    @InjectRepository(ClassStudentEntity)
    private readonly classStudentRepo: Repository<ClassStudentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Student joins class using invite code
   */
  async joinByInviteCode(
    studentId: string,
    inviteCode: string,
  ): Promise<ClassStudentResponse> {
    // Find class by invite code
    const classEntity = await this.classesRepo.findByInviteCode(inviteCode);

    if (!classEntity) {
      throw new NotFoundException('Invalid or expired invite code');
    }

    if (classEntity.status !== ClassStatus.ACTIVE) {
      throw new BadRequestException('This class is not accepting new students');
    }

    // Check if already enrolled
    const existing = await this.classStudentRepo.findOne({
      where: { classId: classEntity.id, studentId },
    });

    if (existing) {
      if (existing.status === StudentStatus.ACTIVE) {
        throw new ConflictException('You are already enrolled in this class');
      }
      // Re-activate if was removed
      existing.status = StudentStatus.ACTIVE;
      existing.enrolledAt = new Date();
      await this.classStudentRepo.save(existing);
      return this.toResponse(existing);
    }

    // Check max students limit
    const currentCount = await this.classStudentRepo.count({
      where: { classId: classEntity.id, status: StudentStatus.ACTIVE },
    });

    if (classEntity.maxStudents && currentCount >= classEntity.maxStudents) {
      throw new BadRequestException('This class has reached maximum capacity');
    }

    // Create enrollment
    const enrollment = this.classStudentRepo.create({
      classId: classEntity.id,
      studentId,
      status: StudentStatus.ACTIVE,
      enrolledAt: new Date(),
    });

    await this.classStudentRepo.save(enrollment);

    // Load student info
    const student = await this.userRepo.findOne({ where: { id: studentId } });
    enrollment.student = student;

    return this.toResponse(enrollment);
  }

  /**
   * Teacher adds students directly
   */
  async addStudents(
    classId: string,
    teacherId: string,
    dto: AddStudentsDto,
  ): Promise<ClassStudentResponse[]> {
    // Verify class ownership
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can add students');
    }

    // Verify all students exist and have student role
    const students = await this.userRepo.find({
      where: { id: In(dto.studentIds) },
      relations: ['roles'],
    });

    if (students.length !== dto.studentIds.length) {
      throw new BadRequestException('Some student IDs are invalid');
    }

    // Filter out already enrolled students
    const existingEnrollments = await this.classStudentRepo.find({
      where: { classId, studentId: In(dto.studentIds) },
    });

    const existingIds = new Set(existingEnrollments.map((e) => e.studentId));
    const newStudentIds = dto.studentIds.filter((id) => !existingIds.has(id));

    // Check capacity
    const currentCount = await this.classStudentRepo.count({
      where: { classId, status: StudentStatus.ACTIVE },
    });

    if (classEntity.maxStudents && currentCount + newStudentIds.length > classEntity.maxStudents) {
      throw new BadRequestException(
        `Cannot add ${newStudentIds.length} students. Class capacity is ${classEntity.maxStudents}, current: ${currentCount}`,
      );
    }

    // Create enrollments
    const enrollments = newStudentIds.map((studentId) =>
      this.classStudentRepo.create({
        classId,
        studentId,
        status: StudentStatus.ACTIVE,
        enrolledAt: new Date(),
      }),
    );

    await this.classStudentRepo.save(enrollments);

    // Re-activate removed students
    for (const existing of existingEnrollments) {
      if (existing.status === StudentStatus.REMOVED) {
        existing.status = StudentStatus.ACTIVE;
        existing.enrolledAt = new Date();
        await this.classStudentRepo.save(existing);
      }
    }

    // Load full data
    const allEnrollments = await this.classStudentRepo.find({
      where: { classId, studentId: In(dto.studentIds), status: StudentStatus.ACTIVE },
      relations: ['student'],
    });

    // TODO: Send welcome notification if dto.welcomeMessage

    return allEnrollments.map((e) => this.toResponse(e));
  }

  /**
   * Get all students in a class
   */
  async getClassStudents(
    classId: string,
    teacherId: string,
  ): Promise<ClassStudentsListResponse> {
    // Verify access
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You can only view students in your own classes');
    }

    const enrollments = await this.classStudentRepo.find({
      where: { classId },
      relations: ['student'],
      order: { enrolledAt: 'DESC' },
    });

    // Get progress stats for each student
    const studentsWithProgress = await Promise.all(
      enrollments.map(async (e) => {
        const progress = await this.getStudentProgress(classId, e.studentId);
        return this.toResponse(e, progress);
      }),
    );

    const activeCount = enrollments.filter(
      (e) => e.status === StudentStatus.ACTIVE,
    ).length;

    return {
      students: studentsWithProgress,
      total: enrollments.length,
      activeCount,
    };
  }

  /**
   * Remove student from class
   */
  async removeStudent(
    classId: string,
    studentId: string,
    teacherId: string,
    reason?: string,
  ): Promise<void> {
    const classEntity = await this.classesRepo.findById(classId);

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can remove students');
    }

    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this class');
    }

    enrollment.status = StudentStatus.REMOVED;
    enrollment.removedAt = new Date();
    enrollment.removeReason = reason;

    await this.classStudentRepo.save(enrollment);

    // TODO: Send notification to student about removal
  }

  /**
   * Student leaves class voluntarily
   */
  async leaveClass(classId: string, studentId: string): Promise<void> {
    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId, status: StudentStatus.ACTIVE },
    });

    if (!enrollment) {
      throw new NotFoundException('You are not enrolled in this class');
    }

    enrollment.status = StudentStatus.INACTIVE;
    enrollment.removedAt = new Date();
    enrollment.removeReason = 'Student left voluntarily';

    await this.classStudentRepo.save(enrollment);
  }

  /**
   * Get student's classes
   */
  async getStudentClasses(studentId: string): Promise<any[]> {
    const enrollments = await this.classStudentRepo.find({
      where: { studentId, status: StudentStatus.ACTIVE },
      relations: ['class', 'class.teacher'],
    });

    return enrollments.map((e) => ({
      id: e.class.id,
      name: e.class.name,
      level: e.class.level,
      teacher: {
        id: e.class.teacher.id,
        name: e.class.teacher.name,
      },
      enrolledAt: e.enrolledAt,
    }));
  }

  private async getStudentProgress(
    classId: string,
    studentId: string,
  ): Promise<StudentProgressStats> {
    // TODO: Implement actual progress calculation from assignments
    return {
      totalAssignments: 0,
      completedAssignments: 0,
      averageScore: 0,
      lastActivityAt: null,
    };
  }

  private toResponse(
    enrollment: ClassStudentEntity,
    progress?: StudentProgressStats,
  ): ClassStudentResponse {
    return {
      id: enrollment.id,
      studentId: enrollment.studentId,
      studentName: enrollment.student?.name || 'Unknown',
      studentAvatar: enrollment.student?.avatar,
      studentEmail: enrollment.student?.email || '',
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      progress,
    };
  }
}
```

### 3. class-students.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
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
import { ClassStudentsService } from './class-students.service';
import { JoinClassDto } from './dto/join-class.dto';
import { AddStudentsDto, RemoveStudentDto } from './dto/add-students.dto';
import { ClassStudentResponse, ClassStudentsListResponse } from './dto/class-student-response.dto';
import { UserPayload } from '@/shared/types/user-payload.type';

@ApiTags('Class Students')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassStudentsController {
  constructor(private readonly classStudentsService: ClassStudentsService) {}

  // ============ STUDENT ACTIONS ============

  @Post('join')
  @Roles('student')
  @ApiOperation({ summary: 'Join a class using invite code' })
  @ApiResponse({ status: 201, type: ClassStudentResponse })
  async joinClass(
    @CurrentUser() user: UserPayload,
    @Body() dto: JoinClassDto,
  ): Promise<ClassStudentResponse> {
    return this.classStudentsService.joinByInviteCode(user.id, dto.inviteCode);
  }

  @Get('my-classes')
  @Roles('student')
  @ApiOperation({ summary: 'Get classes I am enrolled in' })
  async getMyClasses(@CurrentUser() user: UserPayload): Promise<any[]> {
    return this.classStudentsService.getStudentClasses(user.id);
  }

  @Post(':classId/leave')
  @Roles('student')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Leave a class' })
  @ApiParam({ name: 'classId', type: 'string' })
  async leaveClass(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
  ): Promise<void> {
    return this.classStudentsService.leaveClass(classId, user.id);
  }

  // ============ TEACHER ACTIONS ============

  @Get(':classId/students')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Get all students in a class' })
  @ApiResponse({ status: 200, type: ClassStudentsListResponse })
  @ApiParam({ name: 'classId', type: 'string' })
  async getClassStudents(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
  ): Promise<ClassStudentsListResponse> {
    return this.classStudentsService.getClassStudents(classId, user.id);
  }

  @Post(':classId/students')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Add students to a class' })
  @ApiResponse({ status: 201, type: [ClassStudentResponse] })
  @ApiParam({ name: 'classId', type: 'string' })
  async addStudents(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
    @Body() dto: AddStudentsDto,
  ): Promise<ClassStudentResponse[]> {
    return this.classStudentsService.addStudents(classId, user.id, dto);
  }

  @Delete(':classId/students/:studentId')
  @Roles('teacher', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a student from class' })
  @ApiParam({ name: 'classId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  async removeStudent(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
    @Body() dto: RemoveStudentDto,
  ): Promise<void> {
    return this.classStudentsService.removeStudent(
      classId,
      studentId,
      user.id,
      dto.reason,
    );
  }
}
```

### 4. Update classes.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassStudentEntity } from './entities/class-student.entity';
import { ClassMaterialEntity } from './entities/class-material.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ClassesController } from './classes.controller';
import { ClassStudentsController } from './class-students.controller';
import { ClassesService } from './classes.service';
import { ClassStudentsService } from './class-students.service';
import { ClassesRepository } from './classes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassEntity,
      ClassStudentEntity,
      ClassMaterialEntity,
      UserEntity,
    ]),
  ],
  controllers: [ClassesController, ClassStudentsController],
  providers: [ClassesService, ClassStudentsService, ClassesRepository],
  exports: [ClassesService, ClassStudentsService, ClassesRepository],
})
export class ClassesModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Student can join class with invite code
- [ ] Teacher can add multiple students at once
- [ ] Teacher can remove students with reason
- [ ] Student can leave class voluntarily
- [ ] List students with pagination
- [ ] Show student progress stats
- [ ] Validate max students limit
- [ ] Handle re-enrollment properly
- [ ] Proper error messages

---

## 🧪 Test Cases

```typescript
describe('ClassStudentsService', () => {
  describe('joinByInviteCode', () => {
    it('should enroll student with valid code');
    it('should reject invalid code');
    it('should reject if class is not active');
    it('should reject if already enrolled');
    it('should reject if class is full');
    it('should re-activate removed student');
  });

  describe('addStudents', () => {
    it('should add multiple students');
    it('should skip already enrolled students');
    it('should reject if capacity exceeded');
    it('should reject non-owner teacher');
  });

  describe('removeStudent', () => {
    it('should mark student as removed');
    it('should reject non-owner teacher');
  });
});
```
