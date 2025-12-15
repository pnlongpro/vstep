import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách notifications' })
  async getNotifications(
    @Request() req,
    @Query('unread') unread?: string,
    @Query('type') type?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationsService.getNotifications(req.user.userId, {
      unread: unread === 'true',
      type,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số lượng unread notifications' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Đánh dấu đã đọc' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả đã đọc' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa notification' })
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(id, req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa tất cả notifications' })
  async deleteAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Lấy notification preferences' })
  async getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.userId);
  }
}
