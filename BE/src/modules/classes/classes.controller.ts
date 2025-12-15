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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InviteStudentsDto } from './dto/invite-students.dto';
import { JoinClassDto } from './dto/join-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@ApiTags('classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Tạo lớp học mới (Teacher/Admin)' })
  async createClass(@Request() req, @Body() dto: CreateClassDto) {
    return this.classesService.createClass(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lớp học' })
  async getClasses(
    @Request() req,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.classesService.getClasses(req.user.userId, req.user.role, {
      role,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lớp học' })
  async getClassDetails(@Request() req, @Param('id') id: string) {
    return this.classesService.getClassDetails(id, req.user.userId);
  }

  @Put(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Cập nhật lớp học (Teacher/Admin)' })
  async updateClass(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
  ) {
    return this.classesService.updateClass(id, req.user.userId, dto);
  }

  @Delete(':id')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Xóa lớp học (Teacher/Admin)' })
  async deleteClass(@Request() req, @Param('id') id: string) {
    return this.classesService.deleteClass(id, req.user.userId);
  }

  @Post(':id/invite')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Mời học viên vào lớp' })
  async inviteStudents(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: InviteStudentsDto,
  ) {
    return this.classesService.inviteStudents(id, req.user.userId, dto);
  }

  @Post('join')
  @Roles('student')
  @ApiOperation({ summary: 'Tham gia lớp bằng code (Student)' })
  async joinClass(@Request() req, @Body() dto: JoinClassDto) {
    return this.classesService.joinClass(req.user.userId, dto);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Lấy danh sách học viên trong lớp' })
  async getClassStudents(@Request() req, @Param('id') id: string) {
    return this.classesService.getClassStudents(id, req.user.userId);
  }

  @Delete(':id/students/:studentId')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Xóa học viên khỏi lớp' })
  async removeStudent(
    @Request() req,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(id, req.user.userId, studentId);
  }

  // Schedule Management
  @Post(':id/schedule')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Thêm lịch học' })
  async createSchedule(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.classesService.createSchedule(id, req.user.userId, dto);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Lấy lịch học của lớp' })
  async getClassSchedule(
    @Request() req,
    @Param('id') id: string,
    @Query('month') month?: string,
  ) {
    return this.classesService.getClassSchedule(id, req.user.userId, month);
  }

  // Attendance
  @Post(':id/attendance')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Điểm danh' })
  async markAttendance(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.classesService.markAttendance(id, req.user.userId, dto);
  }

  @Get(':id/attendance')
  @ApiOperation({ summary: 'Lấy dữ liệu điểm danh' })
  async getAttendance(
    @Request() req,
    @Param('id') id: string,
    @Query('month') month?: string,
  ) {
    return this.classesService.getAttendance(id, req.user.userId, month);
  }
}
