import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { StartSessionDto } from './dto/start-session.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { SubmitSessionDto } from './dto/submit-session.dto';
import { SaveDraftDto } from './dto/save-draft.dto';

@ApiTags('Practice')
@Controller('practice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Bắt đầu practice session' })
  @ApiResponse({ status: 201, description: 'Session đã được tạo' })
  async startSession(@Request() req, @Body() startSessionDto: StartSessionDto) {
    return this.practiceService.startSession(req.user.id, startSessionDto);
  }

  @Patch('sessions/:id/save')
  @ApiOperation({ summary: 'Auto-save progress' })
  @ApiResponse({ status: 200, description: 'Progress đã được lưu' })
  async saveProgress(
    @Param('id') id: number,
    @Body() saveProgressDto: SaveProgressDto,
  ) {
    return this.practiceService.saveProgress(id, saveProgressDto);
  }

  @Post('sessions/:id/submit')
  @ApiOperation({ summary: 'Submit practice session' })
  @ApiResponse({ status: 200, description: 'Session đã được submit' })
  async submitSession(
    @Param('id') id: number,
    @Body() submitSessionDto: SubmitSessionDto,
  ) {
    return this.practiceService.submitSession(id, submitSessionDto);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Lấy lịch sử practice' })
  @ApiResponse({ status: 200, description: 'Danh sách sessions' })
  async getSessions(
    @Request() req,
    @Query('skill') skill?: string,
    @Query('limit') limit?: number,
  ) {
    return this.practiceService.getSessions(req.user.id, skill, limit);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Lấy chi tiết session' })
  @ApiResponse({ status: 200, description: 'Chi tiết session' })
  async getSession(@Param('id') id: number) {
    return this.practiceService.getSession(id);
  }

  // Draft management
  @Post('drafts')
  @ApiOperation({ summary: 'Lưu draft Writing' })
  @ApiResponse({ status: 201, description: 'Draft đã được lưu' })
  async saveDraft(@Request() req, @Body() saveDraftDto: SaveDraftDto) {
    return this.practiceService.saveDraft(req.user.id, saveDraftDto);
  }

  @Get('drafts/:taskId')
  @ApiOperation({ summary: 'Lấy draft' })
  @ApiResponse({ status: 200, description: 'Draft content' })
  async getDraft(@Request() req, @Param('taskId') taskId: number) {
    return this.practiceService.getDraft(req.user.id, taskId);
  }

  @Delete('drafts/:id')
  @ApiOperation({ summary: 'Xóa draft' })
  @ApiResponse({ status: 200, description: 'Draft đã được xóa' })
  async deleteDraft(@Param('id') id: number) {
    return this.practiceService.deleteDraft(id);
  }
}
