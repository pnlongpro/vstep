import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Notification, NotificationType, ActionType, RelatedEntityType } from '../entities/notification.entity';
import { NotificationPreference, EmailFrequency } from '../entities/notification-preference.entity';
import { CreateNotificationDto, CreateBulkNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationsQueryDto } from '../dto/get-notifications.dto';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { NotificationGateway } from '../gateways/notification.gateway';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// Icon mapping for notification types
const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  [NotificationType.ASSIGNMENT_NEW]: 'ClipboardList',
  [NotificationType.ASSIGNMENT_DUE_SOON]: 'Clock',
  [NotificationType.ASSIGNMENT_OVERDUE]: 'AlertCircle',
  [NotificationType.ASSIGNMENT_GRADED]: 'CheckCircle',
  [NotificationType.ASSIGNMENT_SUBMITTED]: 'Send',
  [NotificationType.CLASS_JOINED]: 'Users',
  [NotificationType.CLASS_ADDED]: 'UserPlus',
  [NotificationType.CLASS_NEW_MATERIAL]: 'FileText',
  [NotificationType.CLASS_CANCELED]: 'XCircle',
  [NotificationType.CLASS_ANNOUNCEMENT]: 'Megaphone',
  [NotificationType.STUDENT_JOINED]: 'UserPlus',
  [NotificationType.STUDENT_LEFT]: 'UserMinus',
  [NotificationType.EXAM_READY]: 'FileCheck',
  [NotificationType.EXAM_RESULT]: 'BarChart',
  [NotificationType.CERTIFICATE_AVAILABLE]: 'Award',
  [NotificationType.SYSTEM_WELCOME]: 'Smile',
  [NotificationType.SYSTEM_EMAIL_VERIFIED]: 'MailCheck',
  [NotificationType.SYSTEM_PASSWORD_CHANGED]: 'Lock',
  [NotificationType.SYSTEM_ACCOUNT_SUSPENDED]: 'Ban',
  [NotificationType.SYSTEM_PREMIUM_EXPIRES]: 'CreditCard',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'Bell',
  [NotificationType.BADGE_UNLOCKED]: 'Trophy',
  [NotificationType.GOAL_ACHIEVED]: 'Target',
  [NotificationType.STREAK_MILESTONE]: 'Flame',
  [NotificationType.XP_EARNED]: 'Star',
  [NotificationType.LEVEL_UP]: 'TrendingUp',
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private readonly preferenceRepo: Repository<NotificationPreference>,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Lấy danh sách thông báo của user
   */
  async getNotifications(userId: string, query: GetNotificationsQueryDto) {
    const { unread, type, page = 1, limit = 20 } = query;

    const whereConditions: any = {
      userId,
      isDeleted: false,
    };

    if (unread) {
      whereConditions.isRead = false;
    }

    if (type) {
      whereConditions.type = type;
    }

    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get unread count
    const unreadCount = await this.notificationRepo.count({
      where: { userId, isRead: false, isDeleted: false },
    });

    return {
      success: true,
      data: {
        notifications: notifications.map(n => this.formatNotification(n)),
        unreadCount,
        total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount(userId: string) {
    const count = await this.notificationRepo.count({
      where: { userId, isRead: false, isDeleted: false },
    });

    return {
      success: true,
      data: { unreadCount: count },
    };
  }

  /**
   * Lấy chi tiết thông báo
   */
  async getNotificationById(userId: string, notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId, isDeleted: false },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return {
      success: true,
      data: this.formatNotification(notification),
    };
  }

  /**
   * Tạo thông báo mới
   */
  async createNotification(dto: CreateNotificationDto) {
    // Check user preferences
    const prefs = await this.getOrCreatePreferences(dto.userId);

    if (!prefs.inappEnabled && !dto.sendEmail) {
      return { success: true, message: 'User has disabled notifications' };
    }

    const notification = this.notificationRepo.create({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      icon: dto.icon || NOTIFICATION_ICONS[dto.type],
      actionUrl: dto.actionUrl,
      actionType: dto.actionType || ActionType.NAVIGATE,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      sentInApp: prefs.inappEnabled,
      sentEmail: dto.sendEmail && this.shouldSendEmail(prefs, dto.type),
      metadata: dto.metadata,
    });

    await this.notificationRepo.save(notification);

    // 🔔 Send real-time notification via WebSocket
    if (prefs.inappEnabled) {
      this.notificationGateway.sendToUser(dto.userId, this.formatNotification(notification));
      
      // Also update unread count
      const unreadCount = await this.notificationRepo.count({
        where: { userId: dto.userId, isRead: false, isDeleted: false },
      });
      this.notificationGateway.sendUnreadCount(dto.userId, unreadCount);
    }

    // TODO: If sentEmail, queue email notification

    return {
      success: true,
      data: {
        notificationId: notification.id,
        sent: true,
      },
    };
  }

  /**
   * Tạo thông báo cho nhiều users
   */
  async createBulkNotifications(dto: CreateBulkNotificationDto) {
    const notifications: Notification[] = [];

    for (const userId of dto.userIds) {
      const prefs = await this.getOrCreatePreferences(userId);

      if (!prefs.inappEnabled && !dto.sendEmail) {
        continue;
      }

      const notification = this.notificationRepo.create({
        userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        icon: dto.icon || NOTIFICATION_ICONS[dto.type],
        actionUrl: dto.actionUrl,
        actionType: dto.actionType || ActionType.NAVIGATE,
        relatedEntityType: dto.relatedEntityType,
        relatedEntityId: dto.relatedEntityId,
        sentInApp: prefs.inappEnabled,
        sentEmail: dto.sendEmail && this.shouldSendEmail(prefs, dto.type),
        metadata: dto.metadata,
      });

      notifications.push(notification);
    }

    await this.notificationRepo.save(notifications);

    // 🔔 Send real-time notifications via WebSocket
    for (const notification of notifications) {
      this.notificationGateway.sendToUser(
        notification.userId,
        this.formatNotification(notification),
      );
    }

    // Update unread counts for all affected users
    const userIds = [...new Set(notifications.map(n => n.userId))];
    for (const userId of userIds) {
      const unreadCount = await this.notificationRepo.count({
        where: { userId, isRead: false, isDeleted: false },
      });
      this.notificationGateway.sendUnreadCount(userId, unreadCount);
    }

    return {
      success: true,
      data: {
        count: notifications.length,
        sent: true,
      },
    };
  }

  /**
   * Đánh dấu đã đọc
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId, isDeleted: false },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await this.notificationRepo.save(notification);

    return {
      success: true,
      message: 'Đã đánh dấu đã đọc',
    };
  }

  /**
   * Đánh dấu tất cả đã đọc
   */
  async markAllAsRead(userId: string) {
    const result = await this.notificationRepo.update(
      { userId, isRead: false, isDeleted: false },
      { isRead: true, readAt: new Date() },
    );

    return {
      success: true,
      message: 'Đã đánh dấu tất cả đã đọc',
      count: result.affected || 0,
    };
  }

  /**
   * Xóa thông báo (soft delete)
   */
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    notification.isDeleted = true;
    await this.notificationRepo.save(notification);

    return {
      success: true,
      message: 'Đã xóa thông báo',
    };
  }

  /**
   * Xóa tất cả thông báo đã đọc
   */
  async deleteAllRead(userId: string) {
    const result = await this.notificationRepo.update(
      { userId, isRead: true, isDeleted: false },
      { isDeleted: true },
    );

    return {
      success: true,
      message: 'Đã xóa tất cả thông báo đã đọc',
      count: result.affected || 0,
    };
  }

  /**
   * Lấy notification preferences
   */
  async getPreferences(userId: string) {
    const prefs = await this.getOrCreatePreferences(userId);

    return {
      success: true,
      data: {
        email: {
          assignments: prefs.emailAssignments,
          classes: prefs.emailClasses,
          exams: prefs.emailExams,
          system: prefs.emailSystem,
          marketing: prefs.emailMarketing,
          frequency: prefs.emailFrequency,
        },
        inApp: {
          enabled: prefs.inappEnabled,
          sound: prefs.inappSound,
          desktopNotifications: prefs.desktopNotifications,
          showBadgeCount: prefs.showBadgeCount,
        },
      },
    };
  }

  /**
   * Cập nhật notification preferences
   */
  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    let prefs = await this.preferenceRepo.findOne({ where: { userId } });

    if (!prefs) {
      prefs = this.preferenceRepo.create({ userId });
    }

    // Update only provided fields
    if (dto.emailAssignments !== undefined) prefs.emailAssignments = dto.emailAssignments;
    if (dto.emailClasses !== undefined) prefs.emailClasses = dto.emailClasses;
    if (dto.emailExams !== undefined) prefs.emailExams = dto.emailExams;
    if (dto.emailSystem !== undefined) prefs.emailSystem = dto.emailSystem;
    if (dto.emailMarketing !== undefined) prefs.emailMarketing = dto.emailMarketing;
    if (dto.emailFrequency !== undefined) prefs.emailFrequency = dto.emailFrequency;
    if (dto.inappEnabled !== undefined) prefs.inappEnabled = dto.inappEnabled;
    if (dto.inappSound !== undefined) prefs.inappSound = dto.inappSound;
    if (dto.desktopNotifications !== undefined) prefs.desktopNotifications = dto.desktopNotifications;
    if (dto.showBadgeCount !== undefined) prefs.showBadgeCount = dto.showBadgeCount;

    await this.preferenceRepo.save(prefs);

    return {
      success: true,
      message: 'Đã cập nhật cài đặt thông báo',
    };
  }

  // ==================== Helper methods ====================

  private async getOrCreatePreferences(userId: string): Promise<NotificationPreference> {
    let prefs = await this.preferenceRepo.findOne({ where: { userId } });

    if (!prefs) {
      prefs = this.preferenceRepo.create({ userId });
      await this.preferenceRepo.save(prefs);
    }

    return prefs;
  }

  private shouldSendEmail(prefs: NotificationPreference, type: NotificationType): boolean {
    if (prefs.emailFrequency === EmailFrequency.NEVER) return false;

    // Map notification type to email preference
    if (type.startsWith('assignment_')) return prefs.emailAssignments;
    if (type.startsWith('class_') || type.startsWith('student_')) return prefs.emailClasses;
    if (type.startsWith('exam_') || type.startsWith('certificate_')) return prefs.emailExams;
    if (type.startsWith('system_')) return prefs.emailSystem;

    return prefs.emailSystem; // Default to system preference
  }

  private formatNotification(notification: Notification) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      actionUrl: notification.actionUrl,
      actionType: notification.actionType,
      relatedEntityType: notification.relatedEntityType,
      relatedEntityId: notification.relatedEntityId,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      timeAgo: formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: vi }),
      metadata: notification.metadata,
    };
  }

  // ==================== Helper for creating common notifications ====================

  /**
   * Tạo thông báo chào mừng user mới
   */
  async createWelcomeNotification(userId: string, userName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.SYSTEM_WELCOME,
      title: 'Chào mừng đến VSTEPRO!',
      message: `Xin chào ${userName}! Hãy bắt đầu hành trình luyện thi VSTEP của bạn.`,
      actionUrl: '/dashboard',
    });
  }

  /**
   * Tạo thông báo bài tập mới
   */
  async createAssignmentNotification(
    userId: string,
    assignmentId: string,
    assignmentTitle: string,
    className: string,
  ) {
    return this.createNotification({
      userId,
      type: NotificationType.ASSIGNMENT_NEW,
      title: 'Bài tập mới',
      message: `Giáo viên đã giao bài tập mới "${assignmentTitle}" trong lớp ${className}`,
      actionUrl: `/student/assignments/${assignmentId}`,
      relatedEntityType: RelatedEntityType.ASSIGNMENT,
      relatedEntityId: assignmentId,
    });
  }

  /**
   * Tạo thông báo bài tập đã chấm
   */
  async createAssignmentGradedNotification(
    userId: string,
    assignmentId: string,
    assignmentTitle: string,
    score: number,
    totalPoints: number,
  ) {
    return this.createNotification({
      userId,
      type: NotificationType.ASSIGNMENT_GRADED,
      title: 'Bài tập đã chấm',
      message: `Bài tập "${assignmentTitle}" đã được chấm. Điểm: ${score}/${totalPoints}`,
      actionUrl: `/student/assignments/${assignmentId}`,
      relatedEntityType: RelatedEntityType.ASSIGNMENT,
      relatedEntityId: assignmentId,
      metadata: { score, totalPoints },
    });
  }

  /**
   * Tạo thông báo được thêm vào lớp
   */
  async createClassJoinedNotification(userId: string, classId: string, className: string) {
    return this.createNotification({
      userId,
      type: NotificationType.CLASS_JOINED,
      title: 'Đã tham gia lớp học',
      message: `Bạn đã được thêm vào lớp "${className}"`,
      actionUrl: `/student/classes/${classId}`,
      relatedEntityType: RelatedEntityType.CLASS,
      relatedEntityId: classId,
    });
  }

  /**
   * Tạo thông báo tài liệu mới
   */
  async createNewMaterialNotification(
    userId: string,
    classId: string,
    className: string,
    materialTitle: string,
  ) {
    return this.createNotification({
      userId,
      type: NotificationType.CLASS_NEW_MATERIAL,
      title: 'Tài liệu mới',
      message: `Tài liệu mới "${materialTitle}" đã được đăng trong lớp ${className}`,
      actionUrl: `/student/classes/${classId}/materials`,
      relatedEntityType: RelatedEntityType.CLASS,
      relatedEntityId: classId,
    });
  }

  /**
   * Tạo thông báo badge mở khóa
   */
  async createBadgeUnlockedNotification(userId: string, badgeId: string, badgeName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.BADGE_UNLOCKED,
      title: '🎉 Huy hiệu mới!',
      message: `Bạn đã mở khóa huy hiệu "${badgeName}"`,
      actionUrl: '/achievements',
      relatedEntityType: RelatedEntityType.BADGE,
      relatedEntityId: badgeId,
    });
  }

  /**
   * Tạo thông báo streak milestone
   */
  async createStreakMilestoneNotification(userId: string, streakDays: number) {
    return this.createNotification({
      userId,
      type: NotificationType.STREAK_MILESTONE,
      title: `🔥 Chuỗi ${streakDays} ngày!`,
      message: `Tuyệt vời! Bạn đã học liên tục ${streakDays} ngày. Hãy tiếp tục phát huy!`,
      actionUrl: '/dashboard',
      metadata: { streakDays },
    });
  }

  /**
   * Format notification for WebSocket payload
   */
  private formatNotification(notification: Notification) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      actionUrl: notification.actionUrl,
      actionType: notification.actionType,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    };
  }
}
