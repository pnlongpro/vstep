import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';
import { ClassMaterial, MaterialType } from '../entities/class-material.entity';
import { ClassStudent, EnrollmentStatus } from '../entities/class-student.entity';
import { CreateMaterialDto, UpdateMaterialDto } from '../dto';

@Injectable()
export class ClassMaterialService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(ClassMaterial)
    private readonly materialRepo: Repository<ClassMaterial>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepo: Repository<ClassStudent>,
  ) {}

  /**
   * Verify teacher owns the class
   */
  private async verifyTeacherAccess(classId: string, teacherId: string): Promise<Class> {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId, teacherId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found or you do not have access');
    }

    return classEntity;
  }

  /**
   * Verify student is enrolled in the class
   */
  private async verifyStudentAccess(classId: string, studentId: string): Promise<void> {
    const enrollment = await this.classStudentRepo.findOne({
      where: { classId, studentId, status: EnrollmentStatus.ACTIVE },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this class');
    }
  }

  /**
   * Create material (by teacher)
   */
  async create(
    classId: string,
    teacherId: string,
    dto: CreateMaterialDto,
    file?: { url: string; name: string; size: number; mimeType: string },
  ): Promise<ClassMaterial> {
    await this.verifyTeacherAccess(classId, teacherId);

    const material = this.materialRepo.create({
      classId,
      uploadedBy: teacherId,
      title: dto.title,
      description: dto.description,
      type: dto.type || MaterialType.DOCUMENT,
      fileUrl: file?.url || dto.fileUrl,
      fileName: file?.name,
      fileSize: file?.size,
      mimeType: file?.mimeType,
    });

    return this.materialRepo.save(material);
  }

  /**
   * Get all materials in a class (for teacher)
   */
  async findAllForTeacher(classId: string, teacherId: string): Promise<ClassMaterial[]> {
    await this.verifyTeacherAccess(classId, teacherId);

    return this.materialRepo.find({
      where: { classId },
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get visible materials (for student)
   */
  async findAllForStudent(classId: string, studentId: string): Promise<ClassMaterial[]> {
    await this.verifyStudentAccess(classId, studentId);

    return this.materialRepo.find({
      where: { classId, isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get single material
   */
  async findById(materialId: string): Promise<ClassMaterial> {
    const material = await this.materialRepo.findOne({
      where: { id: materialId },
      relations: ['uploader', 'class'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  /**
   * Update material
   */
  async update(
    materialId: string,
    teacherId: string,
    dto: UpdateMaterialDto,
  ): Promise<ClassMaterial> {
    const material = await this.findById(materialId);

    await this.verifyTeacherAccess(material.classId, teacherId);

    Object.assign(material, dto);

    return this.materialRepo.save(material);
  }

  /**
   * Delete material
   */
  async delete(materialId: string, teacherId: string): Promise<void> {
    const material = await this.findById(materialId);

    await this.verifyTeacherAccess(material.classId, teacherId);

    // TODO: Delete file from storage if exists
    // if (material.fileUrl) {
    //   await this.storageService.delete(material.fileUrl);
    // }

    await this.materialRepo.remove(material);
  }

  /**
   * Toggle visibility
   */
  async toggleVisibility(materialId: string, teacherId: string): Promise<ClassMaterial> {
    const material = await this.findById(materialId);

    await this.verifyTeacherAccess(material.classId, teacherId);

    material.isVisible = !material.isVisible;

    return this.materialRepo.save(material);
  }

  /**
   * Track download
   */
  async trackDownload(materialId: string, userId: string): Promise<void> {
    const material = await this.findById(materialId);

    // Verify user has access (either teacher or enrolled student)
    const classEntity = await this.classRepo.findOne({
      where: { id: material.classId },
    });

    if (classEntity.teacherId !== userId) {
      await this.verifyStudentAccess(material.classId, userId);

      if (!material.isVisible) {
        throw new ForbiddenException('This material is not available');
      }
    }

    material.downloadCount += 1;
    await this.materialRepo.save(material);
  }
}
