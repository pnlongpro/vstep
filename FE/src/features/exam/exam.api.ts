import { apiClient } from "@/lib/axios";
import {
  Exam,
  ExamListResponse,
  ExamDetail,
  StartExamResponse,
  SubmitExamRequest,
  ExamResult,
} from "./exam.types";

export const examApi = {
  async getExams(params?: {
    level?: string;
    page?: number;
    limit?: number;
  }): Promise<ExamListResponse> {
    const response = await apiClient.get("/exams", { params });
    return response.data;
  },

  async getExamById(id: string): Promise<ExamDetail> {
    const response = await apiClient.get(`/exams/${id}`);
    return response.data;
  },

  async startExam(examId: string): Promise<StartExamResponse> {
    const response = await apiClient.post(`/exams/${examId}/start`);
    return response.data;
  },

  async submitExam(
    attemptId: string,
    data: SubmitExamRequest
  ): Promise<ExamResult> {
    const response = await apiClient.post(`/exams/attempts/${attemptId}/submit`, data);
    return response.data;
  },

  async getExamResult(attemptId: string): Promise<ExamResult> {
    const response = await apiClient.get(`/exams/attempts/${attemptId}/result`);
    return response.data;
  },

  async autoSave(attemptId: string, answers: Record<string, any>): Promise<void> {
    await apiClient.post(`/exams/attempts/${attemptId}/auto-save`, { answers });
  },
};
