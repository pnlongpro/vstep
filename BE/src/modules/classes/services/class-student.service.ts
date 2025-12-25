import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class, ClassStatus } from '../entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../entities/class-student.entity';
import { User } from '../../users/entities/user.entity';
import { UpdateEnrollmentDto } from '../dto';

@Injectable()
export class ClassStudentService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Enroll a student to a class (by teacher)
   */
  async enrollStudent(
    classId: string,
    studentId: string,
    teacherId: string,
  ): Promise<ClassStudent> {
    // Verify class ownership
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    // Check class status
    if (classEntity.status !== ClassStatus.ACTIVE && classEntity.status !== ClassStatus.DRAFT) {
      throw new BadRequestException('Cannot enroll students to this class');
    }

    // Check max students
    const currentCount = await this.classStudentRepo.count({
      where: { classId, status: In([EnrollmentStatus.ACTIVE, EnrollmentStatus.INACTIVE]) },
    });

    if (currentCount >= classEntity.maxStudents) {
      throw new ConflictException('Class is full');
    }

    // Verify student exists
    const student = await this.userRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if already enrolled
    const existing = await this.classStudentRepo.findOne({
      where: { classId, studentId },
    });

    if (existing) {
      if (existing.status === EnrollmentStatus.DROPPED) {
        // Re-enroll
        existing.status = EnrollmentStatus.ACTIVE;
        return this.classStudentRepo.save(existing);
      }
      throw new ConflictException('Student is already enrolled in this class');
    }

    const enrollment = this.classStudentRepo.create({
      classId,
      studentId,
      status: EnrollmentStatus.ACTIVE,
    });

    return this.classStudentRepo.save(enrollment);
  }

  /**
   * Enroll multiple students at once
   */
  async enrollStudents(
    classId: string,
    studentIds: string[],
    teacherId: string,
  ): Promise<{ success: string[]; failed: { studentId: string; reason: string }[] }> {
    const success: string[] = [];
    const failed: { studentId: string; reason: string }[] = [];

    for (const studentId of studentIds) {
      try {
        await this.enrollStudent(classId, studentId, teacherId);
        success.push(studentId);
      } catch (error) {
        failed.push({
          studentId,
          reason: error.message || 'Unknown error',
        });
      }
    }

    return { success, failed };
  }

  /**
   * Remove student from class
   */
  async removeStudent(classId: string, studentId: string, teacherId: string): Promise<void> {
    // Verify class ownership
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this class');
    }

    enrollment.status = EnrollmentStatus.DROPPED;
    await this.classStudentRepo.save(enrollment);
  }

  /**
   * Update student enrollment status
   */
  async updateEnrollment(
    classId: string,
    studentId: string,
    teacherId: string,
    dto: UpdateEnrollmentDto,
  ): Promise<ClassStudent> {
    // Verify class ownership
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId },
      relations: ['student'],
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this class');
    }

    if (dto.status) {
      enrollment.status = dto.status;
    }

    return this.classStudentRepo.save(enrollment);
  }

  /**
   * Get all students in a class
   */
  async getClassStudents(
    classId: string,
    teacherId: string,
  ): Promise<ClassStudent[]> {
    // Verify class ownership
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    return this.classStudentRepo.find({
      where: { classId },
      relations: ['student'],
      order: { enrolledAt: 'DESC' },
    });
  }

  /**
   * Join class by invite code (by student)
   */
  async joinByInviteCode(studentId: string, inviteCode: string): Promise<ClassStudent> {
    const classEntity = await this.classRepo.findOne({
      where: { inviteCode, status: ClassStatus.ACTIVE },
    });

    if (!classEntity) {
      throw new NotFoundException('Invalid invite code or class is not active');
    }

    // Check max students
    const currentCount = await this.classStudentRepo.count({
      where: { classId: classEntity.id, status: In([EnrollmentStatus.ACTIVE, EnrollmentStatus.INACTIVE]) },
    });

    if (currentCount >= classEntity.maxStudents) {
      throw new ConflictException('Class is full');
    }

    // Check if already enrolled
    const existing = await this.classStudentRepo.findOne({
      where: { classId: classEntity.id, studentId },
    });

    if (existing) {
      if (existing.status === EnrollmentStatus.DROPPED) {
        existing.status = EnrollmentStatus.ACTIVE;
        return this.classStudentRepo.save(existing);
      }
      throw new ConflictException('You are already enrolled in this class');
    }

    const enrollment = this.classStudentRepo.create({
      classId: classEntity.id,
      studentId,
      status: EnrollmentStatus.ACTIVE,
    });

    return this.classStudentRepo.save(enrollment);
  }

  /**
   * Leave class (by student)
   */
  async leaveClass(classId: string, studentId: string): Promise<void> {
    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId },
    });

    if (!enrollment) {
      throw new NotFoundException('You are not enrolled in this class');
    }

    if (enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new BadRequestException('You cannot leave this class');
    }

    enrollment.status = EnrollmentStatus.DROPPED;
    await this.classStudentRepo.save(enrollment);
  }

  /**
   * Get classes for student
   */
  async getStudentClasses(studentId: string): Promise<ClassStudent[]> {
    return this.classStudentRepo.find({
      where: { studentId, status: EnrollmentStatus.ACTIVE },
      relations: ['class', 'class.teacher'],
      order: { enrolledAt: 'DESC' },
    });
  }

  /**
   * Check if student is enrolled in a class
   */
  async isEnrolled(classId: string, studentId: string): Promise<boolean> {
    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId, status: EnrollmentStatus.ACTIVE },
    });
    return !!enrollment;
  }
}
