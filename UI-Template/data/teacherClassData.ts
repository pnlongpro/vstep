// Shared class data for Teacher Dashboard
// Used across: Class Management, Attendance, Assignment, and Grading pages

export interface TeacherClass {
  id: number;
  name: string;
  code: string;
  course: string;
  level: 'B1' | 'B2' | 'C1';
  students: number;
  schedule: string;
  activeAssignments: number;
  completionRate: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
  teacherId: number;
  room?: string;
  time?: string;
  created?: string; // For ClassManagementTeacherPage
  progress?: number; // For ClassManagementTeacherPage
  sessions?: number; // For ClassManagementTeacherPage
}

// Centralized class data - 3 classes only
export const teacherClasses: TeacherClass[] = [
  {
    id: 1,
    name: '📚 VSTEP Foundation - Lớp sáng',
    code: 'VSTEP-FOUNDATION-M01',
    course: 'VSTEP Foundation',
    level: 'B1',
    students: 25,
    schedule: 'T2, T4, T6 - 8:00-10:00',
    activeAssignments: 12,
    completionRate: 85,
    status: 'active',
    startDate: '2024-12-03',
    endDate: '2025-02-28',
    teacherId: 1,
    room: 'Phòng 301',
    time: '8:00-10:00',
    created: '2024-01-15',
    progress: 85,
    sessions: 4
  },
  {
    id: 2,
    name: '🎯 VSTEP Complete - Lớp chiều',
    code: 'VSTEP-COMPLETE-A01',
    course: 'VSTEP Complete',
    level: 'B2',
    students: 30,
    schedule: 'T3, T5, T7 - 14:00-16:00',
    activeAssignments: 8,
    completionRate: 78,
    status: 'active',
    startDate: '2024-12-03',
    endDate: '2025-03-15',
    teacherId: 1,
    room: 'Phòng 205',
    time: '14:00-16:00',
    created: '2024-02-01',
    progress: 78,
    sessions: 10
  },
  {
    id: 3,
    name: '🏆 VSTEP Master - Lớp tối',
    code: 'VSTEP-MASTER-E01',
    course: 'VSTEP Master',
    level: 'C1',
    students: 20,
    schedule: 'T2, T4 - 18:00-20:00',
    activeAssignments: 6,
    completionRate: 92,
    status: 'active',
    startDate: '2024-12-03',
    endDate: '2025-04-30',
    teacherId: 1,
    room: 'Phòng 402',
    time: '18:00-20:00',
    created: '2024-03-10',
    progress: 92,
    sessions: 30
  }
];

// Helper function to get class by ID
export const getClassById = (id: number): TeacherClass | undefined => {
  return teacherClasses.find(c => c.id === id);
};

// Helper function to get classes by level
export const getClassesByLevel = (level: 'B1' | 'B2' | 'C1'): TeacherClass[] => {
  return teacherClasses.filter(c => c.level === level);
};

// Helper function to get active classes
export const getActiveClasses = (): TeacherClass[] => {
  return teacherClasses.filter(c => c.status === 'active');
};