export interface User {
  id: string;
  email: string;
  name: string;
  role: "Student" | "Teacher" | "Admin" | "Uploader";
  avatar?: string;
  status: "active" | "inactive" | "banned";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
