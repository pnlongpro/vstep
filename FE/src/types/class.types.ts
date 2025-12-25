// Types for Class Management module

export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1';

export type ClassStatus = 'draft' | 'active' | 'inactive' | 'completed';

export type EnrollmentStatus = 'active' | 'inactive' | 'completed' | 'dropped';

export interface ClassTeacher {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  student: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
  };
}

export interface ClassMaterial {
  id: string;
  classId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ClassData {
  id: string;
  name: string;
  description?: string;
  level: VstepLevel;
  status: ClassStatus;
  inviteCode: string;
  maxStudents: number;
  studentLimit?: number; // Alias for maxStudents
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  schedule?: ClassSchedule[];
  teacherId: string;
  teacher?: ClassTeacher;
  students?: ClassStudent[];
  materials?: ClassMaterial[];
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  droppedStudents: number;
  totalMaterials: number;
  averageAttendance?: number;
  averageProgress?: number;
}

// Request DTOs
export interface CreateClassRequest {
  name: string;
  description?: string;
  level?: VstepLevel;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  schedule?: ClassSchedule[];
  coverImage?: string;
}

export interface UpdateClassRequest {
  name?: string;
  description?: string;
  level?: VstepLevel;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  schedule?: ClassSchedule[];
  coverImage?: string;
  status?: ClassStatus;
}

export interface ClassQueryParams {
  page?: number;
  limit?: number;
  level?: VstepLevel;
  status?: ClassStatus;
  search?: string;
}

export interface InviteStudentsRequest {
  emails: string[];
}

export interface JoinClassRequest {
  inviteCode: string;
}

// Response types
export interface ClassListResponse {
  success: boolean;
  data: ClassData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClassDetailResponse {
  success: boolean;
  data: ClassData;
}

export interface ClassStatsResponse {
  success: boolean;
  data: ClassStats;
}

// UI-specific types (for compatibility with UI-Template)
export interface TeacherClassUI {
  id: string | number;
  name: string;
  code: string;
  course: string;
  level: VstepLevel;
  students: number;
  schedule: string;
  activeAssignments: number;
  completionRate: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate?: string;
  teacherId: string | number;
  room?: string;
  time?: string;
  created?: string;
  progress?: number;
  sessions?: number;
}

// Helper to convert API data to UI format
export function mapClassToUI(classData: ClassData): TeacherClassUI {
  const scheduleStr = classData.schedule
    ?.map(s => `${s.day} ${s.startTime}-${s.endTime}`)
    .join(', ') || '';

  return {
    id: classData.id,
    name: classData.name,
    code: classData.inviteCode,
    course: `VSTEP ${classData.level}`,
    level: classData.level,
    students: classData.studentCount || classData.students?.length || 0,
    schedule: scheduleStr,
    activeAssignments: 0, // TODO: Get from assignments module
    completionRate: 0, // TODO: Calculate from student progress
    status: classData.status === 'active' ? 'active' : 
            classData.status === 'completed' ? 'completed' : 'upcoming',
    startDate: classData.startDate || '',
    endDate: classData.endDate,
    teacherId: classData.teacherId,
    room: '', // TODO: Add room to class entity
    time: classData.schedule?.[0] 
      ? `${classData.schedule[0].startTime}-${classData.schedule[0].endTime}` 
      : '',
    created: classData.createdAt?.split('T')[0],
    progress: 0, // TODO: Calculate from sessions
    sessions: 0, // TODO: Get from schedule module
  };
}
