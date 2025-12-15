import { apiClient } from '@/lib/axios';

export interface RandomMockExamRequest {
  level?: string;
}

export interface RandomMockExamResponse {
  success: boolean;
  data: {
    exams: {
      reading: ExamInfo;
      listening: ExamInfo;
      writing: ExamInfo;
      speaking: ExamInfo;
    };
    level: string;
    totalDuration: number;
  };
}

export interface ExamInfo {
  id: string;
  title: string;
  level: string;
  questionCount: number;
  duration: number;
}

export interface CreateMockExamRequest {
  readingExerciseId: string;
  listeningExerciseId: string;
  writingExerciseId: string;
  speakingExerciseId: string;
}

export interface CreateMockExamResponse {
  success: boolean;
  data: {
    mockExamId: string;
    startedAt: string;
    expiresAt: string;
    totalTime: number;
  };
}

export interface SaveExamProgressRequest {
  skill: string;
  answers: Record<string, any>;
}

export interface SubmitExamRequest {
  answers: Record<string, any>;
  timeSpent: number;
}

export interface ExamResult {
  mockExamId: string;
  overallScore: number;
  scores: {
    reading?: number;
    listening?: number;
    writing?: number;
    speaking?: number;
  };
  certificateId?: string;
}

export interface Exercise {
  id: string;
  title: string;
  skill: string;
  level: string;
  type: string;
  duration: number;
  questionCount: number;
  difficulty: string;
  avgScore: number;
  attemptCount: number;
}

export interface ExerciseListResponse {
  success: boolean;
  data: {
    exercises: Exercise[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class ExamsService {
  /**
   * Random 4 đề thi cho mock exam
   */
  async randomMockExam(level?: string): Promise<RandomMockExamResponse> {
    const params = level ? { level } : {};
    const response = await apiClient.post<RandomMockExamResponse>(
      '/exams/mock-exams/random',
      {},
      { params }
    );
    return response.data;
  }

  /**
   * Bắt đầu mock exam
   */
  async startMockExam(data: CreateMockExamRequest): Promise<CreateMockExamResponse> {
    const response = await apiClient.post<CreateMockExamResponse>(
      '/exams/mock-exams',
      data
    );
    return response.data;
  }

  /**
   * Lấy chi tiết mock exam
   */
  async getMockExamDetails(examId: string) {
    const response = await apiClient.get(`/exams/mock-exams/${examId}`);
    return response.data;
  }

  /**
   * Auto-save exam progress
   */
  async saveExamProgress(examId: string, data: SaveExamProgressRequest) {
    const response = await apiClient.put(
      `/exams/mock-exams/${examId}/save`,
      data
    );
    return response.data;
  }

  /**
   * Submit mock exam
   */
  async submitMockExam(examId: string, data: SubmitExamRequest) {
    const response = await apiClient.post(
      `/exams/mock-exams/${examId}/submit`,
      data
    );
    return response.data;
  }

  /**
   * Lấy kết quả thi
   */
  async getMockExamResult(examId: string): Promise<{ success: boolean; data: ExamResult }> {
    const response = await apiClient.get(`/exams/mock-exams/${examId}/result`);
    return response.data;
  }

  /**
   * Lấy danh sách bài tập
   */
  async getExercises(params: {
    skill?: string;
    level?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ExerciseListResponse> {
    const response = await apiClient.get<ExerciseListResponse>('/exams/exercises', {
      params,
    });
    return response.data;
  }

  /**
   * Lấy chi tiết bài tập
   */
  async getExerciseDetails(id: string) {
    const response = await apiClient.get(`/exams/exercises/${id}`);
    return response.data;
  }
}

export const examsService = new ExamsService();
export default examsService;
