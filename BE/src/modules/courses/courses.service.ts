import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Course,
  CourseClass,
  Document,
  RoadmapItem,
  UserCourseProgress,
  UserDevice,
  ProgressStatus,
  CourseStatus,
} from './entities';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateDocumentDto,
  CreateRoadmapItemDto,
  UpdateRoadmapItemDto,
  CreateCourseClassDto,
  UpdateCourseClassDto,
  RegisterDeviceDto,
} from './dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Document) private readonly docRepo: Repository<Document>,
    @InjectRepository(RoadmapItem)
    private readonly roadmapRepo: Repository<RoadmapItem>,
    @InjectRepository(CourseClass)
    private readonly classRepo: Repository<CourseClass>,
    @InjectRepository(UserDevice)
    private readonly deviceRepo: Repository<UserDevice>,
    @InjectRepository(UserCourseProgress)
    private readonly progressRepo: Repository<UserCourseProgress>,
  ) {}

  // Courses
  async listCourses(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const qb = this.courseRepo.createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoin('course.classes', 'classes')
      .addSelect('COALESCE(SUM(classes.students), 0)', 'totalStudents')
      .groupBy('course.id')
      .addGroupBy('instructor.id');
    
    if (query.search) {
      qb.andWhere('course.title LIKE :search', { search: `%${query.search}%` });
    }
    if (query.category) {
      qb.andWhere('course.category = :category', { category: query.category });
    }
    if (query.status && query.status !== 'all') {
      qb.andWhere('course.status = :status', { status: query.status });
    }
    qb.orderBy('course.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);
    
    const rawResults = await qb.getRawAndEntities();
    const courses = rawResults.entities.map((course, index) => ({
      ...course,
      students: Number(rawResults.raw[index]?.totalStudents || 0),
    }));
    
    // Get total count
    const totalQb = this.courseRepo.createQueryBuilder('course');
    if (query.search) {
      totalQb.andWhere('course.title LIKE :search', { search: `%${query.search}%` });
    }
    if (query.category) {
      totalQb.andWhere('course.category = :category', { category: query.category });
    }
    if (query.status && query.status !== 'all') {
      totalQb.andWhere('course.status = :status', { status: query.status });
    }
    const total = await totalQb.getCount();
    
    return {
      courses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourse(id: string) {
    const course = await this.courseRepo.findOne({ 
      where: { id },
      relations: ['instructor'],
    });
    if (!course) throw new NotFoundException('Course not found');
    
    // Calculate students from classes
    const studentsResult = await this.classRepo
      .createQueryBuilder('c')
      .select('SUM(c.students)', 'sum')
      .where('c.courseId = :courseId', { courseId: id })
      .getRawOne<{ sum: string }>();
    course.students = Number(studentsResult?.sum || 0);
    
    return course;
  }

  async createCourse(payload: CreateCourseDto) {
    const course = this.courseRepo.create(payload);
    return this.courseRepo.save(course);
  }

  async updateCourse(id: string, payload: UpdateCourseDto) {
    const course = await this.getCourse(id);
    Object.assign(course, payload);
    return this.courseRepo.save(course);
  }

  async deleteCourse(id: string) {
    const course = await this.getCourse(id);
    await this.courseRepo.remove(course);
    return { success: true };
  }

  async courseStats() {
    const totalCourses = await this.courseRepo.count();
    const activeCourses = await this.courseRepo.count({ where: { status: CourseStatus.ACTIVE } });
    
    // Calculate total students from all classes
    const totalStudentsResult = await this.classRepo
      .createQueryBuilder('c')
      .select('SUM(c.students)', 'sum')
      .getRawOne<{ sum: string }>();
    const totalStudents = Number(totalStudentsResult?.sum || 0);
    
    const avgRatingResult = await this.courseRepo
      .createQueryBuilder('c')
      .select('AVG(c.rating)', 'avg')
      .getRawOne<{ avg: string }>();
    const averageRating = Number(avgRatingResult?.avg || 0);
    return {
      totalCourses,
      activeCourses,
      totalStudents,
      averageRating,
    };
  }

  // Documents
  async listDocuments(courseId: string) {
    return this.docRepo.find({ where: { courseId } });
  }

  async addDocument(courseId: string, payload: CreateDocumentDto) {
    await this.getCourse(courseId);
    const doc = this.docRepo.create({ ...payload, courseId });
    return this.docRepo.save(doc);
  }

  async deleteDocument(id: string) {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    await this.docRepo.remove(doc);
    return { success: true };
  }

  // Roadmap
  async listRoadmap(courseId: string) {
    return this.roadmapRepo.find({
      where: { courseId },
      order: { orderIndex: 'ASC' },
    });
  }

  async addRoadmapItem(courseId: string, payload: CreateRoadmapItemDto) {
    await this.getCourse(courseId);
    const item = this.roadmapRepo.create({ ...payload, courseId });
    return this.roadmapRepo.save(item);
  }

  async updateRoadmapItem(id: string, payload: UpdateRoadmapItemDto) {
    const item = await this.roadmapRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Roadmap item not found');
    Object.assign(item, payload);
    return this.roadmapRepo.save(item);
  }

  async deleteRoadmapItem(id: string) {
    const item = await this.roadmapRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Roadmap item not found');
    await this.roadmapRepo.remove(item);
    return { success: true };
  }

  async reorderRoadmap(courseId: string, itemIds: string[]) {
    const items = await this.roadmapRepo.find({ where: { id: In(itemIds), courseId } });
    if (items.length !== itemIds.length) {
      throw new BadRequestException('Some roadmap items not found in this course');
    }
    const updates = itemIds.map((id, index) =>
      this.roadmapRepo.update({ id }, { orderIndex: index + 1 }),
    );
    await Promise.all(updates);
    return { success: true };
  }

  // Course classes
  async listClasses(courseId: string) {
    return this.classRepo.find({ where: { courseId } });
  }

  async addClass(courseId: string, payload: CreateCourseClassDto) {
    await this.getCourse(courseId);
    const classEntity = this.classRepo.create({ ...payload, courseId });
    return this.classRepo.save(classEntity);
  }

  async updateClass(id: string, payload: UpdateCourseClassDto) {
    const classEntity = await this.classRepo.findOne({ where: { id } });
    if (!classEntity) throw new NotFoundException('Class not found');
    Object.assign(classEntity, payload);
    return this.classRepo.save(classEntity);
  }

  async deleteClass(id: string) {
    const classEntity = await this.classRepo.findOne({ where: { id } });
    if (!classEntity) throw new NotFoundException('Class not found');
    await this.classRepo.remove(classEntity);
    return { success: true };
  }

  // Devices
  async listDevices(userId: string) {
    return this.deviceRepo.find({ where: { userId, isActive: true } });
  }

  async registerDevice(userId: string, limit: number, payload: RegisterDeviceDto) {
    const activeCount = await this.deviceRepo.count({ where: { userId, isActive: true } });
    if (activeCount >= limit) {
      throw new BadRequestException('DEVICE_LIMIT_REACHED');
    }
    const device = this.deviceRepo.create({ ...payload, userId });
    return this.deviceRepo.save(device);
  }

  async removeDevice(id: string, userId?: string) {
    const device = await this.deviceRepo.findOne({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    if (userId && device.userId !== userId) throw new BadRequestException('Forbidden');
    device.isActive = false;
    return this.deviceRepo.save(device);
  }

  // Progress
  async getProgress(courseId: string, userId: string) {
    const items = await this.roadmapRepo.find({ where: { courseId } });
    const progress = await this.progressRepo.find({ where: { courseId, userId } });
    const map = progress.reduce<Record<string, UserCourseProgress>>((acc, cur) => {
      acc[cur.roadmapItemId] = cur;
      return acc;
    }, {});
    const totalItems = items.length || 1;
    const completed = progress.filter((p) => p.status === ProgressStatus.COMPLETED).length;
    const overall = Math.round((completed / totalItems) * 100);
    return {
      overallPercentage: overall,
      items: items.map((item) => ({
        item,
        progress: map[item.id] || null,
      })),
    };
  }

  async completeRoadmapItem(courseId: string, roadmapItemId: string, userId: string) {
    const item = await this.roadmapRepo.findOne({ where: { id: roadmapItemId, courseId } });
    if (!item) throw new NotFoundException('Roadmap item not found');
    let progress = await this.progressRepo.findOne({
      where: { courseId, roadmapItemId, userId },
    });
    if (!progress) {
      progress = this.progressRepo.create({
        courseId,
        roadmapItemId,
        userId,
        status: ProgressStatus.IN_PROGRESS,
      });
    }
    progress.status = ProgressStatus.COMPLETED;
    progress.completedAt = new Date();
    progress.progressPercentage = 100;
    await this.progressRepo.save(progress);
    return progress;
  }
}
