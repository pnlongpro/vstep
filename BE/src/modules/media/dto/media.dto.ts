import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { MediaCategory, MediaStatus } from '../entities/media.entity';

export class UploadMediaDto {
  @ApiPropertyOptional({ description: 'Custom file name' })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiPropertyOptional({
    enum: MediaCategory,
    description: 'Media category',
    default: MediaCategory.DOCUMENT,
  })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;
}

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  storedName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  sizeHuman: string;

  @ApiProperty({ enum: MediaCategory })
  category: MediaCategory;

  @ApiProperty({ enum: MediaStatus })
  status: MediaStatus;

  @ApiProperty()
  referenceCount: number;

  @ApiPropertyOptional()
  uploadedById?: string;

  @ApiProperty()
  createdAt: Date;
}

export class MediaQueryDto {
  @ApiPropertyOptional({ enum: MediaCategory })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;

  @ApiPropertyOptional({ enum: MediaStatus })
  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

  @ApiPropertyOptional({ description: 'Search by original name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class UpdateMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalName?: string;

  @ApiPropertyOptional({ enum: MediaCategory })
  @IsOptional()
  @IsEnum(MediaCategory)
  category?: MediaCategory;
}

export class DeleteMediaDto {
  @ApiProperty({ description: 'Force delete even if has references' })
  @IsOptional()
  force?: boolean;
}

export class MediaListResponseDto {
  @ApiProperty({ type: [MediaResponseDto] })
  data: MediaResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
