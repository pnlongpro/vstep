import api from '@/lib/axios';
import {
  Course,
  CourseListParams,
  CourseListResponse,
  CourseStats,
  CreateCourseData,
  UpdateCourseData,
  CourseDocument,
  CreateDocumentData,
  RoadmapItem,
  CreateRoadmapItemData,
  UpdateRoadmapItemData,
  CourseClass,
  CreateCourseClassData,
  UpdateCourseClassData,
} from '@/types/course.types';

const BASE_URL = '/api/courses';

// ========== Course APIs ==========
export const coursesApi = {
  // Get list of courses with pagination & filters
  async list(params?: CourseListParams): Promise<CourseListResponse> {
    const { data } = await api.get<CourseListResponse>(BASE_URL, { params });
    return data;
  },

  // Get course statistics
  async getStats(): Promise<CourseStats> {
    const { data } = await api.get<CourseStats>(`${BASE_URL}/stats`);
    return data;
  },

  // Get single course by ID
  async getById(id: string): Promise<Course> {
    const { data } = await api.get<Course>(`${BASE_URL}/${id}`);
    return data;
  },

  // Create new course
  async create(payload: CreateCourseData): Promise<Course> {
    const { data } = await api.post<Course>(BASE_URL, payload);
    return data;
  },

  // Update course
  async update(id: string, payload: UpdateCourseData): Promise<Course> {
    const { data } = await api.put<Course>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  // Delete course
  async delete(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<{ success: boolean }>(`${BASE_URL}/${id}`);
    return data;
  },
};

// ========== Document APIs ==========
export const courseDocumentsApi = {
  // Get documents of a course
  async list(courseId: string): Promise<CourseDocument[]> {
    const { data } = await api.get<CourseDocument[]>(`${BASE_URL}/${courseId}/documents`);
    return data;
  },

  // Add document to course
  async create(courseId: string, payload: CreateDocumentData): Promise<CourseDocument> {
    const { data } = await api.post<CourseDocument>(`${BASE_URL}/${courseId}/documents`, payload);
    return data;
  },

  // Delete document
  async delete(documentId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<{ success: boolean }>(`/api/documents/${documentId}`);
    return data;
  },
};

// ========== Roadmap APIs ==========
export const courseRoadmapApi = {
  // Get roadmap items of a course
  async list(courseId: string): Promise<RoadmapItem[]> {
    const { data } = await api.get<RoadmapItem[]>(`${BASE_URL}/${courseId}/roadmap`);
    return data;
  },

  // Add roadmap item to course
  async create(courseId: string, payload: CreateRoadmapItemData): Promise<RoadmapItem> {
    const { data } = await api.post<RoadmapItem>(`${BASE_URL}/${courseId}/roadmap`, payload);
    return data;
  },

  // Update roadmap item
  async update(itemId: string, payload: UpdateRoadmapItemData): Promise<RoadmapItem> {
    const { data } = await api.put<RoadmapItem>(`/api/roadmap/${itemId}`, payload);
    return data;
  },

  // Delete roadmap item
  async delete(itemId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<{ success: boolean }>(`/api/roadmap/${itemId}`);
    return data;
  },

  // Reorder roadmap items
  async reorder(courseId: string, itemIds: string[]): Promise<{ success: boolean }> {
    const { data } = await api.put<{ success: boolean }>(`${BASE_URL}/${courseId}/roadmap/reorder`, { itemIds });
    return data;
  },
};

// ========== Course Class APIs ==========
export const courseClassesApi = {
  // Get classes of a course
  async list(courseId: string): Promise<CourseClass[]> {
    const { data } = await api.get<CourseClass[]>(`${BASE_URL}/${courseId}/classes`);
    return data;
  },

  // Add class to course
  async create(courseId: string, payload: CreateCourseClassData): Promise<CourseClass> {
    const { data } = await api.post<CourseClass>(`${BASE_URL}/${courseId}/classes`, payload);
    return data;
  },

  // Update class
  async update(classId: string, payload: UpdateCourseClassData): Promise<CourseClass> {
    const { data } = await api.put<CourseClass>(`/api/classes/${classId}`, payload);
    return data;
  },

  // Delete class
  async delete(classId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<{ success: boolean }>(`/api/classes/${classId}`);
    return data;
  },
};

// Combined export
export const coursesService = {
  courses: coursesApi,
  documents: courseDocumentsApi,
  roadmap: courseRoadmapApi,
  classes: courseClassesApi,
};

export default coursesService;
