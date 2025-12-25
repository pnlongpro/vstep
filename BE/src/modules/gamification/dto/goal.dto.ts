import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalType } from '../entities/goal.entity';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: GoalType })
  @IsEnum(GoalType)
  @IsOptional()
  type?: GoalType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  targetValue: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  xpReward?: number;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateGoalProgressDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  progress: number;
}
