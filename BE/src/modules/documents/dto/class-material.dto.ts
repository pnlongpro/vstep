import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ClassMaterialCategory,
  ClassMaterialType,
} from '../entities/class-material.entity';
import { DocumentStatus } from '../entities/study-material.entity';

// ========== Class Material DTOs ==========

export class ClassMaterialFilterDto {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Course name' })
  @IsOptional()
  @IsString()
  course?: string;

  @ApiPropertyOptional({ description: 'Unit' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Skill (Reading, Listening, etc.)' })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({ enum: ClassMaterialCategory })
  @IsOptional()
  @IsEnum(ClassMaterialCategory)
  category?: ClassMaterialCategory;

  @ApiPropertyOptional({ enum: ClassMaterialType })
  @IsOptional()
  @IsEnum(ClassMaterialType)
  type?: ClassMaterialType;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}

export class CreateClassMaterialDto {
  @ApiProperty({ description: 'Material name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Course name' })
  @IsString()
  course: string;

  @ApiPropertyOptional({ description: 'Unit' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Skill' })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiProperty({ enum: ClassMaterialCategory })
  @IsEnum(ClassMaterialCategory)
  category: ClassMaterialCategory;

  @ApiProperty({ enum: ClassMaterialType })
  @IsEnum(ClassMaterialType)
  type: ClassMaterialType;

  @ApiPropertyOptional({ description: 'File size string' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeBytes?: number;

  @ApiPropertyOptional({ description: 'Duration (video/audio)' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'File URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'File name' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({ description: 'MIME type' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Media ID' })
  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}

export class UpdateClassMaterialDto extends PartialType(CreateClassMaterialDto) {}

// ========== Response DTOs ==========

export class ClassMaterialResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  course: string;

  @ApiPropertyOptional()
  unit?: string;

  @ApiPropertyOptional()
  skill?: string;

  @ApiProperty({ enum: ClassMaterialCategory })
  category: ClassMaterialCategory;

  @ApiProperty({ enum: ClassMaterialType })
  type: ClassMaterialType;

  @ApiPropertyOptional()
  size?: string;

  @ApiPropertyOptional()
  duration?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  fileName?: string;

  @ApiProperty({ enum: DocumentStatus })
  status: DocumentStatus;

  @ApiProperty()
  downloads: number;

  @ApiProperty()
  views: number;

  @ApiPropertyOptional()
  uploadedBy?: string;

  @ApiPropertyOptional()
  uploadedById?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ClassMaterialListResponseDto {
  @ApiProperty({ type: [ClassMaterialResponseDto] })
  items: ClassMaterialResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class ClassMaterialStatisticsDto {
  @ApiProperty()
  totalMaterials: number;

  @ApiProperty()
  pendingCount: number;

  @ApiProperty()
  approvedCount: number;

  @ApiProperty()
  rejectedCount: number;

  @ApiProperty({ type: 'object' })
  countByCourse: Record<string, number>;

  @ApiProperty({ type: 'object' })
  countByCategory: Record<string, number>;
}

// ========== Bulk Action DTO ==========

export class BulkMaterialActionDto {
  @ApiProperty({ description: 'Array of material IDs' })
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({ enum: ['publish', 'unpublish', 'delete', 'approve', 'reject'] })
  @IsString()
  action: 'publish' | 'unpublish' | 'delete' | 'approve' | 'reject';

  @ApiPropertyOptional({ description: 'Reason for action' })
  @IsOptional()
  @IsString()
  reason?: string;
}
