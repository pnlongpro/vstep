import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '@/core/logger/winston-logger.service';
import { StudyMaterialService } from '../../documents/services/study-material.service';
import {
  StudyMaterialFilterDto,
  CreateStudyMaterialDto,
  UpdateStudyMaterialDto,
  UpdateMaterialStatusDto,
} from '../../documents/dto/study-material.dto';
import { AdminLogService } from './admin-log.service';

/**
 * DocumentManagementService - Adapter service for Admin module
 * Delegates all operations to StudyMaterialService from Documents module
 */
@Injectable()
export class DocumentManagementService {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly studyMaterialService: StudyMaterialService,
    private readonly adminLogService: AdminLogService,
  ) {}

  /**
   * Get all documents with filters (Admin view)
   */
  async findAll(filter: StudyMaterialFilterDto) {
    this.logger.log(`[ADMIN_DOCUMENTS] Query with filter: ${JSON.stringify(filter)}`);

    const result = await this.studyMaterialService.findAllAdmin(filter);

    // Transform to match old API response format for backward compatibility
    const transformedItems = result.items.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      level: doc.level,
      type: doc.type,
      size: doc.size,
      url: doc.url,
      fileName: doc.fileName || doc.url?.split('/').pop() || '',
      status: doc.status,
      visibility: doc.visibility,
      downloads: doc.downloads,
      views: doc.views,
      uploadedBy: doc.uploadedBy || 'Unknown',
      uploadedById: doc.uploadedById,
      uploadDate: doc.createdAt?.toISOString?.()?.split('T')[0] || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return {
      items: transformedItems,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Get document by ID
   */
  async findById(id: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Finding document: ${id}`);
    const doc = await this.studyMaterialService.findById(id);
    
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      level: doc.level,
      type: doc.type,
      size: doc.size,
      url: doc.url,
      fileName: doc.fileName,
      status: doc.status,
      visibility: doc.visibility,
      downloads: doc.downloads,
      views: doc.views,
      rating: doc.rating,
      ratingCount: doc.ratingCount,
      uploadedBy: doc.uploadedBy
        ? `${doc.uploadedBy.firstName || ''} ${doc.uploadedBy.lastName || ''}`.trim() || doc.uploadedBy.email
        : 'Unknown',
      uploadedById: doc.uploadedById,
      approvedBy: doc.approvedBy
        ? `${doc.approvedBy.firstName || ''} ${doc.approvedBy.lastName || ''}`.trim()
        : null,
      approvedAt: doc.approvedAt?.toISOString() || null,
      rejectionReason: doc.rejectionReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Get document statistics
   */
  async getStatistics() {
    this.logger.log('[ADMIN_DOCUMENTS] Fetching statistics');
    return this.studyMaterialService.getStatistics();
  }

  /**
   * Create new document
   */
  async create(dto: CreateStudyMaterialDto, adminId: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Admin ${adminId} creating document: ${dto.title}`);

    const saved = await this.studyMaterialService.create(dto, adminId);

    await this.adminLogService.create(adminId, {
      action: 'document.create',
      entityType: 'study_material',
      entityId: saved.id,
      newData: { title: dto.title, category: dto.category },
    });

    return saved;
  }

  /**
   * Update document
   */
  async update(id: string, dto: UpdateStudyMaterialDto, adminId: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Admin ${adminId} updating document ${id}`);

    const updated = await this.studyMaterialService.update(id, dto, adminId);

    await this.adminLogService.create(adminId, {
      action: 'document.update',
      entityType: 'study_material',
      entityId: id,
      newData: dto,
    });

    return updated;
  }

  /**
   * Update document status
   */
  async updateStatus(id: string, dto: UpdateMaterialStatusDto, adminId: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Admin ${adminId} updating status of ${id} to ${dto.status}`);

    const updated = await this.studyMaterialService.updateStatus(id, dto, adminId);

    await this.adminLogService.create(adminId, {
      action: 'document.status_change',
      entityType: 'study_material',
      entityId: id,
      newData: { status: dto.status, rejectionReason: dto.rejectionReason },
    });

    return updated;
  }

  /**
   * Delete document
   */
  async delete(id: string, adminId: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Admin ${adminId} deleting document ${id}`);

    await this.studyMaterialService.delete(id);

    await this.adminLogService.create(adminId, {
      action: 'document.delete',
      entityType: 'study_material',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Bulk action on documents
   */
  async bulkAction(dto: { documentIds: string[]; action: string; reason?: string }, adminId: string) {
    this.logger.log(`[ADMIN_DOCUMENTS] Admin ${adminId} performing ${dto.action} on ${dto.documentIds.length} documents`);

    let affected = 0;
    const { DocumentStatus } = await import('../../documents/entities/study-material.entity');

    for (const docId of dto.documentIds) {
      try {
        switch (dto.action) {
          case 'publish':
          case 'approve':
            await this.studyMaterialService.updateStatus(
              docId,
              { status: DocumentStatus.PUBLISHED },
              adminId,
            );
            affected++;
            break;
          case 'unpublish':
            await this.studyMaterialService.updateStatus(
              docId,
              { status: DocumentStatus.DRAFT },
              adminId,
            );
            affected++;
            break;
          case 'reject':
            await this.studyMaterialService.updateStatus(
              docId,
              { status: DocumentStatus.REJECTED, rejectionReason: dto.reason },
              adminId,
            );
            affected++;
            break;
          case 'delete':
            await this.studyMaterialService.delete(docId);
            affected++;
            break;
        }
      } catch (error) {
        this.logger.warn(`[ADMIN_DOCUMENTS] Failed to ${dto.action} document ${docId}: ${error.message}`);
      }
    }

    await this.adminLogService.create(adminId, {
      action: `document.bulk_${dto.action}`,
      entityType: 'study_material',
      newData: { documentIds: dto.documentIds, reason: dto.reason, affected },
    });

    return { affected };
  }

  /**
   * Increment document views
   */
  async incrementViews(id: string) {
    await this.studyMaterialService.incrementView(id);
  }

  /**
   * Increment document downloads
   */
  async incrementDownloads(id: string) {
    await this.studyMaterialService.incrementDownload(id);
  }
}
