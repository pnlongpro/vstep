import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PracticeSession } from '../../practice/entities/practice-session.entity';
import { PracticeAnswer } from '../../practice/entities/practice-answer.entity';
import { Question } from '../../questions/entities/question.entity';
import { VstepScoreCalculator } from '../helpers/vstep-calculator';
import { AnswerSubmission, QuestionResult, SectionResult, SessionScoreResult } from '../interfaces/scoring.interface';
import { SessionStatus } from '../../../shared/enums/practice.enum';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @InjectRepository(PracticeSession)
    private readonly sessionRepository: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private readonly answerRepository: Repository<PracticeAnswer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  /**
   * Score a single answer (real-time feedback)
   */
  async scoreAnswer(questionId: string, answer: string | string[]): Promise<QuestionResult> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['options'],
    });

    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    const isCorrect = this.evaluateAnswer(question, answer);

    return {
      questionId,
      isCorrect,
      pointsEarned: isCorrect ? question.points : 0,
      maxPoints: question.points,
      userAnswer: answer,
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation,
      timeSpent: 0, // Will be set by caller
    };
  }

  /**
   * Score entire practice session
   */
  async scoreSession(sessionId: string): Promise<SessionScoreResult> {
    this.logger.log(`Scoring session: ${sessionId}`);

    // Get session with answers
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['answers'],
    });

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Get all questions for this session
    const questionIds = session.answers.map((a) => a.questionId);
    const questions =
      questionIds.length > 0
        ? await this.questionRepository.find({
            where: { id: In(questionIds) },
            relations: ['options'],
          })
        : [];

    // Score each answer
    const questionResults: QuestionResult[] = [];
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    let totalTimeSpent = 0;

    for (const answer of session.answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      const isCorrect = answer.isCorrect ?? false;
      const points = question.points || 1;

      const result: QuestionResult = {
        questionId: question.id,
        isCorrect,
        pointsEarned: isCorrect ? points : 0,
        maxPoints: points,
        userAnswer: answer.answer || answer.selectedOptionId || '',
        correctAnswer: question.correctAnswer || '',
        explanation: question.explanation,
        timeSpent: answer.timeSpent || 0,
      };

      questionResults.push(result);
      totalPoints += points;
      earnedPoints += result.pointsEarned;
      totalTimeSpent += result.timeSpent;

      if (isCorrect) correctCount++;
    }

    // Build section results (single section for now)
    const sectionResults: SectionResult[] = [
      {
        skill: session.skill,
        totalQuestions: questionResults.length,
        correctCount,
        incorrectCount: questionResults.length - correctCount,
        skippedCount: session.totalQuestions - questionResults.length,
        totalPoints,
        earnedPoints,
        percentage: VstepScoreCalculator.calculatePercentage(correctCount, questionResults.length),
        questionResults,
      },
    ];

    // Calculate overall scores
    const percentage = VstepScoreCalculator.calculatePercentage(correctCount, questionResults.length);
    const overallScore = VstepScoreCalculator.percentageToScore(percentage);
    const vstepScore = VstepScoreCalculator.calculateVstepScore(session.skill, session.level, correctCount);

    // Generate suggestions
    const suggestions = VstepScoreCalculator.generateSuggestions(
      session.skill,
      session.level,
      percentage,
      sectionResults.map((s) => ({ partNumber: s.partNumber, percentage: s.percentage })),
    );

    // Build final result
    const result: SessionScoreResult = {
      sessionId,
      userId: session.userId,
      skill: session.skill,
      level: session.level,
      overallScore,
      vstepScore: vstepScore > 0 ? vstepScore : undefined,
      percentage,
      totalQuestions: questionResults.length,
      correctCount,
      totalTimeSpent,
      averageTimePerQuestion: questionResults.length > 0 ? Math.round(totalTimeSpent / questionResults.length) : 0,
      sectionResults,
      completedAt: new Date(),
      suggestions,
    };

    // Update session with score
    session.score = overallScore;
    session.correctCount = correctCount;
    session.timeSpent = totalTimeSpent;
    session.completedAt = new Date();
    session.status = SessionStatus.COMPLETED;
    await this.sessionRepository.save(session);

    this.logger.log(`Session ${sessionId} scored: ${overallScore}/10 (${percentage}%)`);

    return result;
  }

  /**
   * Get scoring result for a session
   */
  async getSessionResult(sessionId: string): Promise<SessionScoreResult | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session || session.status !== SessionStatus.COMPLETED) {
      return null;
    }

    // Re-calculate and return
    return this.scoreSession(sessionId);
  }

  /**
   * Batch score multiple answers (for auto-grading on submit)
   */
  async batchScoreAnswers(answers: AnswerSubmission[]): Promise<QuestionResult[]> {
    const results: QuestionResult[] = [];

    for (const submission of answers) {
      try {
        const result = await this.scoreAnswer(submission.questionId, submission.answer);
        result.timeSpent = submission.timeSpent;
        results.push(result);
      } catch (error) {
        this.logger.error(`Error scoring question ${submission.questionId}:`, error);
        // Skip failed questions
      }
    }

    return results;
  }

  private evaluateAnswer(question: Question, answer: string | string[]): boolean {
    // For multiple choice
    if (typeof answer === 'string' && question.options && question.options.length > 0) {
      const correctOption = question.options.find((o) => o.isCorrect);
      return correctOption?.id === answer || correctOption?.label === answer;
    }

    // For fill-in-blank, short answer
    if (typeof answer === 'string' && question.correctAnswer) {
      const normalize = (s: string) =>
        s
          .toLowerCase()
          .trim()
          .replace(/\s+/g, ' ');
      return normalize(answer) === normalize(question.correctAnswer);
    }

    // For matching
    if (Array.isArray(answer) && question.correctAnswer) {
      try {
        const correctPairs = JSON.parse(question.correctAnswer);
        return JSON.stringify(answer.sort()) === JSON.stringify(correctPairs.sort());
      } catch {
        return false;
      }
    }

    return false;
  }
}
