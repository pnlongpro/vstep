import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { ClassStudent } from './entities/class-student.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { SessionAttendance } from './entities/session-attendance.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InviteStudentsDto } from './dto/invite-students.dto';
import { JoinClassDto } from './dto/join-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassStudent)
    private classStudentRepository: Repository<ClassStudent>,
    @InjectRepository(ClassSchedule)
    private scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(SessionAttendance)
    private attendanceRepository: Repository<SessionAttendance>,
  ) {}

  /**
   * Generate unique class code
   */
  private generateClassCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new class
   */
  async createClass(teacherId: string, dto: CreateClassDto) {
    let classCode = this.generateClassCode();
    
    // Ensure unique code
    let existingClass = await this.classRepository.findOne({
      where: { class_code: classCode },
    });
    
    while (existingClass) {
      classCode = this.generateClassCode();
      existingClass = await this.classRepository.findOne({
        where: { class_code: classCode },
      });
    }

    const newClass = this.classRepository.create({
      name: dto.name,
      description: dto.description,
      level: dto.level,
      teacher_id: teacherId,
      class_code: classCode,
      max_students: dto.maxStudents,
      start_date: dto.startDate,
      end_date: dto.endDate,
      status: 'active',
      student_count: 0,
    });

    const saved = await this.classRepository.save(newClass);

    return {
      success: true,
      data: {
        classId: saved.id,
        name: saved.name,
        classCode: saved.class_code,
        teacherId: saved.teacher_id,
      },
    };
  }

  /**
   * Get classes for user (teacher or student)
   */
  async getClasses(userId: string, userRole: string, filters: any) {
    let query = this.classRepository.createQueryBuilder('class');

    if (userRole === 'teacher') {
      query = query.where('class.teacher_id = :userId', { userId });
    } else if (userRole === 'student') {
      query = query
        .innerJoin('class.students', 'student')
        .where('student.user_id = :userId', { userId })
        .andWhere('student.status = :status', { status: 'active' });
    }

    if (filters.status) {
      query = query.andWhere('class.status = :status', { status: filters.status });
    }

    const classes = await query
      .leftJoinAndSelect('class.teacher', 'teacher')
      .orderBy('class.created_at', 'DESC')
      .getMany();

    return {
      success: true,
      data: {
        classes: classes.map(c => ({
          id: c.id,
          name: c.name,
          classCode: c.class_code,
          level: c.level,
          studentCount: c.student_count,
          status: c.status,
          teacher: c.teacher ? {
            id: c.teacher.id,
            name: c.teacher.full_name,
          } : null,
        })),
      },
    };
  }

  /**
   * Get class details
   */
  async getClassDetails(classId: string, userId: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['teacher'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Check access
    const isTeacher = classEntity.teacher_id === userId;
    const isStudent = await this.classStudentRepository.findOne({
      where: { class_id: classId, user_id: userId, status: 'active' },
    });

    if (!isTeacher && !isStudent) {
      throw new ForbiddenException('Access denied');
    }

    return {
      success: true,
      data: {
        id: classEntity.id,
        name: classEntity.name,
        description: classEntity.description,
        classCode: classEntity.class_code,
        level: classEntity.level,
        studentCount: classEntity.student_count,
        maxStudents: classEntity.max_students,
        status: classEntity.status,
        teacher: {
          id: classEntity.teacher.id,
          name: classEntity.teacher.full_name,
        },
      },
    };
  }

  /**
   * Update class
   */
  async updateClass(classId: string, teacherId: string, dto: UpdateClassDto) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    Object.assign(classEntity, dto);
    classEntity.updated_at = new Date();

    await this.classRepository.save(classEntity);

    return {
      success: true,
      message: 'Class updated successfully',
    };
  }

  /**
   * Delete class (soft delete)
   */
  async deleteClass(classId: string, teacherId: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    classEntity.deleted_at = new Date();
    await this.classRepository.save(classEntity);

    return {
      success: true,
      message: 'Class deleted successfully',
    };
  }

  /**
   * Invite students to class
   */
  async inviteStudents(classId: string, teacherId: string, dto: InviteStudentsDto) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    // TODO: Create invitations and send emails
    // For now, return success
    
    return {
      success: true,
      data: {
        invitationsSent: dto.emails.length,
      },
    };
  }

  /**
   * Join class with code
   */
  async joinClass(userId: string, dto: JoinClassDto) {
    const classEntity = await this.classRepository.findOne({
      where: { class_code: dto.classCode, status: 'active' },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or inactive');
    }

    // Check if already joined
    const existing = await this.classStudentRepository.findOne({
      where: { class_id: classEntity.id, user_id: userId },
    });

    if (existing && existing.status === 'active') {
      throw new BadRequestException('Already joined this class');
    }

    // Check max students
    if (
      classEntity.max_students &&
      classEntity.student_count >= classEntity.max_students
    ) {
      throw new BadRequestException('Class is full');
    }

    // Create enrollment
    const enrollment = this.classStudentRepository.create({
      class_id: classEntity.id,
      user_id: userId,
      status: 'active',
      joined_via: 'code',
      joined_at: new Date(),
    });

    await this.classStudentRepository.save(enrollment);

    // Update student count
    classEntity.student_count += 1;
    await this.classRepository.save(classEntity);

    return {
      success: true,
      data: {
        classId: classEntity.id,
        className: classEntity.name,
        joinedAt: enrollment.joined_at,
      },
    };
  }

  /**
   * Get students in class
   */
  async getClassStudents(classId: string, userId: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const students = await this.classStudentRepository.find({
      where: { class_id: classId, status: 'active' },
      relations: ['user'],
      order: { joined_at: 'ASC' },
    });

    return {
      success: true,
      data: {
        students: students.map(s => ({
          id: s.user.id,
          name: s.user.full_name,
          email: s.user.email,
          joinedAt: s.joined_at,
        })),
      },
    };
  }

  /**
   * Remove student from class
   */
  async removeStudent(classId: string, teacherId: string, studentId: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    const enrollment = await this.classStudentRepository.findOne({
      where: { class_id: classId, user_id: studentId, status: 'active' },
    });

    if (!enrollment) {
      throw new NotFoundException('Student not found in class');
    }

    enrollment.status = 'removed';
    enrollment.removed_at = new Date();
    enrollment.removed_by = teacherId;

    await this.classStudentRepository.save(enrollment);

    // Update student count
    classEntity.student_count = Math.max(0, classEntity.student_count - 1);
    await this.classRepository.save(classEntity);

    return {
      success: true,
      message: 'Student removed from class',
    };
  }

  /**
   * Create class schedule
   */
  async createSchedule(classId: string, teacherId: string, dto: CreateScheduleDto) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    const schedule = this.scheduleRepository.create({
      class_id: classId,
      title: dto.title,
      date: dto.date,
      start_time: dto.startTime,
      end_time: dto.endTime,
      location: dto.location,
      zoom_link: dto.zoomLink,
      notes: dto.notes,
      is_recurring: dto.isRecurring || false,
      status: 'scheduled',
    });

    await this.scheduleRepository.save(schedule);

    return {
      success: true,
      data: {
        scheduleId: schedule.id,
      },
    };
  }

  /**
   * Get class schedule
   */
  async getClassSchedule(classId: string, userId: string, month?: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    let query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.class_id = :classId', { classId });

    if (month) {
      // Filter by month (YYYY-MM format)
      const [year, monthNum] = month.split('-');
      query = query.andWhere(
        'YEAR(schedule.date) = :year AND MONTH(schedule.date) = :month',
        { year, month: monthNum },
      );
    }

    const schedules = await query
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.start_time', 'ASC')
      .getMany();

    return {
      success: true,
      data: {
        schedules,
      },
    };
  }

  /**
   * Mark attendance
   */
  async markAttendance(classId: string, teacherId: string, dto: MarkAttendanceDto) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId, teacher_id: teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or access denied');
    }

    // Create or update attendance records
    for (const record of dto.records) {
      const existing = await this.attendanceRepository.findOne({
        where: {
          class_id: classId,
          user_id: record.userId,
          session_date: dto.sessionDate,
        },
      });

      if (existing) {
        existing.status = record.status;
        existing.note = record.note;
        existing.marked_by = teacherId;
        existing.updated_at = new Date();
        await this.attendanceRepository.save(existing);
      } else {
        const attendance = this.attendanceRepository.create({
          class_id: classId,
          user_id: record.userId,
          session_date: dto.sessionDate,
          status: record.status,
          note: record.note,
          marked_by: teacherId,
        });
        await this.attendanceRepository.save(attendance);
      }
    }

    return {
      success: true,
      message: 'Attendance marked successfully',
    };
  }

  /**
   * Get attendance records
   */
  async getAttendance(classId: string, userId: string, month?: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    let query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.class_id = :classId', { classId })
      .leftJoinAndSelect('attendance.user', 'user');

    if (month) {
      const [year, monthNum] = month.split('-');
      query = query.andWhere(
        'YEAR(attendance.session_date) = :year AND MONTH(attendance.session_date) = :month',
        { year, month: monthNum },
      );
    }

    const records = await query
      .orderBy('attendance.session_date', 'DESC')
      .getMany();

    return {
      success: true,
      data: {
        records,
      },
    };
  }
}
