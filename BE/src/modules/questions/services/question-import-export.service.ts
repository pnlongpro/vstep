import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionOption } from '../entities/question-option.entity';
import { QuestionTag } from '../entities/question-tag.entity';
import { Skill, VstepLevel, QuestionType, DifficultyLevel } from '../../../shared/enums/exam.enum';

export interface QuestionExportData {
  skill: Skill;
  level: VstepLevel;
  type: QuestionType;
  difficulty?: DifficultyLevel;
  content: string;
  context?: string;
  correctAnswer?: string;
  explanation?: string;
  points?: number;
  options?: {
    label: string;
    content: string;
    isCorrect: boolean;
  }[];
  tags?: string[];
}

export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; error: string }[];
}

@Injectable()
export class QuestionImportExportService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(QuestionTag)
    private readonly tagRepository: Repository<QuestionTag>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Export questions to JSON format
   */
  async exportToJson(filters: { skill?: Skill; level?: VstepLevel; limit?: number }): Promise<QuestionExportData[]> {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.tags', 'tags')
      .where('question.isActive = :isActive', { isActive: true });

    if (filters.skill) {
      query.andWhere('question.skill = :skill', { skill: filters.skill });
    }

    if (filters.level) {
      query.andWhere('question.level = :level', { level: filters.level });
    }

    if (filters.limit) {
      query.take(filters.limit);
    }

    const questions = await query.orderBy('question.createdAt', 'DESC').getMany();

    return questions.map((q) => ({
      skill: q.skill,
      level: q.level,
      type: q.type,
      difficulty: q.difficulty,
      content: q.content,
      context: q.context,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points,
      options: q.options?.map((o) => ({
        label: o.label,
        content: o.content,
        isCorrect: o.isCorrect,
      })),
      tags: q.tags?.map((t) => t.name),
    }));
  }

  /**
   * Import questions from JSON data
   */
  async importFromJson(data: QuestionExportData[]): Promise<ImportResult> {
    const result: ImportResult = {
      total: data.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < data.length; i++) {
        try {
          const item = data[i];
          await this.importSingleQuestion(item, queryRunner.manager);
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  /**
   * Import questions from CSV format (simplified)
   */
  async importFromCsv(csvContent: string): Promise<ImportResult> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new BadRequestException('CSV must have header and at least one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const data: QuestionExportData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const item: Partial<QuestionExportData> = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        switch (header) {
          case 'skill':
            item.skill = value as Skill;
            break;
          case 'level':
            item.level = value as VstepLevel;
            break;
          case 'type':
            item.type = value as QuestionType;
            break;
          case 'content':
            item.content = value;
            break;
          case 'correct_answer':
          case 'correctanswer':
            item.correctAnswer = value;
            break;
          case 'explanation':
            item.explanation = value;
            break;
          case 'points':
            item.points = parseInt(value);
            break;
        }
      });

      if (item.skill && item.level && item.type && item.content) {
        data.push(item as QuestionExportData);
      }
    }

    return this.importFromJson(data);
  }

  /**
   * Export questions to CSV format
   */
  async exportToCsv(filters: { skill?: Skill; level?: VstepLevel; limit?: number }): Promise<string> {
    const questions = await this.exportToJson(filters);

    const headers = ['skill', 'level', 'type', 'content', 'correctAnswer', 'explanation', 'points'];
    const lines = [headers.join(',')];

    for (const q of questions) {
      const values = [
        q.skill,
        q.level,
        q.type,
        this.escapeCsvValue(q.content),
        this.escapeCsvValue(q.correctAnswer || ''),
        this.escapeCsvValue(q.explanation || ''),
        q.points?.toString() || '1',
      ];
      lines.push(values.join(','));
    }

    return lines.join('\n');
  }

  private async importSingleQuestion(data: QuestionExportData, manager: Repository<Question>['manager']) {
    // Validate required fields
    if (!data.skill || !data.level || !data.type || !data.content) {
      throw new Error('Missing required fields: skill, level, type, content');
    }

    // Create question
    const question = this.questionRepository.create({
      skill: data.skill,
      level: data.level,
      type: data.type,
      difficulty: data.difficulty || DifficultyLevel.MEDIUM,
      content: data.content,
      context: data.context,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation,
      points: data.points || 1,
      isActive: true,
    });

    const savedQuestion = await manager.save(question);

    // Create options
    if (data.options && data.options.length > 0) {
      const options = data.options.map((opt, index) =>
        this.optionRepository.create({
          questionId: savedQuestion.id,
          label: opt.label,
          content: opt.content,
          isCorrect: opt.isCorrect,
          orderIndex: index,
        }),
      );
      await manager.save(options);
    }

    return savedQuestion;
  }

  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    return values;
  }

  private escapeCsvValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
