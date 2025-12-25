import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, ClassStatus } from '../../classes/entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../../classes/entities/class-student.entity';
import { ClassMaterial } from '../../classes/entities/class-material.entity';
import { ClassSchedule, ScheduleStatus } from '../../classes/entities/class-schedule.entity';
import { ClassAnnouncement } from '../../classes/entities/class-announcement.entity';
import { ClassAssignment, AssignmentStatus } from '../../classes/entities/class-assignment.entity';
import { ClassAssignmentSubmission, SubmissionStatus } from '../../classes/entities/class-assignment-submission.entity';
import { User } from '../../users/entities/user.entity';
import { AdminClassFilterDto, AdminUpdateClassDto } from '../dto/admin-class.dto';

@Injectable()
export class AdminClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
    @InjectRepository(ClassMaterial)
    private readonly classMaterialRepo: Repository<ClassMaterial>,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepo: Repository<ClassSchedule>,
    @InjectRepository(ClassAnnouncement)
    private readonly classAnnouncementRepo: Repository<ClassAnnouncement>,
    @InjectRepository(ClassAssignment)
    private readonly classAssignmentRepo: Repository<ClassAssignment>,
    @InjectRepository(ClassAssignmentSubmission)
    private readonly assignmentSubmissionRepo: Repository<ClassAssignmentSubmission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Lấy danh sách tất cả lớp học với filters
   */
  async findAll(filter: AdminClassFilterDto) {
    const { page = 1, limit = 10, search, status, level, teacherId, sortBy = 'createdAt', sortOrder = 'DESC' } = filter;

    const queryBuilder = this.classRepo.createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .loadRelationCountAndMap('class.studentCount', 'class.students', 'students', qb => 
        qb.where('students.status = :status', { status: EnrollmentStatus.ACTIVE })
      );

    // Apply filters
    if (search) {
      queryBuilder.andWhere('(class.name LIKE :search OR class.inviteCode LIKE :search)', { search: `%${search}%` });
    }
    if (status) {
      queryBuilder.andWhere('class.status = :status', { status });
    }
    if (level) {
      queryBuilder.andWhere('class.level = :level', { level });
    }
    if (teacherId) {
      queryBuilder.andWhere('class.teacherId = :teacherId', { teacherId });
    }

    // Apply sorting
    queryBuilder.orderBy(`class.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [classes, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        level: cls.level,
        status: cls.status,
        inviteCode: cls.inviteCode,
        startDate: cls.startDate,
        endDate: cls.endDate,
        schedule: cls.schedule,
        maxStudents: cls.maxStudents,
        studentCount: (cls as any).studentCount || 0,
        teacher: cls.teacher ? {
          id: cls.teacher.id,
          name: `${cls.teacher.firstName} ${cls.teacher.lastName}`,
          email: cls.teacher.email,
        } : null,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết lớp học
   */
  async findOne(id: string) {
    const cls = await this.classRepo.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Count students
    const studentCount = await this.classStudentRepo.count({
      where: { classId: id, status: EnrollmentStatus.ACTIVE },
    });

    return {
      success: true,
      data: {
        ...cls,
        studentCount,
        teacher: cls.teacher ? {
          id: cls.teacher.id,
          name: `${cls.teacher.firstName} ${cls.teacher.lastName}`,
          email: cls.teacher.email,
        } : null,
      },
    };
  }

  /**
   * Lấy thống kê lớp học
   */
  async getStats(id: string) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Count students by status
    const totalStudents = await this.classStudentRepo.count({
      where: { classId: id, status: EnrollmentStatus.ACTIVE },
    });

    const removedStudents = await this.classStudentRepo.count({
      where: { classId: id, status: EnrollmentStatus.DROPPED },
    });

    // Calculate averages
    const students = await this.classStudentRepo.find({
      where: { classId: id, status: EnrollmentStatus.ACTIVE },
    });

    const avgProgress = students.length > 0 
      ? students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length 
      : 0;

    return {
      success: true,
      data: {
        totalStudents,
        removedStudents,
        averageProgress: Math.round(avgProgress * 10) / 10,
        averageScore: 0, // Will be calculated from exam results later
        completionRate: avgProgress,
        // Placeholder for more stats
        totalSessions: 0,
        completedSessions: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        pendingAssignments: 0,
      },
    };
  }

  /**
   * Lấy danh sách học viên trong lớp
   */
  async getStudents(classId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;

    const [students, total] = await this.classStudentRepo.findAndCount({
      where: { classId },
      relations: ['student'],
      order: { enrolledAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: students.map(s => ({
        id: s.id,
        studentId: s.studentId,
        student: s.student ? {
          id: s.student.id,
          name: `${s.student.firstName} ${s.student.lastName}`,
          email: s.student.email,
        } : null,
        status: s.status,
        progress: s.progress,
        enrolledAt: s.enrolledAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Cập nhật lớp học
   */
  async update(id: string, dto: AdminUpdateClassDto) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Validate teacher if provided
    if (dto.teacherId) {
      const teacher = await this.userRepo.findOne({ where: { id: dto.teacherId } });
      if (!teacher) {
        throw new BadRequestException('Không tìm thấy giáo viên');
      }
    }

    Object.assign(cls, dto);
    await this.classRepo.save(cls);

    return {
      success: true,
      message: 'Cập nhật lớp học thành công',
      data: cls,
    };
  }

  /**
   * Gán giáo viên cho lớp
   */
  async assignTeacher(classId: string, teacherId: string) {
    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    const teacher = await this.userRepo.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new BadRequestException('Không tìm thấy giáo viên');
    }

    cls.teacherId = teacherId;
    await this.classRepo.save(cls);

    return {
      success: true,
      message: 'Đã gán giáo viên thành công',
      data: {
        classId,
        teacherId,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
      },
    };
  }

  /**
   * Kích hoạt lớp học
   */
  async activate(id: string) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (cls.status !== ClassStatus.DRAFT) {
      throw new BadRequestException('Chỉ có thể kích hoạt lớp ở trạng thái nháp');
    }

    cls.status = ClassStatus.ACTIVE;
    await this.classRepo.save(cls);

    return {
      success: true,
      message: 'Đã kích hoạt lớp học',
      data: cls,
    };
  }

  /**
   * Hoàn thành lớp học
   */
  async complete(id: string) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (cls.status !== ClassStatus.ACTIVE) {
      throw new BadRequestException('Chỉ có thể hoàn thành lớp đang hoạt động');
    }

    cls.status = ClassStatus.COMPLETED;
    await this.classRepo.save(cls);

    return {
      success: true,
      message: 'Đã hoàn thành lớp học',
      data: cls,
    };
  }

  /**
   * Xóa lớp học
   */
  async remove(id: string) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Check if class has active students
    const activeStudents = await this.classStudentRepo.count({
      where: { classId: id, status: EnrollmentStatus.ACTIVE },
    });

    if (activeStudents > 0 && cls.status === ClassStatus.ACTIVE) {
      throw new BadRequestException(
        `Không thể xóa lớp đang có ${activeStudents} học viên. Vui lòng hoàn thành hoặc hủy lớp trước.`
      );
    }

    await this.classRepo.remove(cls);

    return {
      success: true,
      message: 'Đã xóa lớp học',
    };
  }

  /**
   * Xóa học viên khỏi lớp
   */
  async removeStudent(classId: string, studentId: string) {
    const classStudent = await this.classStudentRepo.findOne({
      where: { classId, studentId },
    });

    if (!classStudent) {
      throw new NotFoundException('Không tìm thấy học viên trong lớp');
    }

    classStudent.status = EnrollmentStatus.DROPPED;
    await this.classStudentRepo.save(classStudent);

    return {
      success: true,
      message: 'Đã xóa học viên khỏi lớp',
    };
  }

  /**
   * Lấy báo cáo tổng quan
   */
  async getOverviewReport() {
    const totalClasses = await this.classRepo.count();
    const activeClasses = await this.classRepo.count({ where: { status: ClassStatus.ACTIVE } });
    const draftClasses = await this.classRepo.count({ where: { status: ClassStatus.DRAFT } });
    const completedClasses = await this.classRepo.count({ where: { status: ClassStatus.COMPLETED } });

    const totalStudents = await this.classStudentRepo.count({ where: { status: EnrollmentStatus.ACTIVE } });

    // Get class distribution by level
    const levelStats = await this.classRepo
      .createQueryBuilder('class')
      .select('class.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('class.level')
      .getRawMany();

    return {
      success: true,
      data: {
        totalClasses,
        activeClasses,
        draftClasses,
        completedClasses,
        totalEnrollments: totalStudents,
        levelDistribution: levelStats,
      },
    };
  }

  /**
   * Lấy danh sách tài liệu của lớp (Admin)
   */
  async getMaterials(classId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;

    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    const [materials, total] = await this.classMaterialRepo.findAndCount({
      where: { classId },
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: materials.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        type: m.type,
        fileUrl: m.fileUrl,
        fileName: m.fileName,
        fileSize: m.fileSize,
        mimeType: m.mimeType,
        downloadCount: m.downloadCount,
        isVisible: m.isVisible,
        uploadedBy: m.uploader ? `${m.uploader.firstName} ${m.uploader.lastName}` : 'Unknown',
        createdAt: m.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy lịch học của lớp (Admin)
   */
  async getSchedules(classId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;

    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Get total students for attendance calculation
    const totalStudents = await this.classStudentRepo.count({
      where: { classId, status: EnrollmentStatus.ACTIVE },
    });

    const [schedules, total] = await this.classScheduleRepo.findAndCount({
      where: { classId },
      order: { date: 'ASC', startTime: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: schedules.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        zoomLink: s.zoomLink,
        location: s.location,
        attendanceCount: s.attendanceCount,
        totalStudents,
        createdAt: s.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy thông báo của lớp (Admin)
   */
  async getAnnouncements(classId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;

    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    const [announcements, total] = await this.classAnnouncementRepo.findAndCount({
      where: { classId },
      relations: ['author'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: announcements.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        isPinned: a.isPinned,
        author: a.author ? `${a.author.firstName} ${a.author.lastName}` : 'Unknown',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy danh sách bài tập của lớp (Admin)
   */
  async getAssignments(classId: string, params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;

    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    const queryBuilder = this.classAssignmentRepo.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.creator', 'creator')
      .where('assignment.classId = :classId', { classId })
      .orderBy('assignment.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('assignment.status = :status', { status });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [assignments, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        skill: a.skill,
        dueDate: a.dueDate,
        status: a.status,
        totalPoints: a.totalPoints,
        submissionCount: a.submissionCount,
        gradedCount: a.gradedCount,
        createdBy: a.creator ? `${a.creator.firstName} ${a.creator.lastName}` : 'Unknown',
        createdAt: a.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy submissions cần chấm điểm (Admin)
   */
  async getGradingSubmissions(classId: string, params: { page?: number; limit?: number; status?: string; skill?: string }) {
    const { page = 1, limit = 20, status, skill } = params;

    const cls = await this.classRepo.findOne({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    const queryBuilder = this.assignmentSubmissionRepo.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.assignment', 'assignment')
      .leftJoinAndSelect('submission.student', 'student')
      .leftJoinAndSelect('submission.grader', 'grader')
      .where('assignment.classId = :classId', { classId })
      .orderBy('submission.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('submission.status = :status', { status });
    }

    if (skill) {
      queryBuilder.andWhere('assignment.skill = :skill', { skill });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [submissions, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      data: submissions.map(s => ({
        id: s.id,
        student: s.student ? `${s.student.firstName} ${s.student.lastName}` : 'Unknown',
        studentId: s.studentId,
        assignment: s.assignment?.title || 'Unknown',
        assignmentId: s.assignmentId,
        skill: s.assignment?.skill,
        status: s.status,
        submittedAt: s.submittedAt,
        score: s.score,
        feedback: s.feedback,
        grader: s.grader ? `${s.grader.firstName} ${s.grader.lastName}` : null,
        gradedAt: s.gradedAt,
        wordCount: s.wordCount,
        duration: s.duration,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
