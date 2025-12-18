'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { practiceService } from '@/services/practice.service';
import {
  CreateSessionRequest,
  SubmitAnswerRequest,
  UpdateSessionRequest,
  GetSessionsParams,
  Skill,
  SaveDraftRequest,
} from '@/types/practice';

// Query keys
export const practiceKeys = {
  all: ['practice'] as const,
  sessions: () => [...practiceKeys.all, 'sessions'] as const,
  session: (id: string) => [...practiceKeys.sessions(), id] as const,
  sessionWithQuestions: (id: string) => [...practiceKeys.session(id), 'questions'] as const,
  result: (id: string) => [...practiceKeys.session(id), 'result'] as const,
  statistics: () => [...practiceKeys.all, 'statistics'] as const,
  progress: (days: number) => [...practiceKeys.statistics(), 'progress', days] as const,
  drafts: () => [...practiceKeys.all, 'drafts'] as const,
  draft: (sessionId?: string, questionId?: string) => [...practiceKeys.drafts(), sessionId, questionId] as const,
};

// =====================
// Session Hooks
// =====================

export function useSessions(params: GetSessionsParams = {}) {
  return useQuery({
    queryKey: [...practiceKeys.sessions(), params],
    queryFn: () => practiceService.getSessions(params),
  });
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: practiceKeys.session(sessionId),
    queryFn: () => practiceService.getSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useSessionWithQuestions(sessionId: string) {
  return useQuery({
    queryKey: practiceKeys.sessionWithQuestions(sessionId),
    queryFn: () => practiceService.getSessionWithQuestions(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => practiceService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.sessions() });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: UpdateSessionRequest }) =>
      practiceService.updateSession(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(variables.sessionId) });
    },
  });
}

export function usePauseSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => practiceService.pauseSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(sessionId) });
    },
  });
}

export function useResumeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => practiceService.resumeSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(sessionId) });
    },
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => practiceService.completeSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: practiceKeys.sessions() });
    },
  });
}

export function useAbandonSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => practiceService.abandonSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: practiceKeys.sessions() });
    },
  });
}

// =====================
// Answer Hooks
// =====================

export function useSubmitAnswer(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => practiceService.submitAnswer(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.session(sessionId) });
    },
  });
}

// =====================
// Scoring Hooks
// =====================

export function useScoreSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => practiceService.scoreSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.result(sessionId) });
      queryClient.invalidateQueries({ queryKey: practiceKeys.statistics() });
    },
  });
}

export function useSessionResult(sessionId: string) {
  return useQuery({
    queryKey: practiceKeys.result(sessionId),
    queryFn: () => practiceService.getSessionResult(sessionId),
    enabled: !!sessionId,
  });
}

// =====================
// Statistics Hooks
// =====================

export function useUserStatistics() {
  return useQuery({
    queryKey: practiceKeys.statistics(),
    queryFn: () => practiceService.getUserStatistics(),
  });
}

export function useProgressOverTime(days: number = 30) {
  return useQuery({
    queryKey: practiceKeys.progress(days),
    queryFn: () => practiceService.getProgressOverTime(days),
  });
}

// =====================
// Draft Hooks
// =====================

export function useDraft(sessionId?: string, questionId?: string) {
  return useQuery({
    queryKey: practiceKeys.draft(sessionId, questionId),
    queryFn: () => practiceService.getDraft({ sessionId, questionId }),
    enabled: !!(sessionId || questionId),
  });
}

export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveDraftRequest) => practiceService.saveDraft(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.draft(variables.sessionId, variables.questionId) });
    },
  });
}

export function useAutoSaveDraft() {
  return useMutation({
    mutationFn: (data: SaveDraftRequest) => practiceService.autoSaveDraft(data),
  });
}

export function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => practiceService.deleteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceKeys.drafts() });
    },
  });
}
