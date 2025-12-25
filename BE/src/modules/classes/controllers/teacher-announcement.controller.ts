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
import { ClassAnnouncementService } from '../services/class-announcement.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from '../dto/class-announcement.dto';

@ApiTags('Teacher - Class Announcements')
@ApiBearerAuth()
@Controller('teacher/classes/:classId/announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
export class TeacherAnnouncementController {
  constructor(private readonly announcementService: ClassAnnouncementService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của lớp' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  async getAnnouncements(@Param('classId') classId: string) {
    return this.announcementService.getAnnouncements(classId);
  }

  @Get(':announcementId')
  @ApiOperation({ summary: 'Lấy chi tiết thông báo' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiParam({ name: 'announcementId', description: 'ID thông báo' })
  @ApiResponse({ status: 200, description: 'Chi tiết thông báo' })
  async getAnnouncement(
    @Param('classId') classId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.announcementService.getAnnouncementById(classId, announcementId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo mới' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiResponse({ status: 201, description: 'Đã tạo thông báo' })
  async createAnnouncement(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcementService.createAnnouncement(classId, req.user.id, dto);
  }

  @Put(':announcementId')
  @ApiOperation({ summary: 'Cập nhật thông báo' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiParam({ name: 'announcementId', description: 'ID thông báo' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật thông báo' })
  async updateAnnouncement(
    @Request() req,
    @Param('classId') classId: string,
    @Param('announcementId') announcementId: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.announcementService.updateAnnouncement(
      classId,
      announcementId,
      req.user.id,
      dto,
    );
  }

  @Delete(':announcementId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiParam({ name: 'announcementId', description: 'ID thông báo' })
  @ApiResponse({ status: 200, description: 'Đã xóa thông báo' })
  async deleteAnnouncement(
    @Request() req,
    @Param('classId') classId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.announcementService.deleteAnnouncement(
      classId,
      announcementId,
      req.user.id,
    );
  }

  @Post(':announcementId/toggle-pin')
  @ApiOperation({ summary: 'Ghim/bỏ ghim thông báo' })
  @ApiParam({ name: 'classId', description: 'ID lớp học' })
  @ApiParam({ name: 'announcementId', description: 'ID thông báo' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật trạng thái ghim' })
  async togglePin(
    @Request() req,
    @Param('classId') classId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.announcementService.togglePin(classId, announcementId, req.user.id);
  }
}
