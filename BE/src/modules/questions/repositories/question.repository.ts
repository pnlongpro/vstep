import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionFilterDto } from '../dto/question-filter.dto';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }

  createQueryWithFilters(filters: QuestionFilterDto): SelectQueryBuilder<Question> {
    const query = this.createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.tags', 'tags');

    if (filters.skill) {
      query.andWhere('question.skill = :skill', { skill: filters.skill });
    }

    if (filters.level) {
      query.andWhere('question.level = :level', { level: filters.level });
    }

    if (filters.type) {
      query.andWhere('question.type = :type', { type: filters.type });
    }

    if (filters.difficulty) {
      query.andWhere('question.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      query.andWhere('tags.id IN (:...tagIds)', { tagIds: filters.tagIds });
    }

    if (filters.search) {
      query.andWhere('(question.content LIKE :search OR question.explanation LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.isActive !== undefined) {
      query.andWhere('question.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query;
  }

  async findWithFilters(
    filters: QuestionFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: Question[]; total: number }> {
    const query = this.createQueryWithFilters(filters);

    // Apply sorting
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`question.${sortField}`, sortOrder);

    // Apply pagination
    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findRandomQuestions(filters: QuestionFilterDto, count: number): Promise<Question[]> {
    const query = this.createQueryWithFilters(filters);

    // Random order
    query.orderBy('RAND()').take(count);

    return query.getMany();
  }

  async findByPassage(passageId: string): Promise<Question[]> {
    return this.createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .where('question.passageId = :passageId', { passageId })
      .orderBy('question.orderIndex', 'ASC')
      .addOrderBy('options.orderIndex', 'ASC')
      .getMany();
  }

  async countByFilters(filters: QuestionFilterDto): Promise<number> {
    return this.createQueryWithFilters(filters).getCount();
  }

  async getStatsBySkillAndLevel(): Promise<{ skill: string; level: string; count: string }[]> {
    return this.createQueryBuilder('question')
      .select('question.skill', 'skill')
      .addSelect('question.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('question.isActive = true')
      .groupBy('question.skill')
      .addGroupBy('question.level')
      .getRawMany();
  }
}
