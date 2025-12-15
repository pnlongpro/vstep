export interface User {
  id: string;
  email: string;
  name: string;
  role: "Student" | "Teacher" | "Admin" | "Uploader";
  avatar?: string;
  status: "active" | "inactive" | "banned";
}

export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  country: string;
  language: string;
  timezone: string;
}

export interface UserStats {
  id: string;
  userId: string;
  totalHours: number;
  testsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  xp: number;
  level: number;
}
