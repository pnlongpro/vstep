import api from '@/lib/axios';

export interface MediaItem {
  id: string;
  originalName: string;
  storedName: string;
  url: string;
  mimeType: string;
  size: number;
  sizeHuman: string;
  category: 'document' | 'audio' | 'video' | 'image';
  status: 'active' | 'orphaned' | 'deleted';
  referenceCount: number;
  uploadedById?: string;
  createdAt: string;
}

export interface MediaListResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadMediaParams {
  file: File;
  customName?: string;
  category?: 'document' | 'audio' | 'video' | 'image';
}

export interface MediaQueryParams {
  category?: 'document' | 'audio' | 'video' | 'image';
  status?: 'active' | 'orphaned' | 'deleted';
  search?: string;
  page?: number;
  limit?: number;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  totalSizeHuman: string;
  byCategory: Record<string, { count: number; size: number }>;
  orphanedCount: number;
}

/**
 * Media Service
 * Centralized file upload and management
 */
export const mediaService = {
  /**
   * Upload a file
   */
  async upload(params: UploadMediaParams): Promise<{ success: boolean; data: MediaItem }> {
    const formData = new FormData();
    formData.append('file', params.file);
    
    if (params.customName) {
      formData.append('customName', params.customName);
    }
    
    if (params.category) {
      formData.append('category', params.category);
    }

    const response = await api.post<{ success: boolean; data: MediaItem }>(
      '/media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Get all media files with pagination
   */
  async getAll(params?: MediaQueryParams): Promise<MediaListResponse> {
    const response = await api.get<MediaListResponse>('/media', { params });
    return response.data;
  },

  /**
   * Get media by ID
   */
  async getById(id: string): Promise<MediaItem> {
    const response = await api.get<MediaItem>(`/media/${id}`);
    return response.data;
  },

  /**
   * Update media metadata
   */
  async update(
    id: string,
    data: { originalName?: string; category?: string }
  ): Promise<{ success: boolean; data: MediaItem }> {
    const response = await api.patch<{ success: boolean; data: MediaItem }>(
      `/media/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete media file
   */
  async delete(id: string, force: boolean = false): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/media/${id}`,
      { params: { force } }
    );
    return response.data;
  },

  /**
   * Get storage statistics (Admin only)
   */
  async getStats(): Promise<MediaStats> {
    const response = await api.get<MediaStats>('/media/stats');
    return response.data;
  },

  /**
   * Clean up orphaned media files (Admin only)
   */
  async cleanup(olderThanDays: number = 7): Promise<{ success: boolean; deletedCount: number }> {
    const response = await api.post<{ success: boolean; deletedCount: number }>(
      '/media/cleanup',
      null,
      { params: { olderThanDays } }
    );
    return response.data;
  },

  /**
   * Get full URL for media file
   */
  getFileUrl(relativePath: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}${relativePath}`;
  },
};

export default mediaService;
