import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DocumentCategory,
  DocumentType,
  DocumentStatus,
  DocumentVisibility,
} from '../entities/study-material.entity';

// ========== Study Material DTOs ==========

export class StudyMaterialFilterDto {
  @ApiPropertyOptional({ description: 'Search by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: DocumentCategory })
  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({ enum: DocumentVisibility })
  @IsOptional()
  @IsEnum(DocumentVisibility)
  visibility?: DocumentVisibility;

  @ApiPropertyOptional({ description: 'Level (A2, B1, B2, C1)' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

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

export class CreateStudyMaterialDto {
  @ApiProperty({ description: 'Material title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DocumentCategory })
  @IsEnum(DocumentCategory)
  category: DocumentCategory;

  @ApiPropertyOptional({ description: 'Level (A2, B1, B2, C1)' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiPropertyOptional({ description: 'File size string' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeBytes?: number;

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

  @ApiPropertyOptional({ description: 'Number of pages (PDF)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pages?: number;

  @ApiPropertyOptional({ description: 'Duration (video/audio)' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Thumbnail URL' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Media ID' })
  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({ enum: DocumentVisibility })
  @IsOptional()
  @IsEnum(DocumentVisibility)
  visibility?: DocumentVisibility;

  @ApiPropertyOptional({ description: 'Author name' })
  @IsOptional()
  @IsString()
  author?: string;
}

export class UpdateStudyMaterialDto extends PartialType(CreateStudyMaterialDto) {}

export class UpdateMaterialStatusDto {
  @ApiProperty({ enum: DocumentStatus })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiPropertyOptional({ description: 'Rejection reason' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class RateMaterialDto {
  @ApiProperty({ description: 'Rating 1-5', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Review text' })
  @IsOptional()
  @IsString()
  review?: string;
}

// ========== Response DTOs ==========

export class StudyMaterialResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: DocumentCategory })
  category: DocumentCategory;

  @ApiPropertyOptional()
  level?: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentType;

  @ApiPropertyOptional()
  size?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  fileName?: string;

  @ApiPropertyOptional()
  pages?: number;

  @ApiPropertyOptional()
  duration?: string;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiProperty({ enum: DocumentStatus })
  status: DocumentStatus;

  @ApiProperty({ enum: DocumentVisibility })
  visibility: DocumentVisibility;

  @ApiProperty()
  downloads: number;

  @ApiProperty()
  views: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  ratingCount: number;

  @ApiPropertyOptional()
  author?: string;

  @ApiPropertyOptional()
  uploadedBy?: string;

  @ApiPropertyOptional()
  uploadedById?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class StudyMaterialListResponseDto {
  @ApiProperty({ type: [StudyMaterialResponseDto] })
  items: StudyMaterialResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class DocumentStatisticsDto {
  @ApiProperty()
  totalDocuments: number;

  @ApiProperty()
  publishedDocuments: number;

  @ApiProperty()
  pendingDocuments: number;

  @ApiProperty()
  draftDocuments: number;

  @ApiProperty()
  rejectedDocuments: number;

  @ApiProperty()
  totalDownloads: number;

  @ApiProperty()
  totalViews: number;

  @ApiProperty({ type: 'array' })
  byStatus: { status: string; count: number }[];

  @ApiProperty({ type: 'array' })
  byCategory: { category: string; count: number }[];

  @ApiProperty({ type: 'array' })
  topDownloaded: { id: string; title: string; downloads: number }[];

  @ApiProperty({ type: 'array' })
  topRated: { id: string; title: string; rating: number }[];
}
