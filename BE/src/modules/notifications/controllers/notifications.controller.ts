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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto, CreateBulkNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationsQueryDto } from '../dto/get-notifications.dto';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo' })
  @ApiQuery({ name: 'unread', required: false, type: Boolean, description: 'Chỉ lấy thông báo chưa đọc' })
  @ApiQuery({ name: 'type', required: false, description: 'Lọc theo loại thông báo' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang (mặc định: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng mỗi trang (mặc định: 20)' })
  async getNotifications(
    @Request() req,
    @Query() query: GetNotificationsQueryDto,
  ) {
    return this.notificationsService.getNotifications(req.user.id, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số lượng thông báo chưa đọc' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Lấy cài đặt thông báo' })
  async getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Cập nhật cài đặt thông báo' })
  async updatePreferences(
    @Request() req,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết thông báo' })
  @ApiParam({ name: 'id', description: 'ID thông báo' })
  async getNotification(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.notificationsService.getNotificationById(req.user.id, id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Đánh dấu đã đọc thông báo' })
  @ApiParam({ name: 'id', description: 'ID thông báo' })
  async markAsRead(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đánh dấu tất cả đã đọc' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiParam({ name: 'id', description: 'ID thông báo' })
  async deleteNotification(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.notificationsService.deleteNotification(req.user.id, id);
  }

  @Delete('read/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tất cả thông báo đã đọc' })
  async deleteAllRead(@Request() req) {
    return this.notificationsService.deleteAllRead(req.user.id);
  }

  // Admin endpoints (internal use)
  @Post()
  @ApiOperation({ summary: 'Tạo thông báo mới (internal)' })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Tạo thông báo cho nhiều users (internal)' })
  async createBulkNotifications(@Body() dto: CreateBulkNotificationDto) {
    return this.notificationsService.createBulkNotifications(dto);
  }
}
