import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { VstepLevel, ExamSetStatus } from '../../../shared/enums/exam.enum';

export class ExamSetFilterDto {
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @IsOptional()
  @IsEnum(ExamSetStatus)
  status?: ExamSetStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
