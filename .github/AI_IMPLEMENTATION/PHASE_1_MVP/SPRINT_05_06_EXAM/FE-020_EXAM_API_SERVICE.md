# FE-020: Exam API Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-020 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-020 to BE-027 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `features/exam/exam.api.ts` - ❌ Chưa có - **CÓ THỂ TẠO MỚI**
> - Tham khảo pattern từ `features/auth/auth.api.ts`

**Action:**
- ✅ CREATE `features/exam/exam.api.ts`
- ✅ CREATE `features/exam/exam.hooks.ts`
- ✅ CREATE `features/exam/exam.types.ts`
- ✅ CREATE `features/exam/exam.store.ts`

---

## 🎯 Objective

Implement Exam API Service với:
- Full exam lifecycle API calls
- Timer sync endpoints
- Session management
- Result retrieval
- Certificate APIs

---

## 💻 Implementation

### Step 1: Exam Types

```typescript
// src/types/exam.ts

export type AttemptStatus = 
  | 'not_started'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'abandoned'
  | 'timed_out';

export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

export interface ExamSet {
  id: string;
  title: string;
  description: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  duration: number;
  sections: ExamSection[];
  isActive: boolean;
  createdAt: string;
}

export interface ExamSection {
  id: string;
  examSetId: string;
  title: string;
  skill: SkillType;
  duration: number;
  orderIndex: number;
  passages: Passage[];
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'essay' | 'speaking_task';
  options?: QuestionOption[];
  orderIndex: number;
  points: number;
  explanation?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  label: string;
  isCorrect?: boolean;
}

export interface ExamAttempt {
  id: string;
  examSetId: string;
  status: AttemptStatus;
  currentSectionId: string;
  currentQuestionIndex: number;
  startedAt: string;
  endedAt?: string;
  timeRemaining: number;
  autoSaveVersion: number;
  progress: ExamProgress;
}

export interface ExamProgress {
  totalQuestions: number;
  answeredQuestions: number;
  flaggedQuestions: number;
  sectionProgress: { [sectionId: string]: number };
}

export interface ExamAnswer {
  questionId: string;
  answer?: string;
  selectedOptionId?: string;
  richContent?: string;
  audioUrl?: string;
  timeSpent: number;
  isFlagged: boolean;
}

// Timer types
export interface TimeSyncResponse {
  serverTimestamp: number;
  totalTimeRemaining: number;
  sectionTimeRemaining: number;
  currentSectionId: string;
  isExpired: boolean;
  shouldSubmit: boolean;
  warnings: string[];
  drift: number;
}

export interface ExamTiming {
  attemptId: string;
  status: string;
  startedAt: string;
  totalTimeLimit: number;
  totalTimeRemaining: number;
  totalTimeSpent: number;
  currentSectionId: string;
  sections: SectionTiming[];
  isPaused: boolean;
  pausedAt?: string;
}

export interface SectionTiming {
  sectionId: string;
  skill: SkillType;
  timeLimit: number;
  timeSpent: number;
  timeRemaining: number;
  isCompleted: boolean;
}

// Session types
export interface SessionInfo {
  sessionId: string;
  attemptId: string;
  examSetId: string;
  status: 'active' | 'paused' | 'expired' | 'completed';
  startedAt: string;
  lastActivityAt: string;
  deviceInfo: {
    fingerprint: string;
    browser: string;
    ip: string;
  };
  timeRemaining: number;
  canResume: boolean;
  isLocked: boolean;
}

export interface ActiveSessions {
  hasActiveSession: boolean;
  activeSession?: SessionInfo;
  pausedSessions: SessionInfo[];
  canStartNew: boolean;
  blockReason?: string;
}

// Result types
export interface ExamResult {
  attemptId: string;
  examSetId: string;
  examTitle: string;
  level: string;
  completedAt: string;
  totalDuration: number;
  overallScore: number;
  vstepScore: number;
  band: string;
  bandLabel: string;
  sections: SectionResult[];
  summary: ResultSummary;
  skillAnalysis: SkillAnalysis[];
  recommendations: string[];
  comparison?: ScoreComparison;
}

export interface SectionResult {
  sectionId: string;
  sectionName: string;
  skill: SkillType;
  score: number;
  vstepScore: number;
  correctCount: number;
  totalCount: number;
  timeSpent: number;
  timeAllocated: number;
  questions: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  questionText: string;
  questionType: string;
  skill: SkillType;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  timeSpent: number;
  explanation?: string;
  options?: {
    id: string;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
  }[];
  aiScore?: AIScore;
}

export interface AIScore {
  overall: number;
  criteria: { [key: string]: { score: number; feedback: string } };
  suggestions?: string[];
  grammarErrors?: { text: string; correction: string; position: number }[];
}

export interface ResultSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  averageTimePerQuestion: number;
}

export interface SkillAnalysis {
  skill: SkillType;
  score: number;
  vstepScore: number;
  performance: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  strengths: string[];
  weaknesses: string[];
}

export interface ScoreComparison {
  previousScore: number;
  improvement: number;
  percentile: number;
  rank: number;
}

// Certificate types
export interface Certificate {
  certificateId: string;
  certificateNumber: string;
  recipientName: string;
  examTitle: string;
  level: string;
  vstepScore: number;
  band: string;
  issueDate: string;
  expiryDate: string;
  verificationUrl: string;
  qrCodeUrl: string;
  downloadUrl: string;
  skillScores: { skill: string; score: number }[];
}

export interface CertificateVerification {
  isValid: boolean;
  certificateNumber: string;
  recipientName: string;
  examTitle: string;
  vstepScore: number;
  band: string;
  issueDate: string;
  isExpired: boolean;
  expiryDate?: string;
  message?: string;
}
```

### Step 2: Exam API Service

```typescript
// src/services/examService.ts
import apiClient from '@/lib/apiClient';
import {
  ExamSet,
  ExamAttempt,
  ExamAnswer,
  TimeSyncResponse,
  ExamTiming,
  SessionInfo,
  ActiveSessions,
  ExamResult,
  Certificate,
  CertificateVerification,
} from '@/types/exam';

// =============================================================================
// EXAM SETS
// =============================================================================

export const examSetApi = {
  getAll: async (params?: {
    level?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{
      data: ExamSet[];
      total: number;
      page: number;
      limit: number;
    }>('/exam-sets', { params });
    return response.data;
  },

  getById: async (examSetId: string) => {
    const response = await apiClient.get<ExamSet>(`/exam-sets/${examSetId}`);
    return response.data;
  },

  getWithQuestions: async (examSetId: string) => {
    const response = await apiClient.get<ExamSet>(`/exam-sets/${examSetId}/full`);
    return response.data;
  },
};

// =============================================================================
// EXAM ATTEMPTS
// =============================================================================

export const examAttemptApi = {
  start: async (examSetId: string, sessionFingerprint?: string) => {
    const response = await apiClient.post<ExamAttempt>('/exams/start', {
      examSetId,
      sessionFingerprint,
    });
    return response.data;
  },

  getAttempt: async (attemptId: string) => {
    const response = await apiClient.get<ExamAttempt>(`/exams/attempts/${attemptId}`);
    return response.data;
  },

  submitAnswer: async (attemptId: string, answer: Partial<ExamAnswer>) => {
    const response = await apiClient.post<ExamAnswer>(
      `/exams/attempts/${attemptId}/answers`,
      answer
    );
    return response.data;
  },

  bulkSubmitAnswers: async (
    attemptId: string,
    answers: Partial<ExamAnswer>[],
    autoSaveVersion?: number
  ) => {
    const response = await apiClient.post<{ savedCount: number; version: number }>(
      `/exams/attempts/${attemptId}/answers/bulk`,
      { answers, autoSaveVersion }
    );
    return response.data;
  },

  navigateToSection: async (attemptId: string, sectionId: string) => {
    const response = await apiClient.post<ExamAttempt>(
      `/exams/attempts/${attemptId}/navigate`,
      { sectionId }
    );
    return response.data;
  },

  updateProgress: async (
    attemptId: string,
    progress: { currentQuestionIndex?: number; timeRemaining?: number }
  ) => {
    const response = await apiClient.patch<ExamAttempt>(
      `/exams/attempts/${attemptId}/progress`,
      progress
    );
    return response.data;
  },

  pause: async (attemptId: string) => {
    const response = await apiClient.post(`/exams/attempts/${attemptId}/pause`);
    return response.data;
  },

  resume: async (attemptId: string) => {
    const response = await apiClient.post<ExamAttempt>(`/exams/attempts/${attemptId}/resume`);
    return response.data;
  },

  getAnswers: async (attemptId: string) => {
    const response = await apiClient.get<ExamAnswer[]>(
      `/exams/attempts/${attemptId}/answers`
    );
    return response.data;
  },
};

// =============================================================================
// EXAM SUBMISSION
// =============================================================================

export const examSubmissionApi = {
  submit: async (
    attemptId: string,
    options?: {
      submissionType?: 'manual' | 'auto_timeout' | 'force_submit';
      finalAnswers?: Partial<ExamAnswer>[];
      clientTimestamp?: number;
    }
  ) => {
    const response = await apiClient.post<{
      attemptId: string;
      submittedAt: string;
      status: string;
      processingStatus: {
        reading: string;
        listening: string;
        writing: string;
        speaking: string;
      };
      estimatedCompletionTime?: string;
      preliminaryScore?: { reading: number; listening: number };
    }>('/exams/submit', { attemptId, ...options });
    return response.data;
  },

  getProgress: async (attemptId: string) => {
    const response = await apiClient.get<{
      attemptId: string;
      totalAnswers: number;
      scoredAnswers: number;
      pendingAiScoring: number;
      status: string;
      scores?: { [skill: string]: { score: number; status: string } };
    }>(`/exams/submit/${attemptId}/progress`);
    return response.data;
  },
};

// =============================================================================
// EXAM TIMER
// =============================================================================

export const examTimerApi = {
  sync: async (attemptId: string, clientTimeRemaining?: number, sectionId?: string) => {
    const response = await apiClient.post<TimeSyncResponse>('/exams/timer/sync', {
      attemptId,
      clientTimestamp: Date.now(),
      clientTimeRemaining,
      sectionId,
    });
    return response.data;
  },

  getTiming: async (attemptId: string) => {
    const response = await apiClient.get<ExamTiming>(`/exams/timer/${attemptId}`);
    return response.data;
  },

  startSection: async (attemptId: string, sectionId: string) => {
    const response = await apiClient.post(
      `/exams/timer/${attemptId}/sections/${sectionId}/start`
    );
    return response.data;
  },

  endSection: async (attemptId: string, sectionId: string) => {
    const response = await apiClient.post(
      `/exams/timer/${attemptId}/sections/${sectionId}/end`
    );
    return response.data;
  },

  pause: async (attemptId: string) => {
    const response = await apiClient.post(`/exams/timer/${attemptId}/pause`);
    return response.data;
  },

  resume: async (attemptId: string) => {
    const response = await apiClient.post(`/exams/timer/${attemptId}/resume`);
    return response.data;
  },
};

// =============================================================================
// EXAM SESSIONS
// =============================================================================

export const examSessionApi = {
  start: async (examSetId: string, deviceFingerprint?: string, browserInfo?: string) => {
    const response = await apiClient.post<SessionInfo>('/exams/sessions/start', {
      examSetId,
      deviceFingerprint,
      browserInfo,
    });
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get<ActiveSessions>('/exams/sessions/active');
    return response.data;
  },

  heartbeat: async (attemptId: string, deviceFingerprint?: string) => {
    const response = await apiClient.post<{
      sessionValid: boolean;
      timeRemaining: number;
      serverTime: number;
      warning?: string;
      shouldForceRefresh: boolean;
    }>('/exams/sessions/heartbeat', { attemptId, deviceFingerprint });
    return response.data;
  },

  pause: async (attemptId: string) => {
    const response = await apiClient.post<SessionInfo>(`/exams/sessions/${attemptId}/pause`);
    return response.data;
  },

  resume: async (attemptId: string) => {
    const response = await apiClient.post<SessionInfo>(`/exams/sessions/${attemptId}/resume`);
    return response.data;
  },

  recover: async (attemptId: string, recoveryToken: string) => {
    const response = await apiClient.post<{
      attemptId: string;
      recoveryToken: string;
      answersRestored: number;
      lastSaveTime: string;
      timeRemaining: number;
    }>(`/exams/sessions/${attemptId}/recover`, { recoveryToken });
    return response.data;
  },

  terminate: async (attemptId: string) => {
    await apiClient.delete(`/exams/sessions/${attemptId}`);
  },
};

// =============================================================================
// EXAM RESULTS
// =============================================================================

export const examResultApi = {
  getResult: async (attemptId: string) => {
    const response = await apiClient.get<ExamResult>(`/exams/results/${attemptId}`);
    return response.data;
  },

  getResultSummaries: async (limit?: number, offset?: number) => {
    const response = await apiClient.get<ExamResult[]>('/exams/results', {
      params: { limit, offset },
    });
    return response.data;
  },

  createShareLink: async (attemptId: string, expiresInDays?: number) => {
    const response = await apiClient.post<{
      shareToken: string;
      shareUrl: string;
      expiresAt: string;
    }>(`/exams/results/${attemptId}/share`, { expiresInDays });
    return response.data;
  },

  getSharedResult: async (shareToken: string) => {
    const response = await apiClient.get<ExamResult>(`/exams/results/shared/${shareToken}`);
    return response.data;
  },

  exportResult: async (attemptId: string, format: 'json' | 'csv' | 'pdf') => {
    const response = await apiClient.get(`/exams/results/${attemptId}/export`, {
      params: { format },
      responseType: format === 'json' ? 'json' : 'blob',
    });
    return response.data;
  },
};

// =============================================================================
// EXAM ANALYTICS
// =============================================================================

export const examAnalyticsApi = {
  getAttemptAnalytics: async (attemptId: string) => {
    const response = await apiClient.get(`/exams/analytics/attempt/${attemptId}`);
    return response.data;
  },

  getUserHistory: async () => {
    const response = await apiClient.get('/exams/analytics/history');
    return response.data;
  },
};

// =============================================================================
// VSTEP SCORING
// =============================================================================

export const vstepScoringApi = {
  getFullScore: async (attemptId: string) => {
    const response = await apiClient.get(`/exams/scoring/${attemptId}`);
    return response.data;
  },

  getComparison: async (attemptId: string) => {
    const response = await apiClient.get(`/exams/scoring/${attemptId}/comparison`);
    return response.data;
  },
};

// =============================================================================
// CERTIFICATES
// =============================================================================

export const certificateApi = {
  generate: async (attemptId: string, displayName?: string) => {
    const response = await apiClient.post<Certificate>('/certificates/generate', {
      attemptId,
      displayName,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get<Certificate[]>('/certificates');
    return response.data;
  },

  getById: async (certificateId: string) => {
    const response = await apiClient.get<Certificate>(`/certificates/${certificateId}`);
    return response.data;
  },

  download: async (certificateId: string) => {
    const response = await apiClient.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  verify: async (verificationCode: string) => {
    const response = await apiClient.get<CertificateVerification>(
      `/certificates/verify/${verificationCode}`
    );
    return response.data;
  },
};

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export const examService = {
  sets: examSetApi,
  attempts: examAttemptApi,
  submission: examSubmissionApi,
  timer: examTimerApi,
  sessions: examSessionApi,
  results: examResultApi,
  analytics: examAnalyticsApi,
  scoring: vstepScoringApi,
  certificates: certificateApi,
};

export default examService;
```

### Step 3: Exam Hooks

```typescript
// src/hooks/useExam.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { ExamAttempt, ExamAnswer, TimeSyncResponse } from '@/types/exam';
import { getDeviceFingerprint } from '@/utils/fingerprint';
import { useToast } from '@/hooks/useToast';

const AUTO_SAVE_INTERVAL = 10000; // 10 seconds
const HEARTBEAT_INTERVAL = 10000; // 10 seconds
const TIME_SYNC_INTERVAL = 10000; // 10 seconds

export function useExamAttempt(attemptId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: attempt, isLoading, error, refetch } = useQuery({
    queryKey: ['exam-attempt', attemptId],
    queryFn: () => examService.attempts.getAttempt(attemptId!),
    enabled: !!attemptId,
    refetchOnWindowFocus: false,
  });

  const { data: answers } = useQuery({
    queryKey: ['exam-answers', attemptId],
    queryFn: () => examService.attempts.getAnswers(attemptId!),
    enabled: !!attemptId,
    refetchOnWindowFocus: false,
  });

  return { attempt, answers, isLoading, error, refetch };
}

export function useExamTimer(attemptId: string | null) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const syncRef = useRef<NodeJS.Timeout | null>(null);

  const syncTime = useCallback(async () => {
    if (!attemptId) return;

    try {
      const response = await examService.timer.sync(attemptId, timeRemaining);
      setTimeRemaining(response.totalTimeRemaining);
      setSectionTimeRemaining(response.sectionTimeRemaining);
      setIsExpired(response.isExpired);
      setWarnings(response.warnings);

      if (response.shouldSubmit) {
        // Trigger auto-submit
        window.dispatchEvent(new CustomEvent('exam:timeout', { detail: { attemptId } }));
      }
    } catch (error) {
      console.error('Time sync failed:', error);
    }
  }, [attemptId, timeRemaining]);

  useEffect(() => {
    if (!attemptId) return;

    // Initial sync
    syncTime();

    // Local countdown
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
      setSectionTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    // Server sync
    syncRef.current = setInterval(syncTime, TIME_SYNC_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [attemptId, syncTime]);

  return { timeRemaining, sectionTimeRemaining, isExpired, warnings, syncTime };
}

export function useExamAutoSave(attemptId: string | null) {
  const pendingAnswersRef = useRef<Map<string, Partial<ExamAnswer>>>(new Map());
  const versionRef = useRef(0);
  const { toast } = useToast();

  const saveAnswers = useCallback(async () => {
    if (!attemptId || pendingAnswersRef.current.size === 0) return;

    const answers = Array.from(pendingAnswersRef.current.values());
    pendingAnswersRef.current.clear();

    try {
      const result = await examService.attempts.bulkSubmitAnswers(
        attemptId,
        answers,
        versionRef.current
      );
      versionRef.current = result.version;
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Put answers back for retry
      answers.forEach(a => {
        if (a.questionId) {
          pendingAnswersRef.current.set(a.questionId, a);
        }
      });
    }
  }, [attemptId]);

  const addAnswer = useCallback((answer: Partial<ExamAnswer>) => {
    if (answer.questionId) {
      pendingAnswersRef.current.set(answer.questionId, answer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(saveAnswers, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveAnswers]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => saveAnswers();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveAnswers]);

  return { addAnswer, forceSave: saveAnswers };
}

export function useExamSession(attemptId: string | null) {
  const fingerprint = useRef<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getDeviceFingerprint().then(fp => {
      fingerprint.current = fp;
    });
  }, []);

  const sendHeartbeat = useCallback(async () => {
    if (!attemptId) return;

    try {
      const result = await examService.sessions.heartbeat(
        attemptId,
        fingerprint.current || undefined
      );

      if (!result.sessionValid) {
        toast({
          title: 'Session Invalid',
          description: result.warning || 'Your session has expired',
          variant: 'destructive',
        });
        window.dispatchEvent(new CustomEvent('exam:session-invalid'));
      }

      if (result.warning) {
        console.warn('Session warning:', result.warning);
      }

      if (result.shouldForceRefresh) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  }, [attemptId, toast]);

  useEffect(() => {
    if (!attemptId) return;

    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, [attemptId, sendHeartbeat]);

  return { sendHeartbeat, fingerprint: fingerprint.current };
}

export function useExamSubmission(attemptId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: (finalAnswers?: Partial<ExamAnswer>[]) =>
      examService.submission.submit(attemptId, { finalAnswers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-attempt', attemptId] });
      toast({ title: 'Exam Submitted', description: 'Your exam has been submitted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit exam',
        variant: 'destructive',
      });
    },
  });

  return submitMutation;
}
```

---

## ✅ Acceptance Criteria

- [ ] All exam API endpoints accessible
- [ ] Type definitions complete
- [ ] Auto-save hook functional
- [ ] Timer sync hook works
- [ ] Session heartbeat active
- [ ] Error handling in place

---

## ⏭️ Next Task

→ `FE-021_EXAM_SELECTION_PAGE.md` - Exam Selection Page
