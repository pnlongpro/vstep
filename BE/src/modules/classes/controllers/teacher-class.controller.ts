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
import { ClassService } from '../services/class.service';
import { CreateClassDto, UpdateClassDto, ClassQueryDto } from '../dto';

@ApiTags('Teacher - Classes')
@ApiBearerAuth()
@Controller('teacher/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
export class TeacherClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  async create(@Request() req, @Body() dto: CreateClassDto) {
    const classEntity = await this.classService.create(req.user.id, dto);
    return {
      success: true,
      message: 'Class created successfully',
      data: classEntity,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes for teacher' })
  @ApiResponse({ status: 200, description: 'Returns list of classes' })
  async findAll(@Request() req, @Query() query: ClassQueryDto) {
    const result = await this.classService.findByTeacher(req.user.id, query);
    return {
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  @Get(':classId')
  @ApiOperation({ summary: 'Get class details' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns class details' })
  async findOne(@Request() req, @Param('classId') classId: string) {
    const classEntity = await this.classService.findById(classId, req.user.id);
    return {
      success: true,
      data: classEntity,
    };
  }

  @Put(':classId')
  @ApiOperation({ summary: 'Update class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  async update(
    @Request() req,
    @Param('classId') classId: string,
    @Body() dto: UpdateClassDto,
  ) {
    const classEntity = await this.classService.update(classId, req.user.id, dto);
    return {
      success: true,
      message: 'Class updated successfully',
      data: classEntity,
    };
  }

  @Delete(':classId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  async delete(@Request() req, @Param('classId') classId: string) {
    await this.classService.delete(classId, req.user.id);
    return {
      success: true,
      message: 'Class deleted successfully',
    };
  }

  @Post(':classId/activate')
  @ApiOperation({ summary: 'Activate a draft class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class activated successfully' })
  async activate(@Request() req, @Param('classId') classId: string) {
    const classEntity = await this.classService.activate(classId, req.user.id);
    return {
      success: true,
      message: 'Class activated successfully',
      data: classEntity,
    };
  }

  @Post(':classId/complete')
  @ApiOperation({ summary: 'Mark class as completed' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class completed successfully' })
  async complete(@Request() req, @Param('classId') classId: string) {
    const classEntity = await this.classService.complete(classId, req.user.id);
    return {
      success: true,
      message: 'Class completed successfully',
      data: classEntity,
    };
  }

  @Post(':classId/regenerate-code')
  @ApiOperation({ summary: 'Regenerate invite code' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Invite code regenerated' })
  async regenerateCode(@Request() req, @Param('classId') classId: string) {
    const inviteCode = await this.classService.regenerateInviteCode(
      classId,
      req.user.id,
    );
    return {
      success: true,
      message: 'Invite code regenerated successfully',
      data: { inviteCode },
    };
  }

  @Get(':classId/stats')
  @ApiOperation({ summary: 'Get class statistics' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Returns class statistics' })
  async getStats(@Request() req, @Param('classId') classId: string) {
    const stats = await this.classService.getStats(classId, req.user.id);
    return {
      success: true,
      data: stats,
    };
  }
}
