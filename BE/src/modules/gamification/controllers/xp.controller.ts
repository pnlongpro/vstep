import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { XpService } from '../services/xp.service';

@ApiTags('XP')
@ApiBearerAuth()
@Controller('xp')
@UseGuards(JwtAuthGuard)
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get()
  @ApiOperation({ summary: 'Get current XP and level info' })
  async getXpInfo(@Req() req: any) {
    const totalXp = await this.xpService.getTotalXp(req.user.id);
    const level = this.xpService.calculateLevel(totalXp);
    const nextLevel = this.xpService.getXpForNextLevel(totalXp);

    return {
      totalXp,
      level,
      ...nextLevel,
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get XP transaction history' })
  async getHistory(@Req() req: any, @Query('days') days = 30) {
    return this.xpService.getXpHistory(req.user.id, +days);
  }

  @Get('by-source')
  @ApiOperation({ summary: 'Get XP breakdown by source' })
  async getBySource(@Req() req: any) {
    return this.xpService.getXpBySource(req.user.id);
  }
}
