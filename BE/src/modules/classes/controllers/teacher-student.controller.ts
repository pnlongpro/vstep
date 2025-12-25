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
import { ClassStudentService } from '../services/class-student.service';
import {
  EnrollStudentDto,
  EnrollStudentsDto,
  UpdateEnrollmentDto,
} from '../dto';

@ApiTags('Teacher - Class Students')
@ApiBearerAuth()
@Controller('teacher/classes/:classId/students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
export class TeacherStudentController {
  constructor(private readonly classStudentService: ClassStudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students in a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns list of students' })
  async getStudents(@Request() req, @Param('classId') classId: string) {
    const students = await this.classStudentService.getClassStudents(
      classId,
      req.user.id,
    );
    return {
      success: true,
      data: students,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Enroll a student to class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully' })
  async enrollStudent(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: EnrollStudentDto,
  ) {
    const enrollment = await this.classStudentService.enrollStudent(
      classId,
      dto.studentId,
      req.user.id,
    );
    return {
      success: true,
      message: 'Student enrolled successfully',
      data: enrollment,
    };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Enroll multiple students at once' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 201, description: 'Bulk enrollment result' })
  async enrollStudents(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: EnrollStudentsDto,
  ) {
    const result = await this.classStudentService.enrollStudents(
      classId,
      dto.studentIds,
      req.user.id,
    );
    return {
      success: true,
      message: `Enrolled ${result.success.length} students, ${result.failed.length} failed`,
      data: result,
    };
  }

  @Put(':studentId')
  @ApiOperation({ summary: 'Update student enrollment status' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully' })
  async updateEnrollment(
    @Request() req,
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    const enrollment = await this.classStudentService.updateEnrollment(
      classId,
      studentId,
      req.user.id,
      dto,
    );
    return {
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    };
  }

  @Delete(':studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove student from class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student removed successfully' })
  async removeStudent(
    @Request() req,
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    await this.classStudentService.removeStudent(classId, studentId, req.user.id);
    return {
      success: true,
      message: 'Student removed from class successfully',
    };
  }
}
