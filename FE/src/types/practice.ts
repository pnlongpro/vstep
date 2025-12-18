export type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1';
export type PracticeMode = 'practice' | 'mock_test' | 'review';
export type SessionStatus = 'in_progress' | 'paused' | 'completed' | 'abandoned' | 'expired';
export type QuestionType =
  | 'multiple_choice'
  | 'true_false_ng'
  | 'matching'
  | 'fill_blank'
  | 'short_answer'
  | 'essay'
  | 'speaking_task';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Session
export interface PracticeSession {
  id: string;
  userId: string;
  skill: Skill;
  level: VstepLevel;
  mode: PracticeMode;
  status: SessionStatus;
  sectionId?: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  currentQuestionIndex: number;
  score: number | null;
  maxScore: number | null;
  timeLimit: number | null; // seconds
  timeSpent: number; // seconds
  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  questionOrder: string[];
  settings?: Record<string, unknown>;
  createdAt: string;
}

// Question
export interface Question {
  id: string;
  type: QuestionType;
  skill: Skill;
  level: VstepLevel;
  difficulty: DifficultyLevel;
  content: string;
  context?: string;
  explanation?: string;
  correctAnswer?: string;
  points: number;
  orderIndex: number;
  audioUrl?: string;
  imageUrl?: string;
  wordLimit?: number;
  timeLimit?: number;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  label: string;
  content: string;
  isCorrect?: boolean; // Only shown after submission
  orderIndex: number;
  imageUrl?: string;
}

// Passage (for Reading/Listening)
export interface Passage {
  id: string;
  title?: string;
  content?: string; // Reading text
  audioUrl?: string; // Listening audio
  audioDuration?: number;
  audioTranscript?: string;
  imageUrl?: string;
  orderIndex: number;
  questions: Question[];
}

// Answer
export interface PracticeAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  answer?: string;
  selectedOptionId?: string;
  isCorrect: boolean | null;
  score: number;
  maxScore: number;
  timeSpent: number;
  isFlagged: boolean;
  answeredAt: string;
}

// Session with Questions
export interface SessionWithQuestions {
  session: PracticeSession;
  questions: Question[];
  passages?: Passage[];
}

// Session Result
export interface SessionResult {
  sessionId: string;
  userId: string;
  skill: Skill;
  level: VstepLevel;
  overallScore: number;
  vstepScore?: number;
  percentage: number;
  totalQuestions: number;
  correctCount: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  completedAt: string;
  suggestions: string[];
  sectionResults: SectionResult[];
}

export interface SectionResult {
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

// DTOs
export interface CreateSessionRequest {
  skill: Skill;
  level: VstepLevel;
  mode?: PracticeMode;
  sectionId?: string;
  questionCount?: number;
  timeLimit?: number;
  settings?: Record<string, unknown>;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answer?: string;
  selectedOptionId?: string;
  timeSpent?: number;
  isFlagged?: boolean;
}

export interface UpdateSessionRequest {
  currentQuestionIndex?: number;
  timeSpent?: number;
  status?: SessionStatus;
}

export interface GetSessionsParams {
  skill?: Skill;
  status?: SessionStatus;
  limit?: number;
  offset?: number;
}

export interface SessionsResponse {
  sessions: PracticeSession[];
  total: number;
}

// Statistics
export interface UserStatistics {
  totalSessions: number;
  completedSessions: number;
  totalTimeSpent: number;
  averageScore: number;
  bySkill: SkillStatistics[];
  recentActivity: RecentActivity[];
  streakDays: number;
}

export interface SkillStatistics {
  skill: Skill;
  sessionsCount: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  lastPracticed: string | null;
}

export interface RecentActivity {
  sessionId: string;
  skill: Skill;
  level: VstepLevel;
  score: number;
  completedAt: string;
}

// Draft
export interface PracticeDraft {
  id: string;
  sessionId?: string;
  questionId?: string;
  content: string;
  wordCount: number;
  version: number;
  updatedAt: string;
}

export interface SaveDraftRequest {
  sessionId?: string;
  questionId?: string;
  content: string;
  wordCount?: number;
}
