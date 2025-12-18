import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import { LoginRequest, RegisterRequest, User } from "./auth.types";
import { useRouter } from "next/navigation";
import { tokenUtils } from "@/utils/token.utils";

/**
 * Main auth hook for login/register/logout
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth, clearAuth, isLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
    onError: () => {
      // Force logout even if API fails
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}

/**
 * Fetch current user profile
 */
export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated && tokenUtils.hasValidTokens(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch sessions list
 */
export function useSessions() {
  return useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: () => authApi.getSessions(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Revoke a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
    },
  });
}

/**
 * Revoke all sessions except current
 */
export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
    },
  });
}

/**
 * Fetch login history
 */
export function useLoginHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["auth", "login-history", page, limit],
    queryFn: () => authApi.getLoginHistory(page, limit),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch security alerts
 */
export function useSecurityAlerts() {
  return useQuery({
    queryKey: ["auth", "security-alerts"],
    queryFn: () => authApi.getSecurityAlerts(),
    staleTime: 30 * 1000,
  });
}

/**
 * Dismiss security alert
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alertId: string) => authApi.dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "security-alerts"] });
    },
  });
}

/**
 * Password reset hooks
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useValidateResetToken(token: string) {
  return useQuery({
    queryKey: ["auth", "reset-token", token],
    queryFn: () => authApi.validateResetToken(token),
    enabled: !!token,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  });
}

/**
 * Email verification hooks
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });
}

/**
 * Linked accounts
 */
export function useLinkedAccounts() {
  return useQuery({
    queryKey: ["auth", "linked-accounts"],
    queryFn: () => authApi.getLinkedAccounts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUnlinkGoogle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.unlinkGoogle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "linked-accounts"] });
    },
  });
}
