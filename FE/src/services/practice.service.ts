import { apiClient } from '@/lib/axios';
import {
  PracticeSession,
  PracticeAnswer,
  SessionWithQuestions,
  SessionResult,
  CreateSessionRequest,
  SubmitAnswerRequest,
  UpdateSessionRequest,
  GetSessionsParams,
  SessionsResponse,
  UserStatistics,
  PracticeDraft,
  SaveDraftRequest,
} from '@/types/practice';

class PracticeService {
  private baseUrl = '/practice';

  // =====================
  // Session Management
  // =====================

  async createSession(data: CreateSessionRequest): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(`${this.baseUrl}/sessions`, data);
    return response.data;
  }

  async getSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.get<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}`);
    return response.data;
  }

  async getSessionWithQuestions(sessionId: string): Promise<SessionWithQuestions> {
    const response = await apiClient.get<SessionWithQuestions>(`${this.baseUrl}/sessions/${sessionId}/questions`);
    return response.data;
  }

  async getSessions(params: GetSessionsParams = {}): Promise<SessionsResponse> {
    const response = await apiClient.get<SessionsResponse>(`${this.baseUrl}/sessions`, { params });
    return response.data;
  }

  async updateSession(sessionId: string, data: UpdateSessionRequest): Promise<PracticeSession> {
    const response = await apiClient.patch<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}`, data);
    return response.data;
  }

  async pauseSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}/pause`);
    return response.data;
  }

  async resumeSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}/resume`);
    return response.data;
  }

  async completeSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}/complete`);
    return response.data;
  }

  async abandonSession(sessionId: string): Promise<PracticeSession> {
    const response = await apiClient.post<PracticeSession>(`${this.baseUrl}/sessions/${sessionId}/abandon`);
    return response.data;
  }

  // =====================
  // Answer Management
  // =====================

  async submitAnswer(sessionId: string, data: SubmitAnswerRequest): Promise<PracticeAnswer> {
    const response = await apiClient.post<PracticeAnswer>(`${this.baseUrl}/sessions/${sessionId}/answers`, data);
    return response.data;
  }

  // =====================
  // Scoring
  // =====================

  async scoreSession(sessionId: string): Promise<SessionResult> {
    const response = await apiClient.post<SessionResult>(`/scoring/sessions/${sessionId}/score`);
    return response.data;
  }

  async getSessionResult(sessionId: string): Promise<SessionResult> {
    const response = await apiClient.get<SessionResult>(`/scoring/sessions/${sessionId}/result`);
    return response.data;
  }

  // =====================
  // Statistics
  // =====================

  async getUserStatistics(): Promise<UserStatistics> {
    const response = await apiClient.get<UserStatistics>(`${this.baseUrl}/statistics`);
    return response.data;
  }

  async getProgressOverTime(days: number = 30): Promise<{ date: string; score: number }[]> {
    const response = await apiClient.get<{ date: string; score: number }[]>(`${this.baseUrl}/statistics/progress`, {
      params: { days },
    });
    return response.data;
  }

  // =====================
  // Drafts
  // =====================

  async saveDraft(data: SaveDraftRequest): Promise<PracticeDraft> {
    const response = await apiClient.post<PracticeDraft>(`${this.baseUrl}/drafts`, data);
    return response.data;
  }

  async autoSaveDraft(data: SaveDraftRequest): Promise<{ success: boolean; version: number }> {
    const response = await apiClient.post<{ success: boolean; version: number }>(
      `${this.baseUrl}/drafts/auto-save`,
      data,
    );
    return response.data;
  }

  async getDraft(params: { sessionId?: string; questionId?: string }): Promise<PracticeDraft | null> {
    const response = await apiClient.get<PracticeDraft | null>(`${this.baseUrl}/drafts/find`, { params });
    return response.data;
  }

  async getUserDrafts(): Promise<PracticeDraft[]> {
    const response = await apiClient.get<PracticeDraft[]>(`${this.baseUrl}/drafts`);
    return response.data;
  }

  async deleteDraft(draftId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/drafts/${draftId}`);
  }
}

export const practiceService = new PracticeService();
export default practiceService;
