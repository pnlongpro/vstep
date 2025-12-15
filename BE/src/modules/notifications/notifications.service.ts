import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private preferenceRepository: Repository<NotificationPreference>,
  ) {}

  /**
   * Get notifications for user
   */
  async getNotifications(
    userId: string,
    filters: {
      unread?: boolean;
      type?: string;
      page: number;
      limit: number;
    },
  ) {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.user_id = :userId', { userId })
      .andWhere('notification.is_deleted = :isDeleted', { isDeleted: false });

    if (filters.unread) {
      query.andWhere('notification.is_read = :isRead', { isRead: false });
    }

    if (filters.type) {
      query.andWhere('notification.type = :type', { type: filters.type });
    }

    const total = await query.getCount();

    const notifications = await query
      .orderBy('notification.created_at', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getMany();

    const unreadCount = await this.notificationRepository.count({
      where: {
        user_id: userId,
        is_read: false,
        is_deleted: false,
      },
    });

    return {
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          pages: Math.ceil(total / filters.limit),
        },
      },
    };
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: {
        user_id: userId,
        is_read: false,
        is_deleted: false,
      },
    });

    return {
      success: true,
      data: {
        count,
      },
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.is_read = true;
    notification.read_at = new Date();

    await this.notificationRepository.save(notification);

    return {
      success: true,
      message: 'Marked as read',
    };
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ is_read: true, read_at: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('is_read = :isRead', { isRead: false })
      .andWhere('is_deleted = :isDeleted', { isDeleted: false })
      .execute();

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  /**
   * Delete notification (soft delete)
   */
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.is_deleted = true;
    await this.notificationRepository.save(notification);

    return {
      success: true,
      message: 'Notification deleted',
    };
  }

  /**
   * Delete all notifications
   */
  async deleteAll(userId: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ is_deleted: true })
      .where('user_id = :userId', { userId })
      .andWhere('is_deleted = :isDeleted', { isDeleted: false })
      .execute();

    return {
      success: true,
      message: 'All notifications deleted',
    };
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string) {
    const preferences = await this.preferenceRepository.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      // Return default preferences
      return {
        success: true,
        data: {
          email_enabled: true,
          push_enabled: true,
          assignment_notifications: true,
          badge_notifications: true,
          goal_notifications: true,
          class_notifications: true,
        },
      };
    }

    return {
      success: true,
      data: preferences,
    };
  }

  /**
   * Create notification (internal method for other services)
   */
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    icon?: string;
    actionUrl?: string;
    actionType?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  }) {
    const notification = this.notificationRepository.create({
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      icon: data.icon,
      action_url: data.actionUrl,
      action_type: data.actionType,
      related_entity_type: data.relatedEntityType,
      related_entity_id: data.relatedEntityId,
      is_read: false,
      is_deleted: false,
      sent_in_app: true,
    });

    await this.notificationRepository.save(notification);

    // TODO: Send real-time notification via WebSocket
    // TODO: Send email if user has email notifications enabled

    return notification;
  }

  /**
   * Create bulk notifications
   */
  async createBulkNotifications(
    userIds: string[],
    data: {
      type: string;
      title: string;
      message: string;
      icon?: string;
      actionUrl?: string;
    },
  ) {
    const notifications = userIds.map(userId =>
      this.notificationRepository.create({
        user_id: userId,
        type: data.type,
        title: data.title,
        message: data.message,
        icon: data.icon,
        action_url: data.actionUrl,
        is_read: false,
        is_deleted: false,
        sent_in_app: true,
      }),
    );

    await this.notificationRepository.save(notifications);

    return {
      success: true,
      data: {
        count: notifications.length,
      },
    };
  }
}
