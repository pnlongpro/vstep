import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { PracticeSessionService } from '../services/practice-session.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';

@ApiTags('Practice Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice/sessions')
export class PracticeSessionController {
  constructor(private readonly sessionService: PracticeSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new practice session' })
  async createSession(@CurrentUser('id') userId: string, @Body() dto: CreateSessionDto) {
    return this.sessionService.createSession(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user practice sessions' })
  async getSessions(
    @CurrentUser('id') userId: string,
    @Query('skill') skill?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.sessionService.getUserSessions(userId, {
      skill,
      status: status as never,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get practice session details' })
  async getSession(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.getSession(sessionId, userId);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Get session with questions' })
  async getSessionWithQuestions(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.getSessionWithQuestions(sessionId, userId);
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Submit answer for a question' })
  async submitAnswer(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.sessionService.submitAnswer(sessionId, userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session (progress, status)' })
  async updateSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(sessionId, userId, dto);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause the session' })
  async pauseSession(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.pauseSession(sessionId, userId);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused session' })
  async resumeSession(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.resumeSession(sessionId, userId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete the session' })
  async completeSession(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.completeSession(sessionId, userId);
  }

  @Post(':id/abandon')
  @ApiOperation({ summary: 'Abandon the session' })
  async abandonSession(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) sessionId: string) {
    return this.sessionService.abandonSession(sessionId, userId);
  }
}
