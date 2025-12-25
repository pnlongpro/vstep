import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ClassMaterialService } from '../services/class-material.service';
import { CreateMaterialDto, UpdateMaterialDto } from '../dto';

@ApiTags('Teacher - Class Materials')
@ApiBearerAuth()
@Controller('teacher/classes/:classId/materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
export class TeacherMaterialController {
  constructor(private readonly materialService: ClassMaterialService) {}

  @Get()
  @ApiOperation({ summary: 'Get all materials in a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns list of materials' })
  async findAll(@Request() req, @Param('classId') classId: string) {
    const materials = await this.materialService.findAllForTeacher(
      classId,
      req.user.id,
    );
    return {
      success: true,
      data: materials,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new material (link or text)' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 201, description: 'Material created successfully' })
  async create(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: CreateMaterialDto,
  ) {
    const material = await this.materialService.create(
      classId,
      req.user.id,
      dto,
    );
    return {
      success: true,
      message: 'Material created successfully',
      data: material,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a material file' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Material uploaded successfully' })
  async upload(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: CreateMaterialDto,
    @UploadedFile() file: any,
  ) {
    // TODO: Upload file to S3 or local storage
    // For now, we'll just create the material with a placeholder
    const fileData = file
      ? {
          url: `/uploads/materials/${file.filename || file.originalname}`,
          name: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        }
      : undefined;

    const material = await this.materialService.create(
      classId,
      req.user.id,
      dto,
      fileData,
    );

    return {
      success: true,
      message: 'Material uploaded successfully',
      data: material,
    };
  }

  @Get(':materialId')
  @ApiOperation({ summary: 'Get material details' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Returns material details' })
  async findOne(@Param('materialId') materialId: string) {
    const material = await this.materialService.findById(materialId);
    return {
      success: true,
      data: material,
    };
  }

  @Put(':materialId')
  @ApiOperation({ summary: 'Update material' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Material updated successfully' })
  async update(
    @Request() req,
    @Param('materialId') materialId: string,
    @Body() dto: UpdateMaterialDto,
  ) {
    const material = await this.materialService.update(
      materialId,
      req.user.id,
      dto,
    );
    return {
      success: true,
      message: 'Material updated successfully',
      data: material,
    };
  }

  @Delete(':materialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete material' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Material deleted successfully' })
  async delete(@Request() req, @Param('materialId') materialId: string) {
    await this.materialService.delete(materialId, req.user.id);
    return {
      success: true,
      message: 'Material deleted successfully',
    };
  }

  @Post(':materialId/toggle-visibility')
  @ApiOperation({ summary: 'Toggle material visibility' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Visibility toggled successfully' })
  async toggleVisibility(
    @Request() req,
    @Param('materialId') materialId: string,
  ) {
    const material = await this.materialService.toggleVisibility(
      materialId,
      req.user.id,
    );
    return {
      success: true,
      message: material.isVisible ? 'Material is now visible' : 'Material is now hidden',
      data: material,
    };
  }
}
