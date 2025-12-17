# BE-047: Class Materials Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-047 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-044, BE-045 |

---

## 🎯 Objective

Implement material/document management for classes:
- Upload materials (PDF, DOCX, images, audio)
- Organize materials by category
- Download materials
- Delete materials
- Track download stats

---

## 📁 Files to Create

```
src/modules/classes/
├── class-materials.service.ts    # NEW
├── class-materials.controller.ts # NEW
├── dto/
│   ├── upload-material.dto.ts   # NEW
│   └── material-response.dto.ts # NEW
└── entities/
    └── class-material.entity.ts # UPDATE (add category)
```

---

## 📝 Implementation

### 1. Update Entity - class-material.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ClassEntity } from './class.entity';
import { UserEntity } from '../../users/entities/user.entity';

export enum MaterialCategory {
  DOCUMENT = 'document',
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image',
  EXERCISE = 'exercise',
  ANSWER_KEY = 'answer_key',
  OTHER = 'other',
}

@Entity('class_materials')
@Index(['classId', 'category'])
export class ClassMaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  classId: string;

  @ManyToOne(() => ClassEntity, (c) => c.materials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @Column()
  uploadedById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: UserEntity;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  originalFileName: string;

  @Column({ length: 255 })
  storagePath: string;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({
    type: 'enum',
    enum: MaterialCategory,
    default: MaterialCategory.DOCUMENT,
  })
  category: MaterialCategory;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. DTOs

#### upload-material.dto.ts

```typescript
import { IsString, IsOptional, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialCategory } from '../entities/class-material.entity';

export class UploadMaterialDto {
  @ApiProperty({ example: 'Tài liệu ôn thi VSTEP B1 - Reading' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Tổng hợp các bài đọc mẫu cho level B1' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: MaterialCategory, example: MaterialCategory.DOCUMENT })
  @IsEnum(MaterialCategory)
  category: MaterialCategory;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateMaterialDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: MaterialCategory })
  @IsOptional()
  @IsEnum(MaterialCategory)
  category?: MaterialCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class MaterialQueryDto {
  @ApiPropertyOptional({ enum: MaterialCategory })
  @IsOptional()
  @IsEnum(MaterialCategory)
  category?: MaterialCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
```

#### material-response.dto.ts

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialCategory } from '../entities/class-material.entity';

export class MaterialUploaderResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class MaterialResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  originalFileName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  fileSizeFormatted: string;

  @ApiProperty({ enum: MaterialCategory })
  category: MaterialCategory;

  @ApiProperty()
  downloadCount: number;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty()
  downloadUrl: string;

  @ApiProperty({ type: MaterialUploaderResponse })
  uploadedBy: MaterialUploaderResponse;

  @ApiProperty()
  createdAt: Date;
}

export class MaterialListResponse {
  @ApiProperty({ type: [MaterialResponse] })
  items: MaterialResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalSize: number;

  @ApiProperty()
  totalSizeFormatted: string;
}
```

### 3. class-materials.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ClassMaterialEntity, MaterialCategory } from './entities/class-material.entity';
import { ClassesRepository } from './classes.repository';
import { StorageService } from '@/core/storage/storage.service';
import { UploadMaterialDto, UpdateMaterialDto, MaterialQueryDto } from './dto/upload-material.dto';
import { MaterialResponse, MaterialListResponse } from './dto/material-response.dto';

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  // Video
  'video/mp4',
  'video/webm',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

@Injectable()
export class ClassMaterialsService {
  constructor(
    @InjectRepository(ClassMaterialEntity)
    private readonly materialRepo: Repository<ClassMaterialEntity>,
    private readonly classesRepo: ClassesRepository,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async upload(
    classId: string,
    teacherId: string,
    dto: UploadMaterialDto,
    file: Express.Multer.File,
  ): Promise<MaterialResponse> {
    // Verify class ownership
    const classEntity = await this.classesRepo.findById(classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can upload materials');
    }

    // Validate file
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 100MB limit');
    }

    // Upload to storage (S3 compatible)
    const storagePath = await this.storageService.uploadFile(
      file.buffer,
      `classes/${classId}/materials/${Date.now()}_${file.originalname}`,
      file.mimetype,
    );

    // Create material record
    const material = this.materialRepo.create({
      classId,
      uploadedById: teacherId,
      title: dto.title,
      description: dto.description,
      originalFileName: file.originalname,
      storagePath,
      mimeType: file.mimetype,
      fileSize: file.size,
      category: dto.category,
      isVisible: dto.isVisible ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });

    await this.materialRepo.save(material);

    return this.toResponse(material);
  }

  async findAll(
    classId: string,
    userId: string,
    isTeacher: boolean,
    query: MaterialQueryDto,
  ): Promise<MaterialListResponse> {
    const classEntity = await this.classesRepo.findById(classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Build query
    const qb = this.materialRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.uploadedBy', 'uploader')
      .where('m.classId = :classId', { classId });

    // Students can only see visible materials
    if (!isTeacher) {
      qb.andWhere('m.isVisible = true');
    }

    if (query.category) {
      qb.andWhere('m.category = :category', { category: query.category });
    }

    if (query.search) {
      qb.andWhere('(m.title LIKE :search OR m.description LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy('m.sortOrder', 'ASC').addOrderBy('m.createdAt', 'DESC');

    const items = await qb.getMany();

    const totalSize = items.reduce((sum, m) => sum + Number(m.fileSize), 0);

    return {
      items: items.map((m) => this.toResponse(m)),
      total: items.length,
      totalSize,
      totalSizeFormatted: this.formatFileSize(totalSize),
    };
  }

  async findOne(materialId: string, userId: string): Promise<MaterialResponse> {
    const material = await this.materialRepo.findOne({
      where: { id: materialId },
      relations: ['uploadedBy', 'class'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return this.toResponse(material);
  }

  async getDownloadUrl(
    materialId: string,
    userId: string,
  ): Promise<{ url: string; filename: string }> {
    const material = await this.materialRepo.findOne({
      where: { id: materialId },
      relations: ['class'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Increment download count
    await this.materialRepo.increment({ id: materialId }, 'downloadCount', 1);

    // Generate signed URL
    const url = await this.storageService.getSignedUrl(
      material.storagePath,
      3600, // 1 hour expiry
    );

    return {
      url,
      filename: material.originalFileName,
    };
  }

  async update(
    materialId: string,
    teacherId: string,
    dto: UpdateMaterialDto,
  ): Promise<MaterialResponse> {
    const material = await this.materialRepo.findOne({
      where: { id: materialId },
      relations: ['class'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    if (material.class.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can update materials');
    }

    Object.assign(material, dto);
    await this.materialRepo.save(material);

    return this.toResponse(material);
  }

  async delete(materialId: string, teacherId: string): Promise<void> {
    const material = await this.materialRepo.findOne({
      where: { id: materialId },
      relations: ['class'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    if (material.class.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can delete materials');
    }

    // Delete from storage
    await this.storageService.deleteFile(material.storagePath);

    // Delete record
    await this.materialRepo.remove(material);
  }

  async reorderMaterials(
    classId: string,
    teacherId: string,
    orderMap: { id: string; sortOrder: number }[],
  ): Promise<void> {
    const classEntity = await this.classesRepo.findById(classId);
    if (!classEntity || classEntity.teacherId !== teacherId) {
      throw new ForbiddenException('Only the class teacher can reorder materials');
    }

    for (const item of orderMap) {
      await this.materialRepo.update(item.id, { sortOrder: item.sortOrder });
    }
  }

  private toResponse(entity: ClassMaterialEntity): MaterialResponse {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      originalFileName: entity.originalFileName,
      mimeType: entity.mimeType,
      fileSize: Number(entity.fileSize),
      fileSizeFormatted: this.formatFileSize(Number(entity.fileSize)),
      category: entity.category,
      downloadCount: entity.downloadCount,
      isVisible: entity.isVisible,
      downloadUrl: `/api/classes/materials/${entity.id}/download`,
      uploadedBy: entity.uploadedBy
        ? {
            id: entity.uploadedBy.id,
            name: entity.uploadedBy.name,
          }
        : null,
      createdAt: entity.createdAt,
    };
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
```

### 4. class-materials.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ClassMaterialsService } from './class-materials.service';
import { UploadMaterialDto, UpdateMaterialDto, MaterialQueryDto } from './dto/upload-material.dto';
import { MaterialResponse, MaterialListResponse } from './dto/material-response.dto';
import { UserPayload } from '@/shared/types/user-payload.type';

@ApiTags('Class Materials')
@Controller('classes/:classId/materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassMaterialsController {
  constructor(private readonly materialsService: ClassMaterialsService) {}

  @Post()
  @Roles('teacher', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a material to class' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string', enum: ['document', 'audio', 'video', 'image', 'exercise', 'answer_key', 'other'] },
        isVisible: { type: 'boolean' },
      },
      required: ['file', 'title', 'category'],
    },
  })
  @ApiResponse({ status: 201, type: MaterialResponse })
  async upload(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMaterialDto,
  ): Promise<MaterialResponse> {
    return this.materialsService.upload(classId, user.id, dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials in a class' })
  @ApiResponse({ status: 200, type: MaterialListResponse })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
    @Query() query: MaterialQueryDto,
  ): Promise<MaterialListResponse> {
    const isTeacher = user.roles?.includes('teacher') || user.roles?.includes('admin');
    return this.materialsService.findAll(classId, user.id, isTeacher, query);
  }

  @Get(':materialId')
  @ApiOperation({ summary: 'Get material details' })
  @ApiResponse({ status: 200, type: MaterialResponse })
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('materialId') materialId: string,
  ): Promise<MaterialResponse> {
    return this.materialsService.findOne(materialId, user.id);
  }

  @Get(':materialId/download')
  @ApiOperation({ summary: 'Get download URL for material' })
  async download(
    @CurrentUser() user: UserPayload,
    @Param('materialId') materialId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { url, filename } = await this.materialsService.getDownloadUrl(
      materialId,
      user.id,
    );
    res.redirect(url);
  }

  @Put(':materialId')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Update material metadata' })
  @ApiResponse({ status: 200, type: MaterialResponse })
  async update(
    @CurrentUser() user: UserPayload,
    @Param('materialId') materialId: string,
    @Body() dto: UpdateMaterialDto,
  ): Promise<MaterialResponse> {
    return this.materialsService.update(materialId, user.id, dto);
  }

  @Delete(':materialId')
  @Roles('teacher', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a material' })
  async delete(
    @CurrentUser() user: UserPayload,
    @Param('materialId') materialId: string,
  ): Promise<void> {
    return this.materialsService.delete(materialId, user.id);
  }

  @Post('reorder')
  @Roles('teacher', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reorder materials' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          sortOrder: { type: 'number' },
        },
      },
    },
  })
  async reorder(
    @CurrentUser() user: UserPayload,
    @Param('classId') classId: string,
    @Body() orderMap: { id: string; sortOrder: number }[],
  ): Promise<void> {
    return this.materialsService.reorderMaterials(classId, user.id, orderMap);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Upload file with metadata (title, description, category)
- [ ] Validate file type and size (max 100MB)
- [ ] Store files in S3-compatible storage
- [ ] List materials by category with search
- [ ] Download with signed URL
- [ ] Track download count
- [ ] Update material metadata
- [ ] Delete material (file + record)
- [ ] Reorder materials
- [ ] Students see only visible materials
- [ ] Teachers see all materials

---

## 🔐 Security Considerations

1. **File Validation**
   - Whitelist allowed MIME types
   - Check actual file content, not just extension
   - Limit file size to 100MB

2. **Access Control**
   - Only enrolled students can download
   - Only class teacher can upload/edit/delete
   - Signed URLs expire after 1 hour

3. **Storage**
   - Files stored with randomized names
   - Organized by class ID
   - Consider encryption at rest

---

## 🧪 Test Cases

```typescript
describe('ClassMaterialsService', () => {
  describe('upload', () => {
    it('should upload valid file');
    it('should reject invalid MIME type');
    it('should reject oversized file');
    it('should reject non-teacher');
  });

  describe('download', () => {
    it('should return signed URL');
    it('should increment download count');
    it('should hide invisible from students');
  });

  describe('delete', () => {
    it('should remove file from storage');
    it('should remove database record');
  });
});
```
