# FE-015: Zustand Practice Store

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-015 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `features/practice/practice.store.ts` - ❌ Chưa có - **CÓ THỂ TẠO MỚI**
> - Tham khảo pattern từ `features/auth/auth.store.ts`

**Action:**
- ✅ CREATE `features/practice/practice.store.ts` (theo pattern auth.store.ts)

---

## 🎯 Objective

Implement Zustand Practice Store:
- Session state management
- Answer persistence
- Navigation state
- Timer state
- Auto-save coordination

---

## 💻 Implementation

### Step 1: Practice Store

```typescript
// src/store/practiceStore.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PracticeSession, Question, Answer, Skill, VstepLevel } from '@/types/practice.types';

// Answer state for each question
interface AnswerState {
  questionId: string;
  answer?: string;
  selectedOptionId?: string;
  isFlagged: boolean;
  timeSpent: number;
  savedAt?: Date;
}

// Practice store state
interface PracticeState {
  // Session
  session: PracticeSession | null;
  isLoading: boolean;
  error: string | null;

  // Questions
  questions: Question[];
  currentIndex: number;

  // Answers
  answers: Record<string, AnswerState>;

  // Timer
  timeSpent: number;
  isTimerRunning: boolean;
  timerStartedAt: number | null;

  // UI State
  isPaused: boolean;
  showResults: boolean;
  autoSaveEnabled: boolean;
  lastAutoSaveAt: Date | null;

  // Draft (for Writing)
  draftContent: string;
}

// Practice store actions
interface PracticeActions {
  // Session actions
  setSession: (session: PracticeSession) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Question actions
  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  goToQuestion: (index: number) => void;
  goNext: () => void;
  goPrevious: () => void;

  // Answer actions
  setAnswer: (questionId: string, answer: Partial<AnswerState>) => void;
  toggleFlag: (questionId: string) => void;
  updateTimeSpent: (questionId: string, time: number) => void;
  bulkSetAnswers: (answers: Record<string, AnswerState>) => void;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setTimeSpent: (time: number) => void;
  tick: () => void;

  // Session state actions
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;

  // Draft actions
  setDraftContent: (content: string) => void;

  // Auto-save
  markAutoSaved: () => void;

  // Computed getters
  getCurrentQuestion: () => Question | null;
  getCurrentAnswer: () => AnswerState | null;
  getProgress: () => { answered: number; flagged: number; total: number };
  getTimeRemaining: () => number | null;
}

// Initial state
const initialState: PracticeState = {
  session: null,
  isLoading: false,
  error: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timeSpent: 0,
  isTimerRunning: false,
  timerStartedAt: null,
  isPaused: false,
  showResults: false,
  autoSaveEnabled: true,
  lastAutoSaveAt: null,
  draftContent: '',
};

// Create store with all middleware
export const usePracticeStore = create<PracticeState & PracticeActions>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...initialState,

          // Session actions
          setSession: (session) => set((state) => {
            state.session = session;
            state.isPaused = session.status === 'paused';
            state.timeSpent = session.timeSpent || 0;
          }),

          clearSession: () => set((state) => {
            Object.assign(state, initialState);
          }),

          setLoading: (loading) => set((state) => {
            state.isLoading = loading;
          }),

          setError: (error) => set((state) => {
            state.error = error;
          }),

          // Question actions
          setQuestions: (questions) => set((state) => {
            state.questions = questions;
          }),

          setCurrentIndex: (index) => set((state) => {
            state.currentIndex = index;
          }),

          goToQuestion: (index) => set((state) => {
            if (index >= 0 && index < state.questions.length) {
              state.currentIndex = index;
            }
          }),

          goNext: () => set((state) => {
            if (state.currentIndex < state.questions.length - 1) {
              state.currentIndex += 1;
            }
          }),

          goPrevious: () => set((state) => {
            if (state.currentIndex > 0) {
              state.currentIndex -= 1;
            }
          }),

          // Answer actions
          setAnswer: (questionId, answer) => set((state) => {
            const existing = state.answers[questionId] || {
              questionId,
              isFlagged: false,
              timeSpent: 0,
            };
            state.answers[questionId] = {
              ...existing,
              ...answer,
              savedAt: new Date(),
            };
          }),

          toggleFlag: (questionId) => set((state) => {
            const existing = state.answers[questionId];
            if (existing) {
              existing.isFlagged = !existing.isFlagged;
            } else {
              state.answers[questionId] = {
                questionId,
                isFlagged: true,
                timeSpent: 0,
              };
            }
          }),

          updateTimeSpent: (questionId, time) => set((state) => {
            const existing = state.answers[questionId];
            if (existing) {
              existing.timeSpent = time;
            }
          }),

          bulkSetAnswers: (answers) => set((state) => {
            state.answers = answers;
          }),

          // Timer actions
          startTimer: () => set((state) => {
            state.isTimerRunning = true;
            state.timerStartedAt = Date.now();
          }),

          pauseTimer: () => set((state) => {
            if (state.isTimerRunning && state.timerStartedAt) {
              const elapsed = Math.floor((Date.now() - state.timerStartedAt) / 1000);
              state.timeSpent += elapsed;
              state.isTimerRunning = false;
              state.timerStartedAt = null;
            }
          }),

          resumeTimer: () => set((state) => {
            state.isTimerRunning = true;
            state.timerStartedAt = Date.now();
          }),

          resetTimer: () => set((state) => {
            state.timeSpent = 0;
            state.isTimerRunning = false;
            state.timerStartedAt = null;
          }),

          setTimeSpent: (time) => set((state) => {
            state.timeSpent = time;
          }),

          tick: () => set((state) => {
            if (state.isTimerRunning && state.timerStartedAt) {
              const elapsed = Math.floor((Date.now() - state.timerStartedAt) / 1000);
              state.timeSpent += elapsed;
              state.timerStartedAt = Date.now();
            }
          }),

          // Session state actions
          pauseSession: () => set((state) => {
            state.isPaused = true;
            state.isTimerRunning = false;
            if (state.session) {
              state.session.status = 'paused';
            }
          }),

          resumeSession: () => set((state) => {
            state.isPaused = false;
            state.isTimerRunning = true;
            state.timerStartedAt = Date.now();
            if (state.session) {
              state.session.status = 'in_progress';
            }
          }),

          completeSession: () => set((state) => {
            state.isPaused = false;
            state.isTimerRunning = false;
            state.showResults = true;
            if (state.session) {
              state.session.status = 'completed';
              state.session.completedAt = new Date();
            }
          }),

          // Draft actions
          setDraftContent: (content) => set((state) => {
            state.draftContent = content;
          }),

          // Auto-save
          markAutoSaved: () => set((state) => {
            state.lastAutoSaveAt = new Date();
          }),

          // Computed getters
          getCurrentQuestion: () => {
            const state = get();
            return state.questions[state.currentIndex] || null;
          },

          getCurrentAnswer: () => {
            const state = get();
            const question = state.questions[state.currentIndex];
            return question ? state.answers[question.id] || null : null;
          },

          getProgress: () => {
            const state = get();
            const answered = Object.values(state.answers).filter(
              a => a.answer || a.selectedOptionId
            ).length;
            const flagged = Object.values(state.answers).filter(
              a => a.isFlagged
            ).length;
            return {
              answered,
              flagged,
              total: state.questions.length,
            };
          },

          getTimeRemaining: () => {
            const state = get();
            if (!state.session?.timeLimit) return null;
            const remaining = state.session.timeLimit - state.timeSpent;
            return Math.max(0, remaining);
          },
        })),
        {
          name: 'practice-store',
          partialize: (state) => ({
            // Only persist these fields
            answers: state.answers,
            currentIndex: state.currentIndex,
            timeSpent: state.timeSpent,
            draftContent: state.draftContent,
          }),
          // Don't persist if no session
          skipHydration: true,
        }
      )
    ),
    { name: 'PracticeStore' }
  )
);

// Selectors for optimized re-renders
export const selectSession = (state: PracticeState) => state.session;
export const selectQuestions = (state: PracticeState) => state.questions;
export const selectCurrentIndex = (state: PracticeState) => state.currentIndex;
export const selectAnswers = (state: PracticeState) => state.answers;
export const selectTimeSpent = (state: PracticeState) => state.timeSpent;
export const selectIsPaused = (state: PracticeState) => state.isPaused;
export const selectIsLoading = (state: PracticeState) => state.isLoading;
export const selectError = (state: PracticeState) => state.error;

// Subscribe to time changes for auto-submission
export const subscribeToTimeLimit = (callback: () => void) => {
  return usePracticeStore.subscribe(
    (state) => state.timeSpent,
    (timeSpent) => {
      const session = usePracticeStore.getState().session;
      if (session?.timeLimit && timeSpent >= session.timeLimit) {
        callback();
      }
    }
  );
};
```

### Step 2: Practice Hooks

```typescript
// src/hooks/usePracticeStore.ts
import { useCallback, useEffect } from 'react';
import { usePracticeStore, subscribeToTimeLimit } from '@/store/practiceStore';
import { practiceService } from '@/services/practiceService';

/**
 * Hook to manage practice session with API integration
 */
export function usePracticeSession(options?: {
  autoSaveInterval?: number;
  onTimeUp?: () => void;
  onSessionEnd?: (session: any) => void;
}) {
  const {
    autoSaveInterval = 10000,
    onTimeUp,
    onSessionEnd,
  } = options || {};

  const store = usePracticeStore();

  // Load session
  const loadSession = useCallback(async (sessionId: string) => {
    store.setLoading(true);
    store.setError(null);

    try {
      const [session, questions, answers] = await Promise.all([
        practiceService.getSession(sessionId),
        practiceService.getSessionQuestions(sessionId),
        practiceService.getSessionAnswers(sessionId),
      ]);

      store.setSession(session);
      store.setQuestions(questions);
      
      // Transform answers to state format
      const answerState: Record<string, any> = {};
      answers.forEach((a: any) => {
        answerState[a.questionId] = {
          questionId: a.questionId,
          answer: a.answer,
          selectedOptionId: a.selectedOptionId,
          isFlagged: a.isFlagged || false,
          timeSpent: a.timeSpent || 0,
        };
      });
      store.bulkSetAnswers(answerState);

      // Start timer if session is in progress
      if (session.status === 'in_progress') {
        store.startTimer();
      }
    } catch (error: any) {
      store.setError(error.message || 'Failed to load session');
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Submit answer to API
  const submitAnswer = useCallback(async (answer: {
    questionId: string;
    answer?: string;
    selectedOptionId?: string;
    timeSpent?: number;
  }) => {
    const session = store.session;
    if (!session) return;

    // Update local state immediately
    store.setAnswer(answer.questionId, {
      answer: answer.answer,
      selectedOptionId: answer.selectedOptionId,
      timeSpent: answer.timeSpent || 0,
    });

    // Sync to API
    try {
      await practiceService.submitAnswer(session.id, answer);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }, [store]);

  // Auto-save effect
  useEffect(() => {
    if (!store.session || !store.autoSaveEnabled) return;

    const interval = setInterval(async () => {
      const { session, answers, timeSpent, currentIndex } = usePracticeStore.getState();
      if (!session) return;

      try {
        await practiceService.autoSave(session.id, {
          answers: Object.values(answers),
          timeSpent,
          currentQuestionIndex: currentIndex,
        });
        store.markAutoSaved();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [store.session?.id, autoSaveInterval]);

  // Timer tick effect
  useEffect(() => {
    if (!store.isTimerRunning) return;

    const interval = setInterval(() => {
      store.tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [store.isTimerRunning]);

  // Time limit subscription
  useEffect(() => {
    if (!onTimeUp) return;
    return subscribeToTimeLimit(onTimeUp);
  }, [onTimeUp]);

  // Pause session
  const pauseSession = useCallback(async () => {
    const session = store.session;
    if (!session) return;

    store.pauseSession();
    
    try {
      await practiceService.pauseSession(session.id, {
        timeSpent: store.timeSpent,
        currentQuestionIndex: store.currentIndex,
      });
    } catch (error) {
      console.error('Failed to pause session:', error);
    }
  }, [store]);

  // Resume session
  const resumeSession = useCallback(async () => {
    const session = store.session;
    if (!session) return;

    store.resumeSession();
    
    try {
      await practiceService.resumeSession(session.id);
    } catch (error) {
      console.error('Failed to resume session:', error);
    }
  }, [store]);

  // Complete session
  const completeSession = useCallback(async () => {
    const session = store.session;
    if (!session) return;

    store.pauseTimer();
    
    try {
      const result = await practiceService.completeSession(session.id, {
        timeSpent: store.timeSpent,
      });
      
      store.completeSession();
      onSessionEnd?.(result);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  }, [store, onSessionEnd]);

  return {
    // State
    session: store.session,
    questions: store.questions,
    currentIndex: store.currentIndex,
    currentQuestion: store.getCurrentQuestion(),
    currentAnswer: store.getCurrentAnswer(),
    answers: store.answers,
    isLoading: store.isLoading,
    error: store.error,
    timeSpent: store.timeSpent,
    progress: store.getProgress(),
    timeRemaining: store.getTimeRemaining(),
    isPaused: store.isPaused,
    lastAutoSaveAt: store.lastAutoSaveAt,

    // Actions
    loadSession,
    submitAnswer,
    goToQuestion: store.goToQuestion,
    goNext: store.goNext,
    goPrevious: store.goPrevious,
    toggleFlag: store.toggleFlag,
    pauseSession,
    resumeSession,
    completeSession,
    clearSession: store.clearSession,
  };
}

/**
 * Hook for timer display
 */
export function useTimer() {
  const timeSpent = usePracticeStore((state) => state.timeSpent);
  const isTimerRunning = usePracticeStore((state) => state.isTimerRunning);
  const session = usePracticeStore((state) => state.session);

  const timeLimit = session?.timeLimit;
  const timeRemaining = timeLimit ? Math.max(0, timeLimit - timeSpent) : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeSpent,
    timeRemaining,
    timeLimit,
    isTimerRunning,
    formattedTimeSpent: formatTime(timeSpent),
    formattedTimeRemaining: timeRemaining ? formatTime(timeRemaining) : null,
    isLowTime: timeRemaining !== null && timeRemaining < 300,
    isTimeUp: timeRemaining !== null && timeRemaining <= 0,
  };
}

/**
 * Hook for question navigation
 */
export function useQuestionNavigation() {
  const currentIndex = usePracticeStore((state) => state.currentIndex);
  const questions = usePracticeStore((state) => state.questions);
  const answers = usePracticeStore((state) => state.answers);
  const goToQuestion = usePracticeStore((state) => state.goToQuestion);
  const goNext = usePracticeStore((state) => state.goNext);
  const goPrevious = usePracticeStore((state) => state.goPrevious);

  const answeredSet = new Set<number>();
  const flaggedSet = new Set<number>();

  questions.forEach((q, i) => {
    const ans = answers[q.id];
    if (ans?.answer || ans?.selectedOptionId) {
      answeredSet.add(i);
    }
    if (ans?.isFlagged) {
      flaggedSet.add(i);
    }
  });

  return {
    currentIndex,
    totalQuestions: questions.length,
    answeredQuestions: answeredSet,
    flaggedQuestions: flaggedSet,
    canGoPrevious: currentIndex > 0,
    canGoNext: currentIndex < questions.length - 1,
    goToQuestion,
    goNext,
    goPrevious,
  };
}
```

### Step 3: Store Provider

```tsx
// src/providers/PracticeProvider.tsx
'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePracticeStore } from '@/store/practiceStore';

interface PracticeContextValue {
  hydrated: boolean;
}

const PracticeContext = createContext<PracticeContextValue>({ hydrated: false });

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted state on mount
  useEffect(() => {
    usePracticeStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return (
    <PracticeContext.Provider value={{ hydrated }}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePracticeHydrated() {
  return useContext(PracticeContext).hydrated;
}
```

---

## ✅ Acceptance Criteria

- [ ] Session state persisted across refresh
- [ ] Timer runs correctly
- [ ] Answers stored per question
- [ ] Flag state toggles
- [ ] Navigation state synced
- [ ] Auto-save interval works
- [ ] Time limit subscription fires
- [ ] DevTools integration works

---

## 📦 Dependencies

```bash
npm install zustand immer
```

---

## ⏭️ Next Task

→ `BE-014_EXAM_SET_SERVICE.md` - Exam Set CRUD Service
