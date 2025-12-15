import { apiClient } from '@/lib/axios';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionType?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

class NotificationsService {
  /**
   * Lấy danh sách notifications
   */
  async getNotifications(params?: {
    unread?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  }

  /**
   * Lấy số lượng unread notifications
   */
  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  }

  /**
   * Đánh dấu đã đọc
   */
  async markAsRead(notificationId: string) {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  /**
   * Đánh dấu tất cả đã đọc
   */
  async markAllAsRead() {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  }

  /**
   * Xóa notification
   */
  async deleteNotification(notificationId: string) {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  /**
   * Xóa tất cả notifications
   */
  async deleteAll() {
    const response = await apiClient.delete('/notifications');
    return response.data;
  }

  /**
   * Lấy notification preferences
   */
  async getPreferences() {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  }
}

export const notificationsService = new NotificationsService();
export default notificationsService;
