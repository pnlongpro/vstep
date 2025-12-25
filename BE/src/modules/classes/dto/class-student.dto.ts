import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus } from '../entities/class-student.entity';

export class EnrollStudentDto {
  @ApiProperty({ description: 'Student user ID' })
  @IsUUID()
  studentId: string;
}

export class EnrollStudentsDto {
  @ApiProperty({ description: 'Array of student user IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds: string[];
}

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ enum: EnrollmentStatus })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}

export class JoinByCodeDto {
  @ApiProperty({ example: 'ABC12345', description: 'Class invite code' })
  @IsString()
  inviteCode: string;
}
