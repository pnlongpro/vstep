import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSet } from '../entities/exam-set.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { ExamSetRepository } from '../repositories/exam-set.repository';
import { CreateExamSetDto } from '../dto/create-exam-set.dto';
import { UpdateExamSetDto } from '../dto/update-exam-set.dto';
import { ExamSetFilterDto } from '../dto/exam-set-filter.dto';
import { PaginatedResult, PaginationDto } from '../../../shared/dto/pagination.dto';
import { Skill, ExamSetStatus } from '../../../shared/enums/exam.enum';

@Injectable()
export class ExamSetService {
  constructor(
    private readonly examSetRepository: ExamSetRepository,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
  ) {}

  /**
   * Create a new exam set
   */
  async create(dto: CreateExamSetDto): Promise<ExamSet> {
    const examSet = this.examSetRepository.create({
      title: dto.title,
      description: dto.description,
      level: dto.level,
      totalDuration: dto.totalDuration || 180,
      isMockTest: dto.isMockTest ?? false,
      isFree: dto.isFree ?? false,
      thumbnailUrl: dto.thumbnailUrl,
      status: ExamSetStatus.DRAFT,
    });

    const saved = await this.examSetRepository.save(examSet);

    // Create default sections for VSTEP format
    await this.createDefaultSections(saved.id);

    return this.findById(saved.id);
  }

  /**
   * Create default VSTEP sections
   */
  private async createDefaultSections(examSetId: string): Promise<void> {
    const defaultSections = [
      { skill: Skill.LISTENING, orderIndex: 1, duration: 40, title: 'Listening' },
      { skill: Skill.READING, orderIndex: 2, duration: 60, title: 'Reading' },
      { skill: Skill.WRITING, orderIndex: 3, duration: 60, title: 'Writing' },
      { skill: Skill.SPEAKING, orderIndex: 4, duration: 12, title: 'Speaking' },
    ];

    const sections = defaultSections.map((s) =>
      this.sectionRepository.create({
        ...s,
        examSetId,
      }),
    );

    await this.sectionRepository.save(sections);
  }

  /**
   * Find exam set by ID
   */
  async findById(id: string): Promise<ExamSet> {
    const examSet = await this.examSetRepository.findByIdWithSections(id);
    if (!examSet) {
      throw new NotFoundException(`Exam set with ID ${id} not found`);
    }
    return examSet;
  }

  /**
   * Find exam sets with filters
   */
  async findAll(filters: ExamSetFilterDto, pagination: PaginationDto): Promise<PaginatedResult<ExamSet>> {
    const { items, total } = await this.examSetRepository.findWithFilters(filters, pagination.page, pagination.limit);

    return {
      items,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Get public/active exam sets for students
   */
  async findPublicExamSets(level?: string): Promise<ExamSet[]> {
    const query = this.examSetRepository
      .createQueryBuilder('examSet')
      .leftJoinAndSelect('examSet.sections', 'sections')
      .where('examSet.status = :status', { status: ExamSetStatus.PUBLISHED })
      .orderBy('examSet.createdAt', 'DESC');

    if (level) {
      query.andWhere('examSet.level = :level', { level });
    }

    return query.getMany();
  }

  /**
   * Update exam set
   */
  async update(id: string, dto: UpdateExamSetDto): Promise<ExamSet> {
    const examSet = await this.findById(id);

    Object.assign(examSet, {
      title: dto.title ?? examSet.title,
      description: dto.description ?? examSet.description,
      level: dto.level ?? examSet.level,
      totalDuration: dto.totalDuration ?? examSet.totalDuration,
      isMockTest: dto.isMockTest ?? examSet.isMockTest,
      isFree: dto.isFree ?? examSet.isFree,
      thumbnailUrl: dto.thumbnailUrl ?? examSet.thumbnailUrl,
    });

    await this.examSetRepository.save(examSet);

    return this.findById(id);
  }

  /**
   * Publish exam set
   */
  async publish(id: string): Promise<ExamSet> {
    const examSet = await this.findById(id);

    if (!examSet.sections || examSet.sections.length === 0) {
      throw new BadRequestException('Exam set must have at least one section');
    }

    examSet.status = ExamSetStatus.PUBLISHED;

    await this.examSetRepository.save(examSet);

    return examSet;
  }

  /**
   * Unpublish exam set
   */
  async unpublish(id: string): Promise<ExamSet> {
    const examSet = await this.findById(id);
    examSet.status = ExamSetStatus.DRAFT;

    await this.examSetRepository.save(examSet);

    return examSet;
  }

  /**
   * Delete exam set (soft delete)
   */
  async delete(id: string): Promise<void> {
    const examSet = await this.findById(id);
    examSet.status = ExamSetStatus.ARCHIVED;

    await this.examSetRepository.save(examSet);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{ total: number; byLevel: { level: string; count: string }[] }> {
    const byLevel = await this.examSetRepository.getStatsByLevel();
    const total = await this.examSetRepository.count();

    return {
      total,
      byLevel,
    };
  }
}
