import { apiClient } from '@/lib/axios';

export interface CreateClassRequest {
  name: string;
  description?: string;
  level?: string;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
}

export interface Class {
  id: string;
  name: string;
  classCode: string;
  level: string;
  studentCount: number;
  status: string;
  teacher: {
    id: string;
    name: string;
  };
}

export interface InviteStudentsRequest {
  emails: string[];
}

export interface JoinClassRequest {
  classCode: string;
}

export interface CreateScheduleRequest {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  zoomLink?: string;
  notes?: string;
  isRecurring?: boolean;
}

export interface AttendanceRecord {
  userId: string;
  status: 'present' | 'late' | 'absent';
  note?: string;
}

export interface MarkAttendanceRequest {
  sessionDate: string;
  records: AttendanceRecord[];
}

class ClassesService {
  /**
   * Tạo lớp học mới (Teacher/Admin)
   */
  async createClass(data: CreateClassRequest) {
    const response = await apiClient.post('/classes', data);
    return response.data;
  }

  /**
   * Lấy danh sách lớp học
   */
  async getClasses(params?: { role?: string; status?: string }) {
    const response = await apiClient.get('/classes', { params });
    return response.data;
  }

  /**
   * Lấy chi tiết lớp học
   */
  async getClassDetails(classId: string) {
    const response = await apiClient.get(`/classes/${classId}`);
    return response.data;
  }

  /**
   * Cập nhật lớp học
   */
  async updateClass(classId: string, data: Partial<CreateClassRequest>) {
    const response = await apiClient.put(`/classes/${classId}`, data);
    return response.data;
  }

  /**
   * Xóa lớp học
   */
  async deleteClass(classId: string) {
    const response = await apiClient.delete(`/classes/${classId}`);
    return response.data;
  }

  /**
   * Mời học viên vào lớp
   */
  async inviteStudents(classId: string, data: InviteStudentsRequest) {
    const response = await apiClient.post(`/classes/${classId}/invite`, data);
    return response.data;
  }

  /**
   * Tham gia lớp bằng code (Student)
   */
  async joinClass(data: JoinClassRequest) {
    const response = await apiClient.post('/classes/join', data);
    return response.data;
  }

  /**
   * Lấy danh sách học viên trong lớp
   */
  async getClassStudents(classId: string) {
    const response = await apiClient.get(`/classes/${classId}/students`);
    return response.data;
  }

  /**
   * Xóa học viên khỏi lớp
   */
  async removeStudent(classId: string, studentId: string) {
    const response = await apiClient.delete(
      `/classes/${classId}/students/${studentId}`
    );
    return response.data;
  }

  /**
   * Thêm lịch học
   */
  async createSchedule(classId: string, data: CreateScheduleRequest) {
    const response = await apiClient.post(`/classes/${classId}/schedule`, data);
    return response.data;
  }

  /**
   * Lấy lịch học của lớp
   */
  async getClassSchedule(classId: string, month?: string) {
    const params = month ? { month } : {};
    const response = await apiClient.get(`/classes/${classId}/schedule`, {
      params,
    });
    return response.data;
  }

  /**
   * Điểm danh
   */
  async markAttendance(classId: string, data: MarkAttendanceRequest) {
    const response = await apiClient.post(
      `/classes/${classId}/attendance`,
      data
    );
    return response.data;
  }

  /**
   * Lấy dữ liệu điểm danh
   */
  async getAttendance(classId: string, month?: string) {
    const params = month ? { month } : {};
    const response = await apiClient.get(`/classes/${classId}/attendance`, {
      params,
    });
    return response.data;
  }
}

export const classesService = new ClassesService();
export default classesService;
