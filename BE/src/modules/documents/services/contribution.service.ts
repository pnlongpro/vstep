import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyMaterial, DocumentStatus } from '../entities/study-material.entity';
import { ClassMaterialV2 } from '../entities/class-material.entity';
import { CreateStudyMaterialDto } from '../dto/study-material.dto';
import { CreateClassMaterialDto } from '../dto/class-material.dto';
import { MediaService } from '../../media/media.service';

/**
 * Contribution Service
 * Handles teacher/uploader material contributions
 */
@Injectable()
export class ContributionService {
  private readonly logger = new Logger(ContributionService.name);

  constructor(
    @InjectRepository(StudyMaterial)
    private readonly studyMaterialRepo: Repository<StudyMaterial>,
    @InjectRepository(ClassMaterialV2)
    private readonly classMaterialRepo: Repository<ClassMaterialV2>,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Teacher contributes a study material
   */
  async contributeStudyMaterial(
    dto: CreateStudyMaterialDto,
    userId: string,
  ): Promise<StudyMaterial> {
    this.logger.log(`Teacher ${userId} contributing study material: ${dto.title}`);

    const material = this.studyMaterialRepo.create({
      ...dto,
      uploadedById: userId,
      status: DocumentStatus.PENDING, // Always pending for contributions
    });

    if (dto.mediaId) {
      await this.mediaService.incrementReference(dto.mediaId);
    }

    const saved = await this.studyMaterialRepo.save(material);
    this.logger.log(`Study material contribution submitted: ${saved.id}`);

    return saved;
  }

  /**
   * Teacher contributes a class material
   */
  async contributeClassMaterial(
    dto: CreateClassMaterialDto,
    userId: string,
  ): Promise<ClassMaterialV2> {
    this.logger.log(`Teacher ${userId} contributing class material: ${dto.name}`);

    const material = this.classMaterialRepo.create({
      ...dto,
      uploadedById: userId,
      status: DocumentStatus.PENDING, // Always pending for contributions
    });

    if (dto.mediaId) {
      await this.mediaService.incrementReference(dto.mediaId);
    }

    const saved = await this.classMaterialRepo.save(material);
    this.logger.log(`Class material contribution submitted: ${saved.id}`);

    return saved;
  }

  /**
   * Get teacher's contributions
   */
  async getMyContributions(userId: string, type?: 'study' | 'class', status?: DocumentStatus) {
    const studyMaterials = type === 'class' ? [] : await this.studyMaterialRepo.find({
      where: {
        uploadedById: userId,
        ...(status && { status }),
      },
      order: { createdAt: 'DESC' },
    });

    const classMaterials = type === 'study' ? [] : await this.classMaterialRepo.find({
      where: {
        uploadedById: userId,
        ...(status && { status }),
      },
      order: { createdAt: 'DESC' },
    });

    return {
      studyMaterials: studyMaterials.map((m) => ({
        id: m.id,
        title: m.title,
        type: 'study',
        category: m.category,
        status: m.status,
        createdAt: m.createdAt,
        rejectionReason: m.rejectionReason,
      })),
      classMaterials: classMaterials.map((m) => ({
        id: m.id,
        name: m.name,
        type: 'class',
        course: m.course,
        category: m.category,
        status: m.status,
        createdAt: m.createdAt,
        rejectionReason: m.rejectionReason,
      })),
    };
  }

  /**
   * Get teacher's contribution statistics
   */
  async getMyStats(userId: string) {
    const studyStats = await this.studyMaterialRepo
      .createQueryBuilder('m')
      .select('m.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('m.uploadedById = :userId', { userId })
      .groupBy('m.status')
      .getRawMany();

    const classStats = await this.classMaterialRepo
      .createQueryBuilder('m')
      .select('m.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('m.uploadedById = :userId', { userId })
      .groupBy('m.status')
      .getRawMany();

    const combinedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalDownloads: 0,
      totalViews: 0,
    };

    // Aggregate study material stats
    for (const stat of studyStats) {
      const count = Number(stat.count);
      combinedStats.total += count;
      if (stat.status === DocumentStatus.PENDING) combinedStats.pending += count;
      if (stat.status === DocumentStatus.PUBLISHED) combinedStats.approved += count;
      if (stat.status === DocumentStatus.REJECTED) combinedStats.rejected += count;
    }

    // Aggregate class material stats
    for (const stat of classStats) {
      const count = Number(stat.count);
      combinedStats.total += count;
      if (stat.status === DocumentStatus.PENDING) combinedStats.pending += count;
      if (stat.status === DocumentStatus.PUBLISHED) combinedStats.approved += count;
      if (stat.status === DocumentStatus.REJECTED) combinedStats.rejected += count;
    }

    // Get total downloads/views
    const studyDownloads = await this.studyMaterialRepo
      .createQueryBuilder('m')
      .select('SUM(m.downloads)', 'downloads')
      .addSelect('SUM(m.views)', 'views')
      .where('m.uploadedById = :userId', { userId })
      .getRawOne();

    const classDownloads = await this.classMaterialRepo
      .createQueryBuilder('m')
      .select('SUM(m.downloads)', 'downloads')
      .addSelect('SUM(m.views)', 'views')
      .where('m.uploadedById = :userId', { userId })
      .getRawOne();

    combinedStats.totalDownloads =
      Number(studyDownloads?.downloads || 0) + Number(classDownloads?.downloads || 0);
    combinedStats.totalViews =
      Number(studyDownloads?.views || 0) + Number(classDownloads?.views || 0);

    return combinedStats;
  }

  /**
   * Resubmit a rejected contribution
   */
  async resubmit(
    id: string,
    type: 'study' | 'class',
    userId: string,
  ): Promise<StudyMaterial | ClassMaterialV2> {
    if (type === 'study') {
      const material = await this.studyMaterialRepo.findOne({
        where: { id, uploadedById: userId },
      });

      if (!material) {
        throw new BadRequestException('Material not found or not owned by you');
      }

      if (material.status !== DocumentStatus.REJECTED) {
        throw new BadRequestException('Only rejected materials can be resubmitted');
      }

      material.status = DocumentStatus.PENDING;
      material.rejectionReason = null;

      return this.studyMaterialRepo.save(material);
    } else {
      const material = await this.classMaterialRepo.findOne({
        where: { id, uploadedById: userId },
      });

      if (!material) {
        throw new BadRequestException('Material not found or not owned by you');
      }

      if (material.status !== DocumentStatus.REJECTED) {
        throw new BadRequestException('Only rejected materials can be resubmitted');
      }

      material.status = DocumentStatus.PENDING;
      material.rejectionReason = null;

      return this.classMaterialRepo.save(material);
    }
  }
}
