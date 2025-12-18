import { Controller, Get, Post, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ScoringService } from '../services/scoring.service';

@ApiTags('Scoring')
@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('sessions/:sessionId/score')
  @ApiOperation({ summary: 'Score a practice session' })
  @ApiResponse({ status: 200, description: 'Session scored successfully' })
  async scoreSession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.scoringService.scoreSession(sessionId);
  }

  @Get('sessions/:sessionId/result')
  @ApiOperation({ summary: 'Get scoring result for a session' })
  async getSessionResult(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.scoringService.getSessionResult(sessionId);
  }

  @Post('questions/:questionId/validate')
  @ApiOperation({ summary: 'Validate a single answer' })
  async validateAnswer(@Param('questionId', ParseUUIDPipe) questionId: string, @Body('answer') answer: string | string[]) {
    return this.scoringService.scoreAnswer(questionId, answer);
  }
}
