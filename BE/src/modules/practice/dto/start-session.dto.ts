import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class StartSessionDto {
  @ApiProperty({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  @IsEnum(['reading', 'listening', 'writing', 'speaking'])
  skill: string;

  @ApiProperty({ enum: ['part', 'task', 'full'] })
  @IsEnum(['part', 'task', 'full'])
  mode: string;

  @ApiProperty({ enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsEnum(['A2', 'B1', 'B2', 'C1'])
  level: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  exerciseId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  partNumber?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taskType?: string;
}
