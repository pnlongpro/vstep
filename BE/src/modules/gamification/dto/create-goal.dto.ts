import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  type: string; // 'exercise_count' | 'avg_score' | 'streak' | 'mock_exam' | 'custom'

  @ApiProperty()
  @IsNumber()
  targetValue: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;
}
