import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Question } from '../entities/question.entity';
import { QuestionOption } from '../entities/question-option.entity';
import { QuestionTag } from '../entities/question-tag.entity';
import { QuestionRepository } from '../repositories/question.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { QuestionFilterDto } from '../dto/question-filter.dto';
import { PaginatedResult, PaginationDto } from '../../../shared/dto/pagination.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(QuestionTag)
    private readonly tagRepository: Repository<QuestionTag>,
  ) {}

  /**
   * Create a new question with options and tags
   */
  async create(dto: CreateQuestionDto): Promise<Question> {
    // Validate options for multiple choice questions
    if (['multiple_choice', 'true_false_ng'].includes(dto.type) && (!dto.options || dto.options.length === 0)) {
      throw new BadRequestException('Options are required for this question type');
    }

    // Create question
    const question = this.questionRepository.create({
      skill: dto.skill,
      level: dto.level,
      type: dto.type,
      content: dto.content,
      context: dto.context,
      audioUrl: dto.audioUrl,
      imageUrl: dto.imageUrl,
      correctAnswer: dto.correctAnswer,
      explanation: dto.explanation,
      points: dto.points ?? 1,
      difficulty: dto.difficulty,
      passageId: dto.passageId,
      orderIndex: dto.orderIndex ?? 0,
      wordLimit: dto.wordLimit,
      timeLimit: dto.timeLimit,
    });

    // Save question first to get ID
    const savedQuestion = await this.questionRepository.save(question);

    // Create options
    if (dto.options && dto.options.length > 0) {
      const options = dto.options.map((opt, index) =>
        this.optionRepository.create({
          ...opt,
          questionId: savedQuestion.id,
          orderIndex: opt.orderIndex ?? index,
        }),
      );
      await this.optionRepository.save(options);
    }

    // Associate tags
    if (dto.tagIds && dto.tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(dto.tagIds) });
      savedQuestion.tags = tags;
      await this.questionRepository.save(savedQuestion);
    }

    // Return with relations
    return this.findById(savedQuestion.id);
  }

  /**
   * Find question by ID with all relations
   */
  async findById(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options', 'tags', 'passage'],
      order: { options: { orderIndex: 'ASC' } },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  /**
   * Find questions with filters and pagination
   */
  async findAll(filters: QuestionFilterDto, pagination: PaginationDto): Promise<PaginatedResult<Question>> {
    const { items, total } = await this.questionRepository.findWithFilters(
      filters,
      pagination.page,
      pagination.limit,
    );

    return {
      items,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Get random questions for practice session
   */
  async getRandomQuestions(filters: QuestionFilterDto, count: number): Promise<Question[]> {
    return this.questionRepository.findRandomQuestions(filters, count);
  }

  /**
   * Get questions by passage
   */
  async findByPassage(passageId: string): Promise<Question[]> {
    return this.questionRepository.findByPassage(passageId);
  }

  /**
   * Update question
   */
  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findById(id);

    // Update basic fields
    Object.assign(question, {
      skill: dto.skill ?? question.skill,
      level: dto.level ?? question.level,
      type: dto.type ?? question.type,
      content: dto.content ?? question.content,
      context: dto.context ?? question.context,
      audioUrl: dto.audioUrl ?? question.audioUrl,
      imageUrl: dto.imageUrl ?? question.imageUrl,
      correctAnswer: dto.correctAnswer ?? question.correctAnswer,
      explanation: dto.explanation ?? question.explanation,
      points: dto.points ?? question.points,
      difficulty: dto.difficulty ?? question.difficulty,
    });

    await this.questionRepository.save(question);

    // Update options if provided
    if (dto.options !== undefined) {
      // Remove existing options
      await this.optionRepository.delete({ questionId: id });

      // Create new options
      if (dto.options.length > 0) {
        const options = dto.options.map((opt, index) =>
          this.optionRepository.create({
            ...opt,
            questionId: id,
            orderIndex: opt.orderIndex ?? index,
          }),
        );
        await this.optionRepository.save(options);
      }
    }

    // Update tags if provided
    if (dto.tagIds !== undefined) {
      const tags = dto.tagIds.length > 0 ? await this.tagRepository.findBy({ id: In(dto.tagIds) }) : [];
      question.tags = tags;
      await this.questionRepository.save(question);
    }

    return this.findById(id);
  }

  /**
   * Soft delete question
   */
  async delete(id: string): Promise<void> {
    const question = await this.findById(id);
    question.isActive = false;
    await this.questionRepository.save(question);
  }

  /**
   * Get question statistics
   */
  async getStats(): Promise<{ total: number; bySkillAndLevel: { skill: string; level: string; count: string }[] }> {
    const stats = await this.questionRepository.getStatsBySkillAndLevel();
    const totalCount = await this.questionRepository.count({ where: { isActive: true } });

    return {
      total: totalCount,
      bySkillAndLevel: stats,
    };
  }

  /**
   * Validate answer
   */
  async validateAnswer(
    questionId: string,
    answer: string | string[],
  ): Promise<{ isCorrect: boolean; correctAnswer?: string; explanation?: string }> {
    const question = await this.findById(questionId);

    let isCorrect = false;

    switch (question.type) {
      case 'multiple_choice':
      case 'true_false_ng':
        const correctOption = question.options?.find((o) => o.isCorrect);
        isCorrect = correctOption?.id === answer || correctOption?.label === answer;
        break;

      case 'fill_blank':
      case 'short_answer':
        // Case-insensitive comparison, trim whitespace
        const normalizedAnswer = String(answer).toLowerCase().trim();
        const normalizedCorrect = question.correctAnswer?.toLowerCase().trim();
        isCorrect = normalizedAnswer === normalizedCorrect;
        break;

      case 'matching':
        // For matching, answer is array of pairs
        if (Array.isArray(answer) && question.correctAnswer) {
          const correctPairs = JSON.parse(question.correctAnswer);
          isCorrect = JSON.stringify(answer.sort()) === JSON.stringify(correctPairs.sort());
        }
        break;

      case 'essay':
      case 'speaking_task':
        // These require AI scoring - return false, will be handled separately
        isCorrect = false;
        break;
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }
}
