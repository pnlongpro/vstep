/**
 * Document Management DTOs for Admin module
 * Re-exports from Documents module for backward compatibility
 */
export {
  StudyMaterialFilterDto as DocumentFilterDto,
  CreateStudyMaterialDto as CreateDocumentDto,
  UpdateStudyMaterialDto as UpdateDocumentDto,
  UpdateMaterialStatusDto as UpdateDocumentStatusDto,
  DocumentStatisticsDto,
} from '../../documents/dto/study-material.dto';

export {
  DocumentCategory,
  DocumentStatus,
  DocumentVisibility,
  DocumentType,
} from '../../documents/entities/study-material.entity';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

// Bulk action DTO (specific to admin)
export class BulkDocumentActionDto {
  @ApiProperty({ description: 'Document IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  documentIds: string[];

  @ApiProperty({ 
    description: 'Action to perform',
    enum: ['publish', 'unpublish', 'approve', 'reject', 'delete'],
  })
  @IsString()
  action: 'publish' | 'unpublish' | 'approve' | 'reject' | 'delete';

  @ApiPropertyOptional({ description: 'Reason for rejection' })
  @IsOptional()
  @IsString()
  reason?: string;
}
