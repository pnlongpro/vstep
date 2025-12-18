import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PracticeSession } from './entities/practice-session.entity';
import { PracticeAnswer } from './entities/practice-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionStatus, PracticeMode } from '../../shared/enums/practice.enum';

@Injectable()
export class PracticeSessionService {
  constructor(
    @InjectRepository(PracticeSession)
    private sessionRepo: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private answerRepo: Repository<PracticeAnswer>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto): Promise<PracticeSession> {
    // Get questions based on skill, level
    const questions = await this.getQuestionsForSession(dto);

    if (questions.length === 0) {
      throw new BadRequestException('Không tìm thấy câu hỏi phù hợp');
    }

    const questionOrder = questions.map((q) => q.id);
    const totalQuestions = questionOrder.length;

    // Calculate max score
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

    const session = this.sessionRepo.create({
      userId,
      skill: dto.skill,
      level: dto.level,
      mode: dto.mode || PracticeMode.PRACTICE,
      sectionId: dto.sectionId,
      totalQuestions,
      questionOrder,
      maxScore,
      timeLimit: dto.timeLimit,
      settings: dto.settings,
      startedAt: new Date(),
      expiresAt: dto.timeLimit ? new Date(Date.now() + dto.timeLimit * 1000) : null,
    });

    return this.sessionRepo.save(session);
  }

  async getSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['answers', 'section'],
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên luyện tập');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập phiên này');
    }

    // Check if expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      if (session.status === SessionStatus.IN_PROGRESS) {
        session.status = SessionStatus.EXPIRED;
        await this.sessionRepo.save(session);
      }
    }

    return session;
  }

  async getSessionWithQuestions(sessionId: string, userId: string) {
    const session = await this.getSession(sessionId, userId);

    // Get questions in order
    const questions = await this.questionRepo.find({
      where: { id: In(session.questionOrder || []) },
      relations: ['options'],
    });

    // Sort by order
    const orderedQuestions = (session.questionOrder || [])
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean);

    return {
      session,
      questions: orderedQuestions,
    };
  }

  async submitAnswer(sessionId: string, userId: string, dto: SubmitAnswerDto): Promise<PracticeAnswer> {
    const session = await this.getSession(sessionId, userId);

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Phiên luyện tập đã kết thúc');
    }

    // Get question to validate answer
    const question = await this.questionRepo.findOne({
      where: { id: dto.questionId },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    // Check if already answered
    let answer = await this.answerRepo.findOne({
      where: { sessionId, questionId: dto.questionId },
    });

    // Calculate correctness and score
    const { isCorrect, score } = this.evaluateAnswer(question, dto);

    if (answer) {
      // Update existing answer
      answer.answer = dto.answer;
      answer.selectedOptionId = dto.selectedOptionId;
      answer.isCorrect = isCorrect;
      answer.score = score;
      answer.timeSpent = (answer.timeSpent || 0) + (dto.timeSpent || 0);
      answer.isFlagged = dto.isFlagged ?? answer.isFlagged;
      answer.answeredAt = new Date();
    } else {
      // Create new answer
      answer = this.answerRepo.create({
        sessionId,
        questionId: dto.questionId,
        answer: dto.answer,
        selectedOptionId: dto.selectedOptionId,
        isCorrect,
        score,
        maxScore: question.points,
        timeSpent: dto.timeSpent || 0,
        isFlagged: dto.isFlagged || false,
        answeredAt: new Date(),
      });

      // Update session counts
      session.answeredCount += 1;
      if (isCorrect) {
        session.correctCount += 1;
      }
    }

    await this.answerRepo.save(answer);
    await this.sessionRepo.save(session);

    return answer;
  }

  async updateSession(sessionId: string, userId: string, dto: UpdateSessionDto): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    if (dto.currentQuestionIndex !== undefined) {
      session.currentQuestionIndex = dto.currentQuestionIndex;
    }

    if (dto.timeSpent !== undefined) {
      session.timeSpent = dto.timeSpent;
    }

    if (dto.status) {
      this.updateSessionStatus(session, dto.status);
    }

    return this.sessionRepo.save(session);
  }

  async pauseSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Chỉ có thể tạm dừng phiên đang diễn ra');
    }

    session.status = SessionStatus.PAUSED;
    session.pausedAt = new Date();

    return this.sessionRepo.save(session);
  }

  async resumeSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    if (session.status !== SessionStatus.PAUSED) {
      throw new BadRequestException('Phiên không ở trạng thái tạm dừng');
    }

    // Adjust expiry time if there was a time limit
    if (session.expiresAt && session.pausedAt) {
      const pauseDuration = Date.now() - session.pausedAt.getTime();
      session.expiresAt = new Date(session.expiresAt.getTime() + pauseDuration);
    }

    session.status = SessionStatus.IN_PROGRESS;
    session.pausedAt = null;

    return this.sessionRepo.save(session);
  }

  async completeSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    if (session.status === SessionStatus.COMPLETED) {
      return session;
    }

    // Calculate final score
    const answers = await this.answerRepo.find({
      where: { sessionId },
    });

    const totalScore = answers.reduce((sum, a) => sum + Number(a.score), 0);

    session.score = totalScore;
    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    session.answeredCount = answers.length;
    session.correctCount = answers.filter((a) => a.isCorrect).length;

    return this.sessionRepo.save(session);
  }

  async abandonSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    session.status = SessionStatus.ABANDONED;
    session.completedAt = new Date();

    return this.sessionRepo.save(session);
  }

  async getUserSessions(
    userId: string,
    options: {
      skill?: string;
      status?: SessionStatus;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ sessions: PracticeSession[]; total: number }> {
    const query = this.sessionRepo
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .orderBy('session.createdAt', 'DESC');

    if (options.skill) {
      query.andWhere('session.skill = :skill', { skill: options.skill });
    }

    if (options.status) {
      query.andWhere('session.status = :status', { status: options.status });
    }

    const total = await query.getCount();

    if (options.limit) {
      query.take(options.limit);
    }
    if (options.offset) {
      query.skip(options.offset);
    }

    const sessions = await query.getMany();

    return { sessions, total };
  }

  // Private helper methods

  private async getQuestionsForSession(dto: CreateSessionDto): Promise<Question[]> {
    const query = this.questionRepo
      .createQueryBuilder('q')
      .where('q.skill = :skill', { skill: dto.skill })
      .andWhere('q.level = :level', { level: dto.level })
      .andWhere('q.isActive = :isActive', { isActive: true });

    if (dto.sectionId) {
      query.innerJoin('q.passage', 'p').andWhere('p.sectionId = :sectionId', { sectionId: dto.sectionId });
    }

    // Randomize and limit
    query.orderBy('RAND()');

    if (dto.questionCount) {
      query.take(dto.questionCount);
    } else {
      query.take(20); // Default 20 questions
    }

    return query.getMany();
  }

  private evaluateAnswer(question: Question, dto: SubmitAnswerDto): { isCorrect: boolean; score: number } {
    // For multiple choice
    if (dto.selectedOptionId) {
      const correctOption = question.options?.find((o) => o.isCorrect);
      const isCorrect = correctOption?.id === dto.selectedOptionId;
      return {
        isCorrect,
        score: isCorrect ? question.points : 0,
      };
    }

    // For fill-in-blank, short answer
    if (dto.answer && question.correctAnswer) {
      const isCorrect = this.compareAnswers(dto.answer, question.correctAnswer);
      return {
        isCorrect,
        score: isCorrect ? question.points : 0,
      };
    }

    // For essay, speaking - requires AI scoring (return null)
    return {
      isCorrect: null,
      score: 0,
    };
  }

  private compareAnswers(userAnswer: string, correctAnswer: string): boolean {
    // Normalize and compare
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
    return normalize(userAnswer) === normalize(correctAnswer);
  }

  private updateSessionStatus(session: PracticeSession, status: SessionStatus): void {
    switch (status) {
      case SessionStatus.COMPLETED:
        session.status = SessionStatus.COMPLETED;
        session.completedAt = new Date();
        break;
      case SessionStatus.ABANDONED:
        session.status = SessionStatus.ABANDONED;
        session.completedAt = new Date();
        break;
      case SessionStatus.PAUSED:
        session.status = SessionStatus.PAUSED;
        session.pausedAt = new Date();
        break;
      default:
        session.status = status;
    }
  }
}
