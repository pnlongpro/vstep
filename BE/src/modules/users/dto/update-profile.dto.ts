import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsOptional()
  @IsEnum(['A2', 'B1', 'B2', 'C1'])
  currentLevel?: string;

  @ApiProperty({ required: false, enum: ['A2', 'B1', 'B2', 'C1'] })
  @IsOptional()
  @IsEnum(['A2', 'B1', 'B2', 'C1'])
  targetLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
