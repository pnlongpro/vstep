import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere, Like } from 'typeorm';
import {
  StudyMaterial,
  DocumentStatus,
  DocumentVisibility,
} from '../entities/study-material.entity';
import {
  DocumentRating,
  DocumentBookmark,
  DocumentView,
  DocumentDownload,
} from '../entities/document-tracking.entity';
import {
  StudyMaterialFilterDto,
  CreateStudyMaterialDto,
  UpdateStudyMaterialDto,
  UpdateMaterialStatusDto,
  RateMaterialDto,
  StudyMaterialResponseDto,
  StudyMaterialListResponseDto,
  DocumentStatisticsDto,
} from '../dto/study-material.dto';
import { MediaService } from '../../media/media.service';

@Injectable()
export class StudyMaterialService {
  private readonly logger = new Logger(StudyMaterialService.name);

  constructor(
    @InjectRepository(StudyMaterial)
    private readonly materialRepository: Repository<StudyMaterial>,
    @InjectRepository(DocumentRating)
    private readonly ratingRepository: Repository<DocumentRating>,
    @InjectRepository(DocumentBookmark)
    private readonly bookmarkRepository: Repository<DocumentBookmark>,
    @InjectRepository(DocumentView)
    private readonly viewRepository: Repository<DocumentView>,
    @InjectRepository(DocumentDownload)
    private readonly downloadRepository: Repository<DocumentDownload>,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Get all study materials with filters (for student view)
   */
  async findAllPublic(filter: StudyMaterialFilterDto): Promise<StudyMaterialListResponseDto> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;

    const queryBuilder = this.materialRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.uploadedBy', 'uploader')
      .where('m.status = :status', { status: DocumentStatus.PUBLISHED });

    // Search filter
    if (filter.search) {
      queryBuilder.andWhere(
        '(m.title LIKE :search OR m.description LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    // Category filter
    if (filter.category) {
      queryBuilder.andWhere('m.category = :category', { category: filter.category });
    }

    // Level filter
    if (filter.level) {
      queryBuilder.andWhere('m.level = :level', { level: filter.level });
    }

    // Type filter
    if (filter.type) {
      queryBuilder.andWhere('m.type = :type', { type: filter.type });
    }

    // Visibility filter based on role (handled in controller)
    if (filter.visibility) {
      queryBuilder.andWhere('m.visibility = :visibility', { visibility: filter.visibility });
    }

    // Sorting
    const sortOrder = filter.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const sortBy = filter.sortBy || 'createdAt';

    if (sortBy === 'popular') {
      queryBuilder.orderBy('m.downloads', 'DESC');
    } else if (sortBy === 'rating') {
      queryBuilder.orderBy('m.rating', 'DESC');
    } else {
      queryBuilder.orderBy(`m.${sortBy}`, sortOrder);
    }

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
   * Get all study materials for admin (including all statuses)
   */
  async findAllAdmin(filter: StudyMaterialFilterDto): Promise<StudyMaterialListResponseDto> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;

    const queryBuilder = this.materialRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.uploadedBy', 'uploader')
      .leftJoinAndSelect('m.approvedBy', 'approver');

    // Search filter
    if (filter.search) {
      queryBuilder.andWhere(
        '(m.title LIKE :search OR m.description LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    // Category filter
    if (filter.category) {
      queryBuilder.andWhere('m.category = :category', { category: filter.category });
    }

    // Status filter
    if (filter.status) {
      queryBuilder.andWhere('m.status = :status', { status: filter.status });
    }

    // Visibility filter
    if (filter.visibility) {
      queryBuilder.andWhere('m.visibility = :visibility', { visibility: filter.visibility });
    }

    // Level filter
    if (filter.level) {
      queryBuilder.andWhere('m.level = :level', { level: filter.level });
    }

    // Type filter
    if (filter.type) {
      queryBuilder.andWhere('m.type = :type', { type: filter.type });
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
   * Get document by ID
   */
  async findById(id: string): Promise<StudyMaterial> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['uploadedBy', 'approvedBy', 'media'],
    });

    if (!material) {
      throw new NotFoundException(`Study material not found: ${id}`);
    }

    return material;
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<DocumentStatisticsDto> {
    const total = await this.materialRepository.count();

    const byStatus = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.status')
      .getRawMany();

    const byCategory = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.category')
      .getRawMany();

    const totalDownloads = await this.materialRepository
      .createQueryBuilder('m')
      .select('SUM(m.downloads)', 'total')
      .getRawOne();

    const totalViews = await this.materialRepository
      .createQueryBuilder('m')
      .select('SUM(m.views)', 'total')
      .getRawOne();

    const topDownloaded = await this.materialRepository.find({
      where: { status: DocumentStatus.PUBLISHED },
      order: { downloads: 'DESC' },
      take: 5,
      select: ['id', 'title', 'downloads'],
    });

    const topRated = await this.materialRepository.find({
      where: { status: DocumentStatus.PUBLISHED },
      order: { rating: 'DESC' },
      take: 5,
      select: ['id', 'title', 'rating'],
    });

    const publishedCount = byStatus.find((s) => s.status === DocumentStatus.PUBLISHED)?.count || 0;
    const pendingCount = byStatus.find((s) => s.status === DocumentStatus.PENDING)?.count || 0;
    const draftCount = byStatus.find((s) => s.status === DocumentStatus.DRAFT)?.count || 0;
    const rejectedCount = byStatus.find((s) => s.status === DocumentStatus.REJECTED)?.count || 0;

    return {
      totalDocuments: total,
      publishedDocuments: Number(publishedCount),
      pendingDocuments: Number(pendingCount),
      draftDocuments: Number(draftCount),
      rejectedDocuments: Number(rejectedCount),
      totalDownloads: Number(totalDownloads?.total || 0),
      totalViews: Number(totalViews?.total || 0),
      byStatus,
      byCategory,
      topDownloaded: topDownloaded.map((d) => ({
        id: d.id,
        title: d.title,
        downloads: d.downloads,
      })),
      topRated: topRated.map((d) => ({
        id: d.id,
        title: d.title,
        rating: Number(d.rating),
      })),
    };
  }

  /**
   * Create new study material
   */
  async create(dto: CreateStudyMaterialDto, userId: string): Promise<StudyMaterial> {
    this.logger.log(`Creating study material: ${dto.title} by user ${userId}`);

    const material = this.materialRepository.create({
      ...dto,
      uploadedById: userId,
      status: dto.status || DocumentStatus.DRAFT,
      visibility: dto.visibility || DocumentVisibility.PUBLIC,
    });

    // If mediaId provided, increment reference
    if (dto.mediaId) {
      await this.mediaService.incrementReference(dto.mediaId);
    }

    const saved = await this.materialRepository.save(material);
    this.logger.log(`Study material created: ${saved.id}`);

    return saved;
  }

  /**
   * Update study material
   */
  async update(id: string, dto: UpdateStudyMaterialDto, userId: string): Promise<StudyMaterial> {
    this.logger.log(`Updating study material: ${id} by user ${userId}`);

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

    const updated = await this.materialRepository.save(material);
    this.logger.log(`Study material updated: ${id}`);

    return updated;
  }

  /**
   * Update material status (approve/reject/publish)
   */
  async updateStatus(
    id: string,
    dto: UpdateMaterialStatusDto,
    adminId: string,
  ): Promise<StudyMaterial> {
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
   * Delete study material
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting study material: ${id}`);

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
    this.logger.log(`Study material deleted: ${id}`);
  }

  /**
   * Increment view count
   */
  async incrementView(id: string, userId?: string, ip?: string, userAgent?: string): Promise<void> {
    await this.materialRepository.increment({ id }, 'views', 1);

    // Track view
    const view = this.viewRepository.create({
      documentId: id,
      documentType: 'study',
      userId,
      ipAddress: ip,
      userAgent,
    });
    await this.viewRepository.save(view);
  }

  /**
   * Increment download count
   */
  async incrementDownload(id: string, userId?: string, ip?: string): Promise<void> {
    await this.materialRepository.increment({ id }, 'downloads', 1);

    // Track download
    const download = this.downloadRepository.create({
      documentId: id,
      documentType: 'study',
      userId,
      ipAddress: ip,
    });
    await this.downloadRepository.save(download);
  }

  /**
   * Rate a material
   */
  async rateMaterial(id: string, userId: string, dto: RateMaterialDto): Promise<void> {
    const material = await this.findById(id);

    // Check if user already rated
    let existingRating = await this.ratingRepository.findOne({
      where: { documentId: id, userId },
    });

    if (existingRating) {
      existingRating.rating = dto.rating;
      existingRating.review = dto.review;
      await this.ratingRepository.save(existingRating);
    } else {
      const rating = this.ratingRepository.create({
        documentId: id,
        userId,
        rating: dto.rating,
        review: dto.review,
      });
      await this.ratingRepository.save(rating);
      material.ratingCount += 1;
    }

    // Recalculate average rating
    const avgResult = await this.ratingRepository
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .where('r.documentId = :id', { id })
      .getRawOne();

    material.rating = Number(avgResult.avg) || 0;
    await this.materialRepository.save(material);
  }

  /**
   * Bookmark a material
   */
  async toggleBookmark(documentId: string, userId: string): Promise<boolean> {
    const existing = await this.bookmarkRepository.findOne({
      where: { documentId, userId },
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);
      return false; // Unbookmarked
    } else {
      const bookmark = this.bookmarkRepository.create({ documentId, userId });
      await this.bookmarkRepository.save(bookmark);
      return true; // Bookmarked
    }
  }

  /**
   * Get user's bookmarked materials
   */
  async getBookmarks(userId: string): Promise<StudyMaterial[]> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { userId },
      relations: ['document'],
    });

    return bookmarks
      .filter((b) => b.document)
      .map((b) => b.document);
  }

  /**
   * Check if user bookmarked a material
   */
  async isBookmarked(documentId: string, userId: string): Promise<boolean> {
    const count = await this.bookmarkRepository.count({
      where: { documentId, userId },
    });
    return count > 0;
  }

  /**
   * Transform entity to response DTO
   */
  private toResponseDto(material: StudyMaterial): StudyMaterialResponseDto {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      category: material.category,
      level: material.level,
      type: material.type,
      size: material.size,
      url: material.url || material.media?.url,
      fileName: material.fileName,
      pages: material.pages,
      duration: material.duration,
      thumbnail: material.thumbnail,
      tags: material.tags,
      status: material.status,
      visibility: material.visibility,
      downloads: material.downloads,
      views: material.views,
      rating: Number(material.rating),
      ratingCount: material.ratingCount,
      author: material.author,
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
