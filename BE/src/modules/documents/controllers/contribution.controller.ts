import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ContributionService } from '../services/contribution.service';
import { CreateStudyMaterialDto } from '../dto/study-material.dto';
import { CreateClassMaterialDto } from '../dto/class-material.dto';
import { DocumentStatus } from '../entities/study-material.entity';

@ApiTags('Contributions')
@Controller('documents/contributions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'uploader')
@ApiBearerAuth()
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  // ========== Teacher Contribution Endpoints ==========

  @Post('study')
  @ApiOperation({ summary: 'Contribute a study material' })
  async contributeStudyMaterial(
    @Body() dto: CreateStudyMaterialDto,
    @Request() req,
  ) {
    const material = await this.contributionService.contributeStudyMaterial(
      dto,
      req.user.id,
    );
    return {
      success: true,
      message: 'Study material submitted for review',
      data: material,
    };
  }

  @Post('class')
  @ApiOperation({ summary: 'Contribute a class material' })
  async contributeClassMaterial(
    @Body() dto: CreateClassMaterialDto,
    @Request() req,
  ) {
    const material = await this.contributionService.contributeClassMaterial(
      dto,
      req.user.id,
    );
    return {
      success: true,
      message: 'Class material submitted for review',
      data: material,
    };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my contributions' })
  async getMyContributions(
    @Request() req,
    @Query('type') type?: 'study' | 'class',
    @Query('status') status?: DocumentStatus,
  ) {
    const contributions = await this.contributionService.getMyContributions(
      req.user.id,
      type,
      status,
    );
    return { success: true, data: contributions };
  }

  @Get('my/stats')
  @ApiOperation({ summary: 'Get my contribution statistics' })
  async getMyStats(@Request() req) {
    const stats = await this.contributionService.getMyStats(req.user.id);
    return { success: true, data: stats };
  }

  @Post(':type/:id/resubmit')
  @ApiOperation({ summary: 'Resubmit a rejected contribution' })
  async resubmit(
    @Param('type') type: 'study' | 'class',
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    const material = await this.contributionService.resubmit(id, type, req.user.id);
    return {
      success: true,
      message: 'Material resubmitted for review',
      data: material,
    };
  }
}
