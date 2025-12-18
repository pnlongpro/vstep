import { Skill, VstepLevel } from '../../../shared/enums/exam.enum';

export interface AnswerSubmission {
  questionId: string;
  answer: string | string[];
  timeSpent: number; // seconds
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  userAnswer: string | string[];
  correctAnswer: string;
  explanation?: string;
  timeSpent: number;
}

export interface SectionResult {
  sectionId?: string;
  skill: Skill;
  partNumber?: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  questionResults: QuestionResult[];
}

export interface SessionScoreResult {
  sessionId: string;
  userId: string;
  skill: Skill;
  level: VstepLevel;
  overallScore: number; // 0-10 scale
  vstepScore?: number; // VSTEP score if applicable
  percentage: number; // 0-100
  totalQuestions: number;
  correctCount: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  sectionResults: SectionResult[];
  completedAt: Date;
  suggestions: string[];
}
