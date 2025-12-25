import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { CourseClassStatus } from '../entities';

export class CreateCourseClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructor?: string;

  @IsInt()
  @Min(0)
  students: number;

  @IsInt()
  @Min(1)
  maxStudents: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CourseClassStatus)
  status?: CourseClassStatus;

  @IsOptional()
  @IsString()
  schedule?: string;
}

export class UpdateCourseClassDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructor?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  students?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(CourseClassStatus)
  status?: CourseClassStatus;

  @IsOptional()
  @IsString()
  schedule?: string;
}

export class CourseClassIdParam {
  @IsUUID()
  id: string;
}
