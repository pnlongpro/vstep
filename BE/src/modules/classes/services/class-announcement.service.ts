import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassAnnouncement } from '../entities/class-announcement.entity';
import { Class } from '../entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../entities/class-student.entity';
import { CreateAnnouncementDto, UpdateAnnouncementDto, AnnouncementResponseDto } from '../dto/class-announcement.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { NotificationType, RelatedEntityType } from '../../notifications/entities/notification.entity';

@Injectable()
export class ClassAnnouncementService {
  constructor(
    @InjectRepository(ClassAnnouncement)
    private readonly announcementRepo: Repository<ClassAnnouncement>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Lấy danh sách thông báo của lớp
   */
  async getAnnouncements(classId: string, userId?: string): Promise<{ success: boolean; data: AnnouncementResponseDto[] }> {
    // Verify class exists
    const classEntity = await this.classRepo.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // If userId provided, check membership (for student access)
    if (userId && classEntity.teacherId !== userId) {
      const membership = await this.classStudentRepo.findOne({
        where: { classId, studentId: userId, status: EnrollmentStatus.ACTIVE },
      });
      if (!membership) {
        throw new ForbiddenException('Bạn không phải thành viên của lớp này');
      }
    }

    const announcements = await this.announcementRepo.find({
      where: { classId },
      relations: ['author'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });

    return {
      success: true,
      data: announcements.map(a => this.formatAnnouncement(a)),
    };
  }

  /**
   * Lấy chi tiết thông báo
   */
  async getAnnouncementById(classId: string, announcementId: string): Promise<{ success: boolean; data: AnnouncementResponseDto }> {
    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, classId },
      relations: ['author'],
    });

    if (!announcement) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return {
      success: true,
      data: this.formatAnnouncement(announcement),
    };
  }

  /**
   * Tạo thông báo mới (Teacher only)
   */
  async createAnnouncement(
    classId: string,
    teacherId: string,
    dto: CreateAnnouncementDto,
  ): Promise<{ success: boolean; data: AnnouncementResponseDto; message: string }> {
    // Verify teacher owns this class
    const classEntity = await this.classRepo.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Bạn không phải giáo viên của lớp này');
    }

    const announcement = this.announcementRepo.create({
      classId,
      authorId: teacherId,
      title: dto.title,
      content: dto.content,
      isPinned: dto.isPinned || false,
    });

    await this.announcementRepo.save(announcement);

    // Load author relation
    const savedAnnouncement = await this.announcementRepo.findOne({
      where: { id: announcement.id },
      relations: ['author'],
    });

    // Send notifications to all students in class
    await this.notifyStudents(classId, classEntity.name, announcement);

    return {
      success: true,
      data: this.formatAnnouncement(savedAnnouncement!),
      message: 'Đã tạo thông báo thành công',
    };
  }

  /**
   * Cập nhật thông báo (Teacher only)
   */
  async updateAnnouncement(
    classId: string,
    announcementId: string,
    teacherId: string,
    dto: UpdateAnnouncementDto,
  ): Promise<{ success: boolean; data: AnnouncementResponseDto; message: string }> {
    // Verify teacher owns this class
    const classEntity = await this.classRepo.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Bạn không phải giáo viên của lớp này');
    }

    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, classId },
    });

    if (!announcement) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Update fields
    if (dto.title !== undefined) announcement.title = dto.title;
    if (dto.content !== undefined) announcement.content = dto.content;
    if (dto.isPinned !== undefined) announcement.isPinned = dto.isPinned;

    await this.announcementRepo.save(announcement);

    // Load with author
    const updated = await this.announcementRepo.findOne({
      where: { id: announcementId },
      relations: ['author'],
    });

    return {
      success: true,
      data: this.formatAnnouncement(updated!),
      message: 'Đã cập nhật thông báo',
    };
  }

  /**
   * Xóa thông báo (Teacher only)
   */
  async deleteAnnouncement(
    classId: string,
    announcementId: string,
    teacherId: string,
  ): Promise<{ success: boolean; message: string }> {
    // Verify teacher owns this class
    const classEntity = await this.classRepo.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Bạn không phải giáo viên của lớp này');
    }

    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, classId },
    });

    if (!announcement) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    await this.announcementRepo.remove(announcement);

    return {
      success: true,
      message: 'Đã xóa thông báo',
    };
  }

  /**
   * Toggle ghim thông báo
   */
  async togglePin(
    classId: string,
    announcementId: string,
    teacherId: string,
  ): Promise<{ success: boolean; data: { isPinned: boolean }; message: string }> {
    // Verify teacher owns this class
    const classEntity = await this.classRepo.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Bạn không phải giáo viên của lớp này');
    }

    const announcement = await this.announcementRepo.findOne({
      where: { id: announcementId, classId },
    });

    if (!announcement) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    announcement.isPinned = !announcement.isPinned;
    await this.announcementRepo.save(announcement);

    return {
      success: true,
      data: { isPinned: announcement.isPinned },
      message: announcement.isPinned ? 'Đã ghim thông báo' : 'Đã bỏ ghim thông báo',
    };
  }

  // ==================== Helper methods ====================

  private formatAnnouncement(announcement: ClassAnnouncement): AnnouncementResponseDto {
    return {
      id: announcement.id,
      classId: announcement.classId,
      title: announcement.title,
      content: announcement.content,
      isPinned: announcement.isPinned,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      author: announcement.author
        ? {
            id: announcement.author.id,
            firstName: announcement.author.firstName,
            lastName: announcement.author.lastName,
            avatar: announcement.author.avatar,
          }
        : null,
    };
  }

  private async notifyStudents(classId: string, className: string, announcement: ClassAnnouncement) {
    // Get all active students in class
    const students = await this.classStudentRepo.find({
      where: { classId, status: EnrollmentStatus.ACTIVE },
      select: ['studentId'],
    });

    if (students.length === 0) return;

    const userIds = students.map(s => s.studentId);

    // Create bulk notifications
    await this.notificationsService.createBulkNotifications({
      userIds,
      type: NotificationType.CLASS_ANNOUNCEMENT,
      title: `Thông báo từ lớp ${className}`,
      message: announcement.title,
      actionUrl: `/student/classes/${classId}`,
      relatedEntityType: RelatedEntityType.CLASS,
      relatedEntityId: classId,
    });
  }
}
