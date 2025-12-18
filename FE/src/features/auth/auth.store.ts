import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { AuthState, User, LoginRequest, RegisterRequest } from "./auth.types";
import { authApi } from "./auth.api";
import { tokenUtils } from "@/utils/token.utils";

interface AuthStore extends AuthState {
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        login: async (data: LoginRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authApi.login(data);
            set((state) => {
              state.user = response.user;
              state.accessToken = response.accessToken;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.isInitialized = true;
            });
          } catch (error: any) {
            set((state) => {
              state.isLoading = false;
              state.error = error?.response?.data?.message || 'Đăng nhập thất bại';
            });
            throw error;
          }
        },

        register: async (data: RegisterRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authApi.register(data);
            set((state) => {
              state.user = response.user;
              state.accessToken = response.accessToken;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.isInitialized = true;
            });
          } catch (error: any) {
            set((state) => {
              state.isLoading = false;
              state.error = error?.response?.data?.message || 'Đăng ký thất bại';
            });
            throw error;
          }
        },

        logout: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            await authApi.logout();
          } catch {
            // Ignore logout API errors
          } finally {
            tokenUtils.clearTokens();
            set((state) => {
              state.user = null;
              state.accessToken = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
            });
          }
        },

        checkAuth: async () => {
          // Skip if already checking
          if (get().isLoading) return;

          // Check if we have valid tokens
          if (!tokenUtils.hasValidTokens()) {
            set((state) => {
              state.user = null;
              state.accessToken = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.isInitialized = true;
            });
            return;
          }

          set((state) => {
            state.isLoading = true;
          });

          try {
            const user = await authApi.getMe();
            const accessToken = tokenUtils.getAccessToken();
            set((state) => {
              state.user = user;
              state.accessToken = accessToken;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.isInitialized = true;
            });
          } catch {
            tokenUtils.clearTokens();
            set((state) => {
              state.user = null;
              state.accessToken = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.isInitialized = true;
            });
          }
        },

        refreshUser: async () => {
          if (!get().isAuthenticated) return;

          try {
            const user = await authApi.getMe();
            set((state) => {
              state.user = user;
            });
          } catch {
            // Silent fail
          }
        },

        setAuth: (user, accessToken) =>
          set((state) => {
            state.user = user;
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            state.isInitialized = true;
          }),

        clearAuth: () => {
          tokenUtils.clearTokens();
          set((state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
          });
        },

        updateUser: (userData) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, userData);
            }
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),
      })),
      {
        name: "vstepro-auth",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isInitialized = true;
          }
        },
      }
    ),
    { name: "AuthStore" }
  )
);

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useUserRoles = () => {
  return useAuthStore((state) => state.user?.role?.name);
};

export const useHasRole = (role: string) => {
  return useAuthStore((state) => state.user?.role?.name === role);
};

export const useIsAdmin = () => useHasRole('admin');
export const useIsTeacher = () => useHasRole('teacher');
export const useIsStudent = () => useHasRole('student');

export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    checkAuth: state.checkAuth,
    refreshUser: state.refreshUser,
    updateUser: state.updateUser,
    clearError: state.clearError,
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
  }));
};
