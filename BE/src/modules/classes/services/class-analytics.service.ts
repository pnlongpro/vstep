import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Class } from '../entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../entities/class-student.entity';
import { ClassMaterial } from '../entities/class-material.entity';

export interface ClassAnalytics {
  classId: string;
  className: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  enrollment: {
    total: number;
    active: number;
    inactive: number;
    completed: number;
    dropped: number;
    newThisPeriod: number;
  };
  engagement: {
    averageProgress: number;
    studentsWithActivity: number;
    materialsDownloaded: number;
  };
  materials: {
    total: number;
    visible: number;
    hidden: number;
    totalDownloads: number;
  };
}

export interface TeacherDashboardStats {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  totalMaterials: number;
  classBreakdown: {
    classId: string;
    className: string;
    level: string;
    status: string;
    studentCount: number;
    materialCount: number;
  }[];
}

@Injectable()
export class ClassAnalyticsService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
    @InjectRepository(ClassMaterial)
    private readonly materialRepo: Repository<ClassMaterial>,
  ) {}

  /**
   * Get teacher dashboard statistics
   */
  async getTeacherDashboard(teacherId: string): Promise<TeacherDashboardStats> {
    // Get all classes for teacher
    const classes = await this.classRepo.find({
      where: { teacherId },
      relations: ['students', 'materials'],
    });

    const activeClasses = classes.filter((c) => c.status === 'active').length;

    let totalStudents = 0;
    let totalMaterials = 0;

    const classBreakdown = classes.map((c) => {
      const activeStudents = c.students?.filter(
        (s) => s.status === EnrollmentStatus.ACTIVE,
      ).length || 0;
      
      totalStudents += activeStudents;
      totalMaterials += c.materials?.length || 0;

      return {
        classId: c.id,
        className: c.name,
        level: c.level,
        status: c.status,
        studentCount: activeStudents,
        materialCount: c.materials?.length || 0,
      };
    });

    return {
      totalClasses: classes.length,
      activeClasses,
      totalStudents,
      totalMaterials,
      classBreakdown,
    };
  }

  /**
   * Get detailed analytics for a specific class
   */
  async getClassAnalytics(
    classId: string,
    teacherId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ClassAnalytics> {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    // Default period: last 30 days
    const periodEnd = endDate || new Date();
    const periodStart = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get enrollment stats
    const allEnrollments = await this.classStudentRepo.find({
      where: { classId },
    });

    const enrollmentStats = {
      total: allEnrollments.length,
      active: allEnrollments.filter((e) => e.status === EnrollmentStatus.ACTIVE).length,
      inactive: allEnrollments.filter((e) => e.status === EnrollmentStatus.INACTIVE).length,
      completed: allEnrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED).length,
      dropped: allEnrollments.filter((e) => e.status === EnrollmentStatus.DROPPED).length,
      newThisPeriod: allEnrollments.filter(
        (e) => e.enrolledAt >= periodStart && e.enrolledAt <= periodEnd,
      ).length,
    };

    // Get engagement stats
    const activeEnrollments = allEnrollments.filter(
      (e) => e.status === EnrollmentStatus.ACTIVE,
    );
    
    const averageProgress =
      activeEnrollments.length > 0
        ? activeEnrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) /
          activeEnrollments.length
        : 0;

    const studentsWithActivity = activeEnrollments.filter(
      (e) => e.lastActivityAt && e.lastActivityAt >= periodStart,
    ).length;

    // Get materials stats
    const materials = await this.materialRepo.find({
      where: { classId },
    });

    const materialsDownloaded = materials.reduce(
      (sum, m) => sum + (m.downloadCount || 0),
      0,
    );

    return {
      classId,
      className: classEntity.name,
      period: {
        startDate: periodStart,
        endDate: periodEnd,
      },
      enrollment: enrollmentStats,
      engagement: {
        averageProgress: Math.round(averageProgress * 100) / 100,
        studentsWithActivity,
        materialsDownloaded,
      },
      materials: {
        total: materials.length,
        visible: materials.filter((m) => m.isVisible).length,
        hidden: materials.filter((m) => !m.isVisible).length,
        totalDownloads: materialsDownloaded,
      },
    };
  }

  /**
   * Get student progress for a class
   */
  async getStudentProgress(classId: string, teacherId: string) {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    const enrollments = await this.classStudentRepo.find({
      where: { classId },
      relations: ['student'],
      order: { progress: 'DESC' },
    });

    return enrollments.map((e) => ({
      studentId: e.studentId,
      studentName: e.student
        ? `${e.student.firstName} ${e.student.lastName}`
        : 'Unknown',
      studentEmail: e.student?.email || 'Unknown',
      status: e.status,
      progress: Number(e.progress) || 0,
      enrolledAt: e.enrolledAt,
      lastActivityAt: e.lastActivityAt,
    }));
  }

  /**
   * Get top performing students across all teacher's classes
   */
  async getTopStudents(teacherId: string, limit = 10) {
    const classes = await this.classRepo.find({
      where: { teacherId },
      select: ['id'],
    });

    const classIds = classes.map((c) => c.id);

    if (classIds.length === 0) {
      return [];
    }

    const topStudents = await this.classStudentRepo
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.student', 'student')
      .leftJoinAndSelect('cs.class', 'class')
      .where('cs.classId IN (:...classIds)', { classIds })
      .andWhere('cs.status = :status', { status: EnrollmentStatus.ACTIVE })
      .orderBy('cs.progress', 'DESC')
      .limit(limit)
      .getMany();

    return topStudents.map((cs) => ({
      studentId: cs.studentId,
      studentName: cs.student
        ? `${cs.student.firstName} ${cs.student.lastName}`
        : 'Unknown',
      className: cs.class?.name || 'Unknown',
      progress: Number(cs.progress) || 0,
      lastActivityAt: cs.lastActivityAt,
    }));
  }
}
