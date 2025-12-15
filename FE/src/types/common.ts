export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type Level = "A2" | "B1" | "B2" | "C1";
export type Skill = "reading" | "listening" | "writing" | "speaking";
export type UserRole = "Student" | "Teacher" | "Admin" | "Uploader";
export type UserStatus = "active" | "inactive" | "banned";
