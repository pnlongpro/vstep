
// ========== Types ==========

import apiClient from "@/lib/axios";

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  loginTime: string;
  isCurrentDevice: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  role: {
    id: string;
    name: string;
    displayName: string;
  };
  createdAt: string;
  lastLoginAt?: string;
  profile?: {
    phone?: string;
    location?: string;
    currentLevel?: string;
    targetLevel?: string;
  };
  stats?: {
    totalHours: number;
    testsCompleted: number;
    averageScore: number;
    xp: number;
    level: number;
  };
  userPackage?: {
    plan: string;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  };
  deviceLimit?: number;
}

export interface UserFilter {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newUsersLastWeek: number;
  activeUsersThisWeek: number;
  activeUsersLastWeek: number;
  changes: {
    newUsers: number;
    activeUsers: number;
  };
  byRole: { role: string; count: number }[];
  byStatus: { status: string; count: number }[];
  last30Days: { date: string; count: number }[];
}

export interface AdminExamSet {
  id: string;
  title: string;
  description?: string;
  level: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  duration: number;
  totalQuestions: number;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attemptsCount: number;
}

export interface ExamFilter {
  page?: number;
  limit?: number;
  search?: string;
  skill?: string;
  level?: string;
  status?: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  dataType: 'boolean' | 'number' | 'string' | 'json';
  isPublic: boolean;
}

export interface AnalyticsOverview {
  totalUsers: number;
  totalExams: number;
  totalAttempts: number;
  totalRevenue: number;
  userGrowth: { month: string; count: number }[];
  examAttempts: { month: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
  subscriptionDistribution: { plan: string; count: number }[];
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface PendingGrading {
  type: 'writing' | 'speaking';
  count: number;
  oldestDate: string;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalExams: number;
    aiScoringUsed: number;
    monthlyRevenue: number;
  };
  pendingGradings: PendingGrading[];
  expiringUsers: number;
  aiBudget: {
    used: number;
    limit: number;
    percentage: number;
  };
  todayMetrics: {
    speakingGraded: number;
    writingGraded: number;
    newUsers: number;
  };
  weekMetrics: {
    speakingGraded: number;
    writingGraded: number;
    newUsers: number;
  };
  monthMetrics: {
    speakingGraded: number;
    writingGraded: number;
    newUsers: number;
  };
  systemHealth: {
    service: string;
    status: 'active' | 'degraded' | 'down';
    uptime: string;
  }[];
  recentActivities: {
    user: string;
    action: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }[];
}

// ========== Free User Types ==========
export interface FreeUserUsage {
  mockTests: number;
  aiSpeaking: number;
  aiWriting: number;
}

export interface FreeUserLimits {
  mockTests: number;
  aiSpeaking: number;
  aiWriting: number;
}

export interface FreeUser extends AdminUser {
  usage: FreeUserUsage;
  limits: FreeUserLimits;
  plan: 'free' | 'basic' | 'premium';
  planExpiry?: string;
}

export interface FreeAccountStats {
  total: number;
  active: number;
  inactive: number;
  newThisWeek: number;
}

// ========== User Management API ==========

export const userManagementApi = {
    // Export users as CSV
    exportUsers: async (filter: UserFilter = {}) => {
      const params = new URLSearchParams();
      if (filter.search) params.append('search', filter.search);
      if (filter.role) params.append('role', filter.role);
      if (filter.status) params.append('status', filter.status);
      if (filter.sortBy) params.append('sortBy', filter.sortBy);
      if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
      // No pagination for export
      const response = await apiClient.get(`/admin/users/export?${params.toString()}`, {
        responseType: 'blob',
      });
      return response;
    },
  // Get all users with filters
  getUsers: async (filter: UserFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.role) params.append('role', filter.role);
    if (filter.status) params.append('status', filter.status);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

    const response = await apiClient.get<{
      items: AdminUser[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/users?${params.toString()}`);
    return response;
  },

  // Get free account users with usage and limits
  getFreeUsers: async (filter: UserFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

    const response = await apiClient.get<{
      items: FreeUser[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/users/free?${params.toString()}`);
    return response;
  },

  // Get free account statistics
  getFreeAccountStats: async () => {
    const response = await apiClient.get<FreeAccountStats>('/admin/users/free/statistics');
    return response;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await apiClient.get<AdminUser>(`/admin/users/${id}`);
    return response;
  },

  // Get user statistics
  getStatistics: async () => {
    const response = await apiClient.get<UserStatistics>('/admin/users/statistics');
    return response;
  },

  // Create new user
  createUser: async (data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) => {
    const response = await apiClient.post('/admin/users', data);
    return response;
  },

  // Update user
  updateUser: async (id: string, data: { firstName?: string; lastName?: string; email?: string }) => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response;
  },

  // Update user role
  updateRole: async (userId: string, role: string) => {
    const response = await apiClient.post('/admin/users/assign-role', { userId, role });
    return response;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response;
  },

  // Update user status
  updateStatus: async (id: string, status: string, reason?: string) => {
    const response = await apiClient.put(`/admin/users/${id}/status`, { status, reason });
    return response;
  },

  // Bulk action on users
  bulkAction: async (userIds: string[], action: 'activate' | 'deactivate' | 'delete' | 'ban') => {
    const response = await apiClient.post('/admin/users/bulk-action', { userIds, action });
    return response;
  },

  // Assign role to user
  assignRole: async (userId: string, roleId: string) => {
    const response = await apiClient.post('/admin/users/assign-role', { userId, roleId });
    return response;
  },

  // Get user activity log
  getUserActivity: async (userId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/admin/users/${userId}/activity?page=${page}&limit=${limit}`);
    return response;
  },

  // Reset login sessions - đăng xuất tất cả thiết bị
  resetLoginSessions: async (userId: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/reset-sessions`);
    return response;
  },

  // Get user devices
  getUserDevices: async (userId: string) => {
    const response = await apiClient.get<{
      devices: Device[];
      maxDevices: number;
    }>(`/admin/users/${userId}/devices`);
    return response;
  },

  // Logout specific device
  logoutDevice: async (userId: string, deviceId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}/devices/${deviceId}`);
    return response;
  },

  // Logout all devices
  logoutAllDevices: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}/devices`);
    return response;
  },

  // Update device limit
  updateDeviceLimit: async (userId: string, maxDevices: number) => {
    const response = await apiClient.put(`/admin/users/${userId}/device-limit`, { maxDevices });
    return response;
  },

  // Get user account expiry info
  getUserExpiry: async (userId: string) => {
    const response = await apiClient.get<{
      currentExpiry: string;
      daysRemaining: number;
      planDays: number;
      plan: string;
    }>(`/admin/users/${userId}/expiry`);
    return response;
  },

  // Update account expiry
  updateExpiry: async (userId: string, mode: 'extend' | 'set', value: number | string) => {
    const response = await apiClient.put(`/admin/users/${userId}/expiry`, { mode, value });
    return response;
  },
};

// ========== Exam Management API ==========

export const examManagementApi = {
  // Get all exam sets
  getExamSets: async (filter: ExamFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.skill) params.append('skill', filter.skill);
    if (filter.level) params.append('level', filter.level);
    if (filter.status) params.append('status', filter.status);

    const response = await apiClient.get<{
      data: AdminExamSet[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/exam-sets?${params.toString()}`);
    return response;
  },

  // Get exam set by ID
  getExamSetById: async (id: string) => {
    const response = await apiClient.get(`/admin/exam-sets/${id}`);
    return response;
  },

  // Create exam set
  createExamSet: async (data: Partial<AdminExamSet>) => {
    const response = await apiClient.post('/admin/exam-sets', data);
    return response;
  },

  // Update exam set
  updateExamSet: async (id: string, data: Partial<AdminExamSet>) => {
    const response = await apiClient.put(`/admin/exam-sets/${id}`, data);
    return response;
  },

  // Delete exam set
  deleteExamSet: async (id: string) => {
    const response = await apiClient.delete(`/admin/exam-sets/${id}`);
    return response;
  },

  // Publish exam set
  publishExamSet: async (id: string) => {
    const response = await apiClient.post(`/admin/exam-sets/${id}/publish`);
    return response;
  },

  // Unpublish exam set
  unpublishExamSet: async (id: string) => {
    const response = await apiClient.post(`/admin/exam-sets/${id}/unpublish`);
    return response;
  },

  // Get pending approvals
  getPendingApprovals: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/admin/exam-sets/pending?page=${page}&limit=${limit}`);
    return response;
  },

  // Approve exam
  approveExam: async (id: string, feedback?: string) => {
    const response = await apiClient.post(`/admin/exam-sets/${id}/approve`, { feedback });
    return response;
  },

  // Reject exam
  rejectExam: async (id: string, reason: string) => {
    const response = await apiClient.post(`/admin/exam-sets/${id}/reject`, { reason });
    return response;
  },
};

// ========== Analytics API ==========

export const analyticsApi = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await apiClient.get<AnalyticsOverview>('/admin/analytics/overview');
    return response;
  },

  // Get user analytics
  getUserAnalytics: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await apiClient.get(`/admin/analytics/users?period=${period}`);
    return response;
  },

  // Get exam analytics
  getExamAnalytics: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await apiClient.get(`/admin/analytics/exams?period=${period}`);
    return response;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await apiClient.get(`/admin/analytics/revenue?period=${period}`);
    return response;
  },

  // Export analytics data
  exportData: async (type: 'users' | 'exams' | 'revenue', format: 'csv' | 'excel' = 'csv') => {
    const response = await apiClient.get(`/admin/analytics/export?type=${type}&format=${format}`, {
      responseType: 'blob',
    });
    return response;
  },
};

// ========== System Settings API ==========

export const settingsApi = {
  // Get all settings
  getSettings: async (category?: string) => {
    const url = category ? `/admin/settings?category=${category}` : '/admin/settings';
    const response = await apiClient.get<SystemSetting[]>(url);
    return response;
  },

  // Get single setting
  getSetting: async (key: string) => {
    const response = await apiClient.get<SystemSetting>(`/admin/settings/${key}`);
    return response;
  },

  // Update setting
  updateSetting: async (key: string, value: any) => {
    const response = await apiClient.put(`/admin/settings/${key}`, { value });
    return response;
  },

  // Get public settings (for frontend config)
  getPublicSettings: async () => {
    const response = await apiClient.get<SystemSetting[]>('/admin/settings/public');
    return response;
  },
};

// ========== Admin Logs API ==========

export const adminLogsApi = {
  // Get admin logs
  getLogs: async (filter: {
    page?: number;
    limit?: number;
    adminId?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await apiClient.get<{
      data: AdminLog[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/logs?${params.toString()}`);
    return response;
  },

  // Export logs
  exportLogs: async (filter: any, format: 'csv' | 'json' = 'csv') => {
    const params = new URLSearchParams({ ...filter, format });
    const response = await apiClient.get(`/admin/logs/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response;
  },
};

// ========== Dashboard API ==========

export const adminDashboardApi = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/admin/analytics/overview');
    return response.data;
  },

  // Get pending gradings count
  getPendingGradings: async () => {
    const response = await apiClient.get<PendingGrading[]>('/admin/analytics/pending-gradings');
    return response.data;
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await apiClient.get('/admin/system/health');
    return response;
  },
};

// ========== Teacher Types ==========

export interface Teacher {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  specialty: string;
  degree?: string;
  phone?: string;
  bio?: string;
  courses: number;
  students: number;
  rating: number;
  joined: string;
  avatar?: string;
}

export interface UpdateTeacherData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  degree?: string;
  bio?: string;
  status?: 'active' | 'inactive';
}

export interface TeacherStats {
  totalTeachers: number;
  activeTeachers: number;
  totalCourses: number;
  totalStudents: number;
  changes: {
    teachers: string;
    active: string;
    courses: string;
    students: string;
  };
}

export interface TeacherFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ========== Teacher Management API ==========

export const teacherManagementApi = {
  // Get all teachers with filters
  getTeachers: async (filter: TeacherFilter = {}): Promise<{
    items: Teacher[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

    const response = await apiClient.get<{
      items: Teacher[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/admin/users/teachers?${params.toString()}`);
    return response.data;
  },

  // Get teacher statistics
  getTeacherStats: async (): Promise<TeacherStats> => {
    const response = await apiClient.get<TeacherStats>('/admin/users/teachers/statistics');
    return response.data;
  },

  // Create new teacher
  createTeacher: async (data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<Teacher> => {
    const response = await apiClient.post<Teacher>('/admin/users/teachers', data);
    return response.data;
  },

  // Update teacher status
  updateTeacherStatus: async (id: string, status: 'active' | 'inactive'): Promise<Teacher> => {
    const response = await apiClient.put<Teacher>(`/admin/users/teachers/${id}/status`, { status });
    return response.data;
  },

  // Update teacher information
  updateTeacher: async (id: string, data: UpdateTeacherData): Promise<Teacher> => {
    const response = await apiClient.put<Teacher>(`/admin/users/teachers/${id}`, data);
    return response.data;
  },

  // Bulk action on teachers
  bulkAction: async (teacherIds: string[], action: 'activate' | 'deactivate' | 'delete') => {
    const response = await apiClient.post('/admin/users/teachers/bulk-action', { userIds: teacherIds, action });
    return response.data;
  },

  // Export teachers
  exportTeachers: async (filter: TeacherFilter = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filter.search) params.append('search', filter.search);
    if (filter.status) params.append('status', filter.status);
    params.append('role', 'teacher');
    const response = await apiClient.get(`/admin/users/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========== Document Management Types ==========

export type DocumentStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type DocumentVisibility = 'public' | 'student' | 'teacher';
export type DocumentCategory = 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'general';
export type DocumentType = 'pdf' | 'doc' | 'video' | 'audio' | 'ppt';

export interface LearningDocument {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  level?: string;
  type: DocumentType;
  size?: string;
  url?: string;
  fileName?: string;
  mediaId?: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  downloads: number;
  views: number;
  uploadedBy: string;
  uploadedById: string;
  uploadDate: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  visibility?: DocumentVisibility;
  level?: string;
  type?: DocumentType;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface DocumentStatistics {
  totalDocuments: number;
  publishedDocuments: number;
  pendingDocuments: number;
  draftDocuments: number;
  rejectedDocuments: number;
  totalDownloads: number;
  totalViews: number;
  byStatus: { status: string; count: number }[];
  byCategory: { category: string; count: number }[];
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  category: DocumentCategory;
  level?: string;
  type: DocumentType;
  size?: string;
  sizeBytes?: number;
  url?: string;
  fileName?: string;
  mimeType?: string;
  mediaId?: string;
  status?: DocumentStatus;
  visibility?: DocumentVisibility;
}

export interface UpdateDocumentData extends Partial<CreateDocumentData> {}

// ========== Document Management API ==========

export const documentManagementApi = {
  // Get all documents
  getDocuments: async (filter: DocumentFilter = {}): Promise<{ items: LearningDocument[]; total: number; page: number; limit: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.category) params.append('category', filter.category);
    if (filter.status) params.append('status', filter.status);
    if (filter.visibility) params.append('visibility', filter.visibility);
    if (filter.level) params.append('level', filter.level);
    if (filter.type) params.append('type', filter.type);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    const response = await apiClient.get(`/admin/documents?${params.toString()}`);
    return response.data;
  },

  // Get document statistics
  getStatistics: async (): Promise<DocumentStatistics> => {
    const response = await apiClient.get('/admin/documents/statistics');
    return response.data;
  },

  // Get document by ID
  getDocumentById: async (id: string): Promise<LearningDocument> => {
    const response = await apiClient.get(`/admin/documents/${id}`);
    return response.data;
  },

  // Create document
  createDocument: async (data: CreateDocumentData): Promise<LearningDocument> => {
    const response = await apiClient.post('/admin/documents', data);
    return response.data;
  },

  // Update document
  updateDocument: async (id: string, data: UpdateDocumentData): Promise<LearningDocument> => {
    const response = await apiClient.put(`/admin/documents/${id}`, data);
    return response.data;
  },

  // Update document status
  updateDocumentStatus: async (id: string, status: DocumentStatus, rejectionReason?: string): Promise<LearningDocument> => {
    const response = await apiClient.put(`/admin/documents/${id}/status`, { status, rejectionReason });
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/admin/documents/${id}`);
    return response.data;
  },

  // Bulk action
  bulkAction: async (documentIds: string[], action: 'publish' | 'unpublish' | 'delete' | 'approve' | 'reject', reason?: string): Promise<{ affected: number }> => {
    const response = await apiClient.post('/admin/documents/bulk-action', { documentIds, action, reason });
    return response.data;
  },

  // Increment views
  incrementViews: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/admin/documents/${id}/view`);
    return response.data;
  },

  // Increment downloads
  incrementDownloads: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/admin/documents/${id}/download`);
    return response.data;
  },
};

// ========== Combined Admin Service ==========

export const adminService = {
  users: userManagementApi,
  teachers: teacherManagementApi,
  documents: documentManagementApi,
  exams: examManagementApi,
  analytics: analyticsApi,
  settings: settingsApi,
  logs: adminLogsApi,
  dashboard: adminDashboardApi,
};

export default adminService;

