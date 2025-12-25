import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ClassStudentService } from '../services/class-student.service';
import { ClassMaterialService } from '../services/class-material.service';
import { ClassService } from '../services/class.service';
import { ClassAnnouncementService } from '../services/class-announcement.service';
import { JoinByCodeDto } from '../dto';

@ApiTags('Student - Classes')
@ApiBearerAuth()
@Controller('student/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('student', 'teacher', 'admin')
export class StudentClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly classStudentService: ClassStudentService,
    private readonly materialService: ClassMaterialService,
    private readonly announcementService: ClassAnnouncementService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my enrolled classes' })
  @ApiResponse({ status: 200, description: 'Returns list of enrolled classes' })
  async getMyClasses(@Request() req) {
    const enrollments = await this.classStudentService.getStudentClasses(req.user.id);
    return {
      success: true,
      data: enrollments,
    };
  }

  @Post('join')
  @ApiOperation({ summary: 'Join class by invite code' })
  @ApiResponse({ status: 201, description: 'Joined class successfully' })
  async joinByCode(@Request() req, @Body() dto: JoinByCodeDto) {
    const enrollment = await this.classStudentService.joinByInviteCode(
      req.user.id,
      dto.inviteCode,
    );
    return {
      success: true,
      message: 'Joined class successfully',
      data: enrollment,
    };
  }

  @Get('preview/:inviteCode')
  @ApiOperation({ summary: 'Preview class by invite code before joining' })
  @ApiParam({ name: 'inviteCode', description: 'Class invite code' })
  @ApiResponse({ status: 200, description: 'Returns class preview' })
  async previewClass(@Param('inviteCode') inviteCode: string) {
    const classEntity = await this.classService.findByInviteCode(inviteCode);
    return {
      success: true,
      data: {
        id: classEntity.id,
        name: classEntity.name,
        description: classEntity.description,
        level: classEntity.level,
        teacher: {
          id: classEntity.teacher.id,
          name: `${classEntity.teacher.firstName} ${classEntity.teacher.lastName}`,
        },
        startDate: classEntity.startDate,
        endDate: classEntity.endDate,
        schedule: classEntity.schedule,
      },
    };
  }

  @Get(':classId')
  @ApiOperation({ summary: 'Get class details (as enrolled student)' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns class details' })
  async getClassDetails(@Request() req, @Param('classId') classId: string) {
    // Verify enrollment
    const isEnrolled = await this.classStudentService.isEnrolled(
      classId,
      req.user.id,
    );

    if (!isEnrolled) {
      return {
        success: false,
        message: 'You are not enrolled in this class',
      };
    }

    const classEntity = await this.classService.findById(classId);
    return {
      success: true,
      data: classEntity,
    };
  }

  @Get(':classId/materials')
  @ApiOperation({ summary: 'Get class materials (as enrolled student)' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns class materials' })
  async getMaterials(@Request() req, @Param('classId') classId: string) {
    const materials = await this.materialService.findAllForStudent(
      classId,
      req.user.id,
    );
    return {
      success: true,
      data: materials,
    };
  }

  @Post(':classId/materials/:materialId/download')
  @ApiOperation({ summary: 'Track material download' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Download tracked' })
  async trackDownload(
    @Request() req,
    @Param('materialId') materialId: string,
  ) {
    await this.materialService.trackDownload(materialId, req.user.id);
    return {
      success: true,
      message: 'Download tracked',
    };
  }

  @Delete(':classId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Left class successfully' })
  async leaveClass(@Request() req, @Param('classId') classId: string) {
    await this.classStudentService.leaveClass(classId, req.user.id);
    return {
      success: true,
      message: 'Left class successfully',
    };
  }

  @Get(':classId/announcements')
  @ApiOperation({ summary: 'Get class announcements (as enrolled student)' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns class announcements' })
  async getAnnouncements(@Request() req, @Param('classId') classId: string) {
    return this.announcementService.getAnnouncements(classId, req.user.id);
  }
}
