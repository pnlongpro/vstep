import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { DraftSavingService } from '../services/draft-saving.service';
import { SaveDraftDto } from '../dto/save-draft.dto';

@ApiTags('Practice Drafts')
@Controller('practice/drafts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DraftSavingController {
  constructor(private readonly draftService: DraftSavingService) {}

  @Post()
  @ApiOperation({ summary: 'Save or update a draft' })
  async saveDraft(@CurrentUser('id') userId: string, @Body() dto: SaveDraftDto) {
    return this.draftService.saveDraft(userId, dto);
  }

  @Post('auto-save')
  @ApiOperation({ summary: 'Auto-save draft' })
  async autoSave(@CurrentUser('id') userId: string, @Body() dto: SaveDraftDto) {
    return this.draftService.autoSave(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user drafts' })
  async getUserDrafts(@CurrentUser('id') userId: string) {
    return this.draftService.getUserDrafts(userId);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get drafts for a session' })
  async getSessionDrafts(@CurrentUser('id') userId: string, @Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.draftService.getSessionDrafts(userId, sessionId);
  }

  @Get('find')
  @ApiOperation({ summary: 'Find draft by session or question' })
  async findDraft(
    @CurrentUser('id') userId: string,
    @Query('sessionId') sessionId?: string,
    @Query('questionId') questionId?: string,
  ) {
    return this.draftService.getDraft(userId, { sessionId, questionId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draft' })
  async deleteDraft(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) draftId: string) {
    return this.draftService.deleteDraft(userId, draftId);
  }

  @Delete('session/:sessionId')
  @ApiOperation({ summary: 'Delete all drafts for a session' })
  async deleteSessionDrafts(@CurrentUser('id') userId: string, @Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.draftService.deleteSessionDrafts(userId, sessionId);
  }
}
