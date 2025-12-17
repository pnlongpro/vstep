export interface Role {
  id: string;
  name: 'student' | 'teacher' | 'admin';
  displayName: string;
}

export interface UserProfile {
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  currentLevel?: 'A2' | 'B1' | 'B2' | 'C1';
  targetLevel?: 'A2' | 'B1' | 'B2' | 'C1';
  targetDate?: string;
  studyGoalMinutes?: number;
}

export interface UserStats {
  totalHours: number;
  testsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  xp: number;
  level: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string | null;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  emailVerifiedAt?: string | null;
  role: Role;
  profile?: UserProfile;
  stats?: UserStats;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface Session {
  id: string;
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  currentSessionId: string;
}

export interface LoginHistoryItem {
  id: string;
  status: 'success' | 'failed' | 'blocked';
  method: 'email_password' | 'google' | 'facebook' | 'apple' | 'refresh_token';
  ipAddress: string;
  location: string;
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
  createdAt: string;
}

export interface LoginHistoryResponse {
  items: LoginHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SecurityAlert {
  id: string;
  type: 'new_device' | 'new_location' | 'failed_attempts' | 'password_changed' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  isDismissed: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface SecurityAlertsResponse {
  alerts: SecurityAlert[];
  unreadCount: number;
  total: number;
}

export interface LinkedAccount {
  provider: 'google' | 'facebook' | 'apple';
  email: string;
  linkedAt: string;
}

export interface GoogleAuthRequest {
  accessToken: string;
  googleId?: string;
  email?: string;
  name?: string;
  picture?: string;
}
