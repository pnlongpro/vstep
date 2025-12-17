import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VstepLevel, Skill, QuestionType, DifficultyLevel } from '../../../shared/enums/exam.enum';

export class CreateQuestionOptionDto {
  @IsString()
  label: string;

  @IsString()
  content: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateQuestionDto {
  @IsEnum(Skill)
  skill: Skill;

  @IsEnum(VstepLevel)
  level: VstepLevel;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsNumber()
  wordLimit?: number;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options?: CreateQuestionOptionDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @IsUUID()
  passageId?: string;
}
