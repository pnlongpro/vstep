import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ClassMaterialV2 } from '../entities/class-material.entity';
import { DocumentStatus } from '../entities/study-material.entity';
import { DocumentView, DocumentDownload } from '../entities/document-tracking.entity';
import {
  ClassMaterialFilterDto,
  CreateClassMaterialDto,
  UpdateClassMaterialDto,
  ClassMaterialResponseDto,
  ClassMaterialListResponseDto,
  ClassMaterialStatisticsDto,
  BulkMaterialActionDto,
} from '../dto/class-material.dto';
import { UpdateMaterialStatusDto } from '../dto/study-material.dto';
import { MediaService } from '../../media/media.service';

@Injectable()
export class ClassMaterialService {
  private readonly logger = new Logger(ClassMaterialService.name);

  constructor(
    @InjectRepository(ClassMaterialV2)
    private readonly materialRepository: Repository<ClassMaterialV2>,
    @InjectRepository(DocumentView)
    private readonly viewRepository: Repository<DocumentView>,
    @InjectRepository(DocumentDownload)
    private readonly downloadRepository: Repository<DocumentDownload>,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Get all class materials with filters
   */
  async findAll(filter: ClassMaterialFilterDto): Promise<ClassMaterialListResponseDto> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;

    const queryBuilder = this.materialRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.uploadedBy', 'uploader');

    // Search filter
    if (filter.search) {
      queryBuilder.andWhere(
        '(m.name LIKE :search OR m.description LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    // Course filter
    if (filter.course) {
      queryBuilder.andWhere('m.course = :course', { course: filter.course });
    }

    // Unit filter
    if (filter.unit) {
      queryBuilder.andWhere('m.unit = :unit', { unit: filter.unit });
    }

    // Skill filter
    if (filter.skill) {
      queryBuilder.andWhere('m.skill = :skill', { skill: filter.skill });
    }

    // Category filter
    if (filter.category) {
      queryBuilder.andWhere('m.category = :category', { category: filter.category });
    }

    // Type filter
    if (filter.type) {
      queryBuilder.andWhere('m.type = :type', { type: filter.type });
    }

    // Status filter
    if (filter.status) {
      queryBuilder.andWhere('m.status = :status', { status: filter.status });
    }

    // Sorting
    const sortOrder = filter.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`m.${filter.sortBy || 'createdAt'}`, sortOrder);

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map((m) => this.toResponseDto(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get approved materials for student view
   */
  async findPublic(filter: ClassMaterialFilterDto): Promise<ClassMaterialListResponseDto> {
    filter.status = DocumentStatus.PUBLISHED;
    return this.findAll(filter);
  }

  /**
   * Get pending contributions (for admin review)
   */
  async findPending(filter: ClassMaterialFilterDto): Promise<ClassMaterialListResponseDto> {
    filter.status = DocumentStatus.PENDING;
    return this.findAll(filter);
  }

  /**
   * Get material by ID
   */
  async findById(id: string): Promise<ClassMaterialV2> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['uploadedBy', 'approvedBy', 'media'],
    });

    if (!material) {
      throw new NotFoundException(`Class material not found: ${id}`);
    }

    return material;
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<ClassMaterialStatisticsDto> {
    const total = await this.materialRepository.count();

    const byStatus = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.status')
      .getRawMany();

    const byCourse = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.course', 'course')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.course')
      .getRawMany();

    const byCategory = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.category')
      .getRawMany();

    const pendingCount = byStatus.find((s) => s.status === DocumentStatus.PENDING)?.count || 0;
    const approvedCount = byStatus.find((s) => s.status === DocumentStatus.PUBLISHED)?.count || 0;
    const rejectedCount = byStatus.find((s) => s.status === DocumentStatus.REJECTED)?.count || 0;

    const countByCourse: Record<string, number> = {};
    byCourse.forEach((c) => {
      countByCourse[c.course] = Number(c.count);
    });

    const countByCategory: Record<string, number> = {};
    byCategory.forEach((c) => {
      countByCategory[c.category] = Number(c.count);
    });

    return {
      totalMaterials: total,
      pendingCount: Number(pendingCount),
      approvedCount: Number(approvedCount),
      rejectedCount: Number(rejectedCount),
      countByCourse,
      countByCategory,
    };
  }

  /**
   * Create new class material
   */
  async create(dto: CreateClassMaterialDto, userId: string): Promise<ClassMaterialV2> {
    this.logger.log(`Creating class material: ${dto.name} by user ${userId}`);

    const material = this.materialRepository.create({
      ...dto,
      uploadedById: userId,
      status: dto.status || DocumentStatus.DRAFT,
    });

    // If mediaId provided, increment reference
    if (dto.mediaId) {
      await this.mediaService.incrementReference(dto.mediaId);
    }

    const saved = await this.materialRepository.save(material);
    this.logger.log(`Class material created: ${saved.id}`);

    return saved;
  }

  /**
   * Update class material
   */
  async update(id: string, dto: UpdateClassMaterialDto): Promise<ClassMaterialV2> {
    this.logger.log(`Updating class material: ${id}`);

    const material = await this.findById(id);
    const oldMediaId = material.mediaId;

    Object.assign(material, dto);

    // Handle media change
    if (dto.mediaId && dto.mediaId !== oldMediaId) {
      if (oldMediaId) {
        await this.mediaService.decrementReference(oldMediaId);
      }
      await this.mediaService.incrementReference(dto.mediaId);
    }

    return this.materialRepository.save(material);
  }

  /**
   * Update material status
   */
  async updateStatus(
    id: string,
    dto: UpdateMaterialStatusDto,
    adminId: string,
  ): Promise<ClassMaterialV2> {
    this.logger.log(`Updating status for ${id} to ${dto.status}`);

    const material = await this.findById(id);

    material.status = dto.status;

    if (dto.status === DocumentStatus.PUBLISHED) {
      material.approvedById = adminId;
      material.approvedAt = new Date();
      material.rejectionReason = null;
    }

    if (dto.status === DocumentStatus.REJECTED) {
      material.rejectionReason = dto.rejectionReason || 'No reason provided';
      material.approvedById = adminId;
      material.approvedAt = new Date();
    }

    return this.materialRepository.save(material);
  }

  /**
   * Delete class material
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting class material: ${id}`);

    const material = await this.findById(id);

    // Decrement media reference
    if (material.mediaId) {
      try {
        await this.mediaService.decrementReference(material.mediaId);
      } catch (error) {
        this.logger.warn(`Failed to decrement media ref: ${error.message}`);
      }
    }

    await this.materialRepository.remove(material);
  }

  /**
   * Bulk action on materials
   */
  async bulkAction(dto: BulkMaterialActionDto, adminId: string): Promise<{ affected: number }> {
    this.logger.log(`Bulk action ${dto.action} on ${dto.ids.length} materials`);

    const materials = await this.materialRepository.find({
      where: { id: In(dto.ids) },
    });

    if (materials.length === 0) {
      throw new NotFoundException('No materials found');
    }

    let affected = 0;

    switch (dto.action) {
      case 'publish':
      case 'approve':
        await this.materialRepository.update(
          { id: In(dto.ids) },
          {
            status: DocumentStatus.PUBLISHED,
            approvedById: adminId,
            approvedAt: new Date(),
          },
        );
        affected = materials.length;
        break;

      case 'unpublish':
        await this.materialRepository.update(
          { id: In(dto.ids) },
          { status: DocumentStatus.DRAFT },
        );
        affected = materials.length;
        break;

      case 'reject':
        await this.materialRepository.update(
          { id: In(dto.ids) },
          {
            status: DocumentStatus.REJECTED,
            rejectionReason: dto.reason || 'Bulk rejected',
            approvedById: adminId,
            approvedAt: new Date(),
          },
        );
        affected = materials.length;
        break;

      case 'delete':
        for (const m of materials) {
          if (m.mediaId) {
            try {
              await this.mediaService.decrementReference(m.mediaId);
            } catch (error) {
              this.logger.warn(`Failed to decrement media ref: ${error.message}`);
            }
          }
        }
        await this.materialRepository.remove(materials);
        affected = materials.length;
        break;
    }

    return { affected };
  }

  /**
   * Increment view count
   */
  async incrementView(id: string, userId?: string, ip?: string): Promise<void> {
    await this.materialRepository.increment({ id }, 'views', 1);

    const view = this.viewRepository.create({
      materialId: id,
      documentType: 'class',
      userId,
      ipAddress: ip,
    });
    await this.viewRepository.save(view);
  }

  /**
   * Increment download count
   */
  async incrementDownload(id: string, userId?: string, ip?: string): Promise<void> {
    await this.materialRepository.increment({ id }, 'downloads', 1);

    const download = this.downloadRepository.create({
      materialId: id,
      documentType: 'class',
      userId,
      ipAddress: ip,
    });
    await this.downloadRepository.save(download);
  }

  /**
   * Get materials by course
   */
  async findByCourse(course: string): Promise<ClassMaterialV2[]> {
    return this.materialRepository.find({
      where: { course, status: DocumentStatus.PUBLISHED },
      order: { unit: 'ASC', createdAt: 'DESC' },
    });
  }

  /**
   * Get available courses with material counts
   */
  async getCourses(): Promise<{ course: string; count: number }[]> {
    return this.materialRepository
      .createQueryBuilder('m')
      .select('m.course', 'course')
      .addSelect('COUNT(*)', 'count')
      .where('m.status = :status', { status: DocumentStatus.PUBLISHED })
      .groupBy('m.course')
      .getRawMany();
  }

  /**
   * Transform entity to response DTO
   */
  private toResponseDto(material: ClassMaterialV2): ClassMaterialResponseDto {
    return {
      id: material.id,
      name: material.name,
      description: material.description,
      course: material.course,
      unit: material.unit,
      skill: material.skill,
      category: material.category,
      type: material.type,
      size: material.size,
      duration: material.duration,
      url: material.url || material.media?.url,
      fileName: material.fileName,
      status: material.status,
      downloads: material.downloads,
      views: material.views,
      uploadedBy: material.uploadedBy
        ? `${material.uploadedBy.firstName || ''} ${material.uploadedBy.lastName || ''}`.trim() ||
          material.uploadedBy.email
        : undefined,
      uploadedById: material.uploadedById,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  }
}
