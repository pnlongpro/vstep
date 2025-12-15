import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeSession } from './entities/practice-session.entity';
import { PracticeAnswer } from './entities/practice-answer.entity';
import { DraftAnswer } from './entities/draft-answer.entity';
import { StartSessionDto } from './dto/start-session.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { SubmitSessionDto } from './dto/submit-session.dto';
import { SaveDraftDto } from './dto/save-draft.dto';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(PracticeSession)
    private readonly sessionRepository: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private readonly answerRepository: Repository<PracticeAnswer>,
    @InjectRepository(DraftAnswer)
    private readonly draftRepository: Repository<DraftAnswer>,
  ) {}

  async startSession(userId: number, startSessionDto: StartSessionDto) {
    const session = this.sessionRepository.create({
      userId,
      ...startSessionDto,
      status: 'in_progress',
      startedAt: new Date(),
    });

    await this.sessionRepository.save(session);

    return {
      sessionId: session.id,
      startedAt: session.startedAt,
    };
  }

  async saveProgress(sessionId: number, saveProgressDto: SaveProgressDto) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session không tồn tại');
    }

    session.timeSpent = saveProgressDto.timeSpent;
    session.lastSavedAt = new Date();
    session.autoSaveVersion += 1;

    await this.sessionRepository.save(session);

    // Save answers
    if (saveProgressDto.answers) {
      const answerPromises = Object.entries(saveProgressDto.answers).map(
        async ([questionId, answer]) => {
          let practiceAnswer = await this.answerRepository.findOne({
            where: { sessionId, questionId: parseInt(questionId) },
          });

          if (!practiceAnswer) {
            practiceAnswer = this.answerRepository.create({
              sessionId,
              questionId: parseInt(questionId),
              answer: answer as string,
              answerType: 'choice',
            });
          } else {
            practiceAnswer.answer = answer as string;
          }

          return this.answerRepository.save(practiceAnswer);
        },
      );

      await Promise.all(answerPromises);
    }

    return {
      sessionId,
      autoSaveVersion: session.autoSaveVersion,
      lastSavedAt: session.lastSavedAt,
    };
  }

  async submitSession(sessionId: number, submitSessionDto: SubmitSessionDto) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['answers'],
    });

    if (!session) {
      throw new NotFoundException('Session không tồn tại');
    }

    // Calculate score (simplified)
    let correctAnswers = 0;
    const totalQuestions = Object.keys(submitSessionDto.answers).length;

    // In real implementation, compare with correct answers from questions table
    // This is just a placeholder
    correctAnswers = Math.floor(totalQuestions * 0.7); // Mock 70% correct

    const percentage = (correctAnswers / totalQuestions) * 100;
    const score = this.calculateVstepScore(percentage);

    session.status = 'completed';
    session.completedAt = new Date();
    session.timeSpent = submitSessionDto.timeSpent;
    session.correctAnswers = correctAnswers;
    session.totalQuestions = totalQuestions;
    session.percentage = percentage;
    session.score = score;

    await this.sessionRepository.save(session);

    return {
      sessionId,
      score,
      correctAnswers,
      totalQuestions,
      percentage,
      completedAt: session.completedAt,
    };
  }

  async getSessions(userId: number, skill?: string, limit: number = 10) {
    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .orderBy('session.createdAt', 'DESC')
      .limit(limit);

    if (skill) {
      queryBuilder.andWhere('session.skill = :skill', { skill });
    }

    return queryBuilder.getMany();
  }

  async getSession(sessionId: number) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['answers'],
    });

    if (!session) {
      throw new NotFoundException('Session không tồn tại');
    }

    return session;
  }

  async saveDraft(userId: number, saveDraftDto: SaveDraftDto) {
    let draft = await this.draftRepository.findOne({
      where: { userId, taskId: saveDraftDto.taskId },
    });

    if (!draft) {
      draft = this.draftRepository.create({
        userId,
        ...saveDraftDto,
        lastSavedAt: new Date(),
        autoSaveCount: 1,
      });
    } else {
      Object.assign(draft, saveDraftDto);
      draft.lastSavedAt = new Date();
      draft.autoSaveCount += 1;
    }

    await this.draftRepository.save(draft);

    return {
      draftId: draft.id,
      lastSavedAt: draft.lastSavedAt,
    };
  }

  async getDraft(userId: number, taskId: number) {
    const draft = await this.draftRepository.findOne({
      where: { userId, taskId },
    });

    return draft || null;
  }

  async deleteDraft(draftId: number) {
    await this.draftRepository.delete(draftId);
    return { message: 'Draft đã được xóa' };
  }

  private calculateVstepScore(percentage: number): number {
    if (percentage >= 90) return 10;
    if (percentage >= 80) return 9;
    if (percentage >= 70) return 8;
    if (percentage >= 60) return 7;
    if (percentage >= 50) return 6;
    if (percentage >= 40) return 5;
    return 4;
  }
}
