import { IsString, IsEnum, IsOptional, IsInt, Min, Max, MaxLength, IsUUID } from 'class-validator';
import { Skill } from '../../../shared/enums/exam.enum';

export class CreateSectionDto {
  @IsUUID()
  examSetId: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsEnum(Skill)
  skill: Skill;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @IsInt()
  @Min(1)
  @Max(120)
  duration: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;
}
