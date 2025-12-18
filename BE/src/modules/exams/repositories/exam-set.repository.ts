import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ExamSet } from '../entities/exam-set.entity';
import { ExamSetFilterDto } from '../dto/exam-set-filter.dto';

@Injectable()
export class ExamSetRepository extends Repository<ExamSet> {
  constructor(private dataSource: DataSource) {
    super(ExamSet, dataSource.createEntityManager());
  }

  createQueryWithFilters(filters: ExamSetFilterDto): SelectQueryBuilder<ExamSet> {
    const query = this.createQueryBuilder('examSet').leftJoinAndSelect('examSet.sections', 'sections');

    if (filters.level) {
      query.andWhere('examSet.level = :level', { level: filters.level });
    }

    if (filters.status) {
      query.andWhere('examSet.status = :status', { status: filters.status });
    }

    if (filters.isFree !== undefined) {
      query.andWhere('examSet.isFree = :isFree', { isFree: filters.isFree });
    }

    if (filters.search) {
      query.andWhere('(examSet.title LIKE :search OR examSet.description LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    return query;
  }

  async findWithFilters(
    filters: ExamSetFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: ExamSet[]; total: number }> {
    const query = this.createQueryWithFilters(filters);

    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`examSet.${sortField}`, sortOrder);

    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findByIdWithSections(id: string): Promise<ExamSet | null> {
    return this.createQueryBuilder('examSet')
      .leftJoinAndSelect('examSet.sections', 'sections')
      .leftJoinAndSelect('sections.passages', 'passages')
      .leftJoinAndSelect('passages.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .where('examSet.id = :id', { id })
      .orderBy('sections.orderIndex', 'ASC')
      .addOrderBy('passages.orderIndex', 'ASC')
      .addOrderBy('questions.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC')
      .getOne();
  }

  async getStatsByLevel(): Promise<{ level: string; count: string }[]> {
    return this.createQueryBuilder('examSet')
      .select('examSet.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('examSet.level')
      .getRawMany();
  }
}
