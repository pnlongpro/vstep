import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, Min, Max, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClassStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum VstepLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export class AdminClassFilterDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by class name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ClassStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional({ enum: VstepLevel, description: 'Filter by level' })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional({ description: 'Filter by teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class ScheduleItemDto {
  @ApiProperty({ description: 'Day of week', example: 'Monday' })
  @IsString()
  day: string;

  @ApiProperty({ description: 'Start time', example: '19:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time', example: '21:00' })
  @IsString()
  endTime: string;
}

export class AdminUpdateClassDto {
  @ApiPropertyOptional({ description: 'Class name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Class description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: VstepLevel, description: 'VSTEP level' })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional({ enum: ClassStatus, description: 'Class status' })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Schedule array' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedule?: ScheduleItemDto[];

  @ApiPropertyOptional({ description: 'Max student limit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  studentLimit?: number;

  @ApiPropertyOptional({ description: 'Teacher ID' })
  @IsOptional()
  @IsUUID()
  teacherId?: string;
}

export class AdminAssignTeacherDto {
  @ApiProperty({ description: 'Teacher ID to assign' })
  @IsUUID()
  teacherId: string;
}

export class AdminAddStudentDto {
  @ApiProperty({ description: 'Student ID to add' })
  @IsUUID()
  studentId: string;
}

export class AdminBulkAddStudentsDto {
  @ApiProperty({ description: 'Array of student IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds: string[];
}
