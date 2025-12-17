# FE-008: Practice API Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-008 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-001, BE-010, BE-011 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `services/practice.service.ts` - ❌ Chưa có - **CÓ THỂ TẠO MỚI**
> - `features/practice/` - ❌ Chưa có - Cần tạo

**Action:**
- ✅ CREATE `services/practice.service.ts` 
- ✅ CREATE `types/practice.types.ts`
- ✅ CREATE `hooks/usePractice.ts` (React Query hooks)

---

## 🎯 Objective

Implement Practice API service layer:
- Practice session management
- Question fetching
- Answer submission
- Progress tracking

---

## 💻 Implementation

### Step 1: Practice Types

```typescript
// src/types/practice.types.ts

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
  settings?: Record<string, any>;
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
  session: PracticeSession;
  answers: (PracticeAnswer & { 
    question: Question;
    correctAnswer?: string;
  })[];
  statistics: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    accuracy: number;
    timeSpent: number;
    averageTimePerQuestion: number;
    scoreByType: Record<QuestionType, { correct: number; total: number }>;
  };
}

// DTOs
export interface CreateSessionRequest {
  skill: Skill;
  level: VstepLevel;
  mode?: PracticeMode;
  sectionId?: string;
  questionCount?: number;
  timeLimit?: number;
  settings?: Record<string, any>;
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
```

### Step 2: Practice API Service

```typescript
// src/services/practice.service.ts
import { apiClient } from '@/lib/api-client';
import {
  PracticeSession,
  Question,
  Passage,
  PracticeAnswer,
  SessionWithQuestions,
  SessionResult,
  CreateSessionRequest,
  SubmitAnswerRequest,
  UpdateSessionRequest,
  GetSessionsParams,
  SessionsResponse,
} from '@/types/practice.types';

class PracticeService {
  private baseUrl = '/practice';

  // =====================
  // Session Management
  // =====================

  async createSession(data: CreateSessionRequest): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(
      `${this.baseUrl}/sessions`,
      data
    );
    return response.data;
  }

  async getSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.get<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}`
    );
    return response.data;
  }

  async getSessionWithQuestions(sessionId: string): Promise<SessionWithQuestions> {
    const response = await apiClient.get<SessionWithQuestions>(
      `${this.baseUrl}/sessions/${sessionId}/questions`
    );
    return response.data;
  }

  async getSessions(params: GetSessionsParams = {}): Promise<SessionsResponse> {
    const response = await apiClient.get<SessionsResponse>(
      `${this.baseUrl}/sessions`,
      { params }
    );
    return response.data;
  }

  async updateSession(
    sessionId: string, 
    data: UpdateSessionRequest
  ): Promise<PracticeSession> {
    const response = await apiClient.patch<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}`,
      data
    );
    return response.data;
  }

  async pauseSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}/pause`
    );
    return response.data;
  }

  async resumeSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}/resume`
    );
    return response.data;
  }

  async completeSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}/complete`
    );
    return response.data;
  }

  async abandonSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(
      `${this.baseUrl}/sessions/${sessionId}/abandon`
    );
    return response.data;
  }

  // =====================
  // Answer Submission
  // =====================

  async submitAnswer(
    sessionId: string, 
    data: SubmitAnswerRequest
  ): Promise<PracticeAnswer> {
    const response = await apiClient.post<PracticeAnswer>(
      `${this.baseUrl}/sessions/${sessionId}/answers`,
      data
    );
    return response.data;
  }

  async submitMultipleAnswers(
    sessionId: string,
    answers: SubmitAnswerRequest[]
  ): Promise<PracticeAnswer[]> {
    const response = await apiClient.post<PracticeAnswer[]>(
      `${this.baseUrl}/sessions/${sessionId}/answers/batch`,
      { answers }
    );
    return response.data;
  }

  async getSessionAnswers(sessionId: string): Promise<PracticeAnswer[]> {
    const response = await apiClient.get<PracticeAnswer[]>(
      `${this.baseUrl}/sessions/${sessionId}/answers`
    );
    return response.data;
  }

  // =====================
  // Results
  // =====================

  async getSessionResult(sessionId: string): Promise<SessionResult> {
    const response = await apiClient.get<SessionResult>(
      `${this.baseUrl}/sessions/${sessionId}/result`
    );
    return response.data;
  }

  // =====================
  // Questions (Direct Access)
  // =====================

  async getQuestions(params: {
    skill?: string;
    level?: string;
    type?: string;
    limit?: number;
  }): Promise<Question[]> {
    const response = await apiClient.get<Question[]>(
      `${this.baseUrl}/questions`,
      { params }
    );
    return response.data;
  }

  async getQuestionById(questionId: string): Promise<Question> {
    const response = await apiClient.get<Question>(
      `${this.baseUrl}/questions/${questionId}`
    );
    return response.data;
  }

  // =====================
  // Passages
  // =====================

  async getPassages(params: {
    sectionId?: string;
    skill?: string;
    level?: string;
  }): Promise<Passage[]> {
    const response = await apiClient.get<Passage[]>(
      `${this.baseUrl}/passages`,
      { params }
    );
    return response.data;
  }

  async getPassageById(passageId: string): Promise<Passage> {
    const response = await apiClient.get<Passage>(
      `${this.baseUrl}/passages/${passageId}`
    );
    return response.data;
  }

  // =====================
  // Draft/Auto-save
  // =====================

  async saveDraft(
    sessionId: string,
    data: {
      answers: Record<string, string | undefined>;
      currentIndex: number;
      timeSpent: number;
    }
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/sessions/${sessionId}/draft`, data);
  }

  async getDraft(sessionId: string): Promise<{
    answers: Record<string, string | undefined>;
    currentIndex: number;
    timeSpent: number;
  } | null> {
    try {
      const response = await apiClient.get(
        `${this.baseUrl}/sessions/${sessionId}/draft`
      );
      return response.data;
    } catch {
      return null;
    }
  }

  // =====================
  // Statistics
  // =====================

  async getUserStats(params?: {
    skill?: string;
    level?: string;
    period?: 'week' | 'month' | 'all';
  }): Promise<{
    totalSessions: number;
    completedSessions: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    totalTimeSpent: number;
    averageScore: number;
    skillBreakdown: Record<string, { sessions: number; accuracy: number }>;
    recentProgress: { date: string; score: number }[];
  }> {
    const response = await apiClient.get(`${this.baseUrl}/stats`, { params });
    return response.data;
  }
}

export const practiceService = new PracticeService();
```

### Step 3: Practice Hooks

```typescript
// src/hooks/usePracticeSession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { practiceService } from '@/services/practice.service';
import {
  PracticeSession,
  Question,
  PracticeAnswer,
  CreateSessionRequest,
  SubmitAnswerRequest,
} from '@/types/practice.types';

interface UsePracticeSessionOptions {
  autoSave?: boolean;
  autoSaveInterval?: number; // ms
  onSessionEnd?: (session: PracticeSession) => void;
  onTimeUp?: () => void;
}

export function usePracticeSession(options: UsePracticeSessionOptions = {}) {
  const {
    autoSave = true,
    autoSaveInterval = 10000,
    onSessionEnd,
    onTimeUp,
  } = options;

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, SubmitAnswerRequest>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new session
  const startSession = useCallback(async (data: CreateSessionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await practiceService.createSession(data);
      const { session: sessionData, questions: questionData } = 
        await practiceService.getSessionWithQuestions(newSession.id);
      
      setSession(sessionData);
      setQuestions(questionData);
      setCurrentIndex(0);
      setAnswers({});
      setTimeSpent(0);

      return sessionData;
    } catch (err: any) {
      setError(err.message || 'Không thể bắt đầu phiên luyện tập');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load existing session
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { session: sessionData, questions: questionData } =
        await practiceService.getSessionWithQuestions(sessionId);
      
      setSession(sessionData);
      setQuestions(questionData);
      setCurrentIndex(sessionData.currentQuestionIndex);
      setTimeSpent(sessionData.timeSpent);

      // Load existing answers
      const existingAnswers = await practiceService.getSessionAnswers(sessionId);
      const answersMap: Record<string, SubmitAnswerRequest> = {};
      existingAnswers.forEach((a) => {
        answersMap[a.questionId] = {
          questionId: a.questionId,
          answer: a.answer,
          selectedOptionId: a.selectedOptionId,
          isFlagged: a.isFlagged,
        };
      });
      setAnswers(answersMap);

      return sessionData;
    } catch (err: any) {
      setError(err.message || 'Không thể tải phiên luyện tập');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit answer
  const submitAnswer = useCallback(async (data: Omit<SubmitAnswerRequest, 'questionId'>) => {
    if (!session || !questions[currentIndex]) return;

    const questionId = questions[currentIndex].id;
    const answerData: SubmitAnswerRequest = {
      questionId,
      ...data,
      timeSpent: timeSpent,
    };

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerData,
    }));

    try {
      const result = await practiceService.submitAnswer(session.id, answerData);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [session, questions, currentIndex, timeSpent]);

  // Navigation
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      if (session) {
        practiceService.updateSession(session.id, { currentQuestionIndex: index });
      }
    }
  }, [questions.length, session]);

  const goNext = useCallback(() => {
    goToQuestion(currentIndex + 1);
  }, [currentIndex, goToQuestion]);

  const goPrevious = useCallback(() => {
    goToQuestion(currentIndex - 1);
  }, [currentIndex, goToQuestion]);

  // Flag question
  const toggleFlag = useCallback(() => {
    if (!questions[currentIndex]) return;
    
    const questionId = questions[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        isFlagged: !prev[questionId]?.isFlagged,
      },
    }));
  }, [currentIndex, questions]);

  // Session control
  const pauseSession = useCallback(async () => {
    if (!session) return;
    try {
      const updated = await practiceService.pauseSession(session.id);
      setSession(updated);
    } catch (err: any) {
      setError(err.message);
    }
  }, [session]);

  const resumeSession = useCallback(async () => {
    if (!session) return;
    try {
      const updated = await practiceService.resumeSession(session.id);
      setSession(updated);
    } catch (err: any) {
      setError(err.message);
    }
  }, [session]);

  const completeSession = useCallback(async () => {
    if (!session) return;
    try {
      // Submit all pending answers
      const pendingAnswers = Object.values(answers);
      if (pendingAnswers.length > 0) {
        await practiceService.submitMultipleAnswers(session.id, pendingAnswers);
      }
      
      const completed = await practiceService.completeSession(session.id);
      setSession(completed);
      onSessionEnd?.(completed);
      return completed;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [session, answers, onSessionEnd]);

  const abandonSession = useCallback(async () => {
    if (!session) return;
    try {
      const abandoned = await practiceService.abandonSession(session.id);
      setSession(abandoned);
      onSessionEnd?.(abandoned);
    } catch (err: any) {
      setError(err.message);
    }
  }, [session, onSessionEnd]);

  // Timer effect
  useEffect(() => {
    if (session?.status === 'in_progress') {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => {
          const newTime = prev + 1;
          
          // Check time limit
          if (session.timeLimit && newTime >= session.timeLimit) {
            onTimeUp?.();
            completeSession();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session?.status, session?.timeLimit, completeSession, onTimeUp]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave && session?.status === 'in_progress') {
      autoSaveRef.current = setInterval(() => {
        practiceService.updateSession(session.id, {
          currentQuestionIndex: currentIndex,
          timeSpent,
        });
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [autoSave, autoSaveInterval, session, currentIndex, timeSpent]);

  // Current question helper
  const currentQuestion = questions[currentIndex] || null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  
  // Progress stats
  const progress = {
    current: currentIndex + 1,
    total: questions.length,
    answered: Object.keys(answers).filter(id => answers[id]?.answer || answers[id]?.selectedOptionId).length,
    flagged: Object.values(answers).filter(a => a.isFlagged).length,
  };

  // Time remaining
  const timeRemaining = session?.timeLimit ? session.timeLimit - timeSpent : null;

  return {
    // State
    session,
    questions,
    answers,
    currentIndex,
    currentQuestion,
    currentAnswer,
    isLoading,
    error,
    timeSpent,
    timeRemaining,
    progress,
    
    // Actions
    startSession,
    loadSession,
    submitAnswer,
    goToQuestion,
    goNext,
    goPrevious,
    toggleFlag,
    pauseSession,
    resumeSession,
    completeSession,
    abandonSession,
    setError,
  };
}
```

---

## 📦 Dependencies

Already included from previous tasks.

---

## ✅ Acceptance Criteria

- [ ] Practice service với all endpoints
- [ ] Types đầy đủ cho Practice domain
- [ ] usePracticeSession hook functional
- [ ] Timer và auto-save working
- [ ] Session lifecycle management

---

## ⏭️ Next Task

→ `FE-009_QUESTION_COMPONENTS.md` - Question Components
