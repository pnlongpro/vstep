import { apiClient } from "@/lib/axios";
import { tokenUtils } from "@/utils/token.utils";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Session,
  SessionListResponse,
  LoginHistoryResponse,
  SecurityAlertsResponse,
  LinkedAccount,
  GoogleAuthRequest,
} from "./auth.types";

export const authApi = {
  // ==================== Basic Auth ====================

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    const { accessToken, refreshToken, expiresIn } = response.data;
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    const { accessToken, refreshToken, expiresIn } = response.data;
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenUtils.clearTokens();
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async getProfile(): Promise<User> {
    return this.getMe();
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    tokenUtils.setTokens(accessToken, newRefreshToken, expiresIn);
    return response.data;
  },

  // ==================== Password Reset ====================

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const response = await apiClient.get(`/auth/reset-password/validate?token=${token}`);
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  // ==================== Email Verification ====================

  async verifyEmail(token: string): Promise<{ message: string; user: User }> {
    const response = await apiClient.post("/auth/verify-email", { token });
    return response.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/resend-verification", { email });
    return response.data;
  },

  async getVerificationStatus(): Promise<{ isVerified: boolean; verifiedAt: string | null }> {
    const response = await apiClient.get("/auth/verification-status");
    return response.data;
  },

  // ==================== Google OAuth ====================

  async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/google/token", data);
    const { accessToken, refreshToken, expiresIn } = response.data;
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    return response.data;
  },

  async linkGoogle(googleId: string, accessToken: string): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/link/google", { googleId, accessToken, provider: 'google' });
    return response.data;
  },

  async unlinkGoogle(): Promise<{ message: string }> {
    const response = await apiClient.delete("/auth/link/google");
    return response.data;
  },

  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    const response = await apiClient.get<LinkedAccount[]>("/auth/linked-accounts");
    return response.data;
  },

  // ==================== Sessions ====================

  async getSessions(): Promise<SessionListResponse> {
    const response = await apiClient.get<SessionListResponse>("/auth/sessions");
    return response.data;
  },

  async revokeSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  async revokeAllSessions(): Promise<{ message: string; revokedCount: number }> {
    const response = await apiClient.delete("/auth/sessions");
    return response.data;
  },

  // ==================== Login History & Security ====================

  async getLoginHistory(page = 1, limit = 20): Promise<LoginHistoryResponse> {
    const response = await apiClient.get<LoginHistoryResponse>(`/auth/login-history?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getSecurityAlerts(): Promise<SecurityAlertsResponse> {
    const response = await apiClient.get<SecurityAlertsResponse>("/auth/security-alerts");
    return response.data;
  },

  async dismissAlert(alertId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/auth/security-alerts/${alertId}/dismiss`);
    return response.data;
  },

  // ==================== Email Availability ====================

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    // This might need to be implemented on backend
    // For now, we can check by attempting to reset password
    // or implement a dedicated endpoint
    try {
      const response = await apiClient.post("/auth/check-email", { email });
      return response.data;
    } catch {
      // If endpoint doesn't exist, assume available
      return { available: true };
    }
  },

  // ==================== Helpers ====================

  isAuthenticated(): boolean {
    return tokenUtils.hasValidTokens();
  },

  getAccessToken(): string | null {
    return tokenUtils.getAccessToken();
  },
};
