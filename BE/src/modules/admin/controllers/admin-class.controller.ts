import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminClassService } from '../services/admin-class.service';
import {
  AdminClassFilterDto,
  AdminUpdateClassDto,
  AdminAssignTeacherDto,
} from '../dto/admin-class.dto';

@ApiTags('Admin - Classes')
@ApiBearerAuth()
@Controller('admin/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminClassController {
  constructor(private readonly adminClassService: AdminClassService) {}

  /**
   * Lấy danh sách tất cả lớp học (Admin)
   */
  @Get()
  @ApiOperation({ summary: 'Get all classes (Admin)' })
  @ApiResponse({ status: 200, description: 'Classes retrieved successfully' })
  async findAll(@Query() filter: AdminClassFilterDto) {
    return this.adminClassService.findAll(filter);
  }

  /**
   * Lấy chi tiết lớp học (Admin)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get class details (Admin)' })
  @ApiResponse({ status: 200, description: 'Class details retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminClassService.findOne(id);
  }

  /**
   * Lấy thống kê lớp học (Admin)
   */
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get class statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Class statistics retrieved successfully' })
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminClassService.getStats(id);
  }

  /**
   * Lấy danh sách học viên trong lớp (Admin)
   */
  @Get(':id/students')
  @ApiOperation({ summary: 'Get students in class (Admin)' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async getStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminClassService.getStudents(id, { page, limit });
  }

  /**
   * Cập nhật thông tin lớp học (Admin)
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update class (Admin)' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: AdminUpdateClassDto,
  ) {
    return this.adminClassService.update(id, updateDto);
  }

  /**
   * Gán giáo viên cho lớp (Admin)
   */
  @Put(':id/teacher')
  @ApiOperation({ summary: 'Assign teacher to class (Admin)' })
  @ApiResponse({ status: 200, description: 'Teacher assigned successfully' })
  async assignTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminAssignTeacherDto,
  ) {
    return this.adminClassService.assignTeacher(id, dto.teacherId);
  }

  /**
   * Kích hoạt lớp học (Admin)
   */
  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate class (Admin)' })
  @ApiResponse({ status: 200, description: 'Class activated successfully' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminClassService.activate(id);
  }

  /**
   * Hoàn thành lớp học (Admin)
   */
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete class (Admin)' })
  @ApiResponse({ status: 200, description: 'Class completed successfully' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminClassService.complete(id);
  }

  /**
   * Xóa lớp học (Admin)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete class (Admin)' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminClassService.remove(id);
  }

  /**
   * Xóa học viên khỏi lớp (Admin)
   */
  @Delete(':id/students/:studentId')
  @ApiOperation({ summary: 'Remove student from class (Admin)' })
  @ApiResponse({ status: 200, description: 'Student removed successfully' })
  async removeStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.adminClassService.removeStudent(id, studentId);
  }

  /**
   * Lấy báo cáo tổng quan các lớp học (Admin Dashboard)
   */
  @Get('reports/overview')
  @ApiOperation({ summary: 'Get classes overview report (Admin)' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  async getOverviewReport() {
    return this.adminClassService.getOverviewReport();
  }

  /**
   * Lấy danh sách tài liệu của lớp (Admin)
   */
  @Get(':id/materials')
  @ApiOperation({ summary: 'Get class materials (Admin)' })
  @ApiResponse({ status: 200, description: 'Materials retrieved successfully' })
  async getMaterials(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminClassService.getMaterials(id, { page, limit });
  }

  /**
   * Lấy lịch học của lớp (Admin)
   */
  @Get(':id/schedules')
  @ApiOperation({ summary: 'Get class schedules (Admin)' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  async getSchedules(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminClassService.getSchedules(id, { page, limit });
  }

  /**
   * Lấy thông báo của lớp (Admin)
   */
  @Get(':id/announcements')
  @ApiOperation({ summary: 'Get class announcements (Admin)' })
  @ApiResponse({ status: 200, description: 'Announcements retrieved successfully' })
  async getAnnouncements(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminClassService.getAnnouncements(id, { page, limit });
  }

  /**
   * Lấy danh sách bài tập của lớp (Admin)
   */
  @Get(':id/assignments')
  @ApiOperation({ summary: 'Get class assignments (Admin)' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  async getAssignments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminClassService.getAssignments(id, { page, limit, status });
  }

  /**
   * Lấy submissions cần chấm điểm (Admin)
   */
  @Get(':id/submissions')
  @ApiOperation({ summary: 'Get grading submissions (Admin)' })
  @ApiResponse({ status: 200, description: 'Submissions retrieved successfully' })
  async getGradingSubmissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('skill') skill?: string,
  ) {
    return this.adminClassService.getGradingSubmissions(id, { page, limit, status, skill });
  }
}
