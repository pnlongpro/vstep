import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "./exam.api";
import { SubmitExamRequest } from "./exam.types";

export function useExams(params?: { level?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: () => examApi.getExams(params),
  });
}

export function useExamDetail(examId: string) {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => examApi.getExamById(examId),
    enabled: !!examId,
  });
}

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => examApi.startExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      data,
    }: {
      attemptId: string;
      data: SubmitExamRequest;
    }) => examApi.submitExam(attemptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });
}

export function useExamResult(attemptId: string) {
  return useQuery({
    queryKey: ["exam-result", attemptId],
    queryFn: () => examApi.getExamResult(attemptId),
    enabled: !!attemptId,
  });
}

export function useAutoSave() {
  return useMutation({
    mutationFn: ({
      attemptId,
      answers,
    }: {
      attemptId: string;
      answers: Record<string, any>;
    }) => examApi.autoSave(attemptId, answers),
  });
}
