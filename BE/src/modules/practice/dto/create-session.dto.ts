import { IsEnum, IsUUID, IsOptional, IsInt, IsObject } from 'class-validator';
import { Skill, VstepLevel } from '../../../shared/enums/exam.enum';
import { PracticeMode } from '../../../shared/enums/practice.enum';

export class CreateSessionDto {
  @IsEnum(Skill)
  skill: Skill;

  @IsEnum(VstepLevel)
  level: VstepLevel;

  @IsEnum(PracticeMode)
  @IsOptional()
  mode?: PracticeMode = PracticeMode.PRACTICE;

  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @IsInt()
  @IsOptional()
  questionCount?: number;

  @IsInt()
  @IsOptional()
  timeLimit?: number; // seconds

  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;
}
