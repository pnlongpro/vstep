import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsService } from '@/services';
import type {
  RandomMockExamRequest,
  CreateMockExamRequest,
  SaveExamProgressRequest,
  SubmitExamRequest,
} from '@/services';

// Query Keys
export const examKeys = {
  all: ['exams'] as const,
  exercises: () => [...examKeys.all, 'exercises'] as const,
  exerciseList: (filters: any) => [...examKeys.exercises(), { filters }] as const,
  exercise: (id: string) => [...examKeys.exercises(), id] as const,
  mockExams: () => [...examKeys.all, 'mock-exams'] as const,
  mockExam: (id: string) => [...examKeys.mockExams(), id] as const,
  mockExamResult: (id: string) => [...examKeys.mockExams(), id, 'result'] as const,
};

// Hooks for Exams

export function useRandomMockExam() {
  return useMutation({
    mutationFn: (data: RandomMockExamRequest) =>
      examsService.randomMockExam(data.level),
  });
}

export function useStartMockExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMockExamRequest) =>
      examsService.startMockExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.mockExams() });
    },
  });
}

export function useMockExamDetails(examId: string) {
  return useQuery({
    queryKey: examKeys.mockExam(examId),
    queryFn: () => examsService.getMockExamDetails(examId),
    enabled: !!examId,
  });
}

export function useSaveExamProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      examId,
      data,
    }: {
      examId: string;
      data: SaveExamProgressRequest;
    }) => examsService.saveExamProgress(examId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.mockExam(variables.examId),
      });
    },
  });
}

export function useSubmitMockExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      examId,
      data,
    }: {
      examId: string;
      data: SubmitExamRequest;
    }) => examsService.submitMockExam(examId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.mockExam(variables.examId),
      });
      queryClient.invalidateQueries({
        queryKey: examKeys.mockExamResult(variables.examId),
      });
    },
  });
}

export function useMockExamResult(examId: string) {
  return useQuery({
    queryKey: examKeys.mockExamResult(examId),
    queryFn: () => examsService.getMockExamResult(examId),
    enabled: !!examId,
  });
}

export function useExercises(params: {
  skill?: string;
  level?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: examKeys.exerciseList(params),
    queryFn: () => examsService.getExercises(params),
  });
}

export function useExerciseDetails(id: string) {
  return useQuery({
    queryKey: examKeys.exercise(id),
    queryFn: () => examsService.getExerciseDetails(id),
    enabled: !!id,
  });
}
