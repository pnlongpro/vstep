import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PracticeSession, Question, Skill, VstepLevel, PracticeMode } from '@/types/practice';

interface PracticeState {
  // Current session
  currentSession: PracticeSession | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, { answer?: string; optionId?: string; flagged?: boolean }>;
  timeSpent: number;

  // UI state
  isLoading: boolean;
  isPaused: boolean;
  showResult: boolean;

  // Actions
  setSession: (session: PracticeSession, questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer?: string, optionId?: string) => void;
  toggleFlag: (questionId: string) => void;
  incrementTime: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeSpent: 0,
      isLoading: false,
      isPaused: false,
      showResult: false,

      setSession: (session, questions) =>
        set({
          currentSession: session,
          questions,
          currentQuestionIndex: session.currentQuestionIndex || 0,
          answers: {},
          timeSpent: session.timeSpent || 0,
          isPaused: false,
          showResult: false,
        }),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      setAnswer: (questionId, answer, optionId) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: { ...state.answers[questionId], answer, optionId },
          },
        })),

      toggleFlag: (questionId) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              ...state.answers[questionId],
              flagged: !state.answers[questionId]?.flagged,
            },
          },
        })),

      incrementTime: () => set((state) => ({ timeSpent: state.timeSpent + 1 })),

      pauseSession: () => set({ isPaused: true }),

      resumeSession: () => set({ isPaused: false }),

      completeSession: () => set({ showResult: true, isPaused: false }),

      resetSession: () =>
        set({
          currentSession: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
          timeSpent: 0,
          isPaused: false,
          showResult: false,
        }),
    }),
    {
      name: 'practice-store',
      partialize: (state) => ({
        currentSession: state.currentSession,
        answers: state.answers,
        timeSpent: state.timeSpent,
        currentQuestionIndex: state.currentQuestionIndex,
      }),
    },
  ),
);
