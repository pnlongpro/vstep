import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateDocumentDto,
  CreateRoadmapItemDto,
  UpdateRoadmapItemDto,
  ReorderRoadmapDto,
  CreateCourseClassDto,
  UpdateCourseClassDto,
  RegisterDeviceDto,
} from './dto';

@Controller('api')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Courses
  @Get('courses')
  listCourses(@Query() query: any) {
    return this.coursesService.listCourses(query);
  }

  @Get('courses/stats')
  stats() {
    return this.coursesService.courseStats();
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.coursesService.getCourse(id);
  }

  @Post('courses')
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Put('courses/:id')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  // Documents
  @Get('courses/:courseId/documents')
  listDocuments(@Param('courseId') courseId: string) {
    return this.coursesService.listDocuments(courseId);
  }

  @Post('courses/:courseId/documents')
  addDocument(@Param('courseId') courseId: string, @Body() dto: CreateDocumentDto) {
    return this.coursesService.addDocument(courseId, dto);
  }

  @Delete('documents/:id')
  deleteDocument(@Param('id') id: string) {
    return this.coursesService.deleteDocument(id);
  }

  // Roadmap
  @Get('courses/:courseId/roadmap')
  listRoadmap(@Param('courseId') courseId: string) {
    return this.coursesService.listRoadmap(courseId);
  }

  @Post('courses/:courseId/roadmap')
  addRoadmapItem(
    @Param('courseId') courseId: string,
    @Body() dto: CreateRoadmapItemDto,
  ) {
    return this.coursesService.addRoadmapItem(courseId, dto);
  }

  @Put('roadmap/:id')
  updateRoadmapItem(@Param('id') id: string, @Body() dto: UpdateRoadmapItemDto) {
    return this.coursesService.updateRoadmapItem(id, dto);
  }

  @Delete('roadmap/:id')
  deleteRoadmapItem(@Param('id') id: string) {
    return this.coursesService.deleteRoadmapItem(id);
  }

  @Put('courses/:courseId/roadmap/reorder')
  reorderRoadmap(
    @Param('courseId') courseId: string,
    @Body() dto: ReorderRoadmapDto,
  ) {
    return this.coursesService.reorderRoadmap(courseId, dto.itemIds);
  }

  // Classes
  @Get('courses/:courseId/classes')
  listClasses(@Param('courseId') courseId: string) {
    return this.coursesService.listClasses(courseId);
  }

  @Post('courses/:courseId/classes')
  addClass(@Param('courseId') courseId: string, @Body() dto: CreateCourseClassDto) {
    return this.coursesService.addClass(courseId, dto);
  }

  @Put('classes/:id')
  updateClass(@Param('id') id: string, @Body() dto: UpdateCourseClassDto) {
    return this.coursesService.updateClass(id, dto);
  }

  @Delete('classes/:id')
  deleteClass(@Param('id') id: string) {
    return this.coursesService.deleteClass(id);
  }

  // Devices
  @Get('users/:userId/devices')
  listDevices(@Param('userId') userId: string) {
    return this.coursesService.listDevices(userId);
  }

  @Post('users/:userId/devices')
  registerDevice(
    @Param('userId') userId: string,
    @Body() dto: RegisterDeviceDto & { limit?: number },
  ) {
    const limit = dto.limit ?? 2;
    return this.coursesService.registerDevice(userId, limit, dto);
  }

  @Delete('devices/:id')
  removeDevice(@Param('id') id: string) {
    return this.coursesService.removeDevice(id);
  }

  // Progress
  @Get('courses/:courseId/progress/:userId')
  getProgress(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.coursesService.getProgress(courseId, userId);
  }

  @Post('courses/:courseId/progress/:roadmapItemId/complete')
  completeRoadmap(
    @Param('courseId') courseId: string,
    @Param('roadmapItemId') roadmapItemId: string,
    @Body('userId') userId: string,
  ) {
    return this.coursesService.completeRoadmapItem(courseId, roadmapItemId, userId);
  }
}
