import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserManagementService } from '../services/user-management.service';
import {
  UserFilterDto,
  UpdateUserStatusDto,
  BulkUserActionDto,
  AssignRoleDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateDeviceLimitDto,
  UpdateExpiryDto,
  UpdateTeacherDto,
} from '../dto/user-management.dto';

@ApiTags('Admin - User Management')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UserManagementController {
    @Get('export')
    @ApiOperation({ summary: 'Export users as CSV' })
    async exportUsers(@Query() filter: UserFilterDto, @Req() req: any, @Res() res: any) {
      const csvBuffer = await this.userManagementService.exportUsers(filter, req.user.id);
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users_export.csv"',
      });
      res.send(csvBuffer);
    }
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get()
  @ApiOperation({ summary: 'List all users with filters' })
  async findAll(@Query() filter: UserFilterDto) {
    return this.userManagementService.findAll(filter);
  }

  @Get('free')
  @ApiOperation({ summary: 'List all free account users with usage and limits' })
  async findFreeUsers(@Query() filter: UserFilterDto) {
    return this.userManagementService.findFreeUsers(filter);
  }

  @Get('free/statistics')
  @ApiOperation({ summary: 'Get free account statistics' })
  async getFreeAccountStats() {
    return this.userManagementService.getFreeAccountStats();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get user statistics' })
  async getStatistics() {
    return this.userManagementService.getStatistics();
  }

  // ========== Teacher Management ==========
  // NOTE: These routes MUST be before :id routes to avoid conflicts

  @Get('teachers')
  @ApiOperation({ summary: 'List all teachers with filters' })
  async findTeachers(@Query() filter: UserFilterDto) {
    return this.userManagementService.findTeachers(filter);
  }

  @Get('teachers/statistics')
  @ApiOperation({ summary: 'Get teacher statistics' })
  async getTeacherStats() {
    return this.userManagementService.getTeacherStats();
  }

  @Post('teachers')
  @ApiOperation({ summary: 'Create new teacher' })
  async createTeacher(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.userManagementService.createTeacher(dto, req.user.id);
  }

  @Put('teachers/:id/status')
  @ApiOperation({ summary: 'Update teacher status' })
  async updateTeacherStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateTeacherStatus(id, dto.status, req.user.id);
  }

  @Put('teachers/:id')
  @ApiOperation({ summary: 'Update teacher information' })
  async updateTeacher(
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateTeacher(id, dto, req.user.id);
  }

  @Post('teachers/bulk-action')
  @ApiOperation({ summary: 'Perform bulk action on teachers' })
  async bulkTeacherAction(@Body() dto: BulkUserActionDto, @Req() req: any) {
    return this.userManagementService.bulkTeacherAction(
      dto.userIds,
      dto.action as 'activate' | 'deactivate' | 'delete',
      req.user.id,
    );
  }

  // ========== User CRUD (with :id param) ==========

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  async findById(@Param('id') id: string) {
    return this.userManagementService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.userManagementService.createUser(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user details' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateUser(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    await this.userManagementService.deleteUser(id, req.user.id);
    return { message: 'User deleted successfully' };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateStatus(id, dto, req.user.id);
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Perform bulk action on users' })
  async bulkAction(@Body() dto: BulkUserActionDto, @Req() req: any) {
    return this.userManagementService.bulkAction(dto, req.user.id);
  }

  @Post('assign-role')
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRole(@Body() dto: AssignRoleDto, @Req() req: any) {
    return this.userManagementService.assignRole(dto, req.user.id);
  }

  // ========== Session/Device Management ==========

  @Post(':id/reset-sessions')
  @ApiOperation({ summary: 'Reset all login sessions for a user' })
  async resetLoginSessions(@Param('id') id: string, @Req() req: any) {
    return this.userManagementService.resetLoginSessions(id, req.user.id);
  }

  @Get(':id/devices')
  @ApiOperation({ summary: 'Get user devices and sessions' })
  async getUserDevices(@Param('id') id: string) {
    return this.userManagementService.getUserDevices(id);
  }

  @Delete(':id/devices/:deviceId')
  @ApiOperation({ summary: 'Logout specific device' })
  async logoutDevice(
    @Param('id') id: string,
    @Param('deviceId') deviceId: string,
    @Req() req: any,
  ) {
    await this.userManagementService.logoutDevice(id, deviceId, req.user.id);
    return { message: 'Device logged out successfully' };
  }

  @Delete(':id/devices')
  @ApiOperation({ summary: 'Logout all devices' })
  async logoutAllDevices(@Param('id') id: string, @Req() req: any) {
    return this.userManagementService.logoutAllDevices(id, req.user.id);
  }

  @Put(':id/device-limit')
  @ApiOperation({ summary: 'Update user device limit' })
  async updateDeviceLimit(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceLimitDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateDeviceLimit(id, dto, req.user.id);
  }

  // ========== Account Expiry Management ==========

  @Get(':id/expiry')
  @ApiOperation({ summary: 'Get user account expiry info' })
  async getUserExpiry(@Param('id') id: string) {
    return this.userManagementService.getUserExpiry(id);
  }

  @Put(':id/expiry')
  @ApiOperation({ summary: 'Update user account expiry' })
  async updateExpiry(
    @Param('id') id: string,
    @Body() dto: UpdateExpiryDto,
    @Req() req: any,
  ) {
    return this.userManagementService.updateExpiry(id, dto, req.user.id);
  }
}
