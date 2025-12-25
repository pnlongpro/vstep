// Course Types for VSTEPRO Platform

export type CourseStatus = 'active' | 'draft' | 'inactive';
export type RoadmapStatus = 'locked' | 'in-progress' | 'completed';
export type CourseClassStatus = 'active' | 'inactive';

// ========== Instructor (from User) ==========
export interface CourseInstructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// ========== Course ==========
export interface Course {
  id: string;
  title: string;
  category: string;
  instructorId: string | null;
  instructor: CourseInstructor | null;  // Populated from relation
  students: number;  // Computed from classes
  lessons: number;
  duration: string | null;
  price: string | null;
  rating: number;
  reviews: number;
  status: CourseStatus;
  deviceLimit: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  category: string;
  instructorId?: string;
  lessons: number;
  duration?: string;
  price?: string;
  status?: CourseStatus;
  deviceLimit?: number;
  description?: string;
}

export type UpdateCourseData = Partial<CreateCourseData>;

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: CourseStatus | 'all';
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  averageRating: number;
}

// ========== Document ==========
export interface CourseDocument {
  id: string;
  courseId: string;
  name: string;
  type: string;
  size: string | null;
  url: string | null;
  downloads: number;
  uploadDate: string | null;
  uploadedById: string | null;
  createdAt: string;
}

export interface CreateDocumentData {
  name: string;
  type: string;
  size?: string;
  url?: string;
  uploadedById?: string;
}

// ========== Roadmap ==========
export interface RoadmapItem {
  id: string;
  courseId: string;
  week: number;
  title: string;
  lessons: number;
  duration: string | null;
  status: RoadmapStatus;
  orderIndex: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoadmapItemData {
  week: number;
  title: string;
  lessons: number;
  duration?: string;
  status?: RoadmapStatus;
  orderIndex: number;
  description?: string;
}

export type UpdateRoadmapItemData = Partial<CreateRoadmapItemData>;

// ========== Course Class ==========
export interface CourseClass {
  id: string;
  courseId: string;
  name: string;
  instructor: string | null;
  students: number;
  maxStudents: number;
  startDate: string | null;
  endDate: string | null;
  status: CourseClassStatus;
  schedule: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseClassData {
  name: string;
  instructor?: string;
  students: number;
  maxStudents: number;
  startDate?: string;
  endDate?: string;
  status?: CourseClassStatus;
  schedule?: string;
}

export type UpdateCourseClassData = Partial<CreateCourseClassData>;
