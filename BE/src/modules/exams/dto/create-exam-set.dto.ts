import { IsString, IsEnum, IsOptional, IsInt, Min, IsBoolean, MaxLength } from 'class-validator';
import { VstepLevel, ExamSetStatus } from '../../../shared/enums/exam.enum';

export class CreateExamSetDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(VstepLevel)
  level: VstepLevel;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDuration?: number; // minutes

  @IsOptional()
  @IsBoolean()
  isMockTest?: boolean;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
