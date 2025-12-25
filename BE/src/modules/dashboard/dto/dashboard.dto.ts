import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VstepLevel } from '../entities/learning-roadmap.entity';

export class DashboardOverviewDto {
  totalStudyMinutes: number;
  testsCompleted: number;
  practiceSessions: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: number;
  skillScores: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
}

export class ActivityQueryDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;
}

export class CalendarQueryDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateRoadmapDto {
  @ApiPropertyOptional({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  @IsOptional()
  targetLevel?: VstepLevel;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(180)
  @IsOptional()
  dailyGoalMinutes?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(14)
  @IsOptional()
  weeklyGoalTests?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  focusSkills?: string[];
}

export class CreateRoadmapDto {
  @ApiProperty({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  currentLevel: VstepLevel;

  @ApiProperty({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  targetLevel: VstepLevel;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(180)
  @IsOptional()
  dailyGoalMinutes?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  focusSkills?: string[];
}
