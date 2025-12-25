import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Media, MediaCategory, MediaStatus } from './entities/media.entity';
import {
  UploadMediaDto,
  MediaQueryDto,
  UpdateMediaDto,
  MediaResponseDto,
  MediaListResponseDto,
} from './dto/media.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    // Configure upload directory
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    this.baseUrl = process.env.MEDIA_BASE_URL || '/api/media/files';

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    const fullPath = path.resolve(this.uploadDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      this.logger.log(`Created upload directory: ${fullPath}`);
    }
  }

  /**
   * Get subdirectory based on date (for organizing files)
   */
  private getDateSubdir(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  /**
   * Determine media category from MIME type
   */
  private getCategoryFromMimeType(mimeType: string): MediaCategory {
    if (mimeType.startsWith('image/')) return MediaCategory.IMAGE;
    if (mimeType.startsWith('video/')) return MediaCategory.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaCategory.AUDIO;
    return MediaCategory.DOCUMENT;
  }

  /**
   * Format bytes to human readable size
   */
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Calculate file checksum
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Upload a file and create media record
   */
  async upload(
    file: Express.Multer.File,
    dto: UploadMediaDto,
    uploaderId?: string,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.logger.log(`Uploading file: ${file.originalname} (${file.size} bytes)`);

    // Generate unique stored name
    const ext = path.extname(file.originalname);
    const storedName = `${uuidv4()}${ext}`;

    // Create date-based subdirectory
    const subdir = this.getDateSubdir();
    const targetDir = path.join(this.uploadDir, subdir);

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Full file path
    const filePath = path.join(targetDir, storedName);
    const relativePath = path.join(subdir, storedName).replace(/\\/g, '/');

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Calculate checksum
    const checksum = await this.calculateChecksum(filePath);

    // Check for duplicate by checksum
    const existing = await this.mediaRepository.findOne({
      where: { checksum, status: MediaStatus.ACTIVE },
    });

    if (existing) {
      // File already exists, remove newly uploaded file
      fs.unlinkSync(filePath);
      this.logger.log(`Duplicate file detected, returning existing: ${existing.id}`);

      // Increment reference count
      existing.referenceCount += 1;
      await this.mediaRepository.save(existing);

      return this.toResponseDto(existing);
    }

    // Determine category
    const category = dto.category || this.getCategoryFromMimeType(file.mimetype);

    // Create media record
    const media = this.mediaRepository.create({
      originalName: dto.customName || file.originalname,
      storedName,
      path: relativePath,
      url: `${this.baseUrl}/${relativePath}`,
      mimeType: file.mimetype,
      size: file.size,
      sizeHuman: this.formatSize(file.size),
      category,
      status: MediaStatus.ACTIVE,
      referenceCount: 1,
      uploadedById: uploaderId,
      checksum,
    });

    const saved = await this.mediaRepository.save(media);
    this.logger.log(`File uploaded successfully: ${saved.id}`);

    return this.toResponseDto(saved);
  }

  /**
   * Find all media with pagination and filters
   */
  async findAll(query: MediaQueryDto): Promise<MediaListResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Media> = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = MediaStatus.ACTIVE;
    }

    if (query.search) {
      where.originalName = Like(`%${query.search}%`);
    }

    const [items, total] = await this.mediaRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: items.map((item) => this.toResponseDto(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find media by ID
   */
  async findById(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    return media;
  }

  /**
   * Update media metadata
   */
  async update(id: string, dto: UpdateMediaDto): Promise<MediaResponseDto> {
    const media = await this.findById(id);

    if (dto.originalName) {
      media.originalName = dto.originalName;
    }

    if (dto.category) {
      media.category = dto.category;
    }

    const saved = await this.mediaRepository.save(media);
    return this.toResponseDto(saved);
  }

  /**
   * Increment reference count when media is used by an entity
   */
  async incrementReference(id: string): Promise<void> {
    await this.mediaRepository.increment({ id }, 'referenceCount', 1);
    this.logger.debug(`Incremented reference for media: ${id}`);
  }

  /**
   * Decrement reference count when entity stops using media
   * If referenceCount reaches 0, mark as orphaned
   */
  async decrementReference(id: string): Promise<void> {
    const media = await this.findById(id);

    if (media.referenceCount > 0) {
      media.referenceCount -= 1;
    }

    if (media.referenceCount === 0) {
      media.status = MediaStatus.ORPHANED;
      this.logger.log(`Media marked as orphaned: ${id}`);
    }

    await this.mediaRepository.save(media);
  }

  /**
   * Delete media file and record
   * @param force - Delete even if has references
   */
  async delete(id: string, force: boolean = false): Promise<void> {
    const media = await this.findById(id);

    if (!force && media.referenceCount > 0) {
      throw new BadRequestException(
        `Cannot delete media with ${media.referenceCount} references. Use force=true to override.`,
      );
    }

    // Delete physical file
    const fullPath = path.join(this.uploadDir, media.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      this.logger.log(`Deleted file: ${fullPath}`);
    }

    // Delete database record
    await this.mediaRepository.remove(media);
    this.logger.log(`Deleted media record: ${id}`);
  }

  /**
   * Clean up orphaned files (files with no references)
   */
  async cleanupOrphaned(olderThanDays: number = 7): Promise<number> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - olderThanDays);

    const orphaned = await this.mediaRepository.find({
      where: {
        status: MediaStatus.ORPHANED,
      },
    });

    let deletedCount = 0;

    for (const media of orphaned) {
      if (media.updatedAt < threshold) {
        await this.delete(media.id, true);
        deletedCount++;
      }
    }

    this.logger.log(`Cleaned up ${deletedCount} orphaned media files`);
    return deletedCount;
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    totalSizeHuman: string;
    byCategory: Record<string, { count: number; size: number }>;
    orphanedCount: number;
  }> {
    const stats = await this.mediaRepository
      .createQueryBuilder('media')
      .select('media.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(media.size)', 'totalSize')
      .where('media.status = :status', { status: MediaStatus.ACTIVE })
      .groupBy('media.category')
      .getRawMany();

    const byCategory: Record<string, { count: number; size: number }> = {};
    let totalFiles = 0;
    let totalSize = 0;

    for (const stat of stats) {
      byCategory[stat.category] = {
        count: parseInt(stat.count),
        size: parseInt(stat.totalSize || 0),
      };
      totalFiles += parseInt(stat.count);
      totalSize += parseInt(stat.totalSize || 0);
    }

    const orphanedCount = await this.mediaRepository.count({
      where: { status: MediaStatus.ORPHANED },
    });

    return {
      totalFiles,
      totalSize,
      totalSizeHuman: this.formatSize(totalSize),
      byCategory,
      orphanedCount,
    };
  }

  /**
   * Get file path for serving
   */
  getFilePath(relativePath: string): string {
    return path.join(this.uploadDir, relativePath);
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      originalName: media.originalName,
      storedName: media.storedName,
      url: media.url,
      mimeType: media.mimeType,
      size: media.size,
      sizeHuman: media.sizeHuman,
      category: media.category,
      status: media.status,
      referenceCount: media.referenceCount,
      uploadedById: media.uploadedById,
      createdAt: media.createdAt,
    };
  }
}
