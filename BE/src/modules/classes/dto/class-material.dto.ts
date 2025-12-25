import { IsString, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialType } from '../entities/class-material.entity';

export class CreateMaterialDto {
  @ApiProperty({ example: 'Grammar Notes - Lesson 1' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Tài liệu ngữ pháp bài 1' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: MaterialType, default: MaterialType.DOCUMENT })
  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;

  @ApiPropertyOptional({ description: 'External link if type is LINK' })
  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class UpdateMaterialDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: MaterialType })
  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
