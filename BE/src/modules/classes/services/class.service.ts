import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, ClassStatus } from '../entities/class.entity';
import { ClassStudent, EnrollmentStatus } from '../entities/class-student.entity';
import { CreateClassDto, UpdateClassDto, ClassQueryDto } from '../dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
  ) {}

  /**
   * Generate unique invite code
   */
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new class
   */
  async create(teacherId: string, dto: CreateClassDto): Promise<Class> {
    // Generate unique invite code
    let inviteCode: string;
    let isUnique = false;
    while (!isUnique) {
      inviteCode = this.generateInviteCode();
      const existing = await this.classRepo.findOne({ where: { inviteCode } });
      if (!existing) isUnique = true;
    }

    const classEntity = this.classRepo.create({
      ...dto,
      teacherId,
      inviteCode,
      status: ClassStatus.DRAFT,
    });

    return this.classRepo.save(classEntity);
  }

  /**
   * Get all classes by teacher
   */
  async findByTeacher(
    teacherId: string,
    query: ClassQueryDto,
  ): Promise<{ data: Class[]; total: number; page: number; limit: number }> {
    const { level, status, page = 1, limit = 10 } = query;

    const qb = this.classRepo
      .createQueryBuilder('class')
      .where('class.teacherId = :teacherId', { teacherId })
      .leftJoinAndSelect('class.students', 'students')
      .orderBy('class.createdAt', 'DESC');

    if (level) {
      qb.andWhere('class.level = :level', { level });
    }

    if (status) {
      qb.andWhere('class.status = :status', { status });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  /**
   * Get class by ID with details
   */
  async findById(classId: string, teacherId?: string): Promise<Class> {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['teacher', 'students', 'students.student', 'materials'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // If teacherId provided, verify ownership
    if (teacherId && classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('You do not have access to this class');
    }

    return classEntity;
  }

  /**
   * Update class
   */
  async update(classId: string, teacherId: string, dto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findById(classId, teacherId);

    Object.assign(classEntity, dto);

    return this.classRepo.save(classEntity);
  }

  /**
   * Delete class
   */
  async delete(classId: string, teacherId: string): Promise<void> {
    const classEntity = await this.findById(classId, teacherId);

    // Check if class has active students
    const activeStudents = await this.classStudentRepo.count({
      where: { classId, status: EnrollmentStatus.ACTIVE },
    });

    if (activeStudents > 0) {
      throw new ConflictException(
        'Cannot delete class with active students. Please remove all students first.',
      );
    }

    await this.classRepo.remove(classEntity);
  }

  /**
   * Activate class (change from draft to active)
   */
  async activate(classId: string, teacherId: string): Promise<Class> {
    const classEntity = await this.findById(classId, teacherId);

    if (classEntity.status !== ClassStatus.DRAFT) {
      throw new ConflictException('Only draft classes can be activated');
    }

    classEntity.status = ClassStatus.ACTIVE;
    return this.classRepo.save(classEntity);
  }

  /**
   * Complete class
   */
  async complete(classId: string, teacherId: string): Promise<Class> {
    const classEntity = await this.findById(classId, teacherId);

    classEntity.status = ClassStatus.COMPLETED;

    // Also mark all students as completed
    await this.classStudentRepo.update(
      { classId, status: EnrollmentStatus.ACTIVE },
      { status: EnrollmentStatus.COMPLETED },
    );

    return this.classRepo.save(classEntity);
  }

  /**
   * Regenerate invite code
   */
  async regenerateInviteCode(classId: string, teacherId: string): Promise<string> {
    const classEntity = await this.findById(classId, teacherId);

    let inviteCode: string;
    let isUnique = false;
    while (!isUnique) {
      inviteCode = this.generateInviteCode();
      const existing = await this.classRepo.findOne({ where: { inviteCode } });
      if (!existing) isUnique = true;
    }

    classEntity.inviteCode = inviteCode;
    await this.classRepo.save(classEntity);

    return inviteCode;
  }

  /**
   * Find class by invite code
   */
  async findByInviteCode(inviteCode: string): Promise<Class> {
    const classEntity = await this.classRepo.findOne({
      where: { inviteCode, status: ClassStatus.ACTIVE },
      relations: ['teacher'],
    });

    if (!classEntity) {
      throw new NotFoundException('Invalid invite code or class is not active');
    }

    return classEntity;
  }

  /**
   * Get class statistics
   */
  async getStats(classId: string, teacherId: string) {
    const classEntity = await this.findById(classId, teacherId);

    const studentStats = await this.classStudentRepo
      .createQueryBuilder('cs')
      .select('cs.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('cs.classId = :classId', { classId })
      .groupBy('cs.status')
      .getRawMany();

    const statusCounts = studentStats.reduce(
      (acc, curr) => {
        acc[curr.status] = parseInt(curr.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      classId,
      name: classEntity.name,
      level: classEntity.level,
      status: classEntity.status,
      maxStudents: classEntity.maxStudents,
      students: {
        total:
          (statusCounts.active || 0) +
          (statusCounts.inactive || 0) +
          (statusCounts.completed || 0) +
          (statusCounts.dropped || 0),
        active: statusCounts.active || 0,
        inactive: statusCounts.inactive || 0,
        completed: statusCounts.completed || 0,
        dropped: statusCounts.dropped || 0,
      },
      materialsCount: classEntity.materials?.length || 0,
    };
  }
}
