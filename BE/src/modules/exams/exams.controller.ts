import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateMockExamDto } from './dto/create-mock-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { SaveExamProgressDto } from './dto/save-exam-progress.dto';

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('mock-exams/random')
  @ApiOperation({ summary: 'Random 4 đề thi cho mock exam' })
  async randomMockExam(@Request() req, @Query('level') level?: string) {
    return this.examsService.randomMockExam(req.user.userId, level);
  }

  @Post('mock-exams')
  @ApiOperation({ summary: 'Bắt đầu mock exam' })
  async startMockExam(@Request() req, @Body() dto: CreateMockExamDto) {
    return this.examsService.startMockExam(req.user.userId, dto);
  }

  @Get('mock-exams/:id')
  @ApiOperation({ summary: 'Lấy chi tiết mock exam' })
  async getMockExamDetails(@Request() req, @Param('id') id: string) {
    return this.examsService.getMockExamDetails(id, req.user.userId);
  }

  @Put('mock-exams/:id/save')
  @ApiOperation({ summary: 'Auto-save exam progress' })
  async saveExamProgress(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: SaveExamProgressDto,
  ) {
    return this.examsService.saveExamProgress(id, req.user.userId, dto);
  }

  @Post('mock-exams/:id/submit')
  @ApiOperation({ summary: 'Submit mock exam' })
  async submitMockExam(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: SubmitExamDto,
  ) {
    return this.examsService.submitMockExam(id, req.user.userId, dto);
  }

  @Get('mock-exams/:id/result')
  @ApiOperation({ summary: 'Lấy kết quả thi' })
  async getMockExamResult(@Request() req, @Param('id') id: string) {
    return this.examsService.getMockExamResult(id, req.user.userId);
  }

  @Get('exercises')
  @ApiOperation({ summary: 'Lấy danh sách bài tập/đề thi' })
  async getExercises(
    @Query('skill') skill?: string,
    @Query('level') level?: string,
    @Query('type') type?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.examsService.getExercises({
      skill,
      level,
      type,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('exercises/:id')
  @ApiOperation({ summary: 'Lấy chi tiết bài tập' })
  async getExerciseDetails(@Param('id') id: string) {
    return this.examsService.getExerciseDetails(id);
  }
}
