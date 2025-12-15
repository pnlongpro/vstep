import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { Submission } from './entities/submission.entity';
import { CreateMockExamDto } from './dto/create-mock-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { SaveExamProgressDto } from './dto/save-exam-progress.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  /**
   * Random 4 đề thi (1 mỗi skill) cho mock exam
   */
  async randomMockExam(userId: string, level?: string) {
    const targetLevel = level || 'B2'; // Default level
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    
    const selectedExams = {};
    
    for (const skill of skills) {
      // Random 1 đề cho mỗi skill
      const exam = await this.examRepository
        .createQueryBuilder('exam')
        .where('exam.skill = :skill', { skill })
        .andWhere('exam.level = :level', { level: targetLevel })
        .andWhere('exam.type = :type', { type: 'full_test' })
        .andWhere('exam.is_public = :isPublic', { isPublic: true })
        .andWhere('exam.deleted_at IS NULL')
        .orderBy('RAND()') // Random order
        .limit(1)
        .getOne();

      if (!exam) {
        throw new NotFoundException(`No ${skill} exam found for level ${targetLevel}`);
      }

      selectedExams[skill] = {
        id: exam.id,
        title: exam.title,
        level: exam.level,
        questionCount: exam.question_count,
        duration: exam.duration_minutes,
      };
    }

    return {
      success: true,
      data: {
        exams: selectedExams,
        level: targetLevel,
        totalDuration: 172, // Total VSTEP exam duration
      },
    };
  }

  /**
   * Bắt đầu mock exam session
   */
  async startMockExam(userId: string, dto: CreateMockExamDto) {
    // Validate all exam IDs exist
    const exams = await this.examRepository.findByIds([
      dto.readingExerciseId,
      dto.listeningExerciseId,
      dto.writingExerciseId,
      dto.speakingExerciseId,
    ]);

    if (exams.length !== 4) {
      throw new BadRequestException('One or more exam IDs are invalid');
    }

    // Create submission for full exam
    const submission = this.submissionRepository.create({
      user_id: userId,
      exam_type: 'mock_exam',
      status: 'in_progress',
      started_at: new Date(),
      expires_at: new Date(Date.now() + 172 * 60 * 1000), // 172 minutes
      current_skill: 'reading',
      exam_data: {
        reading_id: dto.readingExerciseId,
        listening_id: dto.listeningExerciseId,
        writing_id: dto.writingExerciseId,
        speaking_id: dto.speakingExerciseId,
      },
      answers: {},
    });

    const saved = await this.submissionRepository.save(submission);

    return {
      success: true,
      data: {
        mockExamId: saved.id,
        startedAt: saved.started_at,
        expiresAt: saved.expires_at,
        totalTime: 172 * 60, // seconds
      },
    };
  }

  /**
   * Get mock exam details
   */
  async getMockExamDetails(examId: string, userId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: examId, user_id: userId },
    });

    if (!submission) {
      throw new NotFoundException('Mock exam not found');
    }

    // Load full exam content for current skill
    const currentExamId = submission.exam_data[`${submission.current_skill}_id`];
    const exam = await this.examRepository.findOne({
      where: { id: currentExamId },
      relations: ['sections'],
    });

    return {
      success: true,
      data: {
        id: submission.id,
        status: submission.status,
        currentSkill: submission.current_skill,
        startedAt: submission.started_at,
        expiresAt: submission.expires_at,
        exam: exam,
        savedAnswers: submission.answers,
      },
    };
  }

  /**
   * Auto-save exam progress
   */
  async saveExamProgress(
    examId: string,
    userId: string,
    dto: SaveExamProgressDto,
  ) {
    const submission = await this.submissionRepository.findOne({
      where: { id: examId, user_id: userId },
    });

    if (!submission) {
      throw new NotFoundException('Mock exam not found');
    }

    if (submission.status !== 'in_progress') {
      throw new BadRequestException('Exam is not in progress');
    }

    // Update answers
    submission.answers = {
      ...submission.answers,
      [dto.skill]: dto.answers,
    };
    submission.last_saved_at = new Date();

    await this.submissionRepository.save(submission);

    return {
      success: true,
      message: 'Progress saved',
      data: {
        lastSavedAt: submission.last_saved_at,
      },
    };
  }

  /**
   * Submit mock exam
   */
  async submitMockExam(examId: string, userId: string, dto: SubmitExamDto) {
    const submission = await this.submissionRepository.findOne({
      where: { id: examId, user_id: userId },
    });

    if (!submission) {
      throw new NotFoundException('Mock exam not found');
    }

    // Update final submission
    submission.status = 'submitted';
    submission.submitted_at = new Date();
    submission.time_spent = dto.timeSpent;
    submission.answers = dto.answers;

    await this.submissionRepository.save(submission);

    // TODO: Queue AI grading for writing/speaking
    // TODO: Auto-grade reading/listening

    return {
      success: true,
      data: {
        submissionId: submission.id,
        status: 'submitted',
        submittedAt: submission.submitted_at,
      },
      message: 'Exam submitted. Grading in progress...',
    };
  }

  /**
   * Get mock exam result
   */
  async getMockExamResult(examId: string, userId: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id: examId, user_id: userId },
    });

    if (!submission) {
      throw new NotFoundException('Mock exam not found');
    }

    if (submission.status !== 'graded' && submission.status !== 'submitted') {
      throw new BadRequestException('Exam results not available yet');
    }

    // TODO: Get grading results from grading_results table
    
    return {
      success: true,
      data: {
        mockExamId: submission.id,
        overallScore: submission.overall_score || 0,
        scores: submission.skill_scores || {},
        // certificateId: submission.certificate_id,
      },
    };
  }

  /**
   * Get list of exercises
   */
  async getExercises(filters: {
    skill?: string;
    level?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const query = this.examRepository
      .createQueryBuilder('exam')
      .where('exam.is_public = :isPublic', { isPublic: true })
      .andWhere('exam.deleted_at IS NULL');

    if (filters.skill) {
      query.andWhere('exam.skill = :skill', { skill: filters.skill });
    }

    if (filters.level) {
      query.andWhere('exam.level = :level', { level: filters.level });
    }

    if (filters.type) {
      query.andWhere('exam.type = :type', { type: filters.type });
    }

    const total = await query.getCount();
    const exercises = await query
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('exam.created_at', 'DESC')
      .getMany();

    return {
      success: true,
      data: {
        exercises: exercises.map(e => ({
          id: e.id,
          title: e.title,
          skill: e.skill,
          level: e.level,
          type: e.type,
          duration: e.duration_minutes,
          questionCount: e.question_count,
          difficulty: e.difficulty,
          avgScore: e.avg_score,
          attemptCount: e.attempt_count,
        })),
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          pages: Math.ceil(total / filters.limit),
        },
      },
    };
  }

  /**
   * Get exercise details
   */
  async getExerciseDetails(id: string) {
    const exam = await this.examRepository.findOne({
      where: { id, is_public: true },
      relations: ['sections'],
    });

    if (!exam) {
      throw new NotFoundException('Exercise not found');
    }

    return {
      success: true,
      data: exam,
    };
  }
}
